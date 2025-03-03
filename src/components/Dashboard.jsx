import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "./Header";
import HeaderForDashboard from "./HeaderForDashboard";
const Dashboard = ({isAdmin, accountName}) => {
  const COLORS = ["#FFC107", "#FFECB3", "#4CAF50", "#1E88E5", "#2E7D32"];

  const productData = [
    { name: "Berutox M2KN", value: 25 },
    { name: "Berulit GA 2500", value: 20 },
    { name: "Alcom 460", value: 15 },
    { name: "Unopol", value: 25 },
    { name: "Alcom 240", value: 15 },
  ];

  console.log(
    `isAdmin from Dashboard: ${isAdmin},accountName from Dashboard: ${accountName}`
  );

  const distributorData = [
    { name: "A&A Associates", value: 30 },
    { name: "B&A Associates", value: 25 },
    { name: "H&A Associates", value: 20 },
    { name: "S&H Associates", value: 15 },
    { name: "B&C Associates", value: 10 },
  ];

  const salesTrendData = [
    { category: "STEEL", value: 72, color: "#FFC107" },
    { category: "AUTO", value: 24, color: "#757575" },
    { category: "MCF", value: 4, color: "#F44336" },
  ];

  const lineChartData = [
    { name: "Apr", current: 2, previous: 1 },
    { name: "May", current: 3, previous: 1.5 },
    { name: "Jun", current: 2, previous: 1 },
    { name: "Jul", current: 5, previous: 2 },
    { name: "Aug", current: 9, previous: 3 },
    { name: "Sep", current: 6, previous: 4 },
    { name: "Oct", current: 7, previous: 5 },
    { name: "Nov", current: 8, previous: 6 },
    { name: "Dec", current: 12, previous: 7 },
    { name: "Jan", current: 10, previous: 8 },
    { name: "Feb", current: 11, previous: 9 },
    { name: "Mar", current: 13, previous: 10 },
  ];

  return (
    <>
      {isAdmin ? <HeaderForDashboard /> : <Header />}
      <div className="p-4 grid grid-cols-3 gap-4">
        {/* Top 5 Products */}
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="font-semibold">Top 5 Products</h3>
          <PieChart width={250} height={200}>
            <Pie
              data={productData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={50}
            >
              {productData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
          <button className="bg-green-700 text-white px-3 py-1 rounded-md">
            View Report
          </button>
        </div>

        {/* Target & Achieved */}
        <div className="bg-blue-100 shadow-lg p-4 rounded-lg">
          <h3 className="font-semibold">Target</h3>
          <p className="text-lg font-bold">9,00,00,000</p>
          <h3 className="font-semibold">Achieved</h3>
          <p className="text-lg font-bold">4,06,54,689</p>
        </div>

        {/* Top 5 Distributors */}
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="font-semibold">Top 5 Distributors</h3>
          <PieChart width={250} height={200}>
            <Pie
              data={distributorData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={50}
            >
              {distributorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
          <button className="bg-green-700 text-white px-3 py-1 rounded-md">
            View Report
          </button>
        </div>

        {/* Yearly Target */}
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="font-semibold">A&A Associates Yearly Target</h3>
          <p className="text-lg font-bold">2025</p>
          <div className="relative w-32 h-32 mx-auto">
            <div className="w-full h-full rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">68%</span>
            </div>
          </div>
          <p className="text-gray-500 text-center">Yearly Target Reached</p>
        </div>

        {/* Month-wise Sale Value */}
        <div className="bg-white shadow-lg p-4 rounded-lg col-span-2">
          <h3 className="font-semibold">Month-wise Sale Value</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#1E88E5"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#000000"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Trend */}
        {/* <div className="bg-white shadow-lg p-4 rounded-lg">
        <h3 className="font-semibold">Sales Trend</h3>
        <div className="relative w-32 h-32 mx-auto">
          <div className="w-full h-full rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">72</span>
          </div>
        </div>
        <div className="flex justify-around mt-4">
          {salesTrendData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.color }}></div>
              <p className="text-xs">{item.category}</p>
            </div>
          ))}
        </div>
      </div> */}
      </div>
    </>
  );
};

export default Dashboard;
