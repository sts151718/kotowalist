import { Tag } from '@chakra-ui/react';
import { memo, type FC, type ReactNode } from 'react';
import { HiCheck } from 'react-icons/hi';

type TagKind = 'done' | 'default';

type Props = {
  type: TagKind;
  label?: string;
};

const tagStyle: Record<
  TagKind,
  {
    defaultLabel: string;
    colorPalette: string;
    icon?: ReactNode;
  }
> = {
  done: {
    defaultLabel: '実行済み',
    colorPalette: 'purple',
    icon: <HiCheck />,
  },
  default: {
    defaultLabel: '',
    colorPalette: 'gray',
  },
};

export const StatusTag: FC<Props> = memo((props) => {
  const { type, label } = props;
  const style = tagStyle[type];

  return (
    <Tag.Root size="sm" colorPalette={style.colorPalette} borderRadius="full" w="fit-content">
      {style.icon && <Tag.StartElement>{style.icon}</Tag.StartElement>}
      <Tag.Label fontSize="xx-small">{label ?? style.defaultLabel}</Tag.Label>
    </Tag.Root>
  );
});
