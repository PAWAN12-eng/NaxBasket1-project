import React from 'react';
import { FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

const OrderStatusStepper = ({ status, createdAt, updatedAt }) => {
  const steps = [
    { id: 'accepted', label: 'Accepted', icon: <FiPackage /> },
    { id: 'shipped', label: 'Shipped', icon: <FiTruck /> },
    { id: 'delivered', label: 'Delivered', icon: <FiCheckCircle /> },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === status);

  
  return (
    <div className="relative">
      <div className="flex justify-between mb-2 text-xs text-gray-500">
        <span>Ordered: {new Date(createdAt).toLocaleDateString()}</span>
        {updatedAt && (
          <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
        )}
      </div>
      
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -z-10" 
          style={{ 
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`
          }}
        ></div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${index <= currentStepIndex ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {step.icon}
            </div>
            <span className={`text-xs mt-1 ${index <= currentStepIndex ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusStepper;