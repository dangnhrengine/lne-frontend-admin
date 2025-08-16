import { FormSchemaProps } from '@/hooks/useFormSchemaWithTranslation';
import * as yup from 'yup';

export const memberFormSchema = ({ translation }: FormSchemaProps) => {
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  return yup.object().shape({
    name: yup
      .string()
      .required(translation('memberForm.name.required'))
      .max(50, translation('memberForm.name.max')),
    gender: yup
      .mixed<'male' | 'female'>()
      .oneOf(['male', 'female'], translation('memberForm.gender.required'))
      .required(translation('memberForm.gender.required')),
    birthYear: yup
      .string()
      .required(translation('memberForm.birthdate.required')),
    birthMonth: yup
      .string()
      .required(translation('memberForm.birthdate.required')),
    birthDay: yup
      .string()
      .required(translation('memberForm.birthdate.required')),
    email: yup
      .string()
      .required(translation('memberForm.email.required'))
      .max(200, translation('memberForm.email.maxLength'))
      .matches(emailRegex, translation('memberForm.email.invalid')),
    customPhone: yup
      .string()
      .required(translation('memberForm.customPhone.required'))
      .matches(/^\d+$/, translation('memberForm.customPhone.invalid'))
      .max(13, translation('memberForm.customPhone.max')),
    lnePhone: yup
      .string()
      .required(translation('memberForm.lnePhone.required'))
      .matches(/^\d+$/, translation('memberForm.lnePhone.invalid'))
      .max(13, translation('memberForm.customPhone.max')),
    membershipFeeRate: yup
      .string()
      .required(translation('memberForm.membershipFeeRate.required'))
      .matches(
        /^\d+(\.\d{1,2})?$/,
        translation('memberForm.membershipFeeRate.invalid')
      )
      .test(
        'range',
        translation('memberForm.membershipFeeRate.invalid'),
        (v) => {
          const n = Number(v);
          return v !== '' && !Number.isNaN(n) && n >= 0 && n <= 100;
        }
      ),
    referrerId: yup
      .string()
      .required(translation('memberForm.referrerId.required')),
    lnePersonId: yup
      .string()
      .required(translation('memberForm.lnePersonId.required')),
    introducedFeeRate: yup
      .string()
      .required(translation('memberForm.introducedFeeRate.required'))
      .matches(
        /^\d+(\.\d{1,2})?$/,
        translation('memberForm.introducedFeeRate.invalid')
      )
      .test(
        'range',
        translation('memberForm.introducedFeeRate.invalid'),
        (v) => {
          const n = Number(v);
          return v !== '' && !Number.isNaN(n) && n >= 0 && n <= 100;
        }
      ),
  });
};

export type MemberFormData = yup.InferType<ReturnType<typeof memberFormSchema>>;
