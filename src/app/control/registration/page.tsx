'use client';

import { getErrorMessage, isApiError } from '@/api/lib/errorHandler';
import { useRegisterMemberMutation } from '@/api/members/register';
import { ProtectedRoute } from '@/components/auth';
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
import { logError } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { FormEvent, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

type Gender = 'male' | 'female';

type FormValues = {
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

export default function MemberRegistrationPage() {
  const t = useTranslations('pages.memberRegistration');
  const tBtn = useTranslations('ui.buttons');
  const tCommon = useTranslations('common');
  const tMessages = useTranslations('messages');

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
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm<FormValues>({
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
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { mutateAsync: registerMember } = useRegisterMemberMutation();
  const [generalError, setGeneralError] = useState<string | undefined>();

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = 1900; y <= 2100; y++) arr.push(y);
    return arr;
  }, []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  const onSubmit = async (data: FormValues) => {
    setGeneralError(undefined);
    const pad = (n: number) => String(n).padStart(2, '0');
    const payload = {
      name: data.name,
      gender: data.gender,
      birthDate: `${data.birthYear}-${pad(Number(data.birthMonth))}-${pad(Number(data.birthDay))}`,
      email: data.email,
      customPhone: data.customPhone,
      lnePhone: data.lnePhone,
      membershipFeeRate: Number((data as any).membershipFeeRate || 0),
      referrerLoginId: data.referrerLoginId,
      lnePersonId: (data as any).lnePersonId || '',
      introducedFeeRate: Number((data as any).introducedFeeRate || 0),
    };

    try {
      await registerMember(payload);
      // TODO: success handling (e.g., notification or navigation)
    } catch (error) {
      logError('Register member failed:', error as unknown);

      if (isApiError(error)) {
        const err = error as any;
        const dataResp = err.data as {
          code?: string;
          errors?: any;
          message?: string;
        };
        const msg = getErrorMessage(error);

        if (dataResp?.code === 'RESOURCE_CONFLICT' && msg.includes('email')) {
          setGeneralError(t('form.email.conflict'));
        } else if (dataResp?.code === 'NOT_FOUND' && msg.includes('Referrer')) {
          setGeneralError(t('form.referrerLoginId.notFound'));
        } else if (
          dataResp?.code === 'NOT_FOUND' &&
          msg.includes('LnePerson')
        ) {
          setGeneralError(t('form.lnePersonId.notFound'));
        } else {
          setGeneralError(tMessages('error.general'));
        }
      } else {
        setGeneralError(tMessages('error.general'));
      }
    }
  };

  const handleNumberInput = (
    e: FormEvent<HTMLInputElement>,
    isDecimal: boolean
  ): string => {
    const value = (e.target as HTMLInputElement).value;
    let sanitizedValue = '';
    if (isDecimal) {
      // 1. Remove all text characters except number and dot
      sanitizedValue = value.replace(/[^0-9.]/g, '');

      // 2. Limit only 1 dot character
      const parts = sanitizedValue.split('.');
      if (parts.length > 2) {
        sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
      }

      // 3. Limit 2 digits after dot character
      const finalParts = sanitizedValue.split('.');
      if (finalParts[1] && finalParts[1].length > 2) {
        sanitizedValue = finalParts[0] + '.' + finalParts[1].substring(0, 2);
      }
    } else {
      sanitizedValue = value.replace(/\D/g, '');
    }

    return sanitizedValue;
  };

  const inputBase =
    'h-11 w-full rounded-md border bg-gray-100 border-gray-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-gray-300';

  const RequiredBadge = () => (
    <span className="inset-ring inset-ring-red-600/10 mx-2 inline-flex items-center rounded-md bg-red-700 px-2 py-1 text-[10px] font-light text-white">
      {t('form.required')}
    </span>
  );

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="p-6">
        {/* Header title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        </div>

        {generalError && (
          <div className="mb-4">
            <Alert
              variant="error"
              dismissible
              onClose={() => setGeneralError(undefined)}
            >
              {generalError}
            </Alert>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-lg bg-white px-18 py-10 shadow">
            {/* Section title */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('form.sectionTitle')}
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* 氏名 */}
              <div className="flex flex-col gap-2">
                {/* Row Label and Input */}
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

                {/* Row error - Empty Div and Error */}
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>{' '}
                  <div className="flex-1">
                    <ErrorMessage
                      message={errors.name?.message}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 性別 */}
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
                      message={errors.gender?.message}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 生年月日 */}
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
                      {/* 年 */}
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
                              ...years.map((y) => ({
                                value: String(y),
                                label: y,
                              })),
                            ]}
                            {...field}
                          />
                        )}
                      />
                      <span className="text-gray-900">
                        {t('form.birthdate.year')}
                      </span>

                      {/* 月 */}
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

                      {/* 日 */}
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
                              ...days.map((d) => ({
                                value: String(d),
                                label: d,
                              })),
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
                        errors.birthYear?.message ||
                        errors.birthMonth?.message ||
                        errors.birthDay?.message
                      }
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* メールアドレス */}
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
                      message={errors.email?.message}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 電話番号（顧客） */}
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
                      message={errors.customPhone?.message}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 電話番号（Lne） */}
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
                      message={errors.lnePhone?.message}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 会員料率（%） */}
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
                      message={errors.membershipFeeRate?.message}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 紹介者 */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                  <div className="shrink-0 md:w-56">
                    <Label className="text-gray-900">
                      {t('form.referrerLoginId.label')} <RequiredBadge />
                    </Label>
                  </div>
                  <div className="flex-1">
                    <input
                      className={`${inputBase} max-w-[250px]`}
                      inputMode="text"
                      {...register('referrerLoginId', {
                        required: t('form.referrerLoginId.required'),
                      })}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>
                  <div className="flex-1">
                    <ErrorMessage
                      message={errors.referrerLoginId?.message}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Lne担当 */}
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
                      message={errors.lnePersonId?.message}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 紹介情報セクション */}
          <div className="mt-8 rounded-lg bg-white px-18 py-10 shadow">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('form.introSectionTitle')}
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* 紹介料率（%） */}
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
                      message={errors.introducedFeeRate?.message}
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="w-60">
              <FormButton
                type="submit"
                isLoading={isSubmitting}
                loadingText={tBtn('save')}
              >
                {tBtn('save')}
              </FormButton>
            </div>
            <a
              href="/control"
              className="my-4 text-sm text-gray-600 hover:underline"
            >
              {tCommon('backToMembers')}
            </a>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
