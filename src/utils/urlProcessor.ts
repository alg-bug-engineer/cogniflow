import type { URLFetchResult } from '@/types/types';
import { sendChatStream } from './ai';

// URL正则表达式 - 修复版本，支持复杂参数的URL
// 修复：移除\b避免截断，将-放在字符类末尾，增强路径和参数匹配
const URL_REGEX = /https?:\/\/(?:www\.)?[a-zA-Z0-9@:%._\+~#=-]+(?:\.[a-zA-Z0-9@:%._\+~#=-]+)*\.[a-zA-Z]{2,}(?:[a-zA-Z0-9()@:%_\+.~#?&/=\-]*)/gi;

/**
 * 检测文本中是否包含URL
 */
export function detectURL(text: string): string | null {
  if (!text || typeof text !== 'string') return null;
  
  // 先尝试使用正则匹配
  const matches = text.match(URL_REGEX);
  if (matches && matches[0]) {
    const url = matches[0];
    // 验证URL是否有效
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        new URL(url);
        return url;
      } catch {
        // URL 可能不完整但仍返回，让后续处理
        if (url.length > 10) return url;
      }
    }
  }
  
  // 降级方案：手动查找 http:// 或 https:// 开头的字符串
  const httpIndex = text.indexOf('http://');
  const httpsIndex = text.indexOf('https://');
  const startIndex = httpsIndex !== -1 ? httpsIndex : (httpIndex !== -1 ? httpIndex : -1);
  
  if (startIndex !== -1) {
    // 从 http(s):// 开始，找到第一个空格、换行或文本结束
    const remainingText = text.substring(startIndex);
    const endMatch = remainingText.match(/[\s\n\r<>"']/);
    const endIndex = endMatch ? endMatch.index : remainingText.length;
    const potentialURL = remainingText.substring(0, endIndex);
    
    if (potentialURL.length > 10 && (potentialURL.startsWith('http://') || potentialURL.startsWith('https://'))) {
      try {
        new URL(potentialURL);
        return potentialURL;
      } catch {
        return potentialURL;
      }
    }
  }
  
  return null;
}

/**
 * 检测文本是否主要是URL
 * 改进：降低阈值，适应各种场景
 */
export function isMainlyURL(text: string): boolean {
  const url = detectURL(text);
  if (!url) return false;
  
  const trimmedText = text.trim();
  if (trimmedText.length === 0) return false;
  
  // 计算URL占比
  const urlRatio = url.length / trimmedText.length;
  
  // 条件1：URL占比超过30%
  if (urlRatio > 0.3) return true;
  
  // 条件2：文本去除前后空白后，URL占比超过40%
  const textWithoutLeadingTrailingSpaces = trimmedText.replace(/^\s+|\s+$/g, '');
  if (url.length / textWithoutLeadingTrailingSpaces.length > 0.4) return true;
  
  // 条件3：如果文本包含URL且URL长度超过30字符（很可能是完整URL）
  if (url.length > 30 && trimmedText.includes(url)) return true;
  
  return false;
}

/**
 * 提取网页文本内容（简化版，移除 HTML 标签）
 */
function extractTextFromHTML(html: string): string {
  // 移除 script 和 style 标签
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // 移除 HTML 标签
  text = text.replace(/<[^>]+>/g, ' ');
  
  // 解码 HTML 实体
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  text = textarea.value;
  
  // 清理多余空白
  text = text.replace(/\s+/g, ' ').trim();
  
  return text.substring(0, 5000); // 限制长度
}

/**
 * 提取网页标题
 */
function extractTitleFromHTML(html: string): string | null {
  // 尝试从 <title> 标签提取
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // 尝试从 og:title 提取
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (ogTitleMatch && ogTitleMatch[1]) {
    return ogTitleMatch[1].trim();
  }
  
  return null;
}

/**
 * 提取缩略图
 */
function extractThumbnailFromHTML(html: string, baseUrl: string): string | undefined {
  // 尝试从 og:image 提取
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (ogImageMatch && ogImageMatch[1]) {
    const imgUrl = ogImageMatch[1].trim();
    return imgUrl.startsWith('http') ? imgUrl : new URL(imgUrl, baseUrl).href;
  }
  
  // 尝试从 twitter:image 提取
  const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
  if (twitterImageMatch && twitterImageMatch[1]) {
    const imgUrl = twitterImageMatch[1].trim();
    return imgUrl.startsWith('http') ? imgUrl : new URL(imgUrl, baseUrl).href;
  }
  
  return undefined;
}

/**
 * 从 URL 提取更详细的信息（降级方案）
 */
function extractInfoFromURL(url: string): { title: string; description: string } {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    const pathParts = pathname.split('/').filter(Boolean);
    
    let title = hostname;
    let description = `来自 ${hostname} 的链接`;
    
    // GitHub 特殊处理
    if (hostname.includes('github.com') && pathParts.length >= 2) {
      const owner = pathParts[0];
      const repo = pathParts[1];
      title = `${owner}/${repo}`;
      description = `GitHub 仓库：${owner}/${repo}`;
    }
    // 其他常见网站
    else if (pathParts.length > 0) {
        title = pathParts[pathParts.length - 1]
          .replace(/[-_]/g, ' ')
          .replace(/\.[^.]+$/, '') // 移除文件扩展名
          .replace(/\b\w/g, l => l.toUpperCase()); // 首字母大写
      
      if (title.length < 3) {
        title = hostname;
      }
    }
    
    return { title, description };
  } catch {
    return { title: '网页链接', description: '无法提取链接信息' };
  }
}

/**
 * 抓取URL内容 - 尝试直接获取，失败则使用降级方案
 */
export async function fetchURLContent(url: string): Promise<URLFetchResult> {
  console.log('🌐 处理URL:', url);
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // 尝试直接 fetch（可能因为 CORS 失败）
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        mode: 'cors', // 尝试 CORS
      });
      
      if (response.ok) {
        const html = await response.text();
        const title = extractTitleFromHTML(html) || extractInfoFromURL(url).title;
        const content = extractTextFromHTML(html);
        const thumbnail = extractThumbnailFromHTML(html, urlObj.origin) || 
                         `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
        
        console.log('✅ 直接获取网页内容成功:', title);
        
        return {
          url: url,
          title: title,
          summary: '', // 将由 AI 生成
          thumbnail: thumbnail,
          content: content
        };
      }
    } catch (fetchError) {
      // CORS 或其他错误，使用降级方案
      console.warn('⚠️ 直接获取失败，使用降级方案:', fetchError);
    }
    
    // 降级方案：从 URL 提取信息
    const { title, description } = extractInfoFromURL(url);
    const thumbnail = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    
    const result: URLFetchResult = {
      url: url,
      title: title,
      summary: description,
      thumbnail: thumbnail,
      content: '' // 降级方案无法获取内容
    };
    
    console.log('✅ URL信息提取成功（降级方案）:', result.title);
    
    return result;
  } catch (error) {
    console.error('URL处理失败:', error);
    
    // 返回最基本的信息
    return {
      url: url,
      title: '网页链接',
      summary: '无法提取链接信息',
      thumbnail: undefined,
      content: ''
    };
  }
}

/**
 * 使用 AI 生成 URL 内容梗概
 * @param url 链接地址
 * @param urlTitle 链接标题
 * @param urlContent 实际抓取的网页内容（可选，但强烈推荐提供）
 * @param userContext 用户提供的上下文（可选）
 */
export async function generateURLSummary(
  url: string,
  urlTitle: string,
  urlContent?: string,
  userContext?: string
): Promise<string> {
  return new Promise((resolve) => {
    let summary = '';
    
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;
    
    // 从URL结构推断可能的内容类型，并提供更具体的提示
    let contentTypeHint = '';
    let contentAnalysisGuidance = '';
    
    if (hostname.includes('github.com')) {
      contentTypeHint = '这是一个GitHub仓库或开源项目';
      contentAnalysisGuidance = `请重点关注：
- 项目名称和主要功能
- 技术栈、框架或工具
- 项目类型（库、框架、工具、应用等）
- 核心特性或解决的问题
- Stars数量（如果可见）和项目活跃度
- 许可证类型（如果可见）`;
    } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      contentTypeHint = '这是一个YouTube视频';
      contentAnalysisGuidance = '请提取视频标题、频道、时长和主要内容描述';
    } else if (hostname.includes('medium.com') || hostname.includes('blog')) {
      contentTypeHint = '这是一篇博客文章';
      contentAnalysisGuidance = '请提取文章主题、核心观点和主要结论';
    } else if (pathname.match(/\.(pdf|doc|docx)$/)) {
      contentTypeHint = '这是一个文档文件';
      contentAnalysisGuidance = '请提取文档类型、主题和主要内容';
    } else if (pathname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      contentTypeHint = '这是一张图片';
      contentAnalysisGuidance = '请描述图片内容或用途';
    } else {
      contentAnalysisGuidance = '请提取页面的核心主题、主要功能和价值点';
    }

    // 构建内容摘要（如果提供了实际内容）
    let contentSummary = '';
    if (urlContent && urlContent.trim().length > 0) {
      // 提取前3000字符作为分析内容（避免过长）
      const contentToAnalyze = urlContent.substring(0, 3000);
      contentSummary = `\n\n实际网页内容（前3000字符）：\n${contentToAnalyze}`;
    }

    const systemPrompt = `你是一个专业的内容分析助手。根据提供的URL、标题和实际网页内容，生成一个准确、简洁、有用的内容梗概。

要求：
1. **准确性优先**：必须基于实际网页内容生成，不要猜测或编造
2. **梗概长度**：50-120字（根据内容复杂度调整）
3. **核心信息**：必须包含以下关键信息：
   - 项目/内容的核心定位和主要功能
   - 技术栈、框架或关键特性（如果是技术项目）
   - 解决的问题或提供的价值
   - 项目类型（开源库、框架、工具、应用、文档等）
4. **语言风格**：简洁专业，直接描述，避免废话
5. **避免错误**：不要将技术项目描述为"文本生成工具"或"自然语言处理任务"等不准确的描述

${contentTypeHint ? `内容类型：${contentTypeHint}` : ''}
${contentAnalysisGuidance ? `分析指导：${contentAnalysisGuidance}` : ''}

示例（GitHub项目）：
- ✅ 正确："开源RAG引擎：RAGFlow，融合检索增强生成（RAG）与Agent能力，为LLM提供更优的上下文层。支持文档解析、多智能体协作、GraphRAG等功能。"
- ❌ 错误："GitHub项目：基于RAG的文本生成工具，支持多种自然语言处理任务。"（过于笼统且不准确）

示例（技术文档）：
- ✅ 正确："Dify：开源LLM应用开发平台，提供可视化工作流、RAG引擎、Agent框架，支持多种模型接入和部署方式。"
- ❌ 错误："GitHub仓库：Dify是一个Python库，提供文本到语音的转换功能。"（完全错误）`;

    const userPrompt = `URL: ${url}
标题: ${urlTitle}
域名: ${hostname}
${contentTypeHint ? `内容类型: ${contentTypeHint}` : ''}
${userContext ? `用户备注: ${userContext}` : ''}${contentSummary}

请基于实际网页内容，生成一个准确、简洁的内容梗概（50-120字）。如果提供了实际内容，必须基于内容生成，不要仅凭URL猜测。`;

    sendChatStream({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      onUpdate: (content) => {
        summary = content;
      },
      onComplete: () => {
        // 清理可能的引号和多余空白
        const cleanedSummary = summary.trim().replace(/^["']|["']$/g, '');
        resolve(cleanedSummary || `来自 ${hostname} 的内容`);
      },
      onError: (error) => {
        console.error('生成URL梗概失败:', error);
        // 失败时返回基本描述
        resolve(`${contentTypeHint || `来自 ${hostname} 的链接`}`);
      },
      temperature: 0.3 // 降低温度以提高准确性
    });
  });
}
