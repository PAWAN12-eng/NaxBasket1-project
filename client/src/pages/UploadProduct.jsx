import React, { useState } from 'react';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import uploadImage from '../utils/uploadImage';
import { useSelector } from 'react-redux';
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTosterror';
import toast from 'react-hot-toast';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: '',
    image: [],
    category: '',
    subCategory: '',
    unit: '',
    stock: '',
    price: '',
    discount: '',
    description: '',
    more_details: {},
    publish: true
  });

  const AllCategory = useSelector((state) => state.product.allCategory);
  const AllSubCategory = useSelector((state) => state.product.subCategory);
  const [loading, setLoading] = useState(false);
  const [moreField, setMoreField] = useState([])
  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      const imageUrl = ImageResponse.data.url;

      setData((prev) => ({
        ...prev,
        image: [...prev.image, imageUrl],
      }));
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...data.image];
    updatedImages.splice(index, 1);
    setData((prev) => ({
      ...prev,
      image: updatedImages,
    }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.CreateProduct,
        data:data
      })
      const {data:responseData}=response
      if(responseData.success){
        toast.success(responseData.message)
        setData({
          name: '',
          image: [],
          category: '',
          subCategory: '',
          unit: '',
          stock: '',
          price: '',
          discount: '',
          description: '',
          more_details: {},
        });
      }
    } catch (error) {
      AxiosTostError(error)
    }
    console.log(data); 
  };  

  const filteredSubcategories = AllSubCategory.filter(
    (sub) => sub.category === data.category || sub.category?._id === data.category
  );

  const handelAddSubmit = () => {
    if (!fieldName.trim()) return;

    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: "",
      },
    }));

    setFieldName("");
    setOpenAddField(false);
  };


  return (
    <section>
      <div className="text-xl font-bold bg-white shadow-md px-3 py-3 flex items-center justify-between">
        <h2 className="font-semibold">Upload Product</h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-2">

          {/* Name */}
          <label htmlFor='name' className="text-sm font-medium">Name</label>
          <input
            id='name'
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full p-2 border border-gray-300 rounded bg-blue-50 text-sm"
            required
          />

          {/* Description */}
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded bg-blue-50 text-sm resize-none"
            required
          />

          {/* Image Upload */}
          <label className="text-sm font-medium">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleUploadImage}
            accept="image/*"
            className="hidden"
            id="upload-image"
            required
          />
          <label
            htmlFor="upload-image"
            className="w-full py-9 text-center border border-gray-300 rounded bg-blue-50 cursor-pointer mb-2"
          >
            <div className="flex flex-col items-center justify-center">
              {
                loading ? (
                  <div className="w-11 h-11 border-4 border-primary-100 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <MdCloudUpload size={40} />
                    <span>Upload Image</span>
                  </>
                )
              }
            </div>
          </label>

          {/* Display Images */}
          <div className="flex gap-2 flex-wrap">
            {data.image.map((img, index) => (
              <div key={img + index} className="h-20 w-20 min-w-20 bg-blue-50 border relative group">
                <img src={img} alt={img} className="w-full h-full object-scale-down" />
                <div
                  onClick={() => handleDeleteImage(index)}
                  className="absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                >
                  <MdDelete />
                </div>
              </div>
            ))}
          </div>

          {/* Category */}
          <label className="text-sm font-medium">Category</label>
          <select
            name="category"
            required
            value={data.category}
            onChange={(e) => {
              const value = e.target.value;
              setData((prev) => ({
                ...prev,
                category: value,
                subCategory: '', // clear subcategory on category change
              }));
            }}
            className="w-full p-2 border border-gray-300 rounded bg-blue-50 text-sm"
          >
            <option value="">Select Category</option>
            {AllCategory.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
            
          </select>

          {/* SubCategory */}
          <label className="text-sm font-medium">SubCategory</label>
          <select
            name="subCategory"
            value={data.subCategory}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-blue-50 text-sm"
            required
          >
            <option value="">Select SubCategory</option>
            {filteredSubcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>

          {/* Unit */}
          <label className="text-sm font-medium">Unit</label>
          <input
            type="text"
            required
            name="unit"
            value={data.unit}
            onChange={handleChange}
            placeholder="Enter product unit e.g., kg, liter "
            className="w-full p-2 border border-gray-300 rounded bg-blue-50 text-sm"
          />

          {/* Stock */}
          <label className="text-sm font-medium">Stock</label>
          <input
            type="number"
            required
            name="stock"
            value={data.stock}
            onChange={handleChange}
            placeholder="Available stock"
            className="w-full p-2 border border-gray-300 rounded bg-blue-50 text-sm"
          />

          {/* Price */}
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            required
            value={data.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full p-2 border border-gray-300 rounded bg-blue-50 text-sm"
          />

          {/* Discount */}
          <label className="text-sm font-medium">Discount (%)</label>
          <input
            type="number"
            required
            name="discount"
            value={data.discount}
            onChange={handleChange}
            placeholder="Enter discount"
            className="w-full p-2 border border-gray-300 rounded bg-blue-50 text-sm"
          />

          {/* Add Fields Button */}
          {
            Object?.keys(data?.more_details)?.map((k, index) => {
              return (
                <div>
                  <label htmlFor={k} className="text-sm font-medium">{k}</label>
                  <input
                    id={k}
                    type="text"
                    value={data?.more_details[k]}
                    onChange={(e) => {
                      const value = e.target.value
                      setData((preve) => {
                        return {
                          ...preve,
                          more_details: {
                            ...preve.more_details, [k]: value
                          }
                        }
                      })
                    }}
                    className="w-full p-2 border border-gray-300 rounded bg-blue-50 text-sm"
                  />
                </div>
              )
            })
          }
          <div onClick={() => setOpenAddField(true)} className="w-28 px-2 py-2 border border-primary-100 text-primary-100 hover:bg-primary-100 hover:text-black font-semibold rounded text-sm mt-2">
            + Add Fields
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 border-2 border-primary-200 text-primary-200 rounded text-sm hover:text-black hover:bg-primary-200 font-bold mt-4"
          >
            Upload Product
          </button>
        </form>
        {
          openAddField && (
            <AddFieldComponent
              close={() => setOpenAddField(false)}
              onSubmit={handelAddSubmit}
              onChange={(e) => setFieldName(e.target.value)}
              value={fieldName}
            />

          )
        }

      </div>
    </section>
  );
};

export default UploadProduct;
