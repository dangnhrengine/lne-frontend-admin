import { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import * as yup from 'yup';

export type Translation = ReturnType<typeof useTranslations>;

export interface FormSchemaProps {
  translation: Translation;
}

const useFormSchemaWithTranslation = <T extends yup.AnyObject>(
  callback: ({ translation }: FormSchemaProps) => yup.ObjectSchema<T>
) => {
  const translation = useTranslations();

  const formSchema = useMemo(
    () => callback({ translation }),
    [callback, translation]
  );
  return formSchema;
};

export default useFormSchemaWithTranslation;
