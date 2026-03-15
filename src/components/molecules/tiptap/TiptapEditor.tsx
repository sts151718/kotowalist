import { defaultExtension } from '@/lib/tiptap/extensions';
import { EditorContent, EditorContext, useEditor, type Content, type Extensions } from '@tiptap/react';
import { Placeholder } from '@tiptap/extensions/placeholder';
import { useMemo, type FC } from 'react';
import { TiptapFixedMenus } from './TiptapFixedMenus';
import { Box } from '@chakra-ui/react';
import type { JSONContent } from '@tiptap/core';

type Props = {
  content?: Content;
  extensions?: Extensions;
  placeholder?: string;
  onChange?: (content: JSONContent | null) => void;
  testId?: string;
};

export const TiptapEditor: FC<Props> = (props) => {
  const { content = '', extensions = defaultExtension, placeholder = '', onChange, testId } = props;

  const editor = useEditor({
    extensions: [...extensions, Placeholder.configure({ placeholder })],
    content,
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
      },
    },
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <Box w="full" border="1px solid" borderColor="gray.200" borderRadius="sm" fontSize="sm" data-testid={testId}>
      <EditorContext.Provider value={providerValue}>
        <TiptapFixedMenus editor={editor} />
        <EditorContent editor={editor} />
      </EditorContext.Provider>
    </Box>
  );
};
