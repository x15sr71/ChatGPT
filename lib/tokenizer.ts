// lib/tokenizer.ts
import { encoding_for_model } from '@dqbd/tiktoken';

const encoder = encoding_for_model('gpt-4'); // or gpt-4o, gpt-3.5-turbo, etc.

export function countTokens(text: string): number {
  return encoder.encode(text).length;
}
