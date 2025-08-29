import React, { useState } from 'react';
import { ArrowLeft, Phone, MapPin, Camera, Save } from 'lucide-react';

interface VisitScreenProps {
  navigation?: any;
  route?: any;
}

export function VisitScreen({ navigation, route }: VisitScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    customerMet: null as boolean | null,
    visitDone: null as boolean | null,
    amountCollected: '',
    comments: '',
    photos: [] as string[]
  });

  const customerData = {
    name: route?.params?.customerName || "Rajesh Kumar",
    id: route?.params?.customerId || "CUST001",
    address: "Andheri East, Mumbai - 400069",
    phone: "+91 98765 43210"
  };

  const steps = [
    "Customer Details",
    "Visit Information", 
    "Collection",
    "Summary"
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (confirm("Are you sure you want to submit this visit report?")) {
      alert("Visit report submitted successfully!");
      navigation?.goBack?.();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-lg mb-1">{customerData.name}</h3>
              <p className="text-sm text-gray-500 mb-3">ID: {customerData.id}</p>
              
              <div className="flex items-center mb-2">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700 ml-2">{customerData.address}</span>
              </div>
              
              <button className="flex items-center">
                <Phone size={16} className="text-blue-500" />
                <span className="text-sm text-blue-500 ml-2">{customerData.phone}</span>
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Visit Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Was the customer met?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({...formData, customerMet: true})}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.customerMet === true 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setFormData({...formData, customerMet: false})}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.customerMet === false 
                        ? 'bg-red-500 text-white border-red-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Was the visit completed?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({...formData, visitDone: true})}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.visitDone === true 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setFormData({...formData, visitDone: false})}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.visitDone === false 
                        ? 'bg-red-500 text-white border-red-500' 
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Collection Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount Collected (₹)</label>
                <input
                  type="number"
                  value={formData.amountCollected}
                  onChange={(e) => setFormData({...formData, amountCollected: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Comments</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg h-24"
                  placeholder="Add any additional comments..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photos</label>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
                  <Camera size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Add Photo</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Met:</span>
                <span className="font-medium">
                  {formData.customerMet === true ? 'Yes' : formData.customerMet === false ? 'No' : 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Visit Completed:</span>
                <span className="font-medium">
                  {formData.visitDone === true ? 'Yes' : formData.visitDone === false ? 'No' : 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Collected:</span>
                <span className="font-medium">₹{formData.amountCollected || '0'}</span>
              </div>
              {formData.comments && (
                <div>
                  <span className="text-gray-600">Comments:</span>
                  <p className="text-sm mt-1">{formData.comments}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button onClick={() => navigation?.goBack?.()} className="p-2">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold">Visit Report</h1>
          <button onClick={handleSubmit} className="p-2">
            <Save size={20} className="text-blue-500" />
          </button>
        </div>
        
        {/* Progress Steps */}
        <div className="flex mt-4">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}