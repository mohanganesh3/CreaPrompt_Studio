// This file is machine-generated - edit with caution.
'use server';
/**
 * @fileOverview A flow for generating marketing copy, taglines, and calls-to-action using tailored prompt templates.
 *
 * - generateMarketingCopy - A function that handles the generation of marketing copy.
 * - GenerateMarketingCopyInput - The input type for the generateMarketingCopy function.
 * - GenerateMarketingCopyOutput - The return type for the generateMarketingCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingCopyInputSchema = z.object({
  promptTemplate: z.string().describe('The template to use for generating the marketing copy.'),
  audience: z.string().describe('The target audience for the marketing copy.'),
  platform: z.string().describe('The platform where the marketing copy will be used.'),
  productName: z.string().describe('The name of the product being marketed.'),
  productDescription: z.string().describe('A description of the product.'),
});

export type GenerateMarketingCopyInput = z.infer<typeof GenerateMarketingCopyInputSchema>;

const GenerateMarketingCopyOutputSchema = z.object({
  marketingCopy: z.string().describe('The generated marketing copy.'),
});

export type GenerateMarketingCopyOutput = z.infer<typeof GenerateMarketingCopyOutputSchema>;

export async function generateMarketingCopy(input: GenerateMarketingCopyInput): Promise<GenerateMarketingCopyOutput> {
  return generateMarketingCopyFlow(input);
}

const generateMarketingCopyPrompt = ai.definePrompt({
  name: 'generateMarketingCopyPrompt',
  input: {schema: GenerateMarketingCopyInputSchema},
  output: {schema: GenerateMarketingCopyOutputSchema},
  prompt: `You are an expert marketing copywriter. Generate marketing copy based on the following information:

Prompt Template: {{{promptTemplate}}}
Audience: {{{audience}}}
Platform: {{{platform}}}
Product Name: {{{productName}}}
Product Description: {{{productDescription}}}`,
});

const generateMarketingCopyFlow = ai.defineFlow(
  {
    name: 'generateMarketingCopyFlow',
    inputSchema: GenerateMarketingCopyInputSchema,
    outputSchema: GenerateMarketingCopyOutputSchema,
  },
  async input => {
    const {output} = await generateMarketingCopyPrompt(input);
    return output!;
  }
);
