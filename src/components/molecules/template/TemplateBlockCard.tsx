import { Card, Checkbox, Stack, Textarea } from '@chakra-ui/react';
import { type FC, useEffect, useState } from 'react';
import { FormField } from '../form/FormField';
import { Controller, type Control, type FieldErrors, type UseFormRegister, useWatch } from 'react-hook-form';
import type { DeclineForm, TemplateForm } from '@/schemas/declinePosts/form';

type Props = {
  control: Control<DeclineForm>;
  errors?: FieldErrors<TemplateForm>;
  index: number;
  register: UseFormRegister<DeclineForm>;
};

export const TemplateBlockCard: FC<Props> = ({ control, errors, index, register }) => {
  const doneFlag = useWatch({
    control,
    name: `templates.${index}.doneFlag`,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(doneFlag === true);
  }, [doneFlag]);

  return (
    <Card.Root size="sm" mb={4}>
      <Card.Body>
        <Stack gap={4}>
          <FormField
            required
            label="初めの言葉（感謝の言葉）"
            invalid={!!errors?.openingText}
            errorText={errors?.openingText?.message}
          >
            <Textarea
              placeholder="例：お誘い頂きありがとうございます。"
              {...register(`templates.${index}.openingText`)}
            />
          </FormField>
          <FormField
            required
            label="締めの言葉（代替案）"
            invalid={!!errors?.closingText}
            errorText={errors?.closingText?.message}
          >
            <Textarea
              placeholder="例：またの機会にぜひお願いします。"
              {...register(`templates.${index}.closingText`)}
            />
          </FormField>
          <Controller
            control={control}
            name={`templates.${index}.doneFlag`}
            render={({ field }) => (
              <Checkbox.Root
                checked={field.value}
                onCheckedChange={({ checked }) => {
                  field.onChange(checked);
                }}
                variant="solid"
                colorPalette="blue"
                size="sm"
              >
                <Checkbox.HiddenInput name={field.name} />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label fontSize="xs">実行済み</Checkbox.Label>
              </Checkbox.Root>
            )}
          />

          {open && (
            <>
              <FormField
                required
                label="実行結果"
                invalid={!!errors?.doneResult}
                errorText={errors?.doneResult?.message}
              >
                <Textarea
                  placeholder="実際にこのテンプレートを使ってみた結果を書いてください。"
                  {...register(`templates.${index}.doneResult`)}
                />
              </FormField>
            </>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
