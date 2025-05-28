import React from "react";
import {
  ClipboardList,
  PlusSquare,
  MapPin,
  AlertCircle,
  History,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

const Warehouse = () => {
  const { id } = useParams();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: PlusSquare, path: "warehouse-Dashboard" },
    { name: "All Orders", icon: ClipboardList, path: "orders" },
    // { name: "Manage Product Stock", icon: MapPin, path: "manage-product-stock" },
    { name: "Low Stock Alerts", icon: AlertCircle, path: "low-stock-alert" },
    // { name: "Dispatch Orders", icon: History, path: "dispatch-orders" },
  ];

  const isActive = (path) => location.pathname.includes(path);

  return (
    <aside className="w-64 min-w-64 h-screen bg-white px-4 py-6 space-y-4 border-r">
      <div className="text-center text-lg font-semibold text-gray-700 border-b pb-4">
        Warehouse Panel
      </div>

      <nav className="space-y-1">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <Link
            key={path}
            to={`/warehouse/${id}/${path}`}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all 
              ${
                isActive(path)
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
              }`}
          >
            <Icon size={20} />
            <span className="text-sm">{name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Warehouse;
