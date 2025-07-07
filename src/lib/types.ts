export type AssetType = "Copy" | "Visual" | "Brand Voice" | "Moderation";

export interface Asset {
  id: string;
  type: AssetType;
  content: string; // text content or image URL
  promptData?: Record<string, any>;
  createdAt: Date;
  meta?: any; // For moderation result, etc.
}
