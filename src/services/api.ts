import { UserFormData, StreamData, ApiResponse } from '../types';

// API基础配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// API客户端类
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 生成文书 - 流式输出
  async generateDocument(
    formData: UserFormData,
    documentType: string,
    onChunk: (data: StreamData) => void
  ): Promise<void> {
    const url = `${this.baseURL}/generate/stream`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          documentType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // 处理最后的数据
          if (buffer.trim()) {
            try {
              const data = JSON.parse(buffer);
              onChunk(data);
            } catch (e) {
              console.warn('解析最后数据块失败:', e);
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              // 处理SSE格式的数据
              const cleanLine = line.replace(/^data: /, '');
              if (cleanLine === '[DONE]') {
                onChunk({ content: '', isComplete: true });
                return;
              }
              
              const data = JSON.parse(cleanLine);
              onChunk(data);
            } catch (e) {
              console.warn('解析数据块失败:', e, '原始数据:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('流式生成失败:', error);
      onChunk({
        content: '',
        isComplete: true,
        error: error instanceof Error ? error.message : '生成失败'
      });
    }
  }

  // 验证表单数据
  async validateForm(formData: UserFormData): Promise<ApiResponse> {
    return this.request<ApiResponse>('/validate', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // 获取支持的文档类型
  async getDocumentTypes(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/document-types');
  }

  // 保存生成的文档
  async saveDocument(
    content: string,
    formData: UserFormData,
    documentType: string
  ): Promise<ApiResponse> {
    return this.request<ApiResponse>('/documents', {
      method: 'POST',
      body: JSON.stringify({
        content,
        formData,
        documentType,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  // 获取用户历史文档
  async getUserDocuments(userId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/documents/user/${userId}`);
  }
}

// 导出API客户端实例
export const apiClient = new ApiClient();

// 导出便捷方法
export const generateDocument = apiClient.generateDocument.bind(apiClient);
export const validateForm = apiClient.validateForm.bind(apiClient);
export const getDocumentTypes = apiClient.getDocumentTypes.bind(apiClient);
export const saveDocument = apiClient.saveDocument.bind(apiClient);
export const getUserDocuments = apiClient.getUserDocuments.bind(apiClient);