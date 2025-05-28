import React, { useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import uploadImage from "../utils/uploadImage";
import toast from "react-hot-toast";
import AxiosTostError from "../utils/AxiosTosterror";

const EditCategory = ({ data, close, onSuccess, data: CategoryData }) => {
    const [formData, setFormData] = useState({
        _id: CategoryData._id,
        name: CategoryData.name,
        image: CategoryData.image,
    });
    const [loading, setLoading] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
      
        try {
          setLoading(true); // Start loading
          const response = await uploadImage(file);
          const { data: imageRes } = response;
      
          setFormData((prev) => ({
            ...prev,
            image: imageRes.data.url,
          }));
          toast.success("Image uploaded successfully");
        } catch (error) {
          toast.error("Image upload failed");
          console.error("Image upload error:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      };
      

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateCategory, 
                data: formData,
            });

            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                onSuccess(formData); 
                close();
            }
        } catch (error) {
            AxiosTostError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[600px] shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Edit Category</h3>
                    <button onClick={close} className="text-gray-500 hover:text-gray-700">✖</button>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleOnChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-semibold mb-1">Image</label>
                    <div className="flex items-center gap-4">
                        <img
                            src={formData.image}
                            alt="Category"
                            className="w-[100px] h-[100px] object-cover border rounded"
                        />
                        <label className=" px-3 py-2 border border-primary-200 hover:bg-primary-200 text-black font-bold text-sm rounded transition">
                            {
                                loading ? "Loading..." : 'Upload Image'
                            }

                            <input type="file" hidden onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.image}
                    className="w-full mt-6 py-2 border border-primary-200 hover:bg-primary-200 text-black transition rounded disabled:bg-gray-400 "
                >
                    {loading ? "Updating..." : "Update Category"}
                </button>
            </div>
        </section>
    );
};

export default EditCategory;
