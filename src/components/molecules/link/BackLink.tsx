import type { FC, ReactNode } from 'react';
import { Link } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';
import { Flex } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
  to: string;
};

export const BackLink: FC<Props> = (props) => {
  const { children, to } = props;

  return (
    <Link to={to}>
      <Flex
        gap={2}
        alignItems="center"
        color="gray.500"
        fontSize="sm"
        fontWeight="medium"
        mb={4}
        _hover={{ color: 'fg' }}
      >
        <FaArrowLeft />
        {children}
      </Flex>
    </Link>
  );
};
