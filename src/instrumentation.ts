/**
 * Next.js 服务器启动时注册的钩子
 * 在服务器初始化时自动执行，用于注入全局代理
 */
export async function register(): Promise<void> {
  // 仅在配置了代理时启用代理 fetch
  if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) {
    // 使用相对路径而非 @/ 别名，确保 instrumentation 启动阶段可正确加载
    const { enableProxyFetch } = await import("./lib/proxy-fetch");
    enableProxyFetch();
  }
}
