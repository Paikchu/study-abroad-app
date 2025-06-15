import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DocumentArrowDownIcon, ClipboardDocumentIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { downloadDocument, generateFileName } from '../utils/download';
import { DownloadOptions } from '../types';

interface DocumentPreviewProps {
  content: string;
  isGenerating: boolean;
  isStreaming: boolean;
  documentType: string;
  onDownload?: (options: DownloadOptions) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  content,
  isGenerating,
  isStreaming,
  documentType,
  onDownload
}) => {
  const [showRawContent, setShowRawContent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const contentRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部（流式输出时）
  useEffect(() => {
    if (isStreaming && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content, isStreaming]);

  // 复制内容到剪贴板
  const handleCopyContent = async () => {
    try {
      // 移除HTML标签，获取纯文本
      const textContent = content
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
      
      await navigator.clipboard.writeText(textContent);
      
      // 显示成功提示
      const button = document.getElementById('copy-button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '已复制!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动选择文本复制');
    }
  };

  // 下载文档
  const handleDownload = async () => {
    if (!content.trim()) {
      alert('没有内容可以下载');
      return;
    }

    setIsDownloading(true);
    try {
      const fileName = generateFileName(documentType, downloadFormat);
      const options: DownloadOptions = {
        format: downloadFormat,
        fileName
      };

      if (onDownload) {
        onDownload(options);
      } else {
        await downloadDocument(content, options);
      }
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };



  // 渲染内容
  const renderContent = () => {
    if (!content) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <DocumentArrowDownIcon className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg font-medium">暂无内容</p>
          <p className="text-sm">请填写左侧表单并点击生成按钮</p>
        </div>
      );
    }

    if (showRawContent) {
      return (
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
          {content}
        </pre>
      );
    }

    return (
      <div className="preview-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="mb-1">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 mb-4">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-700">{children}</em>
            )
          }}
        >
          {content}
        </ReactMarkdown>
        {isStreaming && (
          <span className="inline-block w-2 h-5 bg-primary-500 animate-pulse ml-1"></span>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">文档预览</h2>
            {isGenerating && (
              <div className="flex items-center text-sm text-primary-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                {isStreaming ? '生成中...' : '准备中...'}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 视图切换 */}
            <button
              type="button"
              onClick={() => setShowRawContent(!showRawContent)}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title={showRawContent ? '切换到预览模式' : '切换到源码模式'}
            >
              {showRawContent ? (
                <>
                  <EyeIcon className="w-4 h-4 mr-1" />
                  预览
                </>
              ) : (
                <>
                  <EyeSlashIcon className="w-4 h-4 mr-1" />
                  源码
                </>
              )}
            </button>
            
            {/* 复制按钮 */}
            <button
              id="copy-button"
              type="button"
              onClick={handleCopyContent}
              disabled={!content}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="复制内容"
            >
              <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
              复制
            </button>
          </div>
        </div>
        
        {/* 下载工具栏 */}
        {content && (
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">下载格式:</label>
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as 'pdf' | 'docx' | 'txt')}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pdf">PDF</option>
                <option value="docx">Word文档</option>
                <option value="txt">纯文本</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || !content}
              className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  下载中...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  下载文档
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto" ref={contentRef}>
        <div className="p-6">
          {renderContent()}
          <div ref={endRef} />
        </div>
      </div>
      
      {/* 状态栏 */}
      {content && (
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>字符数: {content.length}</span>
            <span>词数: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;