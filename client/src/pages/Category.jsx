import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import EditCategory from "../components/EditCategory";
import { data } from "react-router-dom";
import ConfirmBox from "../components/ConfirmBox";
import AxiosTostError from "../utils/AxiosTosterror";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Category = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deletCategory, setDeleteCategory] = useState({
    _id: "",
  });
  const AllCategory = useSelector((state) => state.product.allCategory);

  useEffect(() => {
    setCategories(AllCategory);
  }, [AllCategory]);
  // const fetchCategory = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await Axios({
  //       ...SummaryApi.getcetogry,
  //     });
  //     setCategories(response.data?.data || []);
  //   } catch (error) {
  //     console.error("Failed to fetch categories:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchCategory();
  // }, []);

  const handleNewCategory = (newCategory) => {
    setCategories((prev) => [newCategory, ...prev]);
    setOpenUploadCategory(false);
  };

  const handleUpdateCategory = () => {
    setOpenEdit(false);
    fetchCategory();
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deletCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory();
        setOpenConfirmBoxDelete(false);
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  return (
    <section className=" flex flex-col">
      {/* Header */}
      <div className="text-xl font-bold bg-white shadow-md p-2 flex items-center justify-between">
        <h2 className="font-semibold">Categories</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="px-3 py-2 border border-primary-200 hover:bg-primary-200 text-black font-bold text-sm rounded transition"
        >
          Add Category
        </button>
      </div>

      {/* Upload Modal */}
      {openUploadCategory && (
        <UploadCategoryModel
          close={() => setOpenUploadCategory(false)}
          onSuccess={handleNewCategory}
        />
      )}

      {/* Category List */}
      <div className="flex-1 px-4 mb-8 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="group p-4 bg-white rounded-xl text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full border border-gray-100 hover:border-blue-100"
            >
              <div className="relative overflow-hidden rounded-lg mb-3 h-24 w-24 mx-auto">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-lg" />
              </div>

              <p
                className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate mb-4 px-1 transition-colors duration-300"
                title={category.name}
              >
                {category.name}
              </p>

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => {
                    setEditData(category);
                    setOpenEdit(true);
                  }}
                  className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100 border border-blue-100 hover:border-blue-200 transition-colors duration-300 text-xs font-medium flex items-center justify-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpenConfirmBoxDelete(true);
                    setDeleteCategory(category);
                  }}
                  className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg hover:bg-red-100 border border-red-100 hover:border-red-200 transition-colors duration-300 text-xs font-medium flex items-center justify-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          onSuccess={handleUpdateCategory}
        />
      )}

      {openConfirmBoxDelete && (
        <ConfirmBox
          close={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
};

export default Category;
