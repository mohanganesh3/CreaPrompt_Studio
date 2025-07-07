// src/ai/flows/adapt-brand-voice.ts
'use server';

/**
 * @fileOverview Adapts the tone and style of generated content to match uploaded brand guidelines.
 *
 * - adaptBrandVoice - A function that adapts the brand voice of content.
 * - AdaptBrandVoiceInput - The input type for the adaptBrandVoice function.
 * - AdaptBrandVoiceOutput - The return type for the adaptBrandVoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptBrandVoiceInputSchema = z.object({
  brandGuidelines: z
    .string()
    .describe('Brand guidelines document as a string.'),
  contentToAdapt: z.string().describe('The content to adapt to the brand voice.'),
});

export type AdaptBrandVoiceInput = z.infer<typeof AdaptBrandVoiceInputSchema>;

const AdaptBrandVoiceOutputSchema = z.object({
  adaptedContent: z
    .string()
    .describe('The content adapted to match the brand guidelines.'),
});

export type AdaptBrandVoiceOutput = z.infer<typeof AdaptBrandVoiceOutputSchema>;

export async function adaptBrandVoice(input: AdaptBrandVoiceInput): Promise<AdaptBrandVoiceOutput> {
  return adaptBrandVoiceFlow(input);
}

const adaptBrandVoicePrompt = ai.definePrompt({
  name: 'adaptBrandVoicePrompt',
  input: {schema: AdaptBrandVoiceInputSchema},
  output: {schema: AdaptBrandVoiceOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in adapting content to match specific brand guidelines.

  Instructions: Adapt the provided content to match the tone, style, and voice described in the brand guidelines.
  Ensure the adapted content aligns with the brand's identity and resonates with its target audience.

  Brand Guidelines:
  {{brandGuidelines}}

  Content to Adapt:
  {{contentToAdapt}}

  Adapted Content:
  `,
});

const adaptBrandVoiceFlow = ai.defineFlow(
  {
    name: 'adaptBrandVoiceFlow',
    inputSchema: AdaptBrandVoiceInputSchema,
    outputSchema: AdaptBrandVoiceOutputSchema,
  },
  async input => {
    const {output} = await adaptBrandVoicePrompt(input);
    return output!;
  }
);
