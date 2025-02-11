

import React from 'react';

const Navbar = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-gray-100 shadow-sm rounded-lg p-4 flex items-center w-1/2">
        {/* Nav Items */}
        <nav className="ml-8 flex space-x-8 w-full items-center justify-center">
          <a href="#" className="text-gray-700 hover:text-gray-900 hover:underline">PO List</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 hover:underline">Invoice Details</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 hover:underline">Pending Approvals</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 hover:underline">Reports</a>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
