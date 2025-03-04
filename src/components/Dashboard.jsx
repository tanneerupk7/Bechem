import React, { useState } from "react";
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

const Dashboard = ({
  isAdmin,
  distributorData,
  selectedDistributor,
  setSelectedDistributor,
}) => {
  const [accountId, setAccountId] = useState(null);
  const [accountName, setAccountName] = useState("");

  console.log(selectedDistributor);

  const handleDistributorSelect = (id, name) => {
    setAccountId(id);
    setAccountName(name);
    setSelectedDistributor(name);
  };

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
      {isAdmin ? (
        selectedDistributor.ac_name !== "" ? (
          <Header
            accountName={accountName}
            isAdmin={isAdmin}
            selectedDistributor={selectedDistributor}
          />
        ) : (
          <HeaderForDashboard
            isAdmin={isAdmin}
            accountName={accountName}
            setAccountId={setAccountId}
            setAccountName={setAccountName}
            distributorData={distributorData}
            onDistributorSelect={handleDistributorSelect}
            selectedDistributor={selectedDistributor}
            setSelectedDistributor={setSelectedDistributor}
          />
        )
      ) : (
        <Header
          accountName={accountName}
          isAdmin={isAdmin}
          selectedDistributor={selectedDistributor}
        />
      )}

      {/* {isAdmin  ? (
        <HeaderForDashboard
          isAdmin={isAdmin}
          accountName={accountName}
          setAccountId={setAccountId}
          setAccountName={setAccountName}
          distributorData={distributorData}
          onDistributorSelect={handleDistributorSelect}
          selectedDistributor={selectedDistributor}
          setSelectedDistributor={setSelectedDistributor}
        />
      ) : (
        <Header accountName={accountName} isAdmin={isAdmin} />
      )} */}
    </>
  );
};

export default Dashboard;
