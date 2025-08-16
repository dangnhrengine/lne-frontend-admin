'use client';

import { isApiError } from '@/api/lib/errorHandler';
import { IMemberRegistration, useRegisterMemberMutation } from '@/api/members';
import { ProtectedRoute } from '@/components/auth';
import { MemberForm, MemberFormData } from '@/components/member/MemberForm';
import { LNE_DIRECT_SELLER, ROUTES } from '@/constants';
import { logError } from '@/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MemberRegistrationPage() {
  const t = useTranslations('pages.memberRegistration');
  const tBtn = useTranslations('ui.buttons');
  const tCommon = useTranslations('common');
  const tMessages = useTranslations('messages');
  const tMemberForm = useTranslations('memberForm');

  const { mutateAsync: registerMember } = useRegisterMemberMutation();
  const [generalError, setGeneralError] = useState<string | undefined>();
  const router = useRouter();

  const onSubmit = async (data: MemberFormData) => {
    setGeneralError(undefined);
    const payload: IMemberRegistration = {
      name: data.name,
      gender: data.gender,
      dateOfBirth: new Date(
        `${data.birthYear}-${data.birthMonth}-${data.birthDay}`
      ),
      email: data.email,
      customPhone: data.customPhone,
      lnePhone: data.lnePhone,
      membershipFeeRate: Number(data.membershipFeeRate || 0),
      referrerId: data.referrerId === LNE_DIRECT_SELLER ? '' : data.referrerId,
      lnePersonId: data.lnePersonId,
      introducedFeeRate: Number(data.introducedFeeRate || 0),
    };

    try {
      await registerMember(payload);
      router.push(ROUTES.MEMBERS);
    } catch (error) {
      logError('Register member failed:', error as unknown);

      if (isApiError(error)) {
        switch (true) {
          case error.code === 'RESOURCE_CONFLICT' &&
            error.message.includes('email'):
            setGeneralError(tMemberForm('email.conflict'));
            break;
          case error.code === 'NOT_FOUND' && error.message.includes('Referrer'):
            setGeneralError(tMemberForm('referrerId.notFound'));
            break;
          case error.code === 'NOT_FOUND' &&
            error.message.includes('LnePerson'):
            setGeneralError(tMemberForm('lnePersonId.notFound'));
            break;
          default:
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
          submitLabel={tBtn('register')}
          backHref="/control"
          backLabel={tCommon('backToMembers')}
          generalError={generalError}
        />
      </div>
    </ProtectedRoute>
  );
}
