import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdCloudUpload } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosTostError from "../utils/AxiosTosterror";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";

const itemsPerPage = 12;

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    image: [],
    category: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const AllCategory = useSelector((state) => state.product.allCategory);
  const AllSubCategory = useSelector((state) => state.product.subCategory);

  const fetchProducts = async () => {
    try {
      const response = await Axios(SummaryApi.getProduct);
      if (response.data.success) {
        setProducts(response.data.products || []);
        setFilteredProducts(response.data.products || []);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      setDeletingId(productId);
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        url: `${SummaryApi.deleteProduct.url}/${productId}`,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        const updatedList = products.filter((p) => p._id !== productId);
        setProducts(updatedList);
        setFilteredProducts(updatedList);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const openEditPopup = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setData({
        name: product.name,
        description: product.description,
        image: product.image || [],
        category: product.category?._id || "",
        price: product.price || "",
      });
      setEditProductId(productId);
      setShowEditPopup(true);
    }
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setEditProductId(null);
    setData({
      name: "",
      description: "",
      image: [],
      category: "",
      price: "",
    });
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData((prev) => ({
        ...prev,
        image: [url],
      }));
      setImageFile(file);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...data.image];
    updatedImages.splice(index, 1);
    setData((prev) => ({
      ...prev,
      image: updatedImages,
    }));
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("price", data.price);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await Axios.put(
        `${SummaryApi.updateProduct.url}/${editProductId}`,
        formData
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        fetchProducts();
        closeEditPopup();
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Product Management</h1>
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-full max-w-md bg-white shadow-sm">
          <CiSearch size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="ml-3 w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm mt-2 text-gray-500">Loading products...</p>
          </div>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex justify-center items-center h-80">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {currentItems.map((product) => (
              <div
                key={product._id}
                className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md border transition w-full max-w-[170px] h-[200px]"
              >
                <img
                  src={product.image?.[0] || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-24 h-24 object-contain mb-1 rounded"
                />
                <h3 className="text-sm font-semibold text-center line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-green-600 font-semibold text-sm">
                  ₹{product.price}
                </p>
                <p className="text-xs mb-2">
                  {product.publish ? (
                    <span className="text-green-600 font-semibold">
                      Published
                    </span>
                  ) : (
                    <span className="text-gray-400">Draft</span>
                  )}
                </p>
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => openEditPopup(product._id)}
                    title="Edit"
                  >
                    <MdEdit
                      size={20}
                      className="text-blue-500 hover:text-blue-700"
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    title="Delete"
                  >
                    <MdDelete
                      size={20}
                      className="text-red-500 hover:text-red-700"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center items-center gap-6">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of{" "}
              {Math.ceil(filteredProducts.length / itemsPerPage)}
            </span>
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={
                currentPage >= Math.ceil(filteredProducts.length / itemsPerPage)
              }
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredProducts.length / itemsPerPage)
                  )
                )
              }
            >
              Next
            </button>
          </div>
        </>
      )}

      {showEditPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">.
         <button
              className="absolute top-auto right-auto text-white "
              onClick={closeEditPopup}
            >
              <IoClose size={30}/>
            </button>
          {/* <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeEditPopup}
            >
              ✖
            </button>
            <form onSubmit={handleSubmit} className="space-y-1">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={data.price}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={data.discount}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={data.unit}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Category</option>
                  {AllCategory.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="w-full border px-3 py-2 rounded"
                />
                <div className="flex flex-wrap mt-2 gap-2">
                  {data.image.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt="Product"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Product
              </button>
            </form>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;
