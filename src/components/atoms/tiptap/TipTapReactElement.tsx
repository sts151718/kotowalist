import { renderToReactElement } from '@tiptap/static-renderer/pm/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import type { JSONContent } from '@tiptap/core';
import { memo, useMemo, type FC } from 'react';

type Props = {
  json: JSONContent;
};

export const TipTapReactElement: FC<Props> = memo((props) => {
  const { json } = props;

  const output = useMemo(() => {
    return renderToReactElement({
      content: json,
      extensions: [Document, Paragraph, Text, Bold, Underline, TextStyle, Color],
    });
  }, [json]);

  return output;
});
