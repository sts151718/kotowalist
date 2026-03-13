import type { FC } from 'react';
import { MainContainer } from '../atoms/layout/MainContainer';
import { BackLink } from '../molecules/link/BackLink';
import { PrimaryHeading } from '../molecules/text/PrimaryHeading';
import { Card, Fieldset, Heading, Input } from '@chakra-ui/react';
import { Form, useActionData, useNavigation, useSubmit } from 'react-router';
import { FormField } from '../molecules/form/FormField';
import { TiptapEditor } from '../molecules/tiptap/TiptapEditor';
import { FiPlus } from 'react-icons/fi';
import { LiaSaveSolid } from 'react-icons/lia';
import { PrimaryButton } from '../atoms/button/PrimaryButton';
import { Controller, useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeclineFormSchema, type DeclineForm, type TemplateForm } from '@/schemas/declinePosts/form';
import { TemplateBlockCard } from '../molecules/template/TemplateBlockCard';
import { useAuthUserStore } from '@/store/useAuthUserStore';
import type { TemplateCreateError } from '@/routes/actions/templateCreateAction';

const createEmptyTemplate = (): TemplateForm => ({
  id: null,
  openingText: '',
  closingText: '',
  doneFlag: false,
  doneResult: '',
});

export const TemplateCreate: FC = () => {
  const actionData = useActionData<TemplateCreateError>();

  const user = useAuthUserStore((state) => state.user);

  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DeclineForm>({
    mode: 'onChange',
    resolver: zodResolver(DeclineFormSchema),
    defaultValues: {
      declineSituation: '',
      actualSituation: null,
      actualFeeling: null,
      demerit: null,
      templates: [createEmptyTemplate()],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'templates',
  });

  const onSubmit: SubmitHandler<DeclineForm> = async (data) => {
    if (!user) {
      return;
    }

    await submit(
      {
        userId: user.id,
        payload: JSON.stringify(data),
      },
      { method: 'post' }
    );
  };

  return (
    <MainContainer testId="template-create-page">
      <BackLink to="/">一覧へ戻る</BackLink>
      <PrimaryHeading description="断り方のテンプレートを作成して、共有しよう">新規テンプレート作成</PrimaryHeading>
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
                        placeholder="例：金曜の夕方に突然誘われました"
                      />
                    )}
                  />
                </FormField>
              </Card.Body>
            </Card.Root>
            <Card.Root size="sm" variant="elevated" shadow="xs">
              <Card.Body>
                <FormField
                  label="当時の心境"
                  invalid={!!errors.actualFeeling}
                  errorText={errors.actualFeeling?.message}
                >
                  <Controller
                    control={control}
                    name="actualFeeling"
                    render={({ field }) => (
                      <TiptapEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="例：断りづらくて困りました"
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
                <PrimaryButton type="button" variant="outline" onClick={() => append(createEmptyTemplate())}>
                  <FiPlus />
                  テンプレートを追加
                </PrimaryButton>
              </Card.Body>
            </Card.Root>

            <PrimaryButton type="submit" disabled={!isValid || isSubmitting} loading={isSubmitting}>
              <LiaSaveSolid />
              作成する
            </PrimaryButton>
          </Fieldset.Content>

          <Fieldset.ErrorText fontSize="sm">{actionData?.message}</Fieldset.ErrorText>
        </Fieldset.Root>
      </Form>
    </MainContainer>
  );
};
