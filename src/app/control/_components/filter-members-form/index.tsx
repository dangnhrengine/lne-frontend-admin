import { useGetLnePersonsQuery } from '@/api/lne-persons';
import { IFilterMembersDto } from '@/api/members';
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
import { Option } from '@/components/common/ui/CreatableSelect';
import { useFormSchemaWithTranslation } from '@/hooks';
import { MEMBER_STATUS } from '@/types/members';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { DateTimePickerHandle } from 'react-flatpickr';
import { FormProvider, useForm } from 'react-hook-form';
import { FilterMemberFormData, filterMemberFormSchema } from './form-schema';

export interface FilterMembersFormRef {
  resetForm: () => void;
}

interface FilterMembersFormProps {
  filter: IFilterMembersDto;
  onSubmitFilters: (filter: FilterMemberFormData) => void;
}

const FilterMembersForm = memo(
  forwardRef<FilterMembersFormRef, FilterMembersFormProps>(
    ({ filter, onSubmitFilters }, ref) => {
      const t = useTranslations('pages.members');
      const formSchema = useFormSchemaWithTranslation(filterMemberFormSchema);

      const startDateRef = useRef<DateTimePickerHandle>(null);
      const endDateRef = useRef<DateTimePickerHandle>(null);

      const defaultValues = useMemo(
        () => ({
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
        }),
        []
      );

      const { data: lnePersons, isLoading: isLoadingLnePersons } =
        useGetLnePersonsQuery();

      const lnePersonsOptions = useMemo(() => {
        return (
          lnePersons?.map((lnePerson) => ({
            label: lnePerson.name,
            value: lnePerson.name || '',
            id: lnePerson.id || '',
          })) || []
        );
      }, [lnePersons]);

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

      const createDefaultValues = useCallback(() => {
        const {
          loginId,
          name,
          lnePhone,
          transactionsNumber = null,
          referrerId,
          lnePersonId,
          isActive,
          startDate,
          endDate,
          status,
        } = filter || {};

        return {
          loginId,
          name,
          lnePhone: lnePhone ? Number(lnePhone) : undefined,
          transactionsNumber,
          referrerId,
          lnePersonId,
          isArchived: isActive?.toString() === 'false',
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          status: status || MEMBER_STATUS.VALID,
        };
      }, [filter]);

      const form = useForm({
        resolver: yupResolver(formSchema),
        values: createDefaultValues(),
        mode: 'onChange',
        resetOptions: {
          keepValues: false,
        },
      });

      const {
        formState: { isValid, isDirty, isSubmitting },
        watch,
      } = form;
      const startDate = watch('startDate');
      const endDate = watch('endDate');

      const handleKeyDownInputNumber = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
          ['.', ',', '-', 'e'].includes(e.key) && e.preventDefault();
        },
        []
      );

      const handleResetForm = useCallback(() => {
        form.reset(defaultValues, {
          keepDefaultValues: false,
          keepValues: false,
        });
        startDateRef.current?.flatpickr?.clear();
        endDateRef.current?.flatpickr?.clear();
      }, [form, defaultValues]);

      useImperativeHandle(
        ref,
        () => ({
          resetForm: handleResetForm,
        }),
        [handleResetForm]
      );

      const handleResetWithSubmit = useCallback(() => {
        handleResetForm();
        onSubmitFilters(defaultValues);
      }, [handleResetForm, onSubmitFilters, defaultValues]);

      const onSubmit = useCallback(
        async (data: FilterMemberFormData) => {
          onSubmitFilters({
            ...data,
          });
        },
        [onSubmitFilters]
      );

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
                              e.target.value ? Number(e.target.value) : null
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
                              e.target.value ? Number(e.target.value) : null
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
                          ref={startDateRef}
                          label={t('joiningDate')}
                          value={field.value}
                          options={{
                            maxDate: endDate,
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className={formItemClasses}>
                      <FormControl>
                        <DatePicker
                          ref={endDateRef}
                          value={field.value}
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
                          {...field}
                          valueField="id"
                          isSearchable
                          label={t('lnePerson')}
                          loading={isLoadingLnePersons}
                          options={lnePersonsOptions}
                          onChange={(option) => {
                            field.onChange((option as Option)?.id);
                          }}
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
                <Button
                  type="button"
                  variant="outline"
                  disabled={!isDirty}
                  onClick={handleResetWithSubmit}
                >
                  {t('reset')}
                </Button>
                <Button
                  type="submit"
                  className="px-12"
                  disabled={!isValid}
                  loading={isSubmitting}
                >
                  {t('submit')}
                </Button>
              </div>
            </Form>
          </FormProvider>
        </div>
      );
    }
  )
);

export default FilterMembersForm;
