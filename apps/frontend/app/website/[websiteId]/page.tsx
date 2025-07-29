// /app/website/[websiteId]/page.tsx
import WebsiteDetailsPage from '@/components/websiteDetails';
import React from 'react';

interface Props {
  params: {
    websiteId: string;
  };
}

const WebsitePage = async ({ params }: Props) => {
  const { websiteId } = params;

  // Fetch your data here (optional)
  // const website = await fetchWebsite(websiteId);

  return (
    <div>
      {/* render data here */}

      <WebsiteDetailsPage/>
    </div>
  );
};

export default WebsitePage;
