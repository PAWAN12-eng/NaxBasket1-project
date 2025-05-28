import React, { useEffect, useState } from 'react'
import { useGlobleContext } from '../provider/GlobleProvider'
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { FaMinus,FaPlus } from 'react-icons/fa';

const AddToCartButton = ({ data }) => {
    const { fetchCartItems, handleUpdateQty,deleteCartItem } = useGlobleContext()
    const [loading, setLoading] = useState(false)
    const cartItems = useSelector((state) => state.cartItem.cart);
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty ,setQty]=useState(0)
    const [cartItmeDetails, setCartItmeDetails ]=useState()

    const handelAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.AddToCart,
                data: {
                    productId: data?._id
                }
            })
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItems) {
                    fetchCartItems()
                }
            }
        } catch (error) {
            AxiosTostError(error)
        } finally {
            setLoading(false)
        }
    }

    // Checking if this item is in the cart
    useEffect(() => {
        // const checkingItem = cartItems.some(item => item.productId._id === data._id)
        const checkingItem=cartItems.some(item => item.productId && item.productId._id === data._id)
        setIsAvailableCart(checkingItem)

        // const product = cartItems.find(item => item.productId._id === data._id)
        const product = cartItems.find(item => item.productId && item.productId._id === data._id);
        if (product) {
            setQty(product.quantity)
            setCartItmeDetails(product)
        } else {
            setQty(0)
        }
    }, [data, cartItems])



    const IncreaseQty =async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const response=await handleUpdateQty(cartItmeDetails._id,qty+1)
           if(response.success){
            toast.success('Item added')
           }
    }

    const DecreaseQty =async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if(qty===1){
            deleteCartItem(cartItmeDetails._id)
        }
        else{
           const response = await handleUpdateQty(cartItmeDetails._id,qty-1)
           if(response.success){
            toast.success('Item remove')
           }
        }

    }

    return (
        <div className='w-full max-w-[150px]'>
            {
                isAvailableCart ? (
                    <div className='flex '>
                        <button onClick={DecreaseQty} className='bg-green-600 hover:bg-green-700 text-white  p-1 rounded' ><FaMinus/></button>
                        <p className=' px-1'>{qty}</p>
                        <button onClick={IncreaseQty}  className='bg-green-600 hover:bg-green-700 text-white p-1 rounded'><FaPlus/></button>
                    </div>
                ) : (
                    <button
                        onClick={handelAddToCart}
                        className='bg-green-600 hover:bg-green-700 text-white px-3 lg:px-4 py-1 rounded'
                    >
                        {
                            loading
                                ? <div className="w-6 h-6 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                : "Add"
                        }
                    </button>
                )
            }


        </div>
    )
}

export default AddToCartButton
