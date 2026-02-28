import { useOnInView } from 'react-intersection-observer';

type Props = {
  isLoading: boolean;
  hasMore: boolean;
  callback: () => void;
  options?: IntersectionObserverInit;
};

export const useInfinityScroll = ({ isLoading, hasMore, callback, options = {} }: Props) => {
  const targetRef = useOnInView((inView) => {
    if (inView && !isLoading && hasMore) {
      callback();
    }
  }, options);

  return { targetRef };
};
