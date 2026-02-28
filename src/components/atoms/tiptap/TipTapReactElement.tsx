import { renderToReactElement } from '@tiptap/static-renderer/pm/react';
import type { Extensions, JSONContent } from '@tiptap/core';
import { memo, useMemo, type FC } from 'react';
import { defaultExtension } from '@/lib/tiptap/extensions';

type Props = {
  json: JSONContent;
  extensions?: Extensions;
};

export const TipTapReactElement: FC<Props> = memo((props) => {
  const { json, extensions = defaultExtension } = props;

  const output = useMemo(() => {
    return renderToReactElement({
      content: json,
      extensions: extensions,
    });
  }, [json, extensions]);

  return output;
});
