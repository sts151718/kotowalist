import { Card, Stack, StackSeparator } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

type Props = {
  header: ReactNode;
  children: ReactNode;
};

export const TemplateDetailLayout: FC<Props> = (props) => {
  const { header, children } = props;

  return (
    <Card.Root borderRadius={8}>
      <Card.Header>{header}</Card.Header>
      <Card.Body px={0}>
        <Stack as="dl" spaceY={4} separator={<StackSeparator />}>
          {children}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
