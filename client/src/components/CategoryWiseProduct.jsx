import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AxiosTostError from '../utils/AxiosTosterror'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import CartLoading from './CartLoading'
import CartProduct from './CartProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import { validURLConverter } from '../utils/valideURLConvert'


const CategoryWiseProduct = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const loadingCartNumber = new Array(6).fill(null)
    const SubcategoryData = useSelector(state => state.product.subCategory)
    const navigate = useNavigate()
    

    const fetchCategroyWiseProduct = async () => {
        try {
            setLoading(true)
            const respnse = await Axios({
                ...SummaryApi.getProductByCategroy,
                data: {
                    id: id
                }
            })
            const { data: respnseData } = respnse
            if (respnseData.success) {
                 // Shuffle the product array before setting it
            const shuffledData = respnseData.data.sort(() => Math.random() - 0.5);
            setData(shuffledData);
            }
            // console.log(respnseData)

        } catch (error) {
            AxiosTostError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategroyWiseProduct()
    }, [])

    const handelScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }
    const handelScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }



    const handelRedirectProductListpage = (id, cat) => {

        const subCategory = SubcategoryData.find(sub => {
            // Check if category object exists and compare its _id
            if (sub.category && sub.category._id == id) {
                return true;
            }
            return false;
        });

        if (subCategory) {
            const url = `/${validURLConverter(name)}-${id}/${validURLConverter(subCategory.name)}-${subCategory._id}`;
            return url
        }
    };

    return (
        <div>
            <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                <Link to={handelRedirectProductListpage(id, name)} className='text-green-600 hover:text-green-500'> See All</Link>
            </div>
            <div className='flex items-center gap-4 md:gap-6 lg:gap-3 container mx-auto p-4 overflow-x-auto scrollbar-none scroll-smooth' ref={containerRef}>
                {loading &&
                    loadingCartNumber.map((_, index) => {
                        return (
                            <CartLoading key={"categorywiseProductDisplay123" + index} />
                        )
                    })
                }

                {
                    data.map((p, index) => {
                        return (
                            <CartProduct data={p} key={p._id + "categorywiseProductDisplay" + index} />
                        )
                    })
                }

                <div className='w-full left-0 right-0 absolute container mx-auto px-2 hidden lg:flex justify-between '>
                    <button onClick={handelScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-3 text-lg rounded-full'>
                        <FaAngleLeft />
                    </button>
                    <button onClick={handelScrollRight} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-3 text-lg rounded-full'  >
                        <FaAngleRight />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default CategoryWiseProduct
