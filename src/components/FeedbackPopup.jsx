import { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, DocumentIcon } from '@heroicons/react/24/outline';
import SuccessPopup from './SuccessPopup';
import image from '../assets/images/feedback.jpg';
import headerImage from '../assets/bechemheader.jpeg';

const FeedbackPopup = () => {
  const [isOpen,setIsOpen] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [ratings, setRatings] = useState({
    ontimedelivery: null,
    producthandling: null,
    overallexperience: null,
  });
  const [feedback, setFeedback] = useState('');
  const [showPodUpload, setShowPodUpload] = useState(false);
  const [showMaterialUpload, setShowMaterialUpload] = useState(false);
  const [podFiles, setPodFiles] = useState([]);
  const [materialFiles, setMaterialFiles] = useState([]);
  const [uploadErrors, setUploadErrors] = useState({
    pod: '',
    material: ''
  });

  const MAX_FILES = 5;
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  const emojis = [
    { 
      rating: 1, 
      label: 'Poor', 
      defaultEmoji: '😫',
      activeEmoji: '😭',
      color: '#FFB800' 
    },
    { 
      rating: 2, 
      label: 'Bad', 
      defaultEmoji: '🙁',
      activeEmoji: '😣',
      color: '#FFB800' 
    },
    { 
      rating: 3, 
      label: 'Average', 
      defaultEmoji: '😐',
      activeEmoji: '😊',
      color: '#FFB800' 
    },
    { 
      rating: 4, 
      label: 'Good', 
      defaultEmoji: '☺️',
      activeEmoji: '😄',
      color: '#FFB800' 
    },
    { 
      rating: 5, 
      label: 'Excellent', 
      defaultEmoji: '😎',
      activeEmoji: '🤩',
      color: '#FFB800' 
    },
  ];

  const categoryMapping = {
    'On Time Delivery': 'ontimedelivery',
    'Product Handling': 'producthandling',
    'Overall Experience': 'overallexperience'
  };

  const validateFiles = (files) => {
    if (files.length > MAX_FILES) {
      return `You can only upload up to ${MAX_FILES} files`;
    }

    for (const file of files) {
      if (!allowedFileTypes.includes(file.type)) {
        return 'Only .jpg, .png, and .jpeg files are allowed';
      }

      if (file.size > maxFileSize) {
        return 'File size must be less than 5MB';
      }
    }

    return '';
  };

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);
    const currentFiles = type === 'pod' ? podFiles : materialFiles;
    
    if (currentFiles.length + files.length > MAX_FILES) {
      setUploadErrors(prev => ({
        ...prev,
        [type]: `You can only upload up to ${MAX_FILES} files`
      }));
      return;
    }

    const error = validateFiles(files);
    setUploadErrors(prev => ({
      ...prev,
      [type]: error
    }));

    if (!error) {
      if (type === 'pod') {
        setPodFiles(prev => [...prev, ...files]);
      } else {
        setMaterialFiles(prev => [...prev, ...files]);
      }
    }
  };

  const removeFile = (index, type) => {
    if (type === 'pod') {
      setPodFiles(prev => prev.filter((_, i) => i !== index));
      setUploadErrors(prev => ({ ...prev, pod: '' }));
    } else {
      setMaterialFiles(prev => prev.filter((_, i) => i !== index));
      setUploadErrors(prev => ({ ...prev, material: '' }));
    }
  };

  const isFeedbackRequired = () => {
    return ratings.overallexperience !== null && ratings.overallexperience !== 5;
  };

  const updateVisibilityAndRequirements = (newRatings) => {
    const { ontimedelivery, producthandling } = newRatings;

    setShowPodUpload(false);
    setShowMaterialUpload(false);

    const deliveryNotExcellent = ontimedelivery !== null && ontimedelivery !== 5;
    const handlingNotExcellent = producthandling !== null && producthandling !== 5;

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
    
    setRatings(prev => {
      const newRatings = { ...prev, [categoryKey]: value };
      updateVisibilityAndRequirements(newRatings);
      return newRatings;
    });
  };

  const handleSubmit = () => {
    const { ontimedelivery, producthandling, overallexperience } = ratings;

    if (!ontimedelivery || !producthandling || !overallexperience) {
      alert('Please provide all ratings before submitting.');
      return;
    }

    if (isFeedbackRequired() && !feedback.trim()) {
      alert('Please provide feedback before submitting.');
      return;
    }

    if (showPodUpload && podFiles.length === 0) {
      alert('Please upload at least one POD file.');
      return;
    }

    if (showMaterialUpload && materialFiles.length === 0) {
      alert('Please upload at least one Material picture.');
      return;
    }

    console.log('Submitting:', { 
      ratings, 
      feedback,
      podFiles,
      materialFiles
    });
    
    setShowSuccessPopup(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    setIsOpen(false);
    
    setRatings({
      ontimedelivery: null,
      producthandling: null,
      overallexperience: null
    });
    setFeedback('');
    setPodFiles([]);
    setMaterialFiles([]);
    setShowPodUpload(false);
    setShowMaterialUpload(false);
    setUploadErrors({ pod: '', material: '' });
  };

  const FileUploadSection = ({ 
    title, 
    show, 
    onFileChange, 
    error, 
    files,
    type 
  }) => {
    if (!show) return null;

    return (
      <div className="mt-4 ">
        <p className="font-semibold mb-2 flex items-center">
          {title}
          <span className="text-red-500 ml-1">*</span>
        </p>
        <div className={`border-dashed border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2`}>
          {files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1">
                  <DocumentIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index, type);
                    }}
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
                  ? 'Drop files here to upload' 
                  : `${files.length}/${MAX_FILES} files uploaded`
                }
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
                  onChange={(e) => {
                    e.stopPropagation();
                    onFileChange(e, type);
                  }}
                />
              </label>
            )}
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
        <p className="text-xs text-gray-500 mt-1 text-end">
          <span className="bg-yellow-100 px-2 py-1 rounded">
            (.jpg, .png, .jpeg) Max 5 files, 5MB each
          </span>
        </p>
      </div>
    );
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div 
        className="bg-white rounded-lg p-6 w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Feedback</h2>
        <p className="text-gray-600 mb-4">
          Invoice No: {invoice?.inv_no}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRatingChange(star, star);
                  }}
                  className={`text-2xl ${
                    star <= ratings.overallexperience ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Comments</label>
            <textarea
              value={feedback}
              onChange={(e) => {
                e.stopPropagation();
                setFeedback(e.target.value);
              }}
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder="Enter your feedback here..."
            />
          </div>

          <div className="space-y-4" style={{marginBottom:"20px"}}>
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

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !ratings.overallexperience}
              className={`px-4 py-2 text-white rounded-md ${
                isSubmitting || !ratings.overallexperience
                  ? 'bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>

      {showSuccessPopup && (
        <SuccessPopup 
          onClose={handleSuccessClose}
          message="Thank you for your feedback."
        />
      )}
    </div>
  );
};

export default FeedbackPopup;




