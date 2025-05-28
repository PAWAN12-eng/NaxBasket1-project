import React from 'react'

const CartLoading = () => {
    return (
        <div className='border p-2 grid gap-3 max-w-52 rounded animate-pulse'>
            <div className='min-h-20 max-w-28 lg:max-w-full md:max-w-full bg-blue-50 rounded'>

            </div>
            <div className='p-3 bg-blue-50 rounded w-20'>

            </div>
            <div className='p-3 bg-blue-50 max-w-28 lg:max-w-full rounded'>

            </div>
            <div className='p-3 bg-blue-50  rounded w-14'>

            </div>


            <div className='flex items-center justify-between gap-2 '>
                <div className='p-3 bg-blue-50 max-w-10 lg:max-w-full rounded w-20'>

                </div>
                <div className='p-3 bg-blue-50 max-w-10 lg:max-w-full rounded w-20'>

                </div>
            </div>
        </div>
    )
}

export default CartLoading
