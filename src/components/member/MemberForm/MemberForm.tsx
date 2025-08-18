import { useGetLnePersonsQuery } from '@/api/lne-persons';
import { IFilterMembersDto, useFilterMembersQuery } from '@/api/members';
import {
  Alert,
  CreatableSelect,
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
import { Option } from '@/components/common/ui/CreatableSelect';
import { FULL_COLON, LNE_DIRECT_SELLER } from '@/constants';
import useFormSchemaWithTranslation from '@/hooks/useFormSchemaWithTranslation';
import { MEMBER_STATUS } from '@/types/members';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { MemberFormData, memberFormSchema } from './form-schema';

type MemberFormProps = {
  onSubmit: (values: MemberFormData) => Promise<void> | void;
  submitLabel: string;
  backHref: string;
  backLabel: string;
  generalError?: string;
  memberLoginId?: string;
  initialValues?: Partial<MemberFormData>;
};

export const MemberForm: React.FC<MemberFormProps> = ({
  onSubmit,
  submitLabel,
  backHref,
  backLabel,
  generalError,
  memberLoginId,
  initialValues,
}) => {
  const t = useTranslations('memberForm');
  const formSchema = useFormSchemaWithTranslation(memberFormSchema);

  // fetch lne persons
  const { data: lnePersons, isLoading: isLoadingLnePersons } =
    useGetLnePersonsQuery();
  const lnePersonsOptions = useMemo(() => {
    return (
      lnePersons?.map((lnePerson) => ({
        label: lnePerson.name,
        value: lnePerson.id,
        id: lnePerson.id,
      })) || []
    );
  }, [lnePersons]);

  // this is filter
  const [filter, setFilter] = useState<IFilterMembersDto>({
    limit: '10',
    currentPage: '1',
    searchFields: ['loginId', 'name'],
    search: '',
    status: MEMBER_STATUS.VALID,
  });

  const [debouncedFilter] = useDebounce(filter, 500);
  // this is hook for call API to get data using tanstack query
  const { data: filterMemberResponse, isLoading: isLoadingFilter } =
    useFilterMembersQuery(debouncedFilter);
  // this is options get from data after call API
  const referrerOptions = useMemo(() => {
    const memberOptions =
      filterMemberResponse?.data?.map((member) => ({
        label: `${member.loginId}${FULL_COLON}${member.name}`,
        value: member.id,
        id: member.id,
      })) || [];

    return [
      {
        label: LNE_DIRECT_SELLER,
        value: LNE_DIRECT_SELLER,
        id: LNE_DIRECT_SELLER,
      },
      ...memberOptions,
    ];
  }, [filterMemberResponse]);

  const handleReferrerChange = (inputValue: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      search: inputValue,
    }));
  };

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
      {t('requiredBadge')}
    </span>
  );

  const form = useForm<MemberFormData>({
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
      referrerId: referrerOptions[0].value,
      lnePersonId: '',
      introducedFeeRate: '',
      ...initialValues,
    },
    mode: 'all',
    resolver: yupResolver(formSchema),
  });

  return (
    <FormProvider {...form}>
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        {generalError && (
          <div className="mb-4">
            <Alert variant="error" dismissible open>
              {generalError}
            </Alert>
          </div>
        )}

        <div className="rounded-lg bg-white px-18 py-10 shadow">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('infoSectionTitle')}
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <div className="shrink-0 md:w-56">
                      <Label className="text-gray-900">
                        {t('name.label')} <RequiredBadge />
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
                </FormItem>
              )}
            />

            {/* Gender Field */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <div className="shrink-0 md:w-56">
                      <Label className="text-gray-900">
                        {t('gender.label')} <RequiredBadge />
                      </Label>
                    </div>
                    <div className="flex-1">
                      <FormControl>
                        <FormRadio
                          label=""
                          options={[
                            { value: 'male', label: t('gender.male') },
                            {
                              value: 'female',
                              label: t('gender.female'),
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
                </FormItem>
              )}
            />

            {/* Birthdate Fields */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                <div className="shrink-0 md:w-56">
                  <Label className="text-gray-900">
                    {t('birthdate.label')} <RequiredBadge />
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
                            aria-label={t('birthdate.year')}
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
                    <span className="text-gray-900">{t('birthdate.year')}</span>

                    <FormField
                      control={form.control}
                      name="birthMonth"
                      render={({ field }) => (
                        <FormControl>
                          <FormSelect
                            label=""
                            className="max-w-20"
                            aria-label={t('birthdate.month')}
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
                      {t('birthdate.month')}
                    </span>

                    <FormField
                      control={form.control}
                      name="birthDay"
                      render={({ field }) => (
                        <FormControl>
                          <FormSelect
                            label=""
                            className="max-w-20"
                            aria-label={t('birthdate.day')}
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
                    <span className="text-gray-900">{t('birthdate.day')}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                <div className="shrink-0 md:w-56" />
                <div className="flex-1">
                  <FormMessage>
                    {form.formState.errors?.birthDay?.message ||
                      form.formState.errors?.birthMonth?.message ||
                      form.formState.errors?.birthYear?.message}
                  </FormMessage>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <div className="shrink-0 md:w-56">
                      <Label className="text-gray-900">
                        {t('email.label')} <RequiredBadge />
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
                      <Hint>{t('email.hint')}</Hint>
                      <FormMessage />
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
                <FormItem className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <div className="shrink-0 md:w-56">
                      <Label className="text-gray-900">
                        {t('customPhone.label')} <RequiredBadge />
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
                      <Hint>{t('customPhone.hint')}</Hint>
                      <FormMessage />
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
                <FormItem className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <div className="shrink-0 md:w-56">
                      <Label className="text-gray-900">
                        {t('lnePhone.label')} <RequiredBadge />
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
                      <Hint>{t('lnePhone.hint')}</Hint>
                      <FormMessage />
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
                <FormItem className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <div className="shrink-0 md:w-56">
                      <Label className="text-gray-900">
                        {t('membershipFeeRate.label')} <RequiredBadge />
                      </Label>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <FormInput
                            label=""
                            className="max-w-24"
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
                      <Hint>{t('membershipFeeRate.hint')}</Hint>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Referrer Login ID Field */}
            <FormField
              control={form.control}
              name="referrerId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <div className="shrink-0 md:w-56">
                      <Label className="text-gray-900">
                        {t('referrerId.label')} <RequiredBadge />
                      </Label>
                    </div>
                    <div className="flex-1">
                      <FormControl>
                        <CreatableSelect
                          {...field}
                          className="max-w-[250px]"
                          valueField="id"
                          isSearchable
                          loading={isLoadingFilter}
                          options={referrerOptions}
                          onInputChange={handleReferrerChange}
                          onChange={(option, actionMeta) => {
                            field.onChange((option as Option)?.id);
                          }}
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
                </FormItem>
              )}
            />

            {/* LNE Person ID Field */}
            <FormField
              control={form.control}
              name="lnePersonId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <div className="shrink-0 md:w-56">
                      <Label className="text-gray-900">
                        {t('lnePersonId.label')} <RequiredBadge />
                      </Label>
                    </div>
                    <div className="flex-1">
                      <FormControl>
                        <CreatableSelect
                          {...field}
                          valueField="id"
                          isSearchable
                          label=""
                          className="max-w-[250px]"
                          loading={isLoadingLnePersons}
                          options={lnePersonsOptions}
                          onChange={(option) => {
                            field.onChange((option as Option)?.id);
                          }}
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
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white px-18 py-10 shadow">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('introSectionTitle')}
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Introduced Fee Rate Field */}
            <FormField
              control={form.control}
              name="introducedFeeRate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <div className="shrink-0 md:w-56">
                      <Label className="text-gray-900">
                        {t('introducedFeeRate.label')} <RequiredBadge />
                      </Label>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <FormInput
                            {...field}
                            label=""
                            className="max-w-24"
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
                      <Hint>{t('introducedFeeRate.hint')}</Hint>
                      <FormMessage />
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
          <Link
            href={backHref}
            className="my-4 text-sm text-gray-600 hover:underline"
          >
            {backLabel}
          </Link>
        </div>
      </Form>
    </FormProvider>
  );
};

export default MemberForm;
