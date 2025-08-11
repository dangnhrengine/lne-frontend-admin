import React from 'react';

interface IFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isLoading?: boolean;
}

export const FormInput: React.FC<IFormInputProps> = ({
  label,
  isLoading,
  id,
  className = '',
  ...inputProps
}) => {
  // Base classes that work with the current Tailwind setup
  const baseClasses = 'w-full h-11 px-3 py-2 text-sm rounded-md border outline-none transition-all duration-200';
  
  // Normal state classes
  const normalClasses = 'bg-gray-100 border-gray-200 text-gray-900 focus:bg-gray-100 focus:border-gray-300';
  
  // Loading state classes
  const loadingClasses = isLoading ? 'opacity-50 cursor-not-allowed' : '';
  
  // Combine all classes
  const inputClasses = `${baseClasses} ${normalClasses} ${loadingClasses} ${className}`.trim();

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        disabled={isLoading}
        className={inputClasses}
      />
    </div>
  );
};