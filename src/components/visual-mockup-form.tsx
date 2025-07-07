"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateVisualMockup, type GenerateVisualMockupOutput } from "@/ai/flows/generate-visual-mockups";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, PlusCircle } from "lucide-react";
import type { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const formSchema = z.object({
  prompt: z.string().min(10, "A descriptive prompt is required.").max(500),
  stylePreferences: z.string().min(2, "Style preferences are required.").max(100),
  layoutHints: z.string().min(1, "Please select a layout hint."),
});

type VisualMockupFormProps = {
  addAsset: (asset: Omit<Asset, "id" | "createdAt">) => void;
};

export function VisualMockupForm({ addAsset }: VisualMockupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateVisualMockupOutput | null>(null);
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "A logo for a coffee shop named 'The Daily Grind', featuring a coffee bean and a rising sun.",
      stylePreferences: "Vibrant colors, flat design",
      layoutHints: "Minimalist design",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setFormValues(values);
    try {
      const output = await generateVisualMockup(values);
      setResult(output);
    } catch (error) {
      console.error("Error generating visual mockup:", error);
      toast({
        title: "Error",
        description: "Failed to generate visual. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }
  
  const handleAddToBoard = () => {
    if (result && formValues) {
      addAsset({
        type: "Visual",
        content: result.imageUrl,
        promptData: formValues,
      });
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Visual Mockup Generator</CardTitle>
          <CardDescription>Create ad visuals, thumbnails, and logos from text prompts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'An ad banner for a new sneaker release...'" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="layoutHints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout Style</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a layout style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="minimalist design">Minimalist</SelectItem>
                          <SelectItem value="e-commerce style">E-commerce</SelectItem>
                          <SelectItem value="cinematic style">Cinematic</SelectItem>
                          <SelectItem value="corporate and clean">Corporate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stylePreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style Preferences</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Pastel colors, art deco'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Visual
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {isLoading && !result && (
        <Card className="bg-primary/5 flex flex-col items-center justify-center p-8 min-h-[200px]">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
           <p className="text-muted-foreground mt-4">Generating your visual...</p>
        </Card>
      )}
      {result && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="font-headline">Generated Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image src={result.imageUrl} alt={formValues?.prompt || "Generated visual"} layout="fill" objectFit="cover" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button size="sm" onClick={handleAddToBoard}><PlusCircle className="mr-2 h-4 w-4" />Add to Board</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
