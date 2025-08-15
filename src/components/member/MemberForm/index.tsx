import {
  Alert,
  Form,
  FormButton,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormMessage,
  FormRadio,
  FormSelect,
  Hint,
  Label,
} from '@/components/common/ui';
import useFormSchemaWithTranslation from '@/hooks/useFormSchemaWithTranslation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  MemberRegistrationFormData,
  memberRegistrationSchema,
} from './form-schema';

export type Gender = 'male' | 'female';

type MemberFormProps = {
  onSubmit: (values: MemberRegistrationFormData) => Promise<void> | void;
  submitLabel: string;
  backHref: string;
  backLabel: string;
  generalError?: string;
  initialValues?: Partial<MemberRegistrationFormData>;
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
  const formSchema = useFormSchemaWithTranslation(memberRegistrationSchema);

  const form = useForm<MemberRegistrationFormData>({
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
    resolver: yupResolver(formSchema),
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = 1900; y <= 2100; y++) arr.push(y);
    return arr;
  }, []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  const handleNumberInput = (
    e: React.FormEvent<HTMLInputElement>,
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
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)}>
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
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                      <div className="shrink-0 md:w-56">
                        <Label className="text-gray-900">
                          {t('form.name.label')} <RequiredBadge />
                        </Label>
                      </div>
                      <div className="flex-1">
                        <FormControl>
                          <FormInput
                            label=""
                            className="max-w-[250px]"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                      <div className="shrink-0 md:w-56" />
                      <div className="flex-1">
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Gender Field */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                      <div className="shrink-0 md:w-56">
                        <Label className="text-gray-900">
                          {t('form.gender.label')} <RequiredBadge />
                        </Label>
                      </div>
                      <div className="flex-1">
                        <FormControl>
                          <FormRadio
                            label=""
                            options={[
                              { value: 'male', label: t('form.gender.male') },
                              {
                                value: 'female',
                                label: t('form.gender.female'),
                              },
                            ]}
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                      <div className="shrink-0 md:w-56" />
                      <div className="flex-1">
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Birthdate Fields */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
              <div className="shrink-0 md:w-56">
                <Label className="text-gray-900">
                  {t('form.birthdate.label')} <RequiredBadge />
                </Label>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <FormField
                    control={form.control}
                    name="birthYear"
                    render={({ field }) => (
                      <FormControl>
                        <FormSelect
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
                      </FormControl>
                    )}
                  />
                  <span className="text-gray-900">
                    {t('form.birthdate.year')}
                  </span>

                  <FormField
                    control={form.control}
                    name="birthMonth"
                    render={({ field }) => (
                      <FormControl>
                        <FormSelect
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
                      </FormControl>
                    )}
                  />
                  <span className="text-gray-900">
                    {t('form.birthdate.month')}
                  </span>

                  <FormField
                    control={form.control}
                    name="birthDay"
                    render={({ field }) => (
                      <FormControl>
                        <FormSelect
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
                      </FormControl>
                    )}
                  />
                  <span className="text-gray-900">
                    {t('form.birthdate.day')}
                  </span>
                </div>
                <div className="mt-2">
                  <FormMessage>
                    {errors?.birthDay?.message ||
                      errors?.birthMonth?.message ||
                      errors?.birthYear?.message}
                  </FormMessage>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                      <div className="shrink-0 md:w-56">
                        <Label className="text-gray-900">
                          {t('form.email.label')} <RequiredBadge />
                        </Label>
                      </div>
                      <div className="flex-1">
                        <FormControl>
                          <FormInput
                            label=""
                            className="max-w-[500px]"
                            inputMode="email"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                      <div className="shrink-0 md:w-56" />
                      <div className="flex-1">
                        <Hint>{t('form.email.hint')}</Hint>
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Custom Phone Field */}
            <FormField
              control={form.control}
              name="customPhone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                      <div className="shrink-0 md:w-56">
                        <Label className="text-gray-900">
                          {t('form.customPhone.label')} <RequiredBadge />
                        </Label>
                      </div>
                      <div className="flex-1">
                        <FormControl>
                          <FormInput
                            label=""
                            className="max-w-[280px]"
                            inputMode="numeric"
                            {...field}
                            onChange={(e) => {
                              field.onChange(handleNumberInput(e, false));
                            }}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-8">
                      <div className="shrink-0 md:w-56" />
                      <div className="flex-1">
                        <Hint>{t('form.customPhone.hint')}</Hint>
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* LNE Phone Field */}
            <FormField
              control={form.control}
              name="lnePhone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                      <div className="shrink-0 md:w-56">
                        <Label className="text-gray-900">
                          {t('form.lnePhone.label')} <RequiredBadge />
                        </Label>
                      </div>
                      <div className="flex-1">
                        <FormControl>
                          <FormInput
                            label=""
                            className="max-w-[280px]"
                            inputMode="numeric"
                            {...field}
                            onChange={(e) => {
                              field.onChange(handleNumberInput(e, false));
                            }}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-8">
                      <div className="shrink-0 md:w-56" />
                      <div className="flex-1">
                        <Hint>{t('form.lnePhone.hint')}</Hint>
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Membership Fee Rate Field */}
            <FormField
              control={form.control}
              name="membershipFeeRate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                      <div className="shrink-0 md:w-56">
                        <Label className="text-gray-900">
                          {t('form.membershipFeeRate.label')} <RequiredBadge />
                        </Label>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <FormInput
                              label=""
                              className="max-w-24 text-right"
                              inputMode="decimal"
                              {...field}
                              onChange={(e) => {
                                field.onChange(handleNumberInput(e, true));
                              }}
                            />
                          </FormControl>
                          <span className="text-sm text-gray-900">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-8">
                      <div className="shrink-0 md:w-56" />
                      <div className="flex-1">
                        <Hint>{t('form.membershipFeeRate.hint')}</Hint>
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Referrer Login ID Field */}
            <FormField
              control={form.control}
              name="referrerLoginId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                      <div className="shrink-0 md:w-56">
                        <Label className="text-gray-900">
                          {t('form.referrerLoginId.label')} <RequiredBadge />
                        </Label>
                      </div>
                      <div className="flex-1">
                        <FormControl>
                          <FormInput
                            label=""
                            className="max-w-[250px]"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-8">
                      <div className="shrink-0 md:w-56" />
                      <div className="flex-1">
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* LNE Person ID Field */}
            <FormField
              control={form.control}
              name="lnePersonId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                      <div className="shrink-0 md:w-56">
                        <Label className="text-gray-900">
                          {t('form.lnePersonId.label')} <RequiredBadge />
                        </Label>
                      </div>
                      <div className="flex-1">
                        <FormControl>
                          <FormSelect
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
                        </FormControl>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-8">
                      <div className="shrink-0 md:w-56" />
                      <div className="flex-1">
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white px-18 py-10 shadow">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('form.introSectionTitle')}
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Introduced Fee Rate Field */}
            <FormField
              control={form.control}
              name="introducedFeeRate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                      <div className="shrink-0 md:w-56">
                        <Label className="text-gray-900">
                          {t('form.introducedFeeRate.label')} <RequiredBadge />
                        </Label>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <FormInput
                              {...field}
                              label=""
                              className="max-w-24 text-right"
                              inputMode="decimal"
                              onChange={(e) => {
                                field.onChange(handleNumberInput(e, true));
                              }}
                            />
                          </FormControl>
                          <span className="text-sm text-gray-900">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:gap-8">
                      <div className="shrink-0 md:w-56" />
                      <div className="flex-1">
                        <Hint>{t('form.introducedFeeRate.hint')}</Hint>
                        <FormMessage />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-60">
            <FormButton
              type="submit"
              isLoading={form.formState.isSubmitting}
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
      </Form>
    </FormProvider>
  );
};

export default MemberForm;
