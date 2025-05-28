import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'

const AdminPermission = ({ children }) => {
    const user = useSelector(state => state.user)
    return (
        <>
            {
                isAdmin(user.role) ? children : <p className='text-red-600 bg-red-100 p-4'>Don't have a Permission</p>
                
            }
        </>
    )
}

export default AdminPermission
// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux'
// import isAdmin from '../utils/isAdmin'

// const AdminPermission = ({ children }) => {
//     const user = useSelector(state => state.user);

//     if (!user || !user.role) {
//         return <Navigate to="/" />; // Redirect to homepage if no user or role is found
//     }

//     if (!isAdmin(user.role)) {
//         return <p className='text-red-600 bg-red-100 p-4'>Don't have a Permission</p>;
//     }

//     return children;
// };
// export default AdminPermission
