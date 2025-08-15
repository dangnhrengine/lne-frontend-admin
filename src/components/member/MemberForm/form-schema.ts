import { FormSchemaProps } from '@/hooks/useFormSchemaWithTranslation';
import * as yup from 'yup';

export const memberRegistrationSchema = ({ translation }: FormSchemaProps) => {
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  return yup.object().shape({
    name: yup
      .string()
      .required(translation('pages.memberRegistration.form.name.required'))
      .max(50, translation('pages.memberRegistration.form.name.max')),
    gender: yup
      .mixed<'male' | 'female'>()
      .oneOf(
        ['male', 'female'],
        translation('pages.memberRegistration.form.gender.required')
      )
      .required(translation('pages.memberRegistration.form.gender.required')),
    birthYear: yup
      .string()
      .required(
        translation('pages.memberRegistration.form.birthdate.required')
      ),
    birthMonth: yup
      .string()
      .required(
        translation('pages.memberRegistration.form.birthdate.required')
      ),
    birthDay: yup
      .string()
      .required(
        translation('pages.memberRegistration.form.birthdate.required')
      ),
    email: yup
      .string()
      .required(translation('pages.memberRegistration.form.email.required'))
      .max(200, translation('pages.memberRegistration.form.email.maxLength'))
      .matches(
        emailRegex,
        translation('pages.memberRegistration.form.email.invalid')
      ),
    customPhone: yup
      .string()
      .required(
        translation('pages.memberRegistration.form.customPhone.required')
      )
      .matches(
        /^\d+$/,
        translation('pages.memberRegistration.form.customPhone.invalid')
      )
      .max(13, translation('pages.memberRegistration.form.customPhone.max')),
    lnePhone: yup
      .string()
      .required(translation('pages.memberRegistration.form.lnePhone.required'))
      .matches(
        /^\d+$/,
        translation('pages.memberRegistration.form.lnePhone.invalid')
      )
      .max(13, translation('pages.memberRegistration.form.customPhone.max')),
    membershipFeeRate: yup
      .string()
      .required(
        translation('pages.memberRegistration.form.membershipFeeRate.required')
      )
      .matches(
        /^\d+(\.\d{1,2})?$/,
        translation('pages.memberRegistration.form.membershipFeeRate.invalid')
      )
      .test(
        'range',
        translation('pages.memberRegistration.form.membershipFeeRate.invalid'),
        (v) => {
          const n = Number(v);
          return v !== '' && !Number.isNaN(n) && n >= 0 && n <= 100;
        }
      ),
    referrerLoginId: yup
      .string()
      .required(
        translation('pages.memberRegistration.form.referrerLoginId.required')
      ),
    lnePersonId: yup
      .string()
      .required(
        translation('pages.memberRegistration.form.lnePersonId.required')
      ),
    introducedFeeRate: yup
      .string()
      .required(
        translation('pages.memberRegistration.form.introducedFeeRate.required')
      )
      .matches(
        /^\d+(\.\d{1,2})?$/,
        translation('pages.memberRegistration.form.introducedFeeRate.invalid')
      )
      .test(
        'range',
        translation('pages.memberRegistration.form.introducedFeeRate.invalid'),
        (v) => {
          const n = Number(v);
          return v !== '' && !Number.isNaN(n) && n >= 0 && n <= 100;
        }
      ),
  });
};

export type MemberRegistrationFormData = yup.InferType<
  ReturnType<typeof memberRegistrationSchema>
>;
