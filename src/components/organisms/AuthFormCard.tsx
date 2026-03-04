import { Card, Heading } from '@chakra-ui/react';
import type { FC, ReactNode, SubmitEventHandler } from 'react';
import { Form, type HTMLFormMethod } from 'react-router';

type Props = {
  title: string;
  children: ReactNode;
  method?: HTMLFormMethod;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
};

export const AuthFormCard: FC<Props> = (props) => {
  const { title, children, method = 'POST', onSubmit } = props;

  return (
    <Card.Root textAlign="center">
      <Card.Header>
        <Heading as="h2">{title}</Heading>
      </Card.Header>
      <Card.Body>
        <Form method={method} onSubmit={onSubmit}>
          {children}
        </Form>
      </Card.Body>
    </Card.Root>
  );
};
