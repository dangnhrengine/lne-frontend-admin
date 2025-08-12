'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { ProtectedRoute } from '@/components/auth';
import { Label, FieldError, Hint, FormButton } from '@/components/common/ui';

type Gender = 'male' | 'female';

type FormValues = {
  name: string;
  gender: Gender | '';
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  email: string;
  phoneCustomer: string;
  phoneLne: string;
  memberFee: string;
  referrer: string;
  lneManager: string;
  referralRate: string;
};

export default function MemberRegistrationPage() {
  const t = useTranslations('pages.memberRegistration');
  const tBtn = useTranslations('ui.buttons');
  const tCommon = useTranslations('common');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      gender: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      email: '',
      phoneCustomer: '',
      phoneLne: '',
      memberFee: '',
      referrer: 'lne_hq',
      lneManager: '',
      referralRate: '',
    },
    mode: 'onBlur',
  });

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = 1900; y <= 2100; y++) arr.push(y);
    return arr;
  }, []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  const onSubmit = async (data: FormValues) => {
    console.log('submit payload', data);
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
                {/* Row chính - Label và Input */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                  <div className="shrink-0 md:w-56">
                    <Label className="text-gray-900">
                      {t('form.name.label')} <RequiredBadge />
                    </Label>
                  </div>
                  <div className="flex-1">
                    <input
                      className={`${inputBase} max-w-[250px]`}
                      {...register('name', {
                        required: t('form.name.required'),
                        maxLength: { value: 50, message: t('form.name.max') },
                      })}
                    />
                  </div>
                </div>

                {/* Row error - Div trống và Error */}
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>{' '}
                  {/* Div trống để giữ khoảng cách */}
                  <div className="flex-1">
                    <FieldError error={errors.name?.message} />
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
                    <div className="flex items-center gap-8">
                      <label className="inline-flex items-center gap-2 text-gray-900">
                        <input
                          type="radio"
                          value="male"
                          {...register('gender', {
                            required: t('form.gender.required'),
                          })}
                          className="h-4 w-4"
                        />
                        {t('form.gender.male')}
                      </label>
                      <label className="inline-flex items-center gap-2 text-gray-900">
                        <input
                          type="radio"
                          value="female"
                          {...register('gender', {
                            required: t('form.gender.required'),
                          })}
                          className="h-4 w-4"
                        />
                        {t('form.gender.female')}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>
                  <div className="flex-1">
                    <FieldError error={errors.gender?.message} />
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
                      <select
                        className={`${inputBase} w-24`}
                        aria-label={t('form.birthdate.year')}
                        {...register('birthYear', {
                          required: t('form.birthdate.required'),
                        })}
                      >
                        <option value=""></option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-900">
                        {t('form.birthdate.year')}
                      </span>

                      {/* 月 */}
                      <select
                        className={`${inputBase} w-18`}
                        aria-label={t('form.birthdate.month')}
                        {...register('birthMonth', {
                          required: t('form.birthdate.required'),
                        })}
                      >
                        <option value=""></option>
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-900">
                        {t('form.birthdate.month')}
                      </span>

                      {/* 日 */}
                      <select
                        className={`${inputBase} w-18`}
                        aria-label={t('form.birthdate.day')}
                        {...register('birthDay', {
                          required: t('form.birthdate.required'),
                        })}
                      >
                        <option value=""></option>
                        {days.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-900">
                        {t('form.birthdate.day')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>
                  <div className="flex-1">
                    <FieldError
                      error={
                        errors.birthYear?.message ||
                        errors.birthMonth?.message ||
                        errors.birthDay?.message
                      }
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
                    <input
                      className={`${inputBase} max-w-[500px]`}
                      inputMode="email"
                      {...register('email', {
                        required: t('form.email.required'),
                        maxLength: {
                          value: 200,
                          message: t('form.email.maxLength'),
                        },
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: t('form.email.invalid'),
                        },
                      })}
                    />
                    <Hint>{t('form.email.hint')}</Hint>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>
                  <div className="flex-1">
                    <FieldError error={errors.email?.message} />
                  </div>
                </div>
              </div>

              {/* 電話番号（顧客） */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                  <div className="shrink-0 md:w-56">
                    <Label className="text-gray-900">
                      {t('form.phoneCustomer.label')} <RequiredBadge />
                    </Label>
                  </div>
                  <div className="flex-1">
                    <input
                      className={`${inputBase} max-w-[280px]`}
                      inputMode="numeric"
                      placeholder=""
                      {...register('phoneCustomer', {
                        required: t('form.phoneCustomer.required'),
                        minLength: { value: 10, message: '10〜13桁' },
                        maxLength: { value: 13, message: '10〜13桁' },
                        pattern: {
                          value: /^\d+$/,
                          message: t('form.phoneCustomer.invalid'),
                        },
                      })}
                      onInput={(e) => {
                        const v = (e.target as HTMLInputElement).value.replace(
                          /\D/g,
                          ''
                        );
                        setValue('phoneCustomer', v, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                    <Hint>{t('form.phoneCustomer.hint')}</Hint>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>
                  <div className="flex-1">
                    <FieldError error={errors.phoneCustomer?.message} />
                  </div>
                </div>
              </div>

              {/* 電話番号（Lne） */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                  <div className="shrink-0 md:w-56">
                    <Label className="text-gray-900">
                      {t('form.phoneLne.label')} <RequiredBadge />
                    </Label>
                  </div>
                  <div className="flex-1">
                    <input
                      className={`${inputBase} max-w-[280px]`}
                      inputMode="numeric"
                      placeholder=""
                      {...register('phoneLne', {
                        required: t('form.phoneLne.required'),
                        minLength: { value: 10, message: '10〜13桁' },
                        maxLength: { value: 13, message: '10〜13桁' },
                        pattern: {
                          value: /^\d+$/,
                          message: t('form.phoneLne.invalid'),
                        },
                      })}
                      onInput={(e) => {
                        const v = (e.target as HTMLInputElement).value.replace(
                          /\D/g,
                          ''
                        );
                        setValue('phoneLne', v, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                    <Hint>{t('form.phoneLne.hint')}</Hint>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>
                  <div className="flex-1">
                    <FieldError error={errors.phoneLne?.message} />
                  </div>
                </div>
              </div>

              {/* 会員料率（%） */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                  <div className="shrink-0 md:w-56">
                    <Label className="text-gray-900">
                      {t('form.memberFee.label')} <RequiredBadge />
                    </Label>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        className={`${inputBase} w-24 text-right`}
                        inputMode="numeric"
                        placeholder=""
                        {...register('memberFee', {
                          required: t('form.memberFee.required'),
                          pattern: {
                            value: /^\d+$/,
                            message: t('form.memberFee.invalid'),
                          },
                          min: {
                            value: 0,
                            message: t('form.memberFee.invalid'),
                          } as any,
                          max: {
                            value: 100,
                            message: t('form.memberFee.invalid'),
                          } as any,
                        })}
                        onInput={(e) => {
                          const v = (
                            e.target as HTMLInputElement
                          ).value.replace(/\D/g, '');
                          setValue('memberFee', v, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                      />
                      <span className="text-sm text-gray-900">%</span>
                    </div>
                    <Hint>{t('form.memberFee.hint')}</Hint>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>
                  <div className="flex-1">
                    <FieldError error={errors.memberFee?.message} />
                  </div>
                </div>
              </div>

              {/* 紹介者 */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                  <div className="shrink-0 md:w-56">
                    <Label className="text-gray-900">
                      {t('form.referrer.label')} <RequiredBadge />
                    </Label>
                  </div>
                  <div className="flex-1">
                    <select
                      className={`${inputBase} max-w-[250px]`}
                      {...register('referrer', {
                        required: t('form.referrer.required'),
                      })}
                    >
                      <option value=""></option>
                      <option value="lne_hq">
                        {t('form.referrer.default')}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>
                  <div className="flex-1">
                    <FieldError error={errors.referrer?.message} />
                  </div>
                </div>
              </div>

              {/* Lne担当 */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                  <div className="shrink-0 md:w-56">
                    <Label className="text-gray-900">
                      {t('form.lneManager.label')} <RequiredBadge />
                    </Label>
                  </div>
                  <div className="flex-1">
                    <select
                      className={`${inputBase} max-w-[250px]`}
                      {...register('lneManager', {
                        required: t('form.lneManager.required'),
                      })}
                    >
                      <option value=""></option>
                      <option value="manager_a">
                        {t('form.lneManager.optionA')}
                      </option>
                      <option value="manager_b">
                        {t('form.lneManager.optionB')}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                  <div className="shrink-0 md:w-56"></div>
                  <div className="flex-1">
                    <FieldError error={errors.lneManager?.message} />
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
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                <div className="shrink-0 md:w-56">
                  <Label className="text-gray-900">
                    {t('form.referralRate.label')} <RequiredBadge />
                  </Label>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      className={`${inputBase} w-24 text-right`}
                      inputMode="numeric"
                      placeholder=""
                      {...register('referralRate', {
                        required: t('form.referralRate.required'),
                        pattern: {
                          value: /^\d+$/,
                          message: t('form.referralRate.invalid'),
                        },
                        min: {
                          value: 0,
                          message: t('form.referralRate.invalid'),
                        } as any,
                        max: {
                          value: 100,
                          message: t('form.referralRate.invalid'),
                        } as any,
                      })}
                      onInput={(e) => {
                        const v = (e.target as HTMLInputElement).value.replace(
                          /\D/g,
                          ''
                        );
                        setValue('referralRate', v, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                    <span className="text-sm text-gray-900">%</span>
                  </div>
                  <FieldError error={errors.referralRate?.message} />
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
