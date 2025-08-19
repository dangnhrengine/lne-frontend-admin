'use client';

import { isApiError } from '@/api/lib/errorHandler';
import { useEditMemberMutation, useGetMemberByIdQuery } from '@/api/members';

import { ProtectedRoute } from '@/components/auth';
import { FullScreenSpinner } from '@/components/common/ui';
import { MemberForm } from '@/components/member/MemberForm';
import { MemberFormData } from '@/components/member/MemberForm/form-schema';
import { LNE_DIRECT_SELLER, ROUTES } from '@/constants';
import { logError } from '@/utils';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MemberEditPage() {
  const params = useParams();
  const memberId = params.id as string;

  const t = useTranslations('pages.memberEdit');
  const tBtn = useTranslations('ui.buttons');
  const tCommon = useTranslations('common');
  const tMessages = useTranslations('messages');
  const tMemberForm = useTranslations('memberForm');

  const router = useRouter();
  const { mutateAsync: editMember } = useEditMemberMutation();

  const [generalError, setGeneralError] = useState<string | undefined>();

  const {
    data: member,
    isLoading,
    error: getError,
  } = useGetMemberByIdQuery(memberId);

  const parseBirthDate = (birthDate: Date) => {
    return {
      birthYear: birthDate.getFullYear().toString(),
      birthMonth: (birthDate.getMonth() + 1).toString(),
      birthDay: birthDate.getDate().toString(),
    };
  };

  // Convert member data to form data format
  const getInitialValues = () => {
    if (!member) {
      return {};
    }

    const { birthYear, birthMonth, birthDay } = parseBirthDate(
      member.dateOfBirth
    );

    return {
      name: member.name,
      gender: member.gender,
      birthYear,
      birthMonth,
      birthDay,
      email: member.email,
      customPhone: member.customPhone,
      lnePhone: member.lnePhone,
      membershipFeeRate: String(member.membershipFeeRate),
      referrerId: member.referrerId || LNE_DIRECT_SELLER,
      lnePersonId: member.lnePersonId,
      introducedFeeRate: String(member.introducedFeeRate),
    };
  };

  const onSubmit = async (data: MemberFormData) => {
    setGeneralError(undefined);

    const payload = {
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
      await editMember({ id: memberId, payload });
      router.push(ROUTES.MEMBERS);
    } catch (error) {
      logError('Edit member failed:', error as unknown);

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

  // Show loading state
  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <FullScreenSpinner />
      </ProtectedRoute>
    );
  }

  // Show error state
  if (getError) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {t('memberNotFound')}
              </h3>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        </div>
        <MemberForm
          onSubmit={onSubmit}
          submitLabel={tBtn('update')}
          backHref="/control"
          backLabel={tCommon('backToMembers')}
          generalError={generalError}
          memberId={memberId}
          initialValues={getInitialValues()}
        />
      </div>
    </ProtectedRoute>
  );
}
