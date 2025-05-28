import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchLowStock } from '../redux/stockSlice';

export default function LowStockAlert() {
//   const dispatch = useDispatch();
//   const { lowStock } = useSelector((state) => state.stock);

//   useEffect(() => {
//     dispatch(fetchLowStock());
//   }, [dispatch]);

  return (
    <div className="p-4 bg-red-100 border border-red-400 rounded">
      <h2 className="text-lg font-bold mb-2 text-red-700">⚠️ Low Stock Alerts</h2>
      <p>No low stock items</p>
      {/* {lowStock.length === 0 ? (
        <p>No low stock items</p>
      ) : (
        <ul className="text-sm list-disc pl-6">
          {lowStock.map((item) => (
            <li key={item._id}>
              {item.product.name} - Qty: {item.quantity} (Location: {item.location.name})
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}
