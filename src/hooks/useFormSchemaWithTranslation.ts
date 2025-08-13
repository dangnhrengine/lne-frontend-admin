import { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import * as yup from 'yup';

export type Translation = ReturnType<typeof useTranslations>;

export interface FormSchemaProps {
  requiredMessage: string;
  translation: Translation;
}

const useFormSchemaWithTranslation = <T extends yup.AnyObject>(
  callback: ({
    requiredMessage,
    translation,
  }: FormSchemaProps) => yup.ObjectSchema<T>
) => {
  const translation = useTranslations();

  const requiredMessage = translation('validation:required-field');
  const formSchema = useMemo(
    () => callback({ requiredMessage, translation }),
    [callback, requiredMessage, translation]
  );
  return formSchema;
};

export default useFormSchemaWithTranslation;
