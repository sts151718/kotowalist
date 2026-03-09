import { Field } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

type Props = {
  label: ReactNode;
  invalid?: boolean;
  helperText?: ReactNode;
  errorText?: ReactNode;
  children: ReactNode;
};

export const FormField: FC<Props> = (props) => {
  const { label, invalid = false, helperText = '', errorText = '', children } = props;
  return (
    <Field.Root invalid={invalid}>
      <Field.Label fontSize="xs">{label}</Field.Label>
      {children}
      {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
      {errorText && <Field.ErrorText>{errorText}</Field.ErrorText>}
    </Field.Root>
  );
};
