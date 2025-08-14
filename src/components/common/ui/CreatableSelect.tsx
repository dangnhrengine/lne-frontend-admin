import { FC, memo, ReactNode, useCallback } from 'react';
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

export interface Option {
  value: string;
  label: string;
  [key: string]: string | number | boolean;
}

export interface NoOptionsMessageProps {
  inputValue: string;
  [key: string]: string | number | boolean;
}

export interface CreatableSelectProps
  extends CreatableProps<Option, true, GroupBase<Option>> {
  label?: string;
  isMulti?: true;
  loading?: boolean;
  options?: Option[];
  disabled?: boolean;
  isSearchable?: boolean;
  defaultValues?: MultiValue<Option>;
  closeMenuOnSelect?: boolean;
  value?: MultiValue<Option>;
  placeholder?: string;
  className?: string;
  isHiddenCreateNewOption?: boolean;
  onChange: (
    options: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => void;
  onCreateOption?: (v: string) => void;
  formatCreateLabel?: (v: string) => ReactNode;
  noOptionsMessage?: (props: NoOptionsMessageProps) => ReactNode;
}

const NoOptionsMessage: React.FC = () => {
  const t = useTranslations('ui.select');
  return (
    <div className="pointer-events-none">
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
const minHeight = '3rem';

const optionStyle = (
  styles: CSSObjectWithLabel,
  props: OptionProps<Option, true, GroupBase<Option>>,
  isHiddenCreateNewOption: boolean
) => {
  const { isFocused } = props;

  return {
    ...styles,
    backgroundColor:
      isFocused && !isHiddenCreateNewOption
        ? backgroundColor
        : 'transparent !important',
    color: textColor,
    ':hover': {
      backgroundColor: isHiddenCreateNewOption
        ? 'transparent !important'
        : '#FAFAFC !important',
      cursor: isHiddenCreateNewOption ? 'default' : 'pointer',
    },
  };
};

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
    borderRadius: '8px',
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
    backgroundColor: 'red !important',
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
    ...props
  }) => {
    const defaultNoOptionsMessage = useCallback(() => <NoOptionsMessage />, []);

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
          styles={{
            option: (styles, props) =>
              optionStyle(styles, props, isHiddenCreateNewOption),
            ...colorStyles,
            ...styles,
          }}
          components={{
            ...components,
            DropdownIndicator: null,
            LoadingIndicator: () => <Spinner className="mr-4 size-5" />,
          }}
          isDisabled={disabled}
          isLoading={loading}
          isSearchable={isSearchable}
          value={value}
          defaultValue={defaultValues}
          onCreateOption={onCreateOption}
          onChange={(newValue, actionMeta) =>
            onChange(newValue as MultiValue<Option>, actionMeta)
          }
          closeMenuOnSelect={closeMenuOnSelect}
          formatCreateLabel={
            isHiddenCreateNewOption
              ? defaultNoOptionsMessage
              : formatCreateLabel
          }
          noOptionsMessage={noOptionsMessage || defaultNoOptionsMessage}
        />
      </div>
    );
  }
);

CreatableSelect.displayName = 'CreatableSelect';
