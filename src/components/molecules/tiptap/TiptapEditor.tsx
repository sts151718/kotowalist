import { defaultExtension } from '@/lib/tiptap/extensions';
import { EditorContent, EditorContext, useEditor, type Content, type Extensions } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Placeholder } from '@tiptap/extensions/placeholder';
import { useMemo, type FC } from 'react';
import { TiptapFixedMenus } from './TiptapFixedMenus';
import { Box } from '@chakra-ui/react';

type Props = {
  content?: Content;
  extensions?: Extensions;
  minHeight?: string;
  placeholder?: string;
};

export const TiptapEditor: FC<Props> = (props) => {
  const { content = '', extensions = defaultExtension, minHeight = '100px', placeholder = '' } = props;

  const editor = useEditor({
    extensions: [...extensions, Placeholder.configure({ placeholder })],
    content,
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
      },
    },
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <Box w="full" border="1px solid" borderColor="gray.200" borderRadius="sm" fontSize="sm">
      <TiptapFixedMenus editor={editor} />
      <EditorContext.Provider value={providerValue}>
        <EditorContent
          editor={editor}
          style={{
            minHeight,
          }}
        />
        <BubbleMenu editor={editor}></BubbleMenu>
      </EditorContext.Provider>
    </Box>
  );
};
