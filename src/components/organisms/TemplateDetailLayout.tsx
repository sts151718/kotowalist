import { Card, Stack, StackSeparator } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

type Props = {
  header: ReactNode;
  children: ReactNode;
  testId?: string;
};

export const TemplateDetailLayout: FC<Props> = (props) => {
  const { header, children, testId = '' } = props;

  return (
    <Card.Root borderRadius={8} data-testid={testId} size="sm" variant="elevated" shadow="sm">
      <Card.Header>{header}</Card.Header>
      <Card.Body px={0}>
        <Stack as="dl" spaceY={4} separator={<StackSeparator />}>
          {children}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
