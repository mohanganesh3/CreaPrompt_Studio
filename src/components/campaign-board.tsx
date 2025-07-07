"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Asset, AssetType } from "@/lib/types";
import { FileText, Palette, Sparkles, ShieldCheck, Trash2, ClipboardCopy, AlertTriangle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";

type CampaignBoardProps = {
  assets: Asset[];
  removeAsset: (id: string) => void;
};

const iconMap: Record<AssetType, React.ReactNode> = {
  "Copy": <FileText className="w-4 h-4" />,
  "Brand Voice": <Palette className="w-4 h-4" />,
  "Visual": <Sparkles className="w-4 h-4" />,
  "Moderation": <ShieldCheck className="w-4 h-4" />,
};

export const CampaignBoard = React.forwardRef<HTMLDivElement, CampaignBoardProps>(
  ({ assets, removeAsset }, ref) => {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-xl bg-card/20">
        <p className="text-muted-foreground">Your campaign board is empty.</p>
        <p className="text-sm text-muted-foreground/80">Generated assets will appear here.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full flex-grow">
      <div ref={ref} className="grid gap-4 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 pr-4">
        {assets.map((asset) => (
          <Card key={asset.id} className="flex flex-col campaign-asset-card">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  {iconMap[asset.type]}
                  {asset.type}
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(asset.createdAt, { addSuffix: true })}
                </span>
            </CardHeader>
            <CardContent className="flex-grow">
              {asset.type === "Visual" ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border mt-2">
                    <Image src={asset.content} alt="Generated visual" layout="fill" objectFit="cover" data-ai-hint="abstract art" />
                </div>
              ) : asset.type === "Moderation" ? (
                <div className="mt-2 space-y-2">
                    <p className="text-sm italic p-2 bg-muted rounded-md">"{asset.content}"</p>
                    <Badge variant={asset.meta?.isSensitive ? "destructive" : "default"} className={!asset.meta?.isSensitive ? "bg-green-600" : ""}>
                        {asset.meta?.isSensitive ? <AlertTriangle className="mr-1 h-3 w-3" /> : <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {asset.meta?.isSensitive ? "Sensitive" : "Okay"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{asset.meta.reason}</p>
                </div>
              ) : (
                <p className="mt-2 text-sm italic p-2 bg-muted rounded-md">"{asset.content}"</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {asset.type !== "Visual" && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(asset.type === 'Moderation' ? asset.meta.reason : asset.content)}>
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => removeAsset(asset.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
});

CampaignBoard.displayName = "CampaignBoard";
