import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import uploadImage from "../utils/uploadImage";
import AxiosTostError from "../utils/AxiosTosterror";
import { toast } from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';

const UploadSubCategory = ({ close, onSuccess }) => {
    const [subcategoryData, setSubcategoryData] = useState({
        name: "",
        image: "",
        category:"",
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const AllCategory = useSelector((state) => state.product.allCategory);

    // console.log(subcategoryData)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubcategoryData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.AddSubcategory,
                data: subcategoryData,
            });

            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                // onSuccess(responseData.data);
                if(close){
                    close()
                }
                if(onSuccess){
                    onSuccess()
                }
            }
        } catch (error) {
            AxiosTostError(error);
        } finally {
            setLoading(false);
        }
    };

    const handelUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const response = await uploadImage(file);
        const { data: imageResponse } = response;

        setSubcategoryData((prev) => ({
            ...prev,
            image: imageResponse.data.url,
        }));
    };

    return (
        <section>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-[600px] shadow-xl">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Add Subcategory</h3>
                        <button onClick={close} className="text-gray-500 hover:text-gray-700">
                            <IoClose size={25} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmitSubCategory}>
                        {/* Name Input */}
                        <div className="mt-4">
                            <label className="block font-semibold text-sm mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={subcategoryData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter Subcategory name"
                            />
                        </div>

                        {/* Upload Image */}
                        <div className="mt-4">
                            <label className="block font-semibold text-sm mb-1">Image</label>
                            <div className="flex items-center mt-1 gap-3">
                                <div className="w-[100px] h-[100px] flex items-center justify-center border border-gray-300 rounded bg-gray-100 overflow-hidden">
                                    {subcategoryData.image ? (
                                        <img
                                            src={subcategoryData.image}
                                            alt="subcategory"
                                            className="w-full h-full object-cover rounded"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-xs">No Image</span>
                                    )}
                                </div>
                                <label className="px-3 py-2 border border-primary-200 hover:bg-primary-200 text-black font-bold text-sm rounded transition cursor-pointer">
                                    Upload Image
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handelUploadSubCategoryImage}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Category Select */}
                        <div className="mt-4">
                            <label className="block font-semibold text-sm mb-1">
                                Select Category
                            </label>
                            {/* display value */}
                            <select
                                name="category"
                                value={subcategoryData.category}
                                onChange={(e) => {
                                    setSubcategoryData((prev) => ({
                                        ...prev,
                                        category: e.target.value, // store only ID
                                    }));
                                }}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Select Category</option>
                                {AllCategory.map((cat) => (
                                    <option key={cat._id + "subcategory"} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={!subcategoryData?.name || !subcategoryData?.image || !subcategoryData?.category}
                            className={`w-full mt-6 py-2 text-black transition rounded
                          ${!subcategoryData?.name || !subcategoryData?.image || !subcategoryData?.category
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "border border-primary-200 hover:bg-primary-200"}`}
                        >
                            Add Subcategory
                        </button>

                    </form>
                </div>
            </div>
        </section>
    );
};

export default UploadSubCategory;
