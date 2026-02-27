import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import type { DeclincePost } from '@/domain/DeclinePost';
import type { postListLoader } from '@/routes/loader/postListLoader';

export const useFetchPostList = (maxPage: number) => {
  const fetcher = useFetcher<typeof postListLoader>();

  const [postList, setPostList] = useState<Array<DeclincePost>>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const isLoading = fetcher.state !== 'idle';

  const fetchPostList = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setHasMore(maxPage > nextPage);

    fetcher.load(`/resources/posts?page=${nextPage}`);
  };

  useEffect(() => {
    (() => {
      if (fetcher.data) {
        setPostList([...postList, ...fetcher.data]);
      }
    })();
  }, [fetcher.data]);

  return { isLoading, postList, currentPage, hasMore, fetchPostList };
};
