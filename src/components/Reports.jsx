import Header from "./Header"
import Cards from "./Cards"
const Reports = ({isAdmin,accountName, selectedDistributor}) => {
  return (
    <>
      <Header isAdmin={isAdmin} accountName={accountName} selectedDistributor={selectedDistributor}/>
      <Cards isAdmin={isAdmin} accountName={accountName} selectedDistributor={selectedDistributor} />
    </>
  );
};

export default Reports;