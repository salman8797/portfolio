import type { Metadata } from 'next';

import { ComingSoonPage } from '@/components/layout/ComingSoonPage';

export const metadata: Metadata = { title: 'Lab' };

export default function Page() {
  return <ComingSoonPage id="lab" />;
}
