import React, { useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';
import { updatedAvtar } from '../Store/userSlice';
import { IoClose } from "react-icons/io5";



const UserProfileAvtarEdit = ({ close }) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handelSubmit = (e) => {
        e.preventDefault()
    }

    const handleUplaodAvtarImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avtar', file);

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.UploadAvatar,
                data: formData,
            });
            const { data: responseData } = response
            dispatch(updatedAvtar(responseData.data.avtar))
            // Optionally update the Redux state here if needed
        } catch (error) {
            AxiosTostError(error)
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center'>
            {/* profile upolad and display image */}
            <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
                <button className=" text-neutral-800 block w-fit ml-auto" onClick={close}>
                    <IoClose size={20} />
                </button>
                <div className='w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-lg'>
                    {
                        user.avtar ? (
                            <img src={user.avtar} alt={user.name} className='w-20 h-20' />
                        ) : (
                            <FaUserCircle size={65} />
                        )
                    }
                </div>

                <form onSubmit={handelSubmit}>
                    <label htmlFor="uploadProfile">
                        <div className='cursor-pointer text-xm min-w-20 border px-3 py-1 rounded-full mt-3 border-primary-100 hover:border-primary-200 hover:bg-primary-200'>

                            {
                                loading ? "Loading..." : "Upload"
                            }
                        </div>
                        <input onChange={handleUplaodAvtarImage} type="file" id='uploadProfile' className='hidden' />
                    </label>
                </form>

            </div>

        </section>
    )
}

export default UserProfileAvtarEdit
