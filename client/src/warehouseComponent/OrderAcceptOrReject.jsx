import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import {
  FaCheck,
  FaTimes,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaWarehouse,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import toast from "react-hot-toast";
import OrderStatusStepper from "../components/OrderStatusStepper";

const OrderAcceptOrRejectByWareHouse = () => {
  const { id } = useParams(); // warehouse id
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const warehouseStatusSteps = [
    { id: "pending", label: "Pending", icon: <FaBoxOpen /> },
    { id: "accepted", label: "Accepted", icon: <FaWarehouse /> },
    { id: "shipped", label: "Shipped", icon: <FaTruck /> },
    { id: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await Axios(SummaryApi.getWarehouseById(id));
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await Axios.put(SummaryApi.updateOrderStatus(orderId), {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") return order.status === "pending";
    if (activeTab === "accepted") return order.status === "accepted";
    if (activeTab === "shipped") return order.status === "shipped";
    if (activeTab === "delivered") return order.status === "delivered";
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const price = Number(item.productId?.price || 0);
      const discount = Number(item.productId?.discount || 0);
      const discountedPrice = price * (1 - discount / 100);
      return sum + discountedPrice * (item.qty || 0);
    }, 0);
  };

  useEffect(() => {
    fetchOrders();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile responsive */}
      {/* Tabs - Mobile scrollable */}
      <div className="max-w-7xl mx-auto px-2 ">
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          {["pending", "accepted", "shipped", "delivered"].map((tab) => (
            <button
              key={tab}
              className={`px-3 py-2 text-sm md:text-base md:px-4 md:py-2 font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setExpandedOrder(null);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List - Mobile optimized */}
      <div className="max-w-7xl mx-auto py-4 md:py-6 px-2 md:px-4">
        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 md:py-10 bg-white rounded-lg shadow border border-gray-200">
            <FaBoxOpen className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
            <h3 className="mt-2 text-base md:text-lg font-medium text-gray-900">
              No {activeTab} orders
            </h3>
            <p className="mt-1 text-sm md:text-base text-gray-500">
              There are currently no {activeTab} orders for this warehouse.
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredOrders.map((order) => {
              const totalPrice = calculateTotal(order.items);
              const isExpanded = expandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm md:shadow-md border border-gray-200 overflow-hidden"
                >
                  {/* Header - Collapsible on mobile */}
                  <div 
                    className="p-3 md:p-4 bg-gray-50 border-b border-gray-200 cursor-pointer md:cursor-auto"
                    onClick={() => window.innerWidth < 768 && toggleOrderExpand(order._id)}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base truncate">
                          Order: {order._id.slice().toUpperCase()}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 truncate">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm md:text-base">
                          ₹{totalPrice.toFixed(2)}
                        </p>
                        <p className={`text-xs font-medium ${
                          order.status === 'pending' ? 'text-yellow-600' :
                          order.status === 'accepted' ? 'text-blue-600' :
                          order.status === 'shipped' ? 'text-purple-600' :
                          'text-green-600'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                      <div className="md:hidden ml-2">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {(isExpanded || window.innerWidth >= 768) && (
                    <>
                      {/* Customer Info */}
                      <div className="p-3 md:p-4 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                              Customer
                            </h4>
                            <p className="text-sm md:text-base">
                              {order.userId?.name || "—"}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600">
                              {order.userId?.email || "—"}
                            </p>
                          </div>
                          {order.address && (
                            <div>
                              <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                                Shipping Address
                              </h4>
                              <p className="text-xs md:text-sm">
                                {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stepper - Simplified on mobile */}
                      <div className="p-3 md:p-4 border-b border-gray-200">
                        <OrderStatusStepper
                          status={order.status}
                          createdAt={order.createdAt}
                          updatedAt={order.updatedAt}
                          steps={warehouseStatusSteps}
                          isMobile={window.innerWidth < 768}
                        />
                      </div>

                      {/* Products and Actions - Stacked on mobile */}
                      <div className="p-3 md:p-4 flex flex-col gap-4">
                        {/* Products */}
                        <div>
                          <h4 className="text-sm md:text-base font-medium text-gray-700 mb-2">
                            Products ({order.items.length})
                          </h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-2 bg-gray-50 rounded border border-gray-100"
                              >
                                <img
                                  src={
                                    item.productId?.image?.[0] ||
                                    "/placeholder-product.png"
                                  }
                                  alt={item.productId?.name}
                                  className="w-12 h-12 md:w-16 md:h-16 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm md:text-base font-medium truncate">
                                    {item.productId?.name}
                                  </p>
                                  <p className="text-xs md:text-sm text-gray-500">
                                    Qty: {item.qty} • ₹{(item.productId?.price * item.qty).toFixed(2)}
                                    {item.productId?.discount > 0 && (
                                      <span className="ml-1 text-green-600">
                                        ({item.productId.discount}% off)
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions - Full width on mobile */}
                        <div>
                          <h4 className="text-sm md:text-base font-medium text-gray-700 mb-2">
                            Actions
                          </h4>
                          <div className="space-y-2">
                            {order.status === "pending" && (
                              <>
                                <button
                                  className="w-full px-3 py-2 text-sm md:text-base bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center justify-center gap-1"
                                  onClick={() =>
                                    handleStatusChange(order._id, "accepted")
                                  }
                                >
                                  <FaCheck className="inline" />
                                  Accept Order
                                </button>
                                <button
                                  className="w-full px-3 py-2 text-sm md:text-base bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center justify-center gap-1"
                                  onClick={() =>
                                    handleStatusChange(order._id, "cancelled")
                                  }
                                >
                                  <FaTimes className="inline" />
                                  Reject Order
                                </button>
                              </>
                            )}

                            {order.status === "accepted" && (
                              <button
                                className="w-full px-3 py-2 text-sm md:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-1"
                                onClick={() =>
                                  handleStatusChange(order._id, "shipped")
                                }
                              >
                                <FaTruck className="inline" />
                                Mark as Shipped
                              </button>
                            )}

                            {order.status === "shipped" && (
                              <button
                                className="w-full px-3 py-2 text-sm md:text-base bg-green-700 text-white rounded hover:bg-green-800 transition flex items-center justify-center gap-1"
                                onClick={() =>
                                  handleStatusChange(order._id, "delivered")
                                }
                              >
                                <FaCheckCircle className="inline" />
                                Mark as Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile-specific styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default OrderAcceptOrRejectByWareHouse;