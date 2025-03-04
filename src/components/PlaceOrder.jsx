

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const PlaceOrder = ({accountId,isAdmin,accountName, selectedDistributor}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState('');
  const [poNo, setPoNo] = useState('');
  const [deliveryRemarks, setDeliveryRemarks] = useState('');
  const [salesType, setSalesType] = useState('');
  const [consignee, setConsignee] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const [products, setProducts] = useState([
    { id: 1, productName: 'Bechem High Lubjindal Stainless..', noOfPacks: 1, packSize: 180, basicPrice: 349, discount: 0, assessAmt: 62820, delStatus: 'Regular', vertical: 'Steel', engineer: 'Subhajit', tc: 'No', msdc: 'No' },
    { id: 2, productName: 'Bechem High Lubjindal Stainless..', noOfPacks: 2, packSize: 240, basicPrice: 349, discount: 0, assessAmt: 162820, delStatus: 'Schedule', vertical: 'Cement', engineer: 'Sahil', tc: 'No', msdc: 'No' },
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = () => {
    const newProduct = { id: products.length + 1, productName: '', noOfPacks: 0, packSize: 0, basicPrice: 0, discount: 0, assessAmt: 0, delStatus: '', vertical: '', engineer: '', tc: 'No', msdc: 'No' };
    setProducts([...products, newProduct]);
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  };

  const handleSaveAndRelease = () => {
    // Logic to save and release the order
    alert('Order saved and released successfully!');
  };

  const handleEditProduct = (id) => {
    // Logic to edit a product
    alert(`Editing product with ID: ${id}`);
  };

  return (
    <>
      <Header isAdmin={isAdmin} accountName={accountName} selectedDistributor={selectedDistributor}/>
      <div className="p-6 font-sans">
        <div className='px-10'>
        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="block text-gray-600">Date</label>
            <input type="text" placeholder="25/11/2024"  className="p-2 border rounded bg-gray-100 w-40" />
          </div>
          <button
            onClick={handleSaveAndRelease}
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            Save & Release
          </button>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-gray-600">Search</label>
              <input
                type="text"
                placeholder="Search by TR Code"
                value={searchTerm}
                onChange={handleSearch}
                className="p-2 border rounded w-60"
              />
            </div>
            <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 mt-6">Generate</button>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-gray-600">Quantity</label>
              <input
                type="text"
                value={quantity}
                
                className="p-2 border rounded w-20 text-center bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-600">Amount : </label>
              <input
                type="text"
                value={amount.toLocaleString()}
                
                className="p-2 border rounded w-40 text-right bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-4 w-full">
          <div>
            <p className='m-1'>Order Type</p>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="p-2 border rounded w-52"
            >
              <option value="">Select order type</option>
            </select>
          </div>
         <div>
          <p>PO No.</p>
          <input
              type="text"
              placeholder="PO No. *"
              value={poNo}
              onChange={(e) => setPoNo(e.target.value)}
              className="p-2 border rounded w-40"
            />
         </div>
        </div>

        <div className="flex gap-4 mb-4">
          <select
            value={deliveryRemarks}
            onChange={(e) => setDeliveryRemarks(e.target.value)}
            className="p-2 border rounded w-52"
          >
            <option value="">Select Door Delivery</option>
          </select>
          <select
            value={salesType}
            onChange={(e) => setSalesType(e.target.value)}
            className="p-2 border rounded w-52"
          >
            <option value="">Select sales type</option>
          </select>
          <select
            value={consignee}
            onChange={(e) => setConsignee(e.target.value)}
            className="p-2 border rounded w-52"
          >
            <option value="">Select a Consignee</option>
          </select>
          <button
            onClick={handleAddProduct}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 items-end"
          >
            Add Product
          </button>
        </div>
        </div>

        <table className="table-auto w-full border-collapse border-b border-gray-300 text-xs border-l border-r">
          <thead>
            <tr className="bg-tableHeaderColor border-b border-gray-300">
              <th className="p-2 font-normal border-l border-gray-300" style={{ width: "8%" }}>Sl No</th>
              <th className="p-2 font-normal" style={{ width: "15%" }}>Product Name</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>No of Packs</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>Pack Size</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>Basic Price</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>Discount</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>Assess. Amt</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>Del. Status</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>Vertical</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>Engineer</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>TC</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>MSDC</th>
              <th className="p-2 font-normal" style={{ width: "8%" }}>Edit</th>
              <th className="p-2 font-normal border-r border-gray-300" style={{ width: "8%" }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-100 border-b border-gray-300">
                <td className="p-2 text-center border-l border-gray-300 overflow-hidden whitespace-nowrap">{index + 1}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.productName}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.noOfPacks}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.packSize}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.basicPrice.toFixed(2)}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.discount.toFixed(2)}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.assessAmt.toFixed(2)}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.delStatus}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.vertical}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.engineer}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.tc}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">{product.msdc}</td>
                <td className="p-2 text-center overflow-hidden whitespace-nowrap">
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </button>
                </td>
                <td className="p-2 text-center border-r border-gray-300">
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer >
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default PlaceOrder;