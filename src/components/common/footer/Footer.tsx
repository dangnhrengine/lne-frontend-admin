import React from 'react';
import { useTranslations } from 'next-intl';

export const Footer: React.FC = () => {
  const t = useTranslations('footer');

  return <div className="bg-red-500">{t('title')}</div>;
};
