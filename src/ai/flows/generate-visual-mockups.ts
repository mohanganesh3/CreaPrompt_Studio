'use server';

/**
 * @fileOverview Generates visual mockups based on user-defined layout hints and style preferences.
 *
 * - generateVisualMockup - A function that handles the visual mockup generation process.
 * - GenerateVisualMockupInput - The input type for the generateVisualMockup function.
 * - GenerateVisualMockupOutput - The return type for the generateVisualMockup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateVisualMockupInputSchema = z.object({
  layoutHints: z
    .string()
    .describe(
      'Layout hints for the visual mockup, such as minimalist design or e-commerce style.'
    ),
  stylePreferences: z
    .string()
    .describe('Style preferences for the visual mockup, such as color palettes or design trends.'),
  prompt: z.string().describe('A prompt describing the desired image.'),
});
export type GenerateVisualMockupInput = z.infer<typeof GenerateVisualMockupInputSchema>;

const GenerateVisualMockupOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateVisualMockupOutput = z.infer<typeof GenerateVisualMockupOutputSchema>;

export async function generateVisualMockup(
  input: GenerateVisualMockupInput
): Promise<GenerateVisualMockupOutput> {
  return generateVisualMockupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVisualMockupPrompt',
  input: {schema: GenerateVisualMockupInputSchema},
  output: {schema: GenerateVisualMockupOutputSchema},
  prompt: `You are an AI visual designer. Please generate an image based on the following instructions and preferences.\n\nLayout Hints: {{{layoutHints}}}\nStyle Preferences: {{{stylePreferences}}}\nImage Description: {{{prompt}}}`,
});

const generateVisualMockupFlow = ai.defineFlow(
  {
    name: 'generateVisualMockupFlow',
    inputSchema: GenerateVisualMockupInputSchema,
    outputSchema: GenerateVisualMockupOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        {
          text: `Generate an image based on the following layout hints: ${input.layoutHints}, style preferences: ${input.stylePreferences}, and image description: ${input.prompt}.`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {imageUrl: media!.url!};
  }
);
