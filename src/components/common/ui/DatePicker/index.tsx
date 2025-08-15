import { Label } from '@/components/common/ui';
import { cn } from '@/utils/helpers';
import 'flatpickr/dist/flatpickr.css';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import { forwardRef, memo, useCallback, useMemo } from 'react';
import Flatpickr, {
  DateTimePickerHandle,
  DateTimePickerProps,
  OptionsType,
} from 'react-flatpickr';
import './style.css';
import { Calendar } from 'lucide-react';

interface DatePickerProps extends DateTimePickerProps {
  label?: string;
  useJapanese?: boolean;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  required?: boolean;
}

export const DatePicker = memo(
  forwardRef<DateTimePickerHandle, DatePickerProps>(
    (
      {
        label,
        value,
        onChange,
        placeholder,
        disabled,
        required,
        className,
        options = {},
        name,
        id,
        useJapanese = true,
        multiple = false,
        ...props
      },
      ref
    ) => {
      const defaultOptions: OptionsType = useMemo(
        () => ({
          enableTime: false,
          enableSeconds: false,
          time_24hr: false,
          inline: false,
          allowInput: false,
          closeOnSelect: true,
          weekNumbers: false,
          monthSelectorType: 'dropdown',
          minDate: '1900-01-01',
          maxDate: '2099-12-31',
          clickOpens: true,
        }),
        []
      );

      // Determine the date format based on configuration
      const getDateFormat = useCallback(() => {
        if (options.dateFormat) {
          return options.dateFormat;
        }

        if (options.enableTime) {
          if (options.enableSeconds) {
            return options.time_24hr ? 'Y/m/d H:i:S' : 'Y/m/d h:i:S K';
          }
          return options.time_24hr ? 'Y/m/d H:i' : 'Y/m/d h:i K';
        }

        // Use Japanese date format: YYYY/MM/DD
        return 'Y/m/d';
      }, [
        options.dateFormat,
        options.enableTime,
        options.enableSeconds,
        options.time_24hr,
      ]);

      // Build flatpickr options
      const flatpickrOptions: OptionsType = useMemo(
        () => ({
          locale: useJapanese ? Japanese : undefined,
          dateFormat: getDateFormat(),
          mode: multiple ? ('multiple' as const) : ('single' as const),
          firstDayOfWeek: 1, // Monday as first day of week
          ...defaultOptions,
          ...options,
        }),
        [useJapanese, getDateFormat, options, defaultOptions, multiple]
      );

      return (
        <div className="flex flex-col gap-y-2">
          <Label className="h-5 text-sm font-medium text-gray-900">
            {label}
          </Label>
          <div className="relative">
            <Flatpickr
              data-enable-time
              value={value}
              onChange={onChange}
              options={flatpickrOptions}
              placeholder={placeholder}
              disabled={disabled}
              name={name}
              id={id}
              required={required}
              className={cn(
                'flatpickr-input',
                'flex h-11 w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm',
                'placeholder:text-gray-400 focus:border-gray-300 focus:outline-none',
                'transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
                'bg-gray-100 text-gray-900',
                className
              )}
              ref={ref}
              {...props}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <Calendar className="size-4 text-gray-400" />
            </div>
          </div>
        </div>
      );
    }
  )
);

DatePicker.displayName = 'DatePicker';
