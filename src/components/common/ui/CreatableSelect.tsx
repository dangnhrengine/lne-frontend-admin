import { FC, memo, ReactNode, useCallback, useMemo, useRef } from 'react';
import {
  ActionMeta,
  components,
  CSSObjectWithLabel,
  GroupBase,
  MenuListProps,
  MultiValue,
  OptionProps,
  StylesConfig,
} from 'react-select';
import ReactCreatableSelect, { CreatableProps } from 'react-select/creatable';
import { useTranslations } from 'use-intl';
import { Label } from './Label';
import { Spinner } from './Spinner';
import { cn } from '@/utils/helpers';

export interface Option {
  value: string;
  label: string;
  [key: string]: any;
}

export interface NoOptionsMessageProps {
  inputValue: string;
  [key: string]: any;
}

export interface CreatableSelectProps
  extends Omit<CreatableProps<Option, true, GroupBase<Option>>, 'value'> {
  label?: string;
  isMulti?: true;
  loading?: boolean;
  options?: Option[];
  disabled?: boolean;
  isSearchable?: boolean;
  defaultValues?: MultiValue<Option>;
  closeMenuOnSelect?: boolean;
  value?: Option['value'] | Option['value'][];
  placeholder?: string;
  className?: string;
  isHiddenCreateNewOption?: boolean;
  valueField?: keyof Option;
  onChange: (
    option: MultiValue<Option> | Option,
    actionMeta: ActionMeta<Option>
  ) => void;
  onCreateOption?: (v: string) => void;
  formatCreateLabel?: (v: string) => ReactNode;
  noOptionsMessage?: (props: NoOptionsMessageProps) => ReactNode;
}

const NoOptionsMessage: React.FC<{ className?: string }> = ({ className }) => {
  const t = useTranslations('ui.select');
  return (
    <div className={cn('pointer-events-none', className)}>
      <p className="text-center text-sm text-gray-500">{t('noOptions')}</p>
    </div>
  );
};

const textColor = '#475569';
const textColorDisabled = '#6B7280';
const backgroundColor = '#f3f4f6';
const backgroundColorDisabled = '#F3F4F6';
const borderColor = '#e5e7eb';
const borderColorFocused = '#d1d5db';
const fontSize = '1rem';
const lineHeight = '1.25rem';
const minHeight = '44px';

export const colorStyles: StylesConfig<Option, true> = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? backgroundColorDisabled : backgroundColor,
    borderColor,
    '&:hover': {
      borderColor: borderColorFocused,
    },
    fontSize,
    lineHeight,
    minHeight,
    boxShadow: 'none !important',
    borderRadius: '6px',
    height: '44px !important',
  }),
  menu: (base) => ({
    ...base,
    fontSize,
    lineHeight,
    color: textColor,
  }),
  placeholder: (styles) => ({
    ...styles,
    color: '#94A3B8 !important',
  }),
  multiValue: (base, { isDisabled }) => ({
    ...base,
    color: isDisabled ? textColorDisabled : textColor,
    backgroundColor: '#E8E4F1 !important',
    borderRadius: '4px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#573792 !important',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#9A87BE !important',
    ':hover': {
      color: '#292C4C !important',
    },
  }),
  singleValue: (styles, { isDisabled }) => ({
    ...styles,
    color: isDisabled ? textColorDisabled : textColor,
    backgroundColor: 'transparent !important',
  }),
};

type CustomMenuListProps = MenuListProps<Option, true, GroupBase<Option>> & {
  createNewOption?: ReactNode;
};

export const CustomMenuList = ({
  children,
  createNewOption,
  ...props
}: CustomMenuListProps) => {
  return (
    <components.MenuList {...props} className="!pb-0">
      {children}
      {createNewOption}
    </components.MenuList>
  );
};

export const CreatableSelect: FC<CreatableSelectProps> = memo(
  ({
    label,
    isMulti = undefined,
    loading = false,
    disabled,
    isSearchable,
    className,
    onChange,
    options,
    defaultValues,
    closeMenuOnSelect,
    value,
    placeholder = '',
    onCreateOption = () => {},
    formatCreateLabel,
    noOptionsMessage,
    components,
    styles,
    isHiddenCreateNewOption = true,
    valueField = 'value',
    ...props
  }) => {
    const currentValue = useMemo(() => {
      if (Array.isArray(value)) {
        return options?.filter((option) => value.includes(option[valueField]));
      }
      return options?.find((option) => option.value === value);
    }, [value, options]);

    const defaultNoOptionsMessage = useCallback(
      (className?: string) => <NoOptionsMessage className={className} />,
      []
    );

    const optionStyle = useCallback(
      (
        styles: CSSObjectWithLabel,
        props: OptionProps<Option, true, GroupBase<Option>>
      ) => {
        const { isFocused, data, options: propsOptions } = props;

        const isNewOption = data?.__isNew__;
        const isNotMatchOption = !options?.find((option) =>
          option?.value.includes(data.value)
        );

        const optionStyles = {
          ...styles,
          backgroundColor:
            isFocused && !isHiddenCreateNewOption
              ? backgroundColor
              : 'transparent !important',
          color: textColor,
          ':hover': {
            backgroundColor: isNotMatchOption
              ? 'transparent !important'
              : '#FAFAFC !important',
            cursor: isNotMatchOption ? 'default' : 'pointer',
          },
          display: isNewOption
            ? isNotMatchOption
              ? 'block'
              : 'none'
            : 'block',
        };
        return optionStyles;
      },
      [options, isHiddenCreateNewOption]
    );

    const memoizedStyles = useMemo(
      () => ({
        option: (
          styles: CSSObjectWithLabel,
          props: OptionProps<Option, true, GroupBase<Option>>
        ) => optionStyle(styles, props),
        ...colorStyles,
        ...styles,
      }),
      [isHiddenCreateNewOption, styles, options]
    );

    return (
      <div className="flex flex-col gap-y-2">
        <Label className="h-5 text-sm font-medium text-gray-900">{label}</Label>
        <ReactCreatableSelect
          {...props}
          isMulti={isMulti}
          options={options}
          placeholder={placeholder}
          className={className}
          classNamePrefix="react-select"
          styles={memoizedStyles}
          components={{
            ...components,
            DropdownIndicator: null,
            LoadingIndicator: () => <Spinner className="mr-2 size-6" />,
          }}
          isDisabled={disabled}
          isLoading={loading}
          isSearchable={isSearchable}
          value={currentValue}
          defaultValue={defaultValues}
          onCreateOption={onCreateOption}
          onChange={(newValue, actionMeta) => onChange(newValue, actionMeta)}
          closeMenuOnSelect={closeMenuOnSelect}
          formatCreateLabel={
            isHiddenCreateNewOption
              ? () => defaultNoOptionsMessage('new-option')
              : formatCreateLabel
          }
          noOptionsMessage={
            noOptionsMessage ?? (() => defaultNoOptionsMessage('no-options'))
          }
        />
      </div>
    );
  }
);

CreatableSelect.displayName = 'CreatableSelect';
