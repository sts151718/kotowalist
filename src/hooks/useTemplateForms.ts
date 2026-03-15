import type { IDeclineTemplate } from '@/domain/DeclinePost';
import type { TemplateForm, TemplateFormData } from '@/schemas/declinePosts/form';
import { useState } from 'react';

const emptyTemplate = {
  id: null,
  openingText: '',
  closingText: '',
  doneFlag: false,
  doneResult: '',
} as TemplateForm;

const createEmptyFormData = (): TemplateFormData => {
  return { ...emptyTemplate, clientId: crypto.randomUUID() };
};

const toTemplateFormData = (template: IDeclineTemplate): TemplateFormData => {
  return { ...template, clientId: crypto.randomUUID() };
};

export const useTemplateForms = (templates: Array<IDeclineTemplate> | null = null) => {
  const initialTemplateForms = templates
    ? templates.map((template) => toTemplateFormData(template))
    : [createEmptyFormData()];

  const [templateForms, setTemplateForms] = useState<Array<TemplateFormData>>(initialTemplateForms);

  const addTemplateForm = () => {
    setTemplateForms([...templateForms, createEmptyFormData()]);
  };

  return { templateForms, addTemplateForm };
};
