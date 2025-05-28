import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiCheckCircle,
  FiTruck,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import OrderStatusStepper from "../components/OrderStatusStepper";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios(SummaryApi.getUserOrders);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.product_details?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    // Status filter
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusDetails = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <FiPackage className="text-yellow-500" />,
        };
      case "accepted":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <FiPackage className="text-blue-500" />,
        };
      case "shipped":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: <FiTruck className="text-purple-500" />,
        };
      case "delivered":
        return {
          color: "bg-green-100 text-green-800",
          icon: <FiCheckCircle className="text-green-500" />,
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800",
          icon: <FiCheckCircle className="text-red-500" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <FiPackage className="text-gray-500" />,
        };
    }
  };

  const calculateOrderTotals = (order) => {
    const totalItems = order.items.reduce((sum, item) => sum + (item.qty || 0), 0);
    
    const itemTotal = order.items.reduce((sum, item) => {
      const price = parseFloat(item.product_details?.price || item.productId?.price || 0);
      const discount = parseFloat(item.product_details?.discount || item.productId?.discount || 0);
      const discountedPrice = price * (1 - discount / 100);
      return sum + discountedPrice * (item.qty || 0);
    }, 0);

    const getDeliveryCharges = () => {
      if (itemTotal < 200) return 50;
      if (itemTotal >= 200 && itemTotal <= 500) return 30;
      return 0;
    };
    const deliveryCharge = getDeliveryCharges();
    const grandTotal = itemTotal + deliveryCharge;

    return {
      totalItems,
      itemTotal,
      deliveryCharge,
      grandTotal
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-600">Track your recent orders</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                {/* <option value="accepted">Accepted</option> */}
                {/* <option value="shipped">Shipped</option> */}
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <FiPackage className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              You don't have any orders matching your criteria
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusDetails = getStatusDetails(order.status);
              const { totalItems, itemTotal, deliveryCharge, grandTotal } = calculateOrderTotals(order);

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleExpand(order._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && toggleExpand(order._id)
                    }
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                          {statusDetails.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {totalItems} {totalItems === 1 ? "item" : "items"} •{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusDetails.color}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{grandTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <button
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(order._id);
                        }}
                      >
                        {expandedOrderId === order._id ? (
                          <>
                            <FiChevronUp /> Hide details
                          </>
                        ) : (
                          <>
                            <FiChevronDown /> View details
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrderId === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-gray-200">
                          <OrderStatusStepper
                            status={order.status}
                            createdAt={order.createdAt}
                            updatedAt={order.updatedAt}
                          />

                          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                            Order Items
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {order.items.map((item, index) => {
                              const price = parseFloat(item.product_details?.price || item.productId?.price || 0);
                              const discount = parseFloat(item.product_details?.discount || item.productId?.discount || 0);
                              const discountedPrice = price * (1 - discount / 100);
                              const totalPrice = discountedPrice * (item.qty || 0);

                              return (
                                <motion.div
                                  key={index}
                                  whileHover={{ scale: 1.01 }}
                                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <div className="flex-shrink-0">
                                    <img
                                      src={
                                        item.product_details?.image?.[0] || 
                                        item.productId?.image?.[0] ||
                                        "/placeholder-product.png"
                                      }
                                      alt={item.product_details?.name || item.productId?.name}
                                      className="w-20 h-20 object-cover rounded"
                                      onError={(e) =>
                                        (e.target.src = "/placeholder-product.png")
                                      }
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-800">
                                      {item.product_details?.name || item.productId?.name || "Product"}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Qty: {item.qty} × ₹{discountedPrice.toFixed(2)}
                                      {discount > 0 && (
                                        <span className="ml-2 line-through text-gray-400">
                                          ₹{price.toFixed(2)}
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 mt-1">
                                      Total: ₹{totalPrice.toFixed(2)}
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Order Summary */}
                          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                              Order Summary
                            </h3>
                            <div className="space-y-2 text-gray-700">
                              <div className="flex justify-between">
                                <span>Item Total</span>
                                <span>₹{itemTotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Quantity</span>
                                <span>{totalItems}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Delivery Charges</span>
                                <span>
                                  {deliveryCharge > 0
                                    ? `₹${deliveryCharge.toFixed(2)}`
                                    : "Free"}
                                </span>
                              </div>
                              <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
                                <span>Grand Total</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;