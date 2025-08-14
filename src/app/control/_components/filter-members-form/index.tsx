import {
  Button,
  Checkbox,
  CreatableSelect,
  DatePicker,
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormMessage,
  FormRadio,
} from '@/components/common/ui';
import useFormSchemaWithTranslation from '@/hooks/useFormSchemaWithTranslation';
import { MEMBER_STATUS } from '@/types/members';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FilterMemberFormData, filterMemberFormSchema } from './form-schema';
import Flatpickr, {
  DateTimePickerHandle,
  DateTimePickerProps,
  OptionsType,
} from 'react-flatpickr';
export default function FilterMembersForm() {
  const t = useTranslations('pages.members.filter-members-form');
  const formSchema = useFormSchemaWithTranslation(filterMemberFormSchema);

  const statusOptions = useMemo(() => {
    return Object.values(MEMBER_STATUS).map((status) => ({
      label: t(`status-${status}`),
      value: status,
    }));
  }, [t]);

  const formItemClasses = useMemo(
    () =>
      'h-full w-full self-stretch md:w-[200px] lg:w-[214px] standard:col-span-1 standard:w-full',
    []
  );

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      loginId: '',
      name: undefined,
      lnePhone: undefined,
      transactionsNumber: undefined,
      referrerId: '',
      lnePersonId: '',
      isArchived: false,
      startDate: undefined,
      endDate: undefined,
      status: MEMBER_STATUS.VALID,
    },
    mode: 'onChange',
  });

  const { watch } = form;
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const handleKeyDownInputNumber = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      ['.', ',', '-', 'e'].includes(e.key) && e.preventDefault();
    },
    []
  );

  const onSubmit = useCallback(async (data: FilterMemberFormData) => {
    console.log('Form data:', data);
  }, []);

  return (
    <div className="flex w-full flex-col gap-y-6 rounded-md bg-white p-6 shadow">
      <FormProvider {...form}>
        <Form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-y-6"
        >
          <div className="flex w-full flex-wrap items-center gap-3 standard:grid standard:grid-cols-5 standard:gap-x-10 standard:gap-y-6">
            <FormField
              name="loginId"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <FormInput label={t('loginId')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <FormInput label={t('name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lnePhone"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <FormInput
                      label={t('lnePhone')}
                      {...field}
                      onKeyDown={handleKeyDownInputNumber}
                      type="number"
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="transactionsNumber"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <FormInput
                      label={t('transactionsNumber')}
                      {...field}
                      onKeyDown={handleKeyDownInputNumber}
                      type="number"
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="referrerId"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <FormInput label={t('referrer')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="startDate"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <DatePicker
                      label={t('joiningDate')}
                      options={{
                        maxDate: endDate,
                      }}
                      ref={field.ref}
                      onChange={(dates) => {
                        field.onChange(dates[0]); // Add this line
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="endDate"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <DatePicker
                      id="endDate"
                      options={{
                        minDate: startDate,
                      }}
                      onChange={(dates) => {
                        field.onChange(dates[0]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lnePersonId"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <CreatableSelect
                      label={t('lnePerson')}
                      {...field}
                      options={[]}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isArchived"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <div className="flex flex-col gap-y-2">
                      <p className="block h-5 text-sm font-medium text-gray-900">
                        {t('archive')}
                      </p>
                      <div className="flex h-[44px] items-center gap-x-2 [&>div>label]:whitespace-nowrap">
                        <Checkbox
                          inputId="isArchived"
                          label={t('archiveDescription')}
                          {...field}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="status"
              render={({ field }) => (
                <FormItem className={formItemClasses}>
                  <FormControl>
                    <div className="[&>div>div]:h-11">
                      <FormRadio
                        label={t('status')}
                        options={statusOptions}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full gap-x-5">
            <Button type="button" variant="outline">
              {t('reset')}
            </Button>
            <Button type="submit" className="px-12">
              {t('submit')}
            </Button>
          </div>
        </Form>
      </FormProvider>
    </div>
  );
}
