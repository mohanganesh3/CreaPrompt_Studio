"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { moderateContent, type ModerateContentOutput } from "@/ai/flows/moderate-content";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, PlusCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  text: z.string().min(10, "Content to moderate is required.").max(2000),
});

type ModerationFormProps = {
  addAsset: (asset: Omit<Asset, "id" | "createdAt">) => void;
};

export function ModerationForm({ addAsset }: ModerationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ModerateContentOutput | null>(null);
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "Enter content here to check for cultural, gender, or racial sensitivity.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setFormValues(values);
    try {
      const output = await moderateContent(values);
      setResult(output);
    } catch (error) {
      console.error("Error moderating content:", error);
      toast({
        title: "Error",
        description: "Failed to moderate content. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const handleAddToBoard = () => {
    if (result && formValues) {
      addAsset({
        type: "Moderation",
        content: formValues.text,
        promptData: formValues,
        meta: result,
      });
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Content Ethics & Moderation</CardTitle>
          <CardDescription>Pre-screen content for cultural, gender, and racial sensitivity.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content to Moderate</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the content you want to check here." {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Moderate Content
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {result && (
        <Card className={cn("bg-primary/5", result.isSensitive ? "border-destructive" : "border-green-500")}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                {result.isSensitive ? <AlertTriangle className="text-destructive"/> : <CheckCircle2 className="text-green-600" />}
                Moderation Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <p className={cn("text-lg font-bold", result.isSensitive ? "text-destructive" : "text-green-600")}>
                {result.isSensitive ? "Potentially Sensitive Content" : "Content Seems Okay"}
             </p>
            <p className="text-sm text-muted-foreground">{result.reason}</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button size="sm" onClick={handleAddToBoard}><PlusCircle className="mr-2 h-4 w-4" />Add Report to Board</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
