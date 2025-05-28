import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,


  
} from "chart.js";
import { subDays, subMonths, subYears, format, isSameDay, isSameMonth, isSameYear } from "date-fns";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardChart = () => {
  const [timeFrame, setTimeFrame] = useState("daily"); // daily/monthly/yearly
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sales data based on timeframe
  const fetchSalesData = async (frame) => {
    setLoading(true);
    try {
      const response = await Axios.get(SummaryApi.AdminSalesData.url + `?timeFrame=${frame}`);
      console.log("Sales API response:", response.data.data);

      if (response.data.success) {
        setSalesData(response.data.data);
      } else {
        setSalesData([]);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setSalesData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSalesData(timeFrame);
  }, [timeFrame]);

  // Helper: generate date list and fill missing
  const generateFilledData = () => {
    const today = new Date();
    let filled = [];

    if (timeFrame === "daily") {
      const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
      filled = last7Days.map((date) => {
        const found = salesData.find((item) => isSameDay(new Date(item.date), date));
        return {
          date: date,
          totalSales: found ? found.totalSales : 0,
        };
      });
    }

    if (timeFrame === "monthly") {
      const last12Months = Array.from({ length: 12 }, (_, i) => subMonths(today, 11 - i));
      filled = last12Months.map((date) => {
        const found = salesData.find((item) => isSameMonth(new Date(item.date), date));
        return {
          date: date,
          totalSales: found ? found.totalSales : 0,
        };
      });
    }

    if (timeFrame === "yearly") {
      const last5Years = Array.from({ length: 5 }, (_, i) => subYears(today, 4 - i));
      filled = last5Years.map((date) => {
        const found = salesData.find((item) => isSameYear(new Date(item.date), date));
        return {
          date: date,
          totalSales: found ? found.totalSales : 0,
        };
      });
    }

    return filled;
  };

  const filledSalesData = generateFilledData();

  // Prepare labels and dataset for chart
  const labels = filledSalesData.map((item) => {
    const date = item.date;
    if (timeFrame === "yearly") return date.getFullYear();
    if (timeFrame === "monthly")
      return date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    return date.toLocaleDateString();
  });

  const dataPoints = filledSalesData.map((item) => item.totalSales);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Sales",
        data: dataPoints,
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#E5E7EB" },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        titleColor: "#F3F4F6",
        bodyColor: "#E5E7EB",
        borderColor: "rgba(75, 85, 99, 1)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(55, 65, 81, 1)" },
        ticks: { color: "#9CA3AF" },
      },
      y: {
        grid: { color: "rgba(55, 65, 81, 1)" },
        ticks: { color: "#9CA3AF" },
      },
    },
    maintainAspectRatio: false,
    interaction: { mode: "nearest", axis: "x", intersect: false },
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <div className="flex justify-end space-x-2 mb-3">
        {["daily", "monthly", "yearly"].map((frame) => (
          <button
            key={frame}
            onClick={() => setTimeFrame(frame)}
            className={`px-3 py-1 rounded ${
              timeFrame === frame
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {frame.charAt(0).toUpperCase() + frame.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative h-80">
        {loading ? (
          <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg"></div>
        ) : filledSalesData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No sales data available.
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default DashboardChart;
