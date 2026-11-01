import type { Metadata } from 'next';

import { ComingSoonPage } from '@/components/layout/ComingSoonPage';

export const metadata: Metadata = { title: 'AI' };

export default function Page() {
  return <ComingSoonPage id="ai" />;
}
