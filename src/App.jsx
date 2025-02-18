

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";

import InvoiceTable from "./components/InvoiceTable";
import ProductOrderList from "./components/POList";
import PendingApprovals from "./components/PendingApprovals";
import PlaceOrder from "./components/PlaceOrder"
import Reports from "./components/Reports";
import UsersDetails from "./components/UserDetails";  
import ResetPasswordPopup from "./components/ResetPasswordPopup";
import Cards from "./components/Cards";
import ProfilePage from "./components/ProfilePage";
import PoliciesSection from "./components/PoliciesSection"
import EditUserPopup from "./components/EditUserPopup";
import AddUserPopup from "./components/AddUserPopup";
import SuccessPopup from "./components/SuccessPopup";
import Notifications from "./components/Notifications";
import ForgotPassword from "./components/forgetPassword";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [accountId, setAccountId] = useState();
  const [accountName, setAccountName] = useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login setAccountId={setAccountId} setAccountName={setAccountName} />}
        />
        <Route
          path="/Notifications"
          element={<Notifications setAccountId={setAccountId} setAccountName={setAccountName} />}
        />
        <Route
          path="/Place_Order"
          element={<PlaceOrder  accountId={accountId} accountName={accountName}/>}
        />
        <Route
          path="/Invoice_Table"
          element={<InvoiceTable accountId={accountId} accountName={accountName} />}
        />
        <Route
          path="/Product_Order_List"
          element={<ProductOrderList accountId={accountId} accountName={accountName} />}
        />
        <Route
          path="/Pending_Approvals"
          element={<PendingApprovals accountId={accountId} accountName={accountName} />}
        />
        <Route
          path="/Reports"
          element={<Reports accountId={accountId} accountName={accountName} />}
        />
        <Route
          path="/UsersDetails"
          element={<UsersDetails accountId={accountId} accountName={accountName} />}
        />
        <Route
          path="/Profile"
          element={<ProfilePage accountId={accountId} accountName={accountName} />}
        />
        <Route
          path="/Policy"
          element={<PoliciesSection accountId={accountId} accountName={accountName} />}
        />
        <Route
          path="/Dashboard"
          element={<Dashboard accountId={accountId} accountName={accountName} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
