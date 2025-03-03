import { useState } from 'react';
import surveyImage from '../assets/log.png';
import { XMarkIcon, } from "@heroicons/react/24/outline";
import SuccessPopup from './successPopup';

const LogisticSurvey = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [emojiRating, setEmojiRating] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  
  // Form state for tracking all required fields
  const [formState, setFormState] = useState({
    rating2: null,
    rating3: null,
    rating4: null,
    emojiRating: null,
    improvements: "",
    responsiveness: null,
    remarks: "",
    complaints: null,
    complaintDetails: "",
    otherComments: ""
  });

  const emojis = [
    { 
      rating: 1, 
      label: 'Poor', 
      defaultEmoji: '😣',
      activeEmoji: '😭',
    },
    { 
      rating: 2, 
      label: 'Bad', 
      defaultEmoji: '🙁',
      activeEmoji: '😣',
    },
    { 
      rating: 3, 
      label: 'Average', 
      defaultEmoji: '😐',
      activeEmoji: '😊',
    },
    { 
      rating: 4, 
      label: 'Good', 
      defaultEmoji: '🙂',
      activeEmoji: '😄',
    },
    { 
      rating: 5, 
      label: 'Excellent', 
      defaultEmoji: '😎',
      activeEmoji: '🤩',
    },
  ];

  // Update a field in the form state
  const updateFormField = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation alert when user fixes a field
    if (showValidationAlert) {
      setShowValidationAlert(false);
    }
  };

  // Handle emoji rating change
  const handleEmojiRatingChange = (rating) => {
    setEmojiRating(rating);
    updateFormField('emojiRating', rating);
  };

  // Validate the form before saving
  const validateForm = () => {
    const required = [
      { field: 'rating2', label: 'On Time Delivery Rating' },
      { field: 'rating3', label: 'Professionalism Rating' },
      { field: 'rating4', label: 'Handling of Goods Rating' },
      { field: 'emojiRating', label: 'User Experience Rating' },
      { field: 'improvements', label: 'Improvements' },
      { field: 'responsiveness', label: 'Responsiveness Rating' },
      { field: 'remarks', label: 'Remarks' },
      { field: 'complaints', label: 'Complaints Question' },
      { field: 'otherComments', label: 'Other Comments' }
    ];

    // Add complaint details if complaints is 'yes'
    if (formState.complaints === 'yes') {
      required.push({ field: 'complaintDetails', label: 'Complaint Details' });
    }

    const missing = required.filter(item => {
      const value = formState[item.field];
      return value === null || value === undefined || value === '';
    });

    setMissingFields(missing.map(item => item.label));
    return missing.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setShowSuccessPopup(true);
    } else {
      setShowValidationAlert(true);
      // Scroll to top to show the validation alert
      const scrollableContent = document.querySelector('.overflow-y-auto');
      if (scrollableContent) {
        scrollableContent.scrollTop = 0;
      }
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    onClose(); // Close the LogisticSurvey component
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 ">
      <div className="bg-white rounded-lg rounded-tl-none  w-[1323px] h-[596px] shadow-lg overflow-hidden">
        {/* Header remains the same */}
       
        <div 
  className=" px-3 py-1 flex justify-between items-center bg-headerColor border-b border-customYellow " 
  style={{ backgroundImage: 'url(header.svg)', backgroundSize: "contain", backgroundPosition: "left center", backgroundRepeat: 'no-repeat' }}
>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Logistic Survey</h2>
            <p className="text-gray-500 text-xs">Rate the delivery experience, click save when you're done.</p>
          </div>
          <button onClick={() => setIsOpen(false)}><XMarkIcon className="w-5 h-5" /></button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(596px-48px)]">
          {/* Left side - Image */}
          <div className="grid grid-cols- gap-6 p-4">
            <div className="border border-gray-200 bg-gray-50 rounded-lg  shadow-md h-[509px] w-[336px]">
              <img src={surveyImage} alt="surveyImage" className="h-[342px] w-[336px] object-contain mt-28" />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-2/3 flex flex-col h-full">
            {/* Fixed Distributor Text (Non-Editable) */}
            <div className="p-6 bg-white">
              <label className="block text-base mb-2">Distributor</label>
              <div className="w-[276px] h-[40px] px-3 flex items-center bg-white border rounded-md">
                <span className="text-gray-700">Safe Express</span>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6">
              {/* Validation Alert */}
              {showValidationAlert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="font-bold">Please complete all required fields before saving:</p>
                  <ul className="list-disc pl-5 mt-2">
                    {missingFields.map((field, idx) => (
                      <li key={idx}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rating sections */}
              {[
                {
                  num: 2,
                  field: 'rating2',
                  text: "Rate Logistics Service Providers on the Parameter of 'On Time Delivery'. Please select the right attribute by ticking the corresponding cell."
                },
                {
                  num: 3,
                  field: 'rating3',
                  text: "Rate Logistics Service Providers on the Parameter of 'Professionalism'. Please select the right attribute by ticking the corresponding cell."
                },
                {
                  num: 4,
                  field: 'rating4',
                  text: "Rate Logistics Service Providers on the Parameter of 'Handling of Goods'. Please select the right attribute by ticking the corresponding cell."
                }
              ].map(({ num, field, text }) => (
                <div key={num} className="space-y-3 mb-8">
                  <label className="block text-base">
                    {num}. {text}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex gap-3 ml-10">
                    {['Excellent', 'Good', 'Satisfied', 'Improve', 'Poor'].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center justify-start w-[140px] h-[40px] bg-gray-100 rounded-md cursor-pointer transition-colors duration-200 px-4 text-left"
                        onClick={(e) => {
                          // Remove highlight from other options in the same group
                          e.currentTarget.parentElement.querySelectorAll('label').forEach(label => {
                            label.classList.remove('bg-yellow-400');
                            label.classList.add('bg-gray-100');
                          });
                          // Add highlight to clicked option
                          e.currentTarget.classList.remove('bg-gray-100');
                          e.currentTarget.classList.add('bg-yellow-400');
                          // Update form state
                          updateFormField(field, rating);
                        }}
                      >
                        <input
                          type="radio"
                          name={`rating${num}`}
                          className="mr-2 w-[16px] h-[16px]"
                        />
                        <span>{rating}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* Updated Emoji Rating Section with fixed dimensions */}
              <div className="mb-8">
                <label className="block text-base mb-3">
                  5. How has been your user experience with the SOG Partner Portal and its features? Rate on the scale of 1 to 5. 1 being Poor and 5 being Excellent
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="w-[409px] h-[69px] ml-5">
                  <div className="flex justify-between mb-2">
                    {emojis.map(({ rating, label, defaultEmoji, activeEmoji }) => {
                      const isSelected = emojiRating === rating;
                      const shouldBeGrey = emojiRating && !isSelected;
                      
                      return (
                        <button
                          key={rating}
                          onClick={() => handleEmojiRatingChange(rating)}
                          className="flex flex-col items-center transition-all duration-300 w-12"
                        >
                          <span 
                            className={`text-2xl transition-all duration-300 ${
                              shouldBeGrey 
                                ? 'opacity-50 grayscale' 
                                : isSelected 
                                  ? 'animate-bounce scale-110' 
                                  : 'hover:scale-105'
                            }`}
                            style={{
                              filter: shouldBeGrey ? 'grayscale(100%)' : 'none',
                            }}
                          >
                            {isSelected ? activeEmoji : defaultEmoji}
                          </span>
                          <span className={`text-xs mt-1 ${
                            shouldBeGrey ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="absolute h-full rounded-full transition-all duration-300"
                      style={{
                        width: emojiRating 
                          ? emojiRating === 1 
                            ? '10%'
                            : `${((emojiRating - 1) / 4) * 100}%`
                          : '0%',
                        backgroundColor: '#FFB800',
                        left: '0',
                      }}
                    />
                    {emojiRating && (
                      <div 
                        className="absolute w-4 h-4 bg-white border-2 border-yellow-400 rounded-full -mt-1 transition-all duration-300"
                        style={{
                          left: emojiRating === 1 
                            ? '10%'
                            : `${((emojiRating - 1) / 4) * 100}%`,
                          transform: 'translateX(-50%)',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Improvements Text Area */}
              <div className="mb-8">
                <label className="block text-base mb-3">
                  6. What improvement would you like to see in the SOG Partner Portal?
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  placeholder="Write your comment here"
                  className="w-[581px] h-[79px] p-3 border rounded-md resize-none ml-4"
                  value={formState.improvements}
                  onChange={(e) => updateFormField('improvements', e.target.value)}
                />
              </div>

              {/* 7. Responsiveness Rating */}
              <div className="mb-8 ">
                <label className="block text-base mb-3">
                  7. Please rate on Responsiveness / Support from Bechem Team
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="space-y-2 ml-3">
                  {['Excellent', 'Good', 'Satisfied', 'Need Improvements', 'Poor'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="responsiveness"
                        className="w-[16px] h-[16px] mr-2"
                        onChange={() => updateFormField('responsiveness', option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 8. Remarks */}
              <div className="mb-8">
                <label className="block text-base mb-3">
                  8. Please share your remarks if any...
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  placeholder="Write your comment here"
                  className="w-[581px] h-[79px] p-3 border rounded-md resize-none ml-3"
                  value={formState.remarks}
                  onChange={(e) => updateFormField('remarks', e.target.value)}
                />
              </div>

              {/* 9. Complaints */}
              <div className="mb-8">
                <label className="block text-base mb-3">
                  9. Have you faced any complaints from the customer because of late dispatches?
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="space-y-2 mb-3">
                  <label className="flex items-center ">
                    <input 
                      type="radio" 
                      name="complaints" 
                      value="yes"
                      onChange={(e) => {
                        updateFormField('complaints', 'yes');
                        const commentLabel = document.getElementById('elaborateLabel');
                        if (e.target.checked) {
                          commentLabel.innerHTML = 'If yes, Please Elaborate... <span class="text-red-500">*</span>';
                        }
                      }}
                      className="mr-2 w-[16px] h-[16px] ml-3" 
                    />
                    <span>yes</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="complaints" 
                      value="no"
                      onChange={(e) => {
                        updateFormField('complaints', 'no');
                        const commentLabel = document.getElementById('elaborateLabel');
                        if (e.target.checked) {
                          commentLabel.innerHTML = 'If yes, Please Elaborate...';
                        }
                      }}
                      className="mr-2 w-[16px] h-[16px] ml-3" 
                    />
                    <span>No</span>
                  </label>
                </div>
                <div>
                  <label id="elaborateLabel" className="block mb-2">
                    If yes, Please Elaborate...
                  </label>
                  <textarea
                    placeholder="Write your comment here"
                    className="w-[581px] h-[79px] p-3 border rounded-md resize-none ml-3"
                    value={formState.complaintDetails}
                    onChange={(e) => updateFormField('complaintDetails', e.target.value)}
                  />
                </div>
              </div>

              {/* 10. Other Comments */}
              <div className="mb-8">
                <label className="block text-base mb-3">
                  10. Any other comments.
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  placeholder="Write your comment here"
                  className="w-[581px] h-[79px] p-3 border rounded-md resize-none ml-3"
                  value={formState.otherComments}
                  onChange={(e) => updateFormField('otherComments', e.target.value)}
                />
              </div>
            </div>

            {/* Fixed Buttons at bottom */}
            <div className="p-6 flex justify-end gap-4 bg-white">
              <button
                className="w-[140px] h-[40px] bg-grayColorButton rounded-md text-white hover:bg-customYellow"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="w-[140px] h-[40px] bg-green-800 text-white rounded-md text-base hover:bg-customYellow"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={handleSuccessClose}
          message="Thank you for your feedback."
        />
      )}
    </div>
  );
};

export default LogisticSurvey;