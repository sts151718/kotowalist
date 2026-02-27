import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import type { DeclincePost } from '@/domain/DeclinePost';
import type { postListLoader } from '@/routes/loader/postListLoader';

const calcHasMore = (maxPage: number, page: number) => maxPage > page;

export const useFetchPostList = (maxPage: number) => {
  const fetcher = useFetcher<typeof postListLoader>();

  const [isLoading, setIsLoading] = useState(true);
  const [postList, setPostList] = useState<Array<DeclincePost>>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchPostList = () => {
    setIsLoading(true);

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setHasMore(calcHasMore(maxPage, nextPage));

    fetcher.load(`/resources/posts?page=${nextPage}`);
  };

  useEffect(() => {
    (() => {
      if (fetcher.data) {
        setPostList([...postList, ...fetcher.data]);
        setIsLoading(false);
      }
    })();
  }, [fetcher.data]);

  return { isLoading, postList, currentPage, hasMore, fetchPostList };
};
