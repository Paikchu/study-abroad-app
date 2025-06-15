import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DownloadOptions } from '../types';

// 下载为PDF
export const downloadAsPDF = async (
  content: string,
  fileName: string = 'document.pdf'
): Promise<void> => {
  try {
    // 创建临时DOM元素
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    tempDiv.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 800px;
      padding: 40px;
      font-family: 'Times New Roman', serif;
      font-size: 12px;
      line-height: 1.6;
      color: #000;
      background: #fff;
    `;
    
    document.body.appendChild(tempDiv);

    // 使用html2canvas生成图片
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // 移除临时元素
    document.body.removeChild(tempDiv);

    // 创建PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4宽度
    const pageHeight = 295; // A4高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，添加更多页面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 下载PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF下载失败:', error);
    throw new Error('PDF生成失败，请重试');
  }
};

// 下载为Word文档（简化版，实际为RTF格式）
export const downloadAsWord = (
  content: string,
  fileName: string = 'document.docx'
): void => {
  try {
    // 将HTML转换为RTF格式
    const rtfContent = convertHtmlToRtf(content);
    
    const blob = new Blob([rtfContent], {
      type: 'application/rtf'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.docx', '.rtf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Word文档下载失败:', error);
    throw new Error('Word文档生成失败，请重试');
  }
};

// 下载为纯文本
export const downloadAsText = (
  content: string,
  fileName: string = 'document.txt'
): void => {
  try {
    // 移除HTML标签，保留纯文本
    const textContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
    
    const blob = new Blob([textContent], {
      type: 'text/plain;charset=utf-8'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('文本文件下载失败:', error);
    throw new Error('文本文件生成失败，请重试');
  }
};

// HTML转RTF的简化实现
const convertHtmlToRtf = (html: string): string => {
  const rtfHeader = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24`;
  const rtfFooter = '}';
  
  let rtfContent = html
    // 移除HTML标签并转换格式
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\\b $1\\b0\\par\\par')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\\b $1\\b0\\par')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\\b $1\\b0\\par')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\\par')
    .replace(/<br\s*\/?>/gi, '\\par')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '\\b $1\\b0')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '\\b $1\\b0')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '\\i $1\\i0')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '\\i $1\\i0')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1')
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\\par')
    .replace(/<[^>]*>/g, '') // 移除剩余的HTML标签
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  
  return rtfHeader + rtfContent + rtfFooter;
};

// 统一下载接口
export const downloadDocument = async (
  content: string,
  options: DownloadOptions
): Promise<void> => {
  const { format, fileName } = options;
  
  switch (format) {
    case 'pdf':
      await downloadAsPDF(content, fileName);
      break;
    case 'docx':
      downloadAsWord(content, fileName);
      break;
    case 'txt':
      downloadAsText(content, fileName);
      break;
    default:
      throw new Error(`不支持的文件格式: ${format}`);
  }
};

// 生成文件名
export const generateFileName = (
  documentType: string,
  format: string,
  timestamp?: Date
): string => {
  const date = timestamp || new Date();
  const dateStr = date.toISOString().split('T')[0];
  const typeMap: { [key: string]: string } = {
    'personal-statement': '个人陈述',
    'motivation-letter': '动机信',
    'research-proposal': '研究计划',
    'recommendation-letter': '推荐信'
  };
  
  const typeName = typeMap[documentType] || documentType;
  return `${typeName}_${dateStr}.${format}`;
};