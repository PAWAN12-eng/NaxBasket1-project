import React from 'react'
import { Outlet } from 'react-router-dom'
import UserMenu from '../components/UserMenu'
import Header from '../components/Header'

const Dashboard = () => {
    return (
        <section className='bg-white'>
            {/* <Header/> */}
            <div className='container mx-auto grid lg:grid-cols-[250px,1fr] '>
                {/* left menu */}
                <div className='py-4 sticky  top-24 overflow-y-auto hidden lg:block border-r'>
                    <UserMenu/>
                </div>
                {/* right menu */}
                <div className='bg-white min-h-[78vh] '>
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default Dashboard
