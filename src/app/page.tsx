"use client";

import React, { useState, useRef } from "react";
import {
  Wand2,
  Files,
  Trash2,
  FileText,
  Palette,
  ShieldCheck,
  Sparkles,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CampaignCopyForm } from "@/components/campaign-copy-form";
import { BrandVoiceForm } from "@/components/brand-voice-form";
import { VisualMockupForm } from "@/components/visual-mockup-form";
import { ModerationForm } from "@/components/moderation-form";
import { CampaignBoard } from "@/components/campaign-board";
import type { Asset } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CreaPromptStudio() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const { toast } = useToast();
  const boardRef = useRef<HTMLDivElement>(null);

  const addAsset = (asset: Omit<Asset, "id" | "createdAt">) => {
    const newAsset = { ...asset, id: crypto.randomUUID(), createdAt: new Date() };
    setAssets((prev) => [newAsset, ...prev]);
    toast({
      title: "Asset Added to Board",
      description: `New '${asset.type}' asset has been saved.`,
    });
  };

  const removeAsset = (id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
    toast({
      title: "Asset Removed",
      description: "The asset has been removed from your campaign board.",
      variant: "destructive",
    });
  };

  const clearBoard = () => {
    setAssets([]);
    toast({
      title: "Board Cleared",
      description: "All assets have been removed from your campaign board.",
    });
  };

  const handleExport = async () => {
    const boardElement = boardRef.current;
    if (!boardElement || assets.length === 0) {
      toast({
        title: "Board is Empty",
        description: "Add some assets to the board before exporting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Exporting...",
      description: "Generating PDF of your campaign board. This may take a moment.",
    });
    
    const clone = boardElement.cloneNode(true) as HTMLElement;

    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = '800px'; 
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.gap = '16px';
    clone.style.padding = '0';
    
    Array.from(clone.children).forEach(child => {
        if (child instanceof HTMLElement) {
            child.style.width = '100%';
        }
    });

    document.body.appendChild(clone);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      let y = margin;

      const cardElements = clone.querySelectorAll('.campaign-asset-card') as NodeListOf<HTMLElement>;
      
      for (const card of Array.from(cardElements)) {
        const canvas = await html2canvas(card, {
          scale: 2,
          useCORS: true,
          backgroundColor: window.getComputedStyle(document.body).getPropertyValue('background-color'),
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (y + imgHeight > pdfHeight - margin && y > margin) {
          pdf.addPage();
          y = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
        y += imgHeight + 5;
      }

      pdf.save('CreaPrompt-Campaign-Board.pdf');

      toast({
        title: 'Export Successful!',
        description: 'Your PDF has been downloaded.',
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: 'Export Failed',
        description: 'An error occurred while generating the PDF.',
        variant: 'destructive',
      });
    } finally {
      document.body.removeChild(clone);
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-5 h-screen overflow-hidden">
      <aside className="lg:col-span-2 flex flex-col p-4 sm:p-6 border-r bg-card/20 overflow-y-auto">
        <header className="flex items-center gap-3 pb-6">
          <Wand2 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-headline text-primary">CreaPrompt Studio</h1>
            <p className="text-sm text-muted-foreground">AI Content Generation Hub</p>
          </div>
        </header>

        <Tabs defaultValue="copy" className="flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="copy" className="flex flex-col sm:flex-row gap-2 p-3 sm:p-2"><FileText className="w-4 h-4" /> Copy</TabsTrigger>
            <TabsTrigger value="brand" className="flex flex-col sm:flex-row gap-2 p-3 sm:p-2"><Palette className="w-4 h-4" /> Brand</TabsTrigger>
            <TabsTrigger value="visuals" className="flex flex-col sm:flex-row gap-2 p-3 sm:p-2"><Sparkles className="w-4 h-4" /> Visuals</TabsTrigger>
            <TabsTrigger value="moderate" className="flex flex-col sm:flex-row gap-2 p-3 sm:p-2"><ShieldCheck className="w-4 h-4" /> Moderate</TabsTrigger>
          </TabsList>
          
          <div className="flex-grow overflow-y-auto mt-4 pr-2">
            <TabsContent value="copy">
              <CampaignCopyForm addAsset={addAsset} />
            </TabsContent>
            <TabsContent value="brand">
              <BrandVoiceForm addAsset={addAsset} />
            </TabsContent>
            <TabsContent value="visuals">
              <VisualMockupForm addAsset={addAsset} />
            </TabsContent>
            <TabsContent value="moderate">
              <ModerationForm addAsset={addAsset} />
            </TabsContent>
          </div>
        </Tabs>
      </aside>

      <main className="lg:col-span-3 flex flex-col p-4 sm:p-6 overflow-hidden">
        <header className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <Files className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-headline">Campaign Board</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={assets.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={assets.length === 0}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all
                    assets from your campaign board.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearBoard}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        <CampaignBoard ref={boardRef} assets={assets} removeAsset={removeAsset} />
      </main>
    </div>
  );
}
