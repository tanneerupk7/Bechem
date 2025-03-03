import Header from "./Header"
import Cards from "./Cards"
const Reports = ({isAdmin,accountName}) => {
  return (
    <>
      <Header isAdmin={isAdmin} accountName={accountName} />
      <Cards />
    </>
  );
};

export default Reports;