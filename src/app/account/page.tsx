import type { Metadata } from 'next';
import { AccountView } from '@/components/account/AccountView';
import { PrivatePage } from '@/components/layout/PrivatePage';

export const metadata: Metadata = { title: 'Кабинет', robots: { index: false } };

export default function AccountPage() {
  return (
    <PrivatePage>
      <AccountView />
    </PrivatePage>
  );
}
