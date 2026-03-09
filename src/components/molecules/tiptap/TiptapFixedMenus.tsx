import {
  ColorPicker,
  Flex,
  IconButton,
  parseColor,
  Separator,
  type ColorPickerValueChangeDetails,
} from '@chakra-ui/react';
import { Editor } from '@tiptap/react';
import type { FC } from 'react';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { LuCheck } from 'react-icons/lu';

type Props = {
  editor: Editor;
};

export const TiptapFixedMenus: FC<Props> = (props) => {
  const { editor } = props;

  const swatches = ['#000000', '#ef4444', '#f97316', '#22c55e', '#3b82f6', '#9333ea', '#db2777', '#71717a'];
  const onColorChange = ({ valueAsString }: ColorPickerValueChangeDetails) => {
    editor.chain().focus().setColor(valueAsString).run();
  };

  return (
    <Flex
      alignItems="center"
      gap={2}
      bg="gray.100"
      w="full"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={2}
      py={1}
    >
      <IconButton
        aria-label="太字"
        size="xs"
        variant={editor.isActive('bold') ? 'solid' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FaBold />
      </IconButton>
      <IconButton
        aria-label="イタリック"
        size="xs"
        variant={editor.isActive('italic') ? 'solid' : 'ghost'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FaItalic />
      </IconButton>
      <IconButton
        aria-label="下線"
        size="xs"
        variant={editor.isActive('underline') ? 'solid' : 'ghost'}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FaUnderline />
      </IconButton>

      <Separator orientation="vertical" height="4" />

      <ColorPicker.Root ml="2" size="2xs" defaultValue={parseColor('#000')} onValueChange={onColorChange}>
        <ColorPicker.Control>
          <ColorPicker.Trigger />
        </ColorPicker.Control>
        <ColorPicker.Positioner>
          <ColorPicker.Content boxSize="36">
            <ColorPicker.SwatchGroup>
              {swatches.map((swatch) => (
                <ColorPicker.SwatchTrigger key={swatch} value={swatch}>
                  <ColorPicker.Swatch value={swatch} boxSize="8">
                    <ColorPicker.SwatchIndicator>
                      <LuCheck />
                    </ColorPicker.SwatchIndicator>
                  </ColorPicker.Swatch>
                </ColorPicker.SwatchTrigger>
              ))}
            </ColorPicker.SwatchGroup>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </ColorPicker.Root>
    </Flex>
  );
};
