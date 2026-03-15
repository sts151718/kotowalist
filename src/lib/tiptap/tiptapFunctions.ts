import type { TiptapNode } from './tiptapTypes';

export const extractChars = (node: TiptapNode | TiptapNode[] | undefined): string => {
  if (!node) return '';

  if (Array.isArray(node)) {
    return node.map((child) => extractChars(child)).join('');
  }

  const selfText = typeof node.text === 'string' ? node.text : '';
  const childText = Array.isArray(node.content) ? extractChars(node.content) : '';

  return selfText + childText;
};
