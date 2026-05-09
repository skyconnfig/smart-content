// ============================================================
// DeepSeek API 封装
// DeepSeek 的 API 兼容 OpenAI 格式，使用 openai SDK 即可调用
// 官方文档: https://api-docs.deepseek.com
// ============================================================

import OpenAI from "openai";

/// DeepSeek API 配置
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

/// 懒初始化 AI client，避免构建时因缺少环境变量而报错
function getClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: DEEPSEEK_BASE_URL,
  });
}

/// 模板提示词映射表
const TEMPLATE_PROMPTS: Record<string, string> = {
  blog: "Write a blog post",
  news: "Write a news article",
  ecommerce: "Write an e-commerce product copy",
  academic: "Write an academic-style article",
};

/**
 * 调用 DeepSeek API 生成文案
 * @param keyword   - 用户输入的关键词或主题
 * @param template  - 文案风格模板
 * @param maxTokens - 最大生成 token 数（默认 800）
 * @returns 生成的文案内容
 */
export async function generateText(
  keyword: string,
  template: string = "blog",
  maxTokens: number = 800
): Promise<string> {
  const styleGuide = TEMPLATE_PROMPTS[template] || TEMPLATE_PROMPTS.blog;

  const prompt = `${styleGuide} about "${keyword}". Write approximately 300-400 words in English. Make it engaging and well-structured with paragraphs.`;

  const response = await getClient().chat.completions.create({
    model: process.env.DEEPSEEK_MODEL || DEEPSEEK_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a professional copywriter and content creator. Write high-quality, engaging content in English.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}
