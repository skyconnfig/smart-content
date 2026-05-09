type ProxyAgentInstance = {
  close(): Promise<void>;
};

let proxyAgent: ProxyAgentInstance | null = null;

/**
 * 获取代理配置的 undici ProxyAgent 实例（单例）
 * 动态导入 undici，避免在生产环境加载不必要的依赖
 */
async function getProxyAgent(): Promise<ProxyAgentInstance | null> {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (!proxyUrl) return null;

  if (!proxyAgent) {
    const { ProxyAgent } = await import("undici");
    proxyAgent = new ProxyAgent(proxyUrl);
  }
  return proxyAgent;
}

/**
 * 在 Next.js 服务器启动时调用，全局替换 fetch 以使用 HTTP 代理
 * 仅在配置了 HTTPS_PROXY 或 HTTP_PROXY 时生效
 */
export async function enableProxyFetch(): Promise<void> {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (!proxyUrl) return;

  const { fetch: undiciFetch } = await import("undici");
  const agent = await getProxyAgent();
  if (!agent) return;

  const originalFetch = globalThis.fetch;

  // 用 undici 的 fetch 替换全局 fetch，同时注入 ProxyAgent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.fetch = function proxyFetch(this: any, input: any, init?: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return (undiciFetch as any)(input, { ...init, dispatcher: agent });
  } as unknown as typeof globalThis.fetch;

  // 保留原始 fetch 引用以便需要时恢复
  (globalThis as unknown as Record<string, unknown>).__originalFetch = originalFetch;
}

/**
 * 恢复原始 fetch
 */
export function disableProxyFetch(): void {
  const original = (globalThis as unknown as Record<string, unknown>).__originalFetch as typeof fetch | undefined;
  if (original) {
    globalThis.fetch = original;
    delete (globalThis as unknown as Record<string, unknown>).__originalFetch;
  }
}

/**
 * 关闭代理连接池（用于清理）
 */
export async function closeProxyAgent(): Promise<void> {
  if (proxyAgent) {
    await proxyAgent.close();
    proxyAgent = null;
  }
}
