import { Card, Checkbox, Collapsible, Stack, Textarea } from '@chakra-ui/react';
import type { FC } from 'react';
import { FormField } from '../form/FormField';

export const TemplateBlockCard: FC = () => {
  return (
    <Card.Root size="sm" mb={4}>
      <Card.Body>
        <Stack spaceY={4}>
          <FormField label="初めの言葉（感謝の言葉）">
            <Textarea placeholder="例：お誘い頂きありがとうございます。" />
          </FormField>
          <FormField label="締めの言葉（代替案）">
            <Textarea placeholder="例：またの機会にぜひお願いします。" />
          </FormField>
          <Collapsible.Root>
            <Collapsible.Trigger>
              <Collapsible.Indicator>
                <Checkbox.Root variant="solid" colorPalette="blue" size="sm">
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label fontSize="xs">実行済み</Checkbox.Label>
                </Checkbox.Root>
              </Collapsible.Indicator>
            </Collapsible.Trigger>
            <Collapsible.Content marginY={2}>
              <FormField required label="実行結果">
                <Textarea placeholder="実際にこのテンプレートを使ってみた結果を書いてください。" />
              </FormField>
            </Collapsible.Content>
          </Collapsible.Root>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
