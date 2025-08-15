'use client';

import { getErrorMessage, isApiError } from '@/api/lib/errorHandler';
import { useRegisterMemberMutation } from '@/api/members/register';
import { ProtectedRoute } from '@/components/auth';
import { MemberForm } from '@/components/member/MemberForm';
import { MemberRegistrationFormData } from '@/components/member/MemberForm/form-schema';
import { logError } from '@/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function MemberRegistrationPage() {
  const t = useTranslations('pages.memberRegistration');
  const tBtn = useTranslations('ui.buttons');
  const tCommon = useTranslations('common');
  const tMessages = useTranslations('messages');

  const { mutateAsync: registerMember } = useRegisterMemberMutation();
  const [generalError, setGeneralError] = useState<string | undefined>();

  const onSubmit = async (data: MemberRegistrationFormData) => {
    setGeneralError(undefined);
    const pad = (n: number) => String(n).padStart(2, '0');
    const payload = {
      name: data.name,
      gender: data.gender,
      birthDate: `${data.birthYear}-${pad(Number(data.birthMonth))}-${pad(Number(data.birthDay))}`,
      email: data.email,
      customPhone: data.customPhone,
      lnePhone: data.lnePhone,
      membershipFeeRate: Number(data.membershipFeeRate || 0),
      referrerLoginId:
        data.referrerLoginId === 'Lne直販' ? null : data.referrerLoginId,
      lnePersonId: data.lnePersonId,
      introducedFeeRate: Number(data.introducedFeeRate || 0),
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

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        </div>
        <MemberForm
          onSubmit={onSubmit}
          submitLabel={tBtn('save')}
          backHref="/control"
          backLabel={tCommon('backToMembers')}
          generalError={generalError}
        />
      </div>
    </ProtectedRoute>
  );
}
