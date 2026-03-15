import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, type DefaultValues, type SubmitHandler } from 'react-hook-form';
import { useNavigation, useSubmit } from 'react-router';
import { useAuthUserStore } from '@/store/useAuthUserStore';
import { DeclineFormSchema, type DeclineForm, type TemplateForm } from '@/schemas/declinePosts/form';
import type { DeclincePost } from '@/domain/DeclinePost';

export const useTemplateEditor = (post?: DeclincePost) => {
  const createEmptyTemplate = (): TemplateForm => ({
    id: null,
    openingText: '',
    closingText: '',
    doneFlag: false,
    doneResult: '',
  });

  const resolvedDefaultValues: DefaultValues<DeclineForm> = post
    ? {
        declineSituation: post.declineSituation,
        actualSituation: post.actualSituation as DeclineForm['actualSituation'],
        actualFeeling: post.actualFeeling as DeclineForm['actualFeeling'],
        demerit: post.demerit as DeclineForm['demerit'],
        templates:
          post.templates.length > 0
            ? post.templates.map((template) => ({
                id: template.id,
                openingText: template.openingText,
                closingText: template.closingText,
                doneFlag: template.doneFlag,
                doneResult: template.doneResult,
              }))
            : [createEmptyTemplate()],
      }
    : {
        declineSituation: '',
        actualSituation: null,
        actualFeeling: null,
        demerit: null,
        templates: [createEmptyTemplate()],
      };

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
    defaultValues: resolvedDefaultValues,
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'templates',
  });

  const addTemplate = () => {
    append(createEmptyTemplate());
  };

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

  return {
    addTemplate,
    control,
    errors,
    fields,
    handleSubmit,
    isSubmitting,
    isValid,
    onSubmit,
    register,
  };
};
