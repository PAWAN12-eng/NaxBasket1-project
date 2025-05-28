import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaPlus, FaMinus, FaSave } from "react-icons/fa";

const AddUpdateStock = () => {
  const { id: warehouseId } = useParams();
  const [products, setProducts] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const res = await Axios(SummaryApi.getAllStockByWarehouse(warehouseId));
        const stocks = {};
        res.data.forEach(p => {
          stocks[p._id] = p.stock || 0;
        });
        setProducts(res.data);
        setStockMap(stocks);
      } catch (error) {
        console.error("Fetch stock error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
  }, [warehouseId]);

  const handleStockChange = (productId, delta) => {
    setStockMap(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  };

  const handleSave = async (productId) => {
    setSavingId(productId);
    try {
      const stock = stockMap[productId] || 0;
  
      // ❗ Ensure field name matches what backend expects
      await Axios(SummaryApi.upsertStockForProduct(warehouseId, productId, {quantity: stock }));
  
      alert("Stock updated!");
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSavingId(null);
    }
  };
  
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center text-lg">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        🏬 Warehouse #{warehouseId} - Manage Product Stock
      </h1>

      <input
        type="text"
        placeholder="Search products..."
        className="mb-4 px-4 py-2 border rounded w-full max-w-md focus:outline-none focus:ring focus:border-blue-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-center">Stock</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product._id} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4 font-semibold">{product.name}</td>
                <td className="py-3 px-4 text-sm text-gray-500">{product.description}</td>
                <td className="py-3 px-4 text-center font-bold text-lg">
                  {stockMap[product._id] || 0}
                </td>
                <td className="py-3 px-4 flex items-center justify-center gap-2">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                    onClick={() => handleStockChange(product._id, -1)}
                  >
                    <FaMinus />
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                    onClick={() => handleStockChange(product._id, 1)}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex items-center gap-1"
                    onClick={() => handleSave(product._id)}
                    disabled={savingId === product._id}
                  >
                    <FaSave />
                    {savingId === product._id ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddUpdateStock;
