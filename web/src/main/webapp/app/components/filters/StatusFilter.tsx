import React from 'react';

interface StatusOption {
  value: string;
  label: string;
  count?: number;
}

interface StatusFilterProps {
  options: StatusOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  options,
  value,
  onChange,
  label = 'Status'
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined && ` (${option.count})`}
          </option>
        ))}
      </select>
    </div>
  );
};