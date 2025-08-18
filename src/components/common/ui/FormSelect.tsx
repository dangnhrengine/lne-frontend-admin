import React from 'react';

type Option = {
  label: React.ReactNode;
  value: string;
};

interface IFormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  isLoading?: boolean;
  options: Option[];
}

export const FormSelect: React.FC<IFormSelectProps> = ({
  label,
  isLoading,
  id,
  className = '',
  options,
  ...selectProps
}) => {
  const baseClasses =
    'w-full h-11 px-3 py-2 text-sm rounded-md border outline-none transition-all duration-200';
  const normalClasses =
    'bg-gray-100 border-gray-200 text-gray-900 focus:bg-gray-100 focus:border-gray-300';
  const loadingClasses = isLoading ? 'opacity-50 cursor-not-allowed' : '';
  const selectClasses =
    `${baseClasses} ${normalClasses} ${loadingClasses} ${className}`.trim();

  return (
    <div className="space-y-2">
      {label !== '' && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <select
        id={id}
        disabled={isLoading}
        className={selectClasses}
        {...selectProps}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
