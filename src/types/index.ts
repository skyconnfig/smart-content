// ============================================================
// 共享类型定义
// ============================================================

/// 支持的文案模板风格
export type TemplateStyle = "blog" | "news" | "ecommerce" | "academic";

/// 模板选项列表（用于 UI 渲染）
export const TEMPLATE_OPTIONS: { value: TemplateStyle; label: string }[] = [
  { value: "blog", label: "Blog Post" },
  { value: "news", label: "News Article" },
  { value: "ecommerce", label: "E-commerce Copy" },
  { value: "academic", label: "Academic Style" },
];

/// 生成请求参数
export interface GenerateRequest {
  keyword: string;
  template: TemplateStyle;
}

/// 生成响应
export interface GenerateResponse {
  content?: string;
  error?: string;
  remainingFree?: number;
  remainingPaid?: number;
}

/// 用户使用状态
export interface UserUsage {
  freeCount: number;
  paidCount: number;
  totalArticles: number;
}
