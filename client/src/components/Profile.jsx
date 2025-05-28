import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserCircle } from "react-icons/fa";
import UserProfileAvtarEdit from './UserProfileAvtarEdit';
import Divider from './Divider';
import { setUserDetails } from '../Store/userSlice';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';
import toast from 'react-hot-toast';
import fatchUserDetails from '../utils/fatchUserDetails';

const Profile = () => {
    const user = useSelector((state) => state.user);
    const [openProfileAvtarEdit, setOpenProfileAvtarEdit] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
    });
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (user && user.name) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobile: user.mobile || '',
            });
        }
    }, [user]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handelSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: formData
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fatchUserDetails()
                dispatch(setUserDetails(userData.data))
            }
        } catch (error) {
            AxiosTostError(error)
        } finally {
            setLoading(false)
        }

    }


    return (
        <section className='mx-5 my-7'>
            <div>
                <div className='w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg'>
                    {
                        user.avtar ? (
                            <img src={user.avtar} alt={user.name} className='w-20 h-20' />
                        ) : (
                            <FaUserCircle size={65} />
                        )
                    }
                </div>
                <button onClick={() => setOpenProfileAvtarEdit(true)} className='text-xm min-w-20 border px-3 py-1 rounded-full mt-3 border-primary-100 hover:border-primary-200 hover:bg-primary-200'>Edit</button>

                {
                    openProfileAvtarEdit && (
                        <UserProfileAvtarEdit close={() => setOpenProfileAvtarEdit(false)} />
                    )
                }
            </div>
            <Divider />
            {/* Name, Email, Mobile, Change Password */}
            <div className="space-y-2">

                {/* Name */}
                <form onSubmit={handelSubmit} >
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleOnChange}
                            className="border border-gray-300 bg-blue-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        />
                    </div>

                    {/* Email (unchanged) */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="border border-gray-300 bg-blue-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        />
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col">
                        <label htmlFor="mobile" className="text-sm font-medium text-gray-700 mb-1">Mobile</label>
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleOnChange}
                            className="border border-gray-300 bg-blue-50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        />
                    </div>


                    <button
                        className="mt-4 border w-full text-primary-100 hover:text-black   border-primary-100 font-medium py-2 px-4 rounded hover:border-primary-200 hover:bg-primary-200  "
                    >

                        {
                            loading ? 'Loading...' : 'Submit'
                        }
                    </button>
                </form>
            </div>


        </section>
    )
}

export default Profile
