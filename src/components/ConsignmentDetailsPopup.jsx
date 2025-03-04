import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ConsignmentImage from "../assets/images/consignee.png";
import HeaderImage from "../assets/bechemheader.jpeg";
import safexpressApi from '../services/safexpressApi';

const ConsignmentDetailsPopup = ({ setIsOpen, lrNumber }) => {
  const [consignmentData, setConsignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStatusSequence = [
    "BOOKED",
    "IN-TRANSIT",
    "ARRIVED AT DESTINATION",
    "OUT FOR DELIVERY",
    "DELIVERED",
  ];

  const getStatusColor = (status, index, currentStatus) => {
    const currentStatusIndex = getStatusSequence.indexOf(currentStatus);
    const thisStatusIndex = getStatusSequence.indexOf(status);
    return thisStatusIndex <= currentStatusIndex
      ? "border-yellow-400 bg-yellow-100"
      : "border-gray-400 bg-gray-200";
  };

  const getMergedStatusList = (trackingData) => {
    return getStatusSequence
      .map((status) => {
        const found = trackingData?.find((update) => update.status === status);
        return found || { status, description: "Pending", date: "Not Updated" };
      })
      .reverse(); // Reverse the order here
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await safexpressApi.getTrackingInfo(lrNumber);
        setConsignmentData(data.shipment);
        setError(null);
      } catch (error) {
        console.error("Error fetching tracking info:", error);
        setError("Failed to load consignment details");
      } finally {
        setLoading(false);
      }
    };

    if (lrNumber) {
      fetchData();
    }
  }, [lrNumber]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
        <div className="text-white">{error}</div>
      </div>
    );
  }

  if (!consignmentData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-[950px] h-[640px] shadow-lg relative">
        {/* <div
          className="rounded-t-lg px-3 py-1 flex justify-between items-center"
          style={{
            backgroundImage: `url(${HeaderImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Consignment Details
            </h2>
            <p className="text-gray-500 text-xs">
              Track the latest update of your consignment
            </p>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div> */}
          <div 
                  className="px-3 py-1 flex justify-between items-center bg-headerColor border-b border-customYellow h-[55px] w-full" 
                  style={{ backgroundImage: 'url(header.svg)', backgroundSize: "contain", backgroundPosition: "left center", backgroundRepeat: 'no-repeat' }}
                >
                  <div className="flex-1">
                    <h2 className="font-bold text-slate-900 font-helvetica text-[22px] leading-none p-1 whitespace-nowrap">
                    Consignment Details
                    </h2>
                    <p className="text-gray-500 text-[10px] leading-none m-0 px-1 font-helvetica">
                    Track the latest update of your consignment
                    </p>
                  </div>
                  <button onClick={() => setIsOpen(false)}>
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
                </div>

        <div className="grid grid-cols-2 gap-6 p-4">
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-8 shadow-md h-[550px] w-[420px]">
            <img
              src={ConsignmentImage}
              alt="Consignment"
              className="w-full h-[280px] object-contain mt-14"
            />
          </div>
          <div className="p-6 pr-16 h-full">
            <div className="space-y-1 mb-4">
              <p className="text-sm">
                <span className="font-bold">Waybill No.:</span>{" "}
                {consignmentData.waybill}
              </p>
              <p className="text-sm">
                <span className="font-bold">Reference No.:</span>{" "}
                {consignmentData.refNo}
              </p>
              <p className="text-sm">
                <span className="font-bold">Pickup Date:</span>{" "}
                {consignmentData.pickUpDate}
              </p>
              <p className="text-sm">
                <span className="font-bold">Delivery Date:</span>{" "}
                {consignmentData.deliveryDate}
              </p>
              <p className="text-sm">
                <span className="font-bold">Origin:</span>{" "}
                {consignmentData.origin}
              </p>
              <p className="text-sm">
                <span className="font-bold">Destination:</span>{" "}
                {consignmentData.destination}
              </p>
              <p className="text-sm">
                <span className="font-bold">Status:</span>{" "}
                {consignmentData.status}
              </p>
            </div>

            <div className="border border-gray-100 rounded-lg shadow p-4 h-[280px] mb-4 overflow-y-auto">
              <h3 className="text-base font-medium flex items-center">
                <span className="text-green-500 text-xl">↑</span> Consignment
                Status
              </h3>
              <div className="relative">
                <div className="absolute left-[9px] top-2 w-[1px] h-[calc(100%-24px)] bg-gray-200"></div>
                <div className="space-y-3">
                  {getMergedStatusList(consignmentData?.tracking || []).map(
                    (update, index) => (
                      <div key={index} className="flex items-start">
                        <div
                          className={`w-[18px] h-[18px] rounded-full border-[2.5px] z-10 transition-colors duration-300 ${getStatusColor(
                            update.status,
                            index,
                            consignmentData?.status || "BOOKED"
                          )}`}
                        ></div>
                        <div className="ml-4">
                          <p className="text-sm font-medium">{update.status}</p>
                          <p className="text-xs text-gray-400">{update.date}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {update.description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-[50px] py-1.5 text-sm text-white bg-green-800 hover:bg-customYellow rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsignmentDetailsPopup;
