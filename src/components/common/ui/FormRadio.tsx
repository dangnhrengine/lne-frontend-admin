// src/components/common/ui/FormRadio.tsx
import React from 'react';

type Option = {
  label: React.ReactNode;
  value: string;
};

interface IFormRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  isLoading?: boolean;
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export const FormRadio: React.FC<IFormRadioProps> = ({
  label,
  isLoading,
  id,
  className = '',
  options,
  name,
  value,
  onChange,
  onValueChange,
  ...rest
}) => {
  return (
    <div className="space-y-2">
      {label !== '' && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <div className="flex items-center gap-8">
        {options.map((opt, index) => {
          const inputId = id ? `${id}-${opt.value}` : `radio-${index}`;
          return (
            <div
              key={opt.value}
              className="inline-flex items-center gap-2 text-gray-900"
            >
              <div className="radio-wrapper">
                <input
                  type="radio"
                  id={inputId}
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => {
                    onChange?.(e);
                    onValueChange?.(opt.value);
                  }}
                  disabled={isLoading}
                  {...rest}
                  className={className}
                />
                <label className="radio-btn" htmlFor={inputId} />
              </div>
              <label className="radio-btn" htmlFor={inputId}>
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

FormRadio.displayName = 'FormRadio';
