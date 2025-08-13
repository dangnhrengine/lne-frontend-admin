import { FormSchemaProps } from '@/hooks/useFormSchemaWithTranslation';
import { MEMBER_STATUS } from '@/types/members';
import * as yup from 'yup';

export const filterMemberFormSchema = ({
  requiredMessage: _,
  translation,
}: FormSchemaProps) =>
  yup.object().shape({
    loginId: yup.string().optional(),
    name: yup.string().optional(),
    lnePhone: yup.number().optional(),
    transactionsNumber: yup.number().optional(),
    referrerId: yup.string().optional(),
    lnePersonId: yup.string().optional(),
    isActive: yup.boolean().optional(),
    startDate: yup.date().optional(),
    endDate: yup.date().optional(),
    status: yup.string().oneOf(Object.values(MEMBER_STATUS)).optional(),
  });

export type FilterMemberFormSchema = ReturnType<typeof filterMemberFormSchema>;
