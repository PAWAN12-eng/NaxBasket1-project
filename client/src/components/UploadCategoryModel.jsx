import React, { useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import uploadImage from "../utils/uploadImage";
import toast from "react-hot-toast"
import AxiosTostError from "../utils/AxiosTosterror";

const UploadCategoryModel = ({
  close,
  onSuccess
}) => {
  const [data, setData] = useState({
    name: "",
    image: "",
  });
  const [loading,setLoding]=useState(false)

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
           try {
            setLoding(true)
            const response = await Axios({
              ...SummaryApi.addCategory,
              data:data
            })
            const {data:responseData}=response
            if(responseData.success){
              toast.success(responseData.message)
              onSuccess(responseData.data);
              close();

            }
            
           } catch (error) {
            AxiosTostError(error)
           }
  };

  const handelUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return
    }
    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    setData((preve) => {
      return {
        ...preve,
        image: ImageResponse.data.url
      }
    })
  };

  return (
    <section>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-[600px] shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
             Add Category
            </h3>
            <button
              onClick={close}
              className="text-gray-500 text-lg hover:text-gray-700"
            >
              ✖
            </button>
          </div>

          {/* Name Input */}
          <div className="mt-4">
            <label className="block font-semibold text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter category name"
            />
          </div>

          {/* Upload Image */}
          <div className="mt-4">
            <label className="block font-semibold text-sm mb-1">Image</label>
            <div className="flex items-center mt-1 gap-3">
              <div className="w-[100px] h-[100px] flex items-center justify-center border border-gray-300 rounded bg-gray-100 overflow-hidden">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="category"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>
              <label className=" px-3 py-2 border border-primary-200 hover:bg-primary-200 text-black font-bold text-sm rounded transition">
                Upload Image
                <input
                  type="file"
                  className="hidden"
                  onChange={handelUploadCategoryImage}
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-2 border border-primary-200 hover:bg-primary-200 text-black transition rounded disabled:bg-gray-400 "
            disabled={!data.name || !data.image}
          >
            Add Category
          </button>
        </div>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
