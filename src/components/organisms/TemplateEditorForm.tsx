import { Card, Fieldset, Heading, Input } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { Form } from 'react-router';
import { FiPlus } from 'react-icons/fi';
import { LiaSaveSolid } from 'react-icons/lia';
import { FormField } from '../molecules/form/FormField';
import { TiptapEditor } from '../molecules/tiptap/TiptapEditor';
import { PrimaryButton } from '../atoms/button/PrimaryButton';
import { TemplateBlockCard } from '../molecules/template/TemplateBlockCard';
import type { DeclincePost } from '@/domain/DeclinePost';
import { useTemplateEditor } from '@/hooks/useTemplateEditor';

type Props = {
  formError?: string;
  post?: DeclincePost;
  submitLabel: string;
};

export const TemplateEditorForm = (props: Props) => {
  const { formError, post, submitLabel } = props;
  const { addTemplate, control, errors, fields, handleSubmit, isSubmitting, isValid, onSubmit, register } =
    useTemplateEditor(post);

  return (
    <Form method="post" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Fieldset.Root>
        <Fieldset.Content>
          <Card.Root size="sm" variant="elevated" shadow="xs">
            <Card.Body>
              <FormField
                label="断りたい状況"
                required
                invalid={!!errors.declineSituation}
                errorText={errors.declineSituation?.message}
              >
                <Input placeholder="例：上司からの飲み会の誘いを断る" {...register('declineSituation')} />
              </FormField>
            </Card.Body>
          </Card.Root>
          <Card.Root size="sm" variant="elevated" shadow="xs">
            <Card.Body>
              <FormField
                label="実際にあった状況"
                invalid={!!errors.actualSituation}
                errorText={errors.actualSituation?.message}
              >
                <Controller
                  control={control}
                  name="actualSituation"
                  render={({ field }) => (
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder=""
                      testId="actual-situation-editor"
                    />
                  )}
                />
              </FormField>
            </Card.Body>
          </Card.Root>
          <Card.Root size="sm" variant="elevated" shadow="xs">
            <Card.Body>
              <FormField label="当時の心境" invalid={!!errors.actualFeeling} errorText={errors.actualFeeling?.message}>
                <Controller
                  control={control}
                  name="actualFeeling"
                  render={({ field }) => (
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="例：断りづらくて困りました"
                      testId="actual-feeling-editor"
                    />
                  )}
                />
              </FormField>
            </Card.Body>
          </Card.Root>
          <Card.Root size="sm" variant="elevated" shadow="xs">
            <Card.Body>
              <FormField
                label="断らなかったときのデメリット"
                invalid={!!errors.demerit}
                errorText={errors.demerit?.message}
              >
                <Controller
                  control={control}
                  name="demerit"
                  render={({ field }) => (
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="例：趣味の時間が取れなくなる。"
                      testId="demerit-editor"
                    />
                  )}
                />
              </FormField>
            </Card.Body>
          </Card.Root>

          <Card.Root size="sm" variant="elevated" shadow="xs">
            <Card.Body>
              <Heading as="h3" fontSize="sm" mb={2}>
                テンプレート
              </Heading>
              {fields.map((field, index) => (
                <TemplateBlockCard
                  control={control}
                  key={field.id}
                  errors={errors.templates?.[index]}
                  index={index}
                  register={register}
                />
              ))}
              <PrimaryButton type="button" variant="outline" onClick={addTemplate}>
                <FiPlus />
                テンプレートを追加
              </PrimaryButton>
            </Card.Body>
          </Card.Root>

          <PrimaryButton type="submit" disabled={!isValid || isSubmitting} loading={isSubmitting}>
            <LiaSaveSolid />
            {submitLabel}
          </PrimaryButton>
        </Fieldset.Content>

        <Fieldset.ErrorText fontSize="sm">{formError}</Fieldset.ErrorText>
      </Fieldset.Root>
    </Form>
  );
};
