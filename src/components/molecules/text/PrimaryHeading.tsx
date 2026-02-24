import { Box, Heading, Text } from '@chakra-ui/react';
import type { FC } from 'react';

type Props = {
  children: string;
  description?: string;
};

export const PrimaryHeading: FC<Props> = (props) => {
  const { children, description = '' } = props;

  return (
    <Box mb={4}>
      <Heading as="h2" mb={1} size="xl">
        {children}
      </Heading>
      <Text fontSize="xs">{description}</Text>
    </Box>
  );
};
