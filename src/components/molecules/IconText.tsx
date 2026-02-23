import { HStack, Icon, Text, type TextProps } from '@chakra-ui/react';
import { type FC, type ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  text: string;
  fontSize?: TextProps['fontSize'];
  color?: TextProps['color'];
};

export const IconText: FC<Props> = (props) => {
  const { icon, text, fontSize = 'xs', color = 'black' } = props;
  return (
    <HStack gap={2} fontSize={fontSize} color={color}>
      <Icon>{icon}</Icon>
      <Text>{text}</Text>
    </HStack>
  );
};
