import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const useProductStock = (location, productId = null) => {
  const [stock, setStock] = useState(null);
  

  useEffect(() => {
    const fetchStock = async () => {
      if (!location) return;
      try {
        const res = await Axios({
          ...SummaryApi.getproductbylocation,
          params: {
            latitude: location.lat,
            longitude: location.lng,
          },
        });

        const products = res.data.products || [];

        if (productId) {
          const product = products.find((p) => p._id === productId);
          setStock(product?.stock || 0);
        } else {
          setStock(products); // full list
        }
      } catch (error) {
        console.error("Error fetching products by location", error);
      }
    };

    fetchStock();
  }, [location, productId]);

  return stock;
};

export default useProductStock;
