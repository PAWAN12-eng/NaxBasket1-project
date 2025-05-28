import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AxiosTostError from "../utils/AxiosTosterror";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CartProduct from "../components/CartProduct";
import { useSelector } from "react-redux";
import { validURLConverter } from "../utils/valideURLConvert";
import Header from "../components/Header";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const subcategory = useSelector((state) => state.product.subCategory);
  const [displaySubCategory, setDisplaySubCategory] = useState();
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  // const link = ""
  // const url = `/${validURLConverter(cat)}-${id}/${validURLConverter(subCategory.name)}-${subCategory._id}`;

  const subCategoryName = params.subCategory.split("-").slice(0, -1).join(" ");
  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategroyandSubcategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        },
      });
      const { data: responseData } = response;
      if (responseData.page == 1) {
        setData(responseData.data);
      } else {
        setData([...data, ...responseData.data]);
      }
      if (responseData.success) {
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  useEffect(() => {
    const sub = subcategory.filter(
      (s) => s.category && s.category._id === categoryId
    );
    setDisplaySubCategory(sub);
  }, [params, subcategory]);

  return (
    <section className="sticky top-24 lg:top-20">
      {/* <Header/> */}
      <div className="container mx-auto grid top-24 grid-cols-[65px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/* sub category */}
        <div className="bg-white min-h-[80vh] max-h-[80vh] lg:min-h-[88vh] lg:max-h-[88vh] overflow-y-auto scrollbar-none shadow-md rounded-md divide-y lg:pt-4">
          {Array.isArray(displaySubCategory) &&
            displaySubCategory.map((s, index) => {
              const link = `/${validURLConverter(s?.category?.name)}-${
                s?.category?._id
              }/${validURLConverter(s.name)}-${s._id}`;

              return (
                <Link
                  to={link}
                  key={index}
                  className={`w-full p-2 border bg-white flex flex-col lg:flex-row items-center gap-2 lg:gap-3 cursor-pointer hover:bg-green-100 ${
                    subCategoryId === s._id ? "bg-green-50" : ""
                  }`}
                  onClick={() => setSelectedSubCategory(s._id)}
                >
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-14 h-14 object-contain"
                  />
                  <p className="text-sm font-medium text-gray-800 text-center lg:text-base">
                    {s.name}
                  </p>
                </Link>
              );
            })}
        </div>

        {/* product */}
        <div className="">
          <div className="bg-white shadow-md p-4">
            <h3 className="font-semibold">{subCategoryName}</h3>
          </div>
          <div>
            <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 lg:p-4 p-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {loading && (
                  <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
                    <div className="w-11 h-11 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {data.map((p, index) => {
                  return (
                    <CartProduct
                      data={p}
                      key={p._id + "categorywiseProductDisplay" + index}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
