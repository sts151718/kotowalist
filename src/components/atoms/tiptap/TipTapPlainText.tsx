import { generateText, type Extensions, type JSONContent } from '@tiptap/core';
import { memo, type FC } from 'react';
import { Text } from '@chakra-ui/react';
import { defaultExtension } from '@/lib/tiptap/extensions';

type Props = {
  json: JSONContent;
  extensions?: Extensions;
};

export const TipTapPlainText: FC<Props> = memo((props) => {
  const { json, extensions = defaultExtension } = props;

  const plainText = generateText(json, extensions);

  return <Text>{plainText}</Text>;
});
