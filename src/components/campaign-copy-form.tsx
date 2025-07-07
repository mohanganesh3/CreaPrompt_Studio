"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateMarketingCopy, type GenerateMarketingCopyOutput } from "@/ai/flows/generate-marketing-copy";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, ClipboardCopy, PlusCircle } from "lucide-react";
import type { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  productName: z.string().min(2, "Product name is required.").max(50),
  productDescription: z.string().min(10, "Description must be at least 10 characters.").max(300),
  platform: z.string().min(1, "Platform is required."),
  audience: z.string().min(1, "Audience is required."),
  promptTemplate: z.string().min(1, "Please select a template."),
});

type CampaignCopyFormProps = {
  addAsset: (asset: Omit<Asset, "id" | "createdAt">) => void;
};

export function CampaignCopyForm({ addAsset }: CampaignCopyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateMarketingCopyOutput | null>(null);
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      platform: "Social Media",
      audience: "General Public",
      promptTemplate: "Generate a catchy tagline.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setFormValues(values);
    try {
      const output = await generateMarketingCopy(values);
      setResult(output);
    } catch (error) {
      console.error("Error generating marketing copy:", error);
      toast({
        title: "Error",
        description: "Failed to generate marketing copy. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const handleCopyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.marketingCopy);
      toast({ title: "Copied to clipboard!" });
    }
  };

  const handleAddToBoard = () => {
    if (result && formValues) {
      addAsset({
        type: "Copy",
        content: result.marketingCopy,
        promptData: formValues,
      });
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Campaign Copy Generator</CardTitle>
          <CardDescription>Craft compelling ad copy, taglines, and calls-to-action.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'CreaPrompt Studio'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Service Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your product in a few sentences." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Input placeholder="e.g., 'Instagram, Blog Post'" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <Input placeholder="e.g., 'Young professionals, designers'" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="promptTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Copy Type</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a copy type to generate" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Generate a catchy tagline.">Tagline</SelectItem>
                          <SelectItem value="Write a short ad copy for a social media post.">Social Media Ad</SelectItem>
                          <SelectItem value="Create a compelling call-to-action.">Call-to-Action</SelectItem>
                          <SelectItem value="Draft a product pitch for an email campaign.">Email Pitch</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Copy
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {result && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="font-headline">Generated Copy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-body italic">"{result.marketingCopy}"</p>
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
