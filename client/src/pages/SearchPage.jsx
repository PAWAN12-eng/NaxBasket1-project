import React, { useEffect, useState } from "react";
import CartLoading from "../components/CartLoading";
import SummeryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosTostError from "../utils/AxiosTosterror";
import CartProduct from "../components/CartProduct";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCart = new Array(10).fill(null);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchText = searchParams.get("q");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummeryApi.SearchProduct,
        data: { search: searchText },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchText) {
        fetchData();
      }
    }, 300); // delay search execution

    return () => clearTimeout(debounce);
  }, [searchText]);

  return (
    <section className="bg-white min-h-[100vh]">
      {/* <Header/> */}
      {/* <div className='container mx-auto p-4'>
        <p className='font-bold'>Search Result: {data.length}</p>
      </div> */}
      <div className="container mx-auto p-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loadingArrayCart.map((_, index) => (
              <CartLoading key={"loadingsearchpage" + index} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <img
              src="https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127823.jpg?ga=GA1.1.596061373.1746198913&semt=ais_hybrid&w=740" // ✅ Use your actual image path here
              alt="No Results Found"
              className="w-64 h-auto"
            />
            <p className="text-gray-600 mt-4">
              No products found for your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.map((p, index) => (
              <CartProduct data={p} key={p?._id + "searchProduct" + index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
