import { useState } from "react";
import {
  XMarkIcon,
  ArrowUpTrayIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import SuccessPopup from "./SuccessPopup";
import image from "../assets/images/feedback.jpg";
import headerImage from "../assets/bechemheader.jpeg";

const FeedbackPopup = ({ onClose, invoice }) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [ratings, setRatings] = useState({
    ontimedelivery: null,
    producthandling: null,
    overallexperience: null,
  });
  const [feedback, setFeedback] = useState("");
  const [showPodUpload, setShowPodUpload] = useState(false);
  const [showMaterialUpload, setShowMaterialUpload] = useState(false);
  const [podFiles, setPodFiles] = useState([]);
  const [materialFiles, setMaterialFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState({
    pod: "",
    material: "",
  });

  const MAX_FILES = 5;
  const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  const emojis = [
    {
      rating: 1,
      label: "Poor",
      defaultEmoji: "😫",
      activeEmoji: "😭",
      color: "#FFB800",
    },
    {
      rating: 2,
      label: "Bad",
      defaultEmoji: "🙁",
      activeEmoji: "😣",
      color: "#FFB800",
    },
    {
      rating: 3,
      label: "Average",
      defaultEmoji: "😐",
      activeEmoji: "😊",
      color: "#FFB800",
    },
    {
      rating: 4,
      label: "Good",
      defaultEmoji: "☺️",
      activeEmoji: "😄",
      color: "#FFB800",
    },
    {
      rating: 5,
      label: "Excellent",
      defaultEmoji: "😎",
      activeEmoji: "🤩",
      color: "#FFB800",
    },
  ];

  const categoryMapping = {
    "On Time Delivery": "ontimedelivery",
    "Product Handling": "producthandling",
    "Overall Experience": "overallexperience",
  };

  const validateFiles = (files) => {
    if (files.length > MAX_FILES) {
      return `You can only upload up to ${MAX_FILES} files`;
    }

    for (const file of files) {
      if (!allowedFileTypes.includes(file.type)) {
        return "Only .jpg, .png, and .jpeg files are allowed";
      }

      if (file.size > maxFileSize) {
        return "File size must be less than 5MB";
      }
    }

    return "";
  };

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);
    const currentFiles = type === "pod" ? podFiles : materialFiles;

    if (currentFiles.length + files.length > MAX_FILES) {
      setUploadErrors((prev) => ({
        ...prev,
        [type]: `You can only upload up to ${MAX_FILES} files`,
      }));
      return;
    }

    const error = validateFiles(files);
    setUploadErrors((prev) => ({
      ...prev,
      [type]: error,
    }));

    if (!error) {
      if (type === "pod") {
        setPodFiles((prev) => [...prev, ...files]);
      } else {
        setMaterialFiles((prev) => [...prev, ...files]);
      }
    }
  };

  const removeFile = (index, type) => {
    if (type === "pod") {
      setPodFiles((prev) => prev.filter((_, i) => i !== index));
      setUploadErrors((prev) => ({ ...prev, pod: "" }));
    } else {
      setMaterialFiles((prev) => prev.filter((_, i) => i !== index));
      setUploadErrors((prev) => ({ ...prev, material: "" }));
    }
  };

  const isFeedbackRequired = () => {
    return (
      ratings.overallexperience !== null && ratings.overallexperience !== 5
    );
  };

  const updateVisibilityAndRequirements = (newRatings) => {
    const { ontimedelivery, producthandling } = newRatings;

    setShowPodUpload(false);
    setShowMaterialUpload(false);

    const deliveryNotExcellent =
      ontimedelivery !== null && ontimedelivery !== 5;
    const handlingNotExcellent =
      producthandling !== null && producthandling !== 5;

    if (deliveryNotExcellent && handlingNotExcellent) {
      setShowPodUpload(true);
      setShowMaterialUpload(true);
      return;
    }

    if (deliveryNotExcellent) {
      setShowPodUpload(true);
    }

    if (handlingNotExcellent) {
      setShowMaterialUpload(true);
    }
  };

  const handleRatingChange = (category, value) => {
    const categoryKey = categoryMapping[category];

    setRatings((prev) => {
      const newRatings = { ...prev, [categoryKey]: value };
      updateVisibilityAndRequirements(newRatings);
      return newRatings;
    });
  };

  const handleSubmit = () => {
    const { ontimedelivery, producthandling, overallexperience } = ratings;

    if (!ontimedelivery || !producthandling || !overallexperience) {
      alert("Please provide all ratings before submitting.");
      return;
    }

    if (isFeedbackRequired() && !feedback.trim()) {
      alert("Please provide feedback before submitting.");
      return;
    }

    if (showPodUpload && podFiles.length === 0) {
      alert("Please upload at least one POD file.");
      return;
    }

    if (showMaterialUpload && materialFiles.length === 0) {
      alert("Please upload at least one Material picture.");
      return;
    }

    console.log("Submitting:", {
      ratings,
      feedback,
      podFiles,
      materialFiles,
    });

    setShowSuccessPopup(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    setRatings({
      ontimedelivery: null,
      producthandling: null,
      overallexperience: null,
    });
    setFeedback("");
    setPodFiles([]);
    setMaterialFiles([]);
    setShowPodUpload(false);
    setShowMaterialUpload(false);
    setUploadErrors({ pod: "", material: "" });
  };

  const FileUploadSection = ({
    title,
    show,
    onFileChange,
    error,
    files,
    type,
  }) => {
    if (!show) return null;

    return (
      <div className="mt-4 ">
        <p className="font-semibold mb-2 flex items-center">
          {title}
          <span className="text-red-500 ml-1">*</span>
        </p>
        <div
          className={`border-dashed border-2 ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg p-2`}
        >
          {files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded px-2 py-1"
                >
                  <DocumentIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm truncate max-w-[150px]">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(index, type)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center ml-12">
              <DocumentIcon className="w-5 h-5 mr-2 text-gray-500" />
              <p className="text-gray-500">
                {files.length === 0
                  ? "Drop files here to upload"
                  : `${files.length}/${MAX_FILES} files uploaded`}
              </p>
            </div>
            {files.length < MAX_FILES && (
              <label className="px-4 py-1 bg-blue-600 text-white rounded-lg inline-flex items-center gap-2 cursor-pointer hover:bg-blue-700">
                <ArrowUpTrayIcon className="w-5 h-5" />
                Upload
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => onFileChange(e, type)}
                />
              </label>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <p className="text-xs text-gray-500 mt-1 text-end">
          <span className="bg-yellow-100 px-2 py-1 rounded">
            (.jpg, .png, .jpeg) Max 5 files, 5MB each
          </span>
        </p>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-5xl relative shadow-lg">
          {/* <div
            className="rounded-t-lg px-3 py-2 flex justify-between items-center w-full"
            style={{
              backgroundImage: `url(${headerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Distributor Feedback
              </h2>
              <p className="text-gray-500" style={{ fontSize: "0.600rem" }}>
                Rate the delivery experience, click save when you're done.
              </p>
            </div>
            <button onClick={onClose}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div> */}
             <div 
                  className="px-3 py-1 flex justify-between items-center bg-headerColor border-b border-customYellow h-[55px] w-full" 
                  style={{ backgroundImage: 'url(header.svg)', backgroundSize: "contain", backgroundPosition: "left center", backgroundRepeat: 'no-repeat' }}
                >
                  <div className="flex-1">
                    <h2 className="font-bold text-slate-900 font-helvetica text-[22px] leading-none p-1 whitespace-nowrap">
                    Distributor Feedback
                    </h2>
                    <p className="text-gray-500 text-[10px] leading-none m-0 px-1 font-helvetica">
                    Rate the delivery experience, click save when you're done.
                    </p>
                  </div>
                  <button onClick={onClose}>
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
                </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4">
            <div className="flex">
              <img
                src={image}
                alt="Feedback"
                className="w-[400px] h-[580px] object-cover rounded-md"
              />
            </div>

            <div className="w-[422px] pr-4 relative h-[580px]">
              <div className="space-y-4 overflow-y-auto scrollbar-hide h-[calc(100%-60px)]">
                <div>
                  <p className="font-semibold">Invoice No.: {invoice?.inv_no}</p>
                  <p>Date: {invoice?.invDt}</p>
                </div>

                {Object.keys(categoryMapping).map((category) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-center text-gray-800 text-lg mb-4">
                      {category}
                    </h3>
                    <div className="flex justify-between px-">
                      {emojis.map(
                        ({
                          rating,
                          label,
                          defaultEmoji,
                          activeEmoji,
                          color,
                        }) => {
                          const categoryKey = categoryMapping[category];
                          const isSelected = ratings[categoryKey] === rating;
                          const selectedRating = ratings[categoryKey];
                          const shouldBeGrey = selectedRating && !isSelected;

                          return (
                            <button
                              key={rating}
                              onClick={() =>
                                handleRatingChange(category, rating)
                              }
                              className="flex flex-col items-center transition-all duration-300 w-24"
                            >
                              <span
                                className={`text-2xl transition-all duration-300 ${
                                  shouldBeGrey
                                    ? "opacity-50 grayscale"
                                    : isSelected
                                    ? "animate-bounce scale-110"
                                    : "hover:scale-105"
                                }`}
                                style={{
                                  filter: shouldBeGrey
                                    ? "grayscale(100%)"
                                    : "none",
                                }}
                              >
                                {isSelected ? activeEmoji : defaultEmoji}
                              </span>
                              <span
                                className={`text-xs mt-2 ${
                                  shouldBeGrey
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {label}
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full mt-2 mx-1">
                      <div
                        className="absolute h-full rounded-full transition-all duration-300"
                        style={{
                          width: ratings[categoryMapping[category]]
                            ? ratings[categoryMapping[category]] === 1
                              ? "10%"
                              : `${
                                  ((ratings[categoryMapping[category]] - 1) /
                                    4) *
                                  100
                                }%`
                            : "0%",
                          backgroundColor: "#FFB800",
                          left: "0",
                        }}
                      />
                      {ratings[categoryMapping[category]] && (
                        <div
                          className="absolute w-4 h-4 bg-white border-2 border-yellow-400 rounded-full -mt-1 transition-all duration-300"
                          style={{
                            left:
                              ratings[categoryMapping[category]] === 1
                                ? "10%"
                                : `${
                                    ((ratings[categoryMapping[category]] - 1) /
                                      4) *
                                    100
                                  }%`,
                            transform: "translateX(-50%)",
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}

                <div>
                  <p className="font-semibold mb-2 flex items-center">
                    Share your feedback
                    {isFeedbackRequired() && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your feedback.."
                    className={`w-full border rounded-lg p-2 h-20 resize-none ${
                      isFeedbackRequired() ? "border-red-500" : ""
                    }`}
                    maxLength={256}
                  />
                  <p className="text-right text-sm text-gray-500">
                    {feedback.length}/256 Characters
                  </p>
                </div>

                <div className="space-y-4" style={{ marginBottom: "20px" }}>
                  <FileUploadSection
                    title="Please upload the POD"
                    show={showPodUpload}
                    onFileChange={handleFileUpload}
                    error={uploadErrors.pod}
                    files={podFiles}
                    type="pod"
                  />

                  <FileUploadSection
                    title="Please upload the Material picture"
                    show={showMaterialUpload}
                    onFileChange={handleFileUpload}
                    error={uploadErrors.material}
                    files={materialFiles}
                    type="material"
                  />
                </div>
              </div>

              <div className="absolute bottom-0 right-4 flex justify-end gap-4 py-4 bg-white w-full">
                <button
                  onClick={onClose}
                  className="px-14 py-3 text-sm font-medium text-white bg-cancelButtonColor rounded-md hover:bg-customYellow"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-14 py-3 text-sm font-medium text-white bg-greenButtonColor rounded-md hover:bg-customYellow"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <SuccessPopup
          onClose={handleSuccessClose}
          message="Thank you for your feedback."
        />
      )}
    </>
  );
};

export default FeedbackPopup;
