import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, disabled = false }) => {
  return (
    <div 
      className={`h-6 w-12 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : isOn ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-200 hover:bg-gray-300'
      }`}
      onClick={() => !disabled && onToggle()}
    >
      <div 
        className={`h-4 w-4 rounded-full transition-transform ${
          isOn ? 'bg-green-600 transform translate-x-6' : 'bg-gray-400'
        }`}
      ></div>
    </div>
  );
};

export default ToggleSwitch;