import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";

import InvoiceTable from "./components/InvoiceTable";
import ProductOrderList from "./components/POList";
import PendingApprovals from "./components/PendingApprovals";
import PlaceOrder from "./components/PlaceOrder";
import Reports from "./components/Reports";
import UsersDetails from "./components/UserDetails";
import ProfilePage from "./components/ProfilePage";
import PoliciesSection from "./components/PoliciesSection";
import Notifications from "./components/Notifications";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  const [accountId, setAccountId] = useState();
  const [accountName, setAccountName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [distributorData, setDistributorData] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState({
    ac_name: "",
  });

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Login
                setAccountId={setAccountId}
                setAccountName={setAccountName}
                setIsAdmin={setIsAdmin}
                setDistributorData={setDistributorData}
              />
            }
          />
          <Route
            path="/Notifications"
            element={
              <Notifications
                accountId={accountId}
                accountName={accountName}
                setAccountId={setAccountId}
                setAccountName={setAccountName}
              />
            }
          />
          <Route
            path="/Place_Order"
            element={
              <PlaceOrder
                accountId={accountId}
                accountName={accountName}
                isAdmin={isAdmin}
                selectedDistributor={selectedDistributor}
              />
            }
          />
          <Route
            path="/Invoice_Table"
            element={
              <InvoiceTable
                accountId={accountId}
                accountName={accountName}
                isAdmin={isAdmin}
                selectedDistributor={selectedDistributor}
              />
            }
          />
          <Route
            path="/Product_Order_List"
            element={
              <ProductOrderList
                accountId={accountId}
                accountName={accountName}
                isAdmin={isAdmin}
                selectedDistributor={selectedDistributor}
              />
            }
          />
          <Route
            path="/Pending_Approvals"
            element={
              <PendingApprovals
                accountId={accountId}
                accountName={accountName}
                selectedDistributor={selectedDistributor}
              />
            }
          />
          <Route
            path="/Reports"
            element={
              <Reports
                accountId={accountId}
                accountName={accountName}
                isAdmin={isAdmin}
                selectedDistributor={selectedDistributor}
              />
            }
          />
          <Route
            path="/UsersDetails"
            element={
              <UsersDetails
                accountId={accountId}
                accountName={accountName}
                isAdmin={isAdmin}
              />
            }
          />
          <Route
            path="/Profile"
            element={
              <ProfilePage accountId={accountId} accountName={accountName} />
            }
          />
          <Route
            path="/Policy"
            element={
              <PoliciesSection
                accountId={accountId}
                accountName={accountName}
                isAdmin={isAdmin}
                selectedDistributor={selectedDistributor}
              />
            }
          />
          <Route
            path="/Dashboard"
            element={
              <Dashboard
                accountId={accountId}
                accountName={accountName}
                isAdmin={isAdmin}
                distributorData={distributorData}
                selectedDistributor={selectedDistributor}
                setSelectedDistributor={setSelectedDistributor}
              />
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
