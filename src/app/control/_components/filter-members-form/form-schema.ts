import { FormSchemaProps } from '@/hooks/useFormSchemaWithTranslation';
import { MEMBER_STATUS } from '@/types/members';
import * as yup from 'yup';

export const filterMemberFormSchema = ({ translation }: FormSchemaProps) =>
  yup.object().shape({
    loginId: yup.string().optional(),
    name: yup.string().optional(),
    lnePhone: yup
      .number()
      .nullable()
      .test('numeric', translation('validation.numeric'), (value, context) => {
        if (value && value?.toString().length > 13) {
          return context.createError({
            message: translation('validation.maxLength', {
              field: 'lnePhone',
              max: 13,
            }),
            path: context?.path,
          });
        }
        if (!value || typeof value === 'number') {
          return true;
        }
        return /^[0-9]+$/.test(value) && !/[.,\-]/.test(value);
      }),
    transactionsNumber: yup
      .number()
      .nullable()
      .test('numeric', translation('validation.numeric'), (value) => {
        if (!value || typeof value === 'number') {
          return true;
        }
        return /^[0-9]+$/.test(value) && !/[.,\-]/.test(value);
      }),
    referrerId: yup.string(),
    lnePersonId: yup.string(),
    isArchived: yup.boolean(),
    startDate: yup.date().optional(),
    endDate: yup.date().optional(),
    status: yup.string().oneOf(Object.values(MEMBER_STATUS)),
  });

export type FilterMemberFormData = yup.InferType<
  ReturnType<typeof filterMemberFormSchema>
>;
