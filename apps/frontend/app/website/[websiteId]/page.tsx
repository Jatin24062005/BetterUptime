// app/website/[websiteId]/page.tsx
import WebsiteDetailsPage from '@/components/websiteDetails';
import React from 'react';

// ✅ Correct type signature for Next.js 15
interface PageProps {
  params: Promise<{
    websiteId: string;
  }>;
}

const WebsitePage = async ({ params }: PageProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { websiteId: _websiteId } = await params;

  return (
    <div>
      <WebsiteDetailsPage />
    </div>
  );
};

export default WebsitePage;
