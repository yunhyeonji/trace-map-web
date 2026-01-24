import React from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

const DetailPage = async ({ params }: Props) => {
  const { id } = await params;
  return <div>상세페이지</div>;
};

export default DetailPage;
