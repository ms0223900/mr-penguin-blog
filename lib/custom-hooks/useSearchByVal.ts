'use client';

import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { Url, UrlObject } from 'url';

export const getSearchByValParams = (val: string): UrlObject => ({
  pathname: '/search',
  query: {
    q: val,
  },
});

const useSearchByVal = () => {
  const router = useRouter();

  const searchVal = useMemo(() => router.query.q as string, [router.query.q]);

  const handleSearchByVal = (val: string) => {
    window.location.href = `/search?q=${val}`;
  };

  return {
    searchVal,
    handleSearchByVal,
  };
};

export default useSearchByVal;
