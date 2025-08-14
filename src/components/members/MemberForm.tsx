'use client';

import {
  Alert,
  ErrorMessage,
  FormButton,
  FormInput,
  FormRadio,
  FormSelect,
  Hint,
  Label,
} from '@/components/common/ui';
import { useTranslations } from 'next-intl';
import { FormEvent, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export type Gender = 'male' | 'female';

export type MemberFormValues = {
  name: string;
  gender: Gender;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  email: string;
  customPhone: string;
  lnePhone: string;
  membershipFeeRate: string;
  referrerLoginId: string;
  lnePersonId: string;
  introducedFeeRate: string;
};

type MemberFormProps = {
  onSubmit: (values: MemberFormValues) => Promise<void> | void;
  submitLabel: string;
  backHref: string;
  backLabel: string;
  generalError?: string;
  initialValues?: Partial<MemberFormValues>;
};

export const MemberForm: React.FC<MemberFormProps> = ({
  onSubmit,
  submitLabel,
  backHref,
  backLabel,
  generalError,
  initialValues,
}) => {
  const t = useTranslations('pages.memberRegistration');

  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  const schema = yup.object({
    name: yup
      .string()
      .required(t('form.name.required'))
      .max(50, t('form.name.max')),
    gender: yup
      .mixed<Gender>()
      .oneOf(['male', 'female'], t('form.gender.required'))
      .required(t('form.gender.required')),
    birthYear: yup.string().required(t('form.birthdate.required')),
    birthMonth: yup.string().required(t('form.birthdate.required')),
    birthDay: yup.string().required(t('form.birthdate.required')),
    email: yup
      .string()
      .required(t('form.email.required'))
      .max(200, t('form.email.maxLength'))
      .matches(emailRegex, t('form.email.invalid')),
    customPhone: yup
      .string()
      .required(t('form.customPhone.required'))
      .matches(/^\d+$/, t('form.customPhone.invalid'))
      .max(13, t('form.customPhone.max')),
    lnePhone: yup
      .string()
      .required(t('form.lnePhone.required'))
      .matches(/^\d+$/, t('form.lnePhone.invalid'))
      .max(13, t('form.customPhone.max')),
    membershipFeeRate: yup
      .string()
      .required(t('form.membershipFeeRate.required'))
      .matches(/^\d+(\.\d{1,2})?$/, t('form.membershipFeeRate.invalid'))
      .test('range', t('form.membershipFeeRate.invalid'), (v) => {
        const n = Number(v);
        return v !== '' && !Number.isNaN(n) && n >= 0 && n <= 100;
      }),
    referrerLoginId: yup.string().required(t('form.referrerLoginId.required')),
    lnePersonId: yup.string().required(t('form.lnePersonId.required')),
    introducedFeeRate: yup
      .string()
      .required(t('form.introducedFeeRate.required'))
      .matches(/^\d+(\.\d{1,2})?$/, t('form.introducedFeeRate.invalid'))
      .test('range', t('form.introducedFeeRate.invalid'), (v) => {
        const n = Number(v);
        return v !== '' && !Number.isNaN(n) && n >= 0 && n <= 100;
      }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormValues>({
    defaultValues: {
      name: '',
      gender: 'male',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      email: '',
      customPhone: '',
      lnePhone: '',
      membershipFeeRate: '',
      referrerLoginId: 'Lne直販',
      lnePersonId: '',
      introducedFeeRate: '',
      ...initialValues,
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = 1900; y <= 2100; y++) arr.push(y);
    return arr;
  }, []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  const handleNumberInput = (
    e: FormEvent<HTMLInputElement>,
    isDecimal: boolean
  ): string => {
    const value = (e.target as HTMLInputElement).value;
    let sanitizedValue = '';
    if (isDecimal) {
      sanitizedValue = value.replace(/[^0-9.]/g, '');
      const parts = sanitizedValue.split('.');
      if (parts.length > 2) {
        sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
      }
      const finalParts = sanitizedValue.split('.');
      if (finalParts[1] && finalParts[1].length > 2) {
        sanitizedValue = finalParts[0] + '.' + finalParts[1].substring(0, 2);
      }
    } else {
      sanitizedValue = value.replace(/\D/g, '');
    }

    return sanitizedValue;
  };

  const RequiredBadge = () => (
    <span className="inset-ring inset-ring-red-600/10 mx-2 inline-flex items-center rounded-md bg-red-700 px-2 py-1 text-[10px] font-light text-white">
      {t('form.required')}
    </span>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {generalError && (
        <div className="mb-4">
          <Alert variant="error" dismissible>
            {generalError}
          </Alert>
        </div>
      )}
      <div className="rounded-lg bg-white px-18 py-10 shadow">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('form.sectionTitle')}
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.name.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      id="name"
                      label=""
                      className="max-w-[250px]"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={(errors as any).name?.message}
                  className="font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.gender.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormRadio
                      id="gender"
                      label=""
                      options={[
                        { value: 'male', label: t('form.gender.male') },
                        { value: 'female', label: t('form.gender.female') },
                      ]}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={(errors as any).gender?.message}
                  className="font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.birthdate.label')}
                  <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Controller
                    name="birthYear"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        id="birthYear"
                        label=""
                        className="max-w-24"
                        aria-label={t('form.birthdate.year')}
                        options={[
                          { value: '', label: '—' },
                          ...years.map((y) => ({ value: String(y), label: y })),
                        ]}
                        {...field}
                      />
                    )}
                  />
                  <span className="text-gray-900">
                    {t('form.birthdate.year')}
                  </span>

                  <Controller
                    name="birthMonth"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        id="birthMonth"
                        label=""
                        className="max-w-20"
                        aria-label={t('form.birthdate.month')}
                        options={[
                          { value: '', label: '—' },
                          ...months.map((m) => ({
                            value: String(m),
                            label: m,
                          })),
                        ]}
                        {...field}
                      />
                    )}
                  />
                  <span className="text-gray-900">
                    {t('form.birthdate.month')}
                  </span>

                  <Controller
                    name="birthDay"
                    control={control}
                    render={({ field }) => (
                      <FormSelect
                        id="birthDay"
                        label=""
                        className="max-w-20"
                        aria-label={t('form.birthdate.day')}
                        options={[
                          { value: '', label: '—' },
                          ...days.map((d) => ({ value: String(d), label: d })),
                        ]}
                        {...field}
                      />
                    )}
                  />
                  <span className="text-gray-900">
                    {t('form.birthdate.day')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={
                    (errors as any).birthYear?.message ||
                    (errors as any).birthMonth?.message ||
                    (errors as any).birthDay?.message
                  }
                  className="font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.email.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      id="email"
                      label=""
                      className="max-w-[500px]"
                      inputMode="email"
                      {...field}
                    />
                  )}
                />
                <Hint>{t('form.email.hint')}</Hint>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={(errors as any).email?.message}
                  className="font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.customPhone.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <Controller
                  name="customPhone"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      id="customPhone"
                      label=""
                      className="max-w-[280px]"
                      inputMode="numeric"
                      placeholder=""
                      {...field}
                      onChange={(e) => {
                        const v = handleNumberInput(e, false);
                        field.onChange(v);
                      }}
                    />
                  )}
                />
                <Hint>{t('form.customPhone.hint')}</Hint>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={(errors as any).customPhone?.message}
                  className="font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.lnePhone.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <Controller
                  name="lnePhone"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      id="lnePhone"
                      label=""
                      className="max-w-[280px]"
                      inputMode="numeric"
                      placeholder=""
                      {...field}
                      onChange={(e) => {
                        const v = handleNumberInput(e, false);
                        field.onChange(v);
                      }}
                    />
                  )}
                />
                <Hint>{t('form.lnePhone.hint')}</Hint>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={(errors as any).lnePhone?.message}
                  className="font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.membershipFeeRate.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Controller
                    name="membershipFeeRate"
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        id="membershipFeeRate"
                        label=""
                        className="max-w-24 text-right"
                        inputMode="decimal"
                        placeholder=""
                        {...field}
                        onChange={(e) => {
                          const v = handleNumberInput(e, true);
                          field.onChange(v);
                        }}
                      />
                    )}
                  />
                  <span className="text-sm text-gray-900">%</span>
                </div>
                <Hint>{t('form.membershipFeeRate.hint')}</Hint>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={(errors as any).membershipFeeRate?.message}
                  className="font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.referrerLoginId.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <Controller
                  name="referrerLoginId"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      id="referrerLoginId"
                      label=""
                      className="max-w-[250px]"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={(errors as any).referrerLoginId?.message}
                  className="font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.lnePersonId.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <Controller
                  name="lnePersonId"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      id="lnePersonId"
                      label=""
                      className="max-w-[250px]"
                      options={[
                        { value: '', label: '—' },
                        {
                          value: '5db300ad-6ca9-4980-b0fc-16051d7e2ad8',
                          label: 'LNE担当 A',
                        },
                        {
                          value: '0158ce3c-c464-4b9f-8613-aa753d5817d7',
                          label: 'LNE担当 B',
                        },
                      ]}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={(errors as any).lnePersonId?.message}
                  className="font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white px-18 py-10 shadow">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('form.introSectionTitle')}
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.introducedFeeRate.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Controller
                    name="introducedFeeRate"
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        id="introducedFeeRate"
                        label=""
                        className="max-w-24 text-right"
                        inputMode="decimal"
                        placeholder=""
                        {...field}
                        onChange={(e) => {
                          const v = handleNumberInput(e, true);
                          field.onChange(v);
                        }}
                      />
                    )}
                  />
                  <span className="text-sm text-gray-900">%</span>
                </div>
                <Hint>{t('form.introducedFeeRate.hint')}</Hint>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-8">
              <div className="shrink-0 md:w-56"></div>
              <div className="flex-1">
                <ErrorMessage
                  message={(errors as any).introducedFeeRate?.message}
                  className="font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="w-60">
          <FormButton
            type="submit"
            isLoading={isSubmitting}
            loadingText={submitLabel}
          >
            {submitLabel}
          </FormButton>
        </div>
        <a
          href={backHref}
          className="my-4 text-sm text-gray-600 hover:underline"
        >
          {backLabel}
        </a>
      </div>
    </form>
  );
};

export default MemberForm;
