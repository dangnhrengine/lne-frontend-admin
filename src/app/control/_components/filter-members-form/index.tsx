import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { filterMemberFormSchema } from './form-schema';
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormMessage,
} from '@/components/common/ui';
import { useCallback } from 'react';
import { MEMBER_STATUS } from '@/types/members';
import useFormSchemaWithTranslation from '@/hooks/useFormSchemaWithTranslation';

export default function FilterMembersForm() {
  const formSchema = useFormSchemaWithTranslation(filterMemberFormSchema);
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      loginId: '',
      name: '',
      lnePhone: undefined,
      transactionsNumber: undefined,
      referrerId: '',
      lnePersonId: '',
      isActive: true,
      startDate: undefined,
      endDate: undefined,
      status: MEMBER_STATUS.VALID,
    },
    mode: 'onChange',
  });

  const onSubmit = useCallback(async () => {}, []);

  return (
    <div className="flex w-full flex-col gap-y-6 rounded-md bg-white p-6 shadow">
      <FormProvider {...form}>
        <Form
          onSubmit={form.handleSubmit(onSubmit)}
          className="standard:grid standard:grid-cols-5 flex w-full flex-wrap items-center gap-6 md:gap-10"
        >
          <FormField
            name="loginId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormInput label="会員ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormInput label="会員ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lnePhone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormInput label="会員ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="loginId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormInput label="会員ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="loginId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormInput label="会員ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </FormProvider>
    </div>
  );
}
