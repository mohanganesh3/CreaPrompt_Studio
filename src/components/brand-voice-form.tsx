"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adaptBrandVoice, type AdaptBrandVoiceOutput } from "@/ai/flows/adapt-brand-voice";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, ClipboardCopy, PlusCircle } from "lucide-react";
import type { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandGuidelines: z.string().min(10, "Brand guidelines are required.").max(2000),
  contentToAdapt: z.string().min(10, "Content to adapt is required.").max(2000),
});

type BrandVoiceFormProps = {
  addAsset: (asset: Omit<Asset, "id" | "createdAt">) => void;
};

export function BrandVoiceForm({ addAsset }: BrandVoiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdaptBrandVoiceOutput | null>(null);
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandGuidelines: "Our brand is friendly, youthful, and uses emojis. We avoid technical jargon.",
      contentToAdapt: "Our new software solution leverages machine learning to optimize your workflow.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setFormValues(values);
    try {
      const output = await adaptBrandVoice(values);
      setResult(output);
    } catch (error) {
      console.error("Error adapting brand voice:", error);
      toast({
        title: "Error",
        description: "Failed to adapt content. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const handleCopyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.adaptedContent);
      toast({ title: "Copied to clipboard!" });
    }
  };

  const handleAddToBoard = () => {
    if (result && formValues) {
      addAsset({
        type: "Brand Voice",
        content: result.adaptedContent,
        promptData: formValues,
      });
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Brand Voice Adaptation</CardTitle>
          <CardDescription>Adapt content to match your brand's unique tone and style.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="brandGuidelines"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Guidelines</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'Our tone is professional, witty, and confident...'" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentToAdapt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content to Adapt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the content you want to adapt here." {...field} rows={4}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Adapt Content
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {result && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="font-headline">Adapted Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-body italic">"{result.adaptedContent}"</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyToClipboard}><ClipboardCopy className="mr-2 h-4 w-4" />Copy</Button>
            <Button size="sm" onClick={handleAddToBoard}><PlusCircle className="mr-2 h-4 w-4" />Add to Board</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
