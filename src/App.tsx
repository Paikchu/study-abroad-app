import React, { useState, useCallback, useEffect } from 'react';
import UserForm from './components/UserForm';
import DocumentPreview from './components/DocumentPreview';
import { UserFormData, FormErrors, GenerationStatus, StreamData, DownloadOptions } from './types';
import { generateDocument } from './services/api';
import { downloadDocument } from './utils/download';
import { validateForm, hasFormErrors } from './utils/validation';
import { AcademicCapIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// 初始表单数据
const initialFormData: UserFormData = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  nationality: '',
  currentEducation: '',
  institution: '',
  major: '',
  gpa: '',
  graduationDate: '',
  targetCountry: '',
  targetUniversity: '',
  targetMajor: '',
  applicationDeadline: '',
  workExperience: '',
  researchExperience: '',
  volunteerExperience: '',
  awards: '',
  englishTest: '',
  englishScore: '',
  otherLanguages: '',
  careerGoals: '',
  whyThisMajor: '',
  whyThisUniversity: '',
  personalChallenges: '',
  uniqueQualities: '',
  additionalInfo: ''
};

const App: React.FC = () => {
  // 状态管理
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [documentType] = useState<string>('personal_statement');
  const [connectionError, setConnectionError] = useState<string>('');

  // 从localStorage加载数据
  useEffect(() => {
    const savedData = localStorage.getItem('study-abroad-form-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData({ ...initialFormData, ...parsedData });
      } catch (error) {
        console.error('加载保存的表单数据失败:', error);
      }
    }
  }, []);

  // 保存表单数据到localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('study-abroad-form-data', JSON.stringify(formData));
    }, 1000); // 防抖，1秒后保存

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // 处理表单数据变化
  const handleFormChange = useCallback((newFormData: UserFormData) => {
    setFormData(newFormData);
  }, []);

  // 处理错误变化
  const handleErrorsChange = useCallback((newErrors: FormErrors) => {
    setErrors(newErrors);
  }, []);

  // 处理流式数据
  const handleStreamData = useCallback((data: StreamData) => {
    if (data.error) {
      setGenerationStatus('error');
      setIsStreaming(false);
      setConnectionError(data.error);
      return;
    }

    if (data.content) {
      setGeneratedContent(prev => prev + data.content);
    }

    if (data.isComplete) {
      setGenerationStatus('completed');
      setIsStreaming(false);
    }
  }, []);

  // 生成文档
  const handleGenerateDocument = useCallback(async () => {
    // 验证表单
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (hasFormErrors(validationErrors)) {
      alert('请先完善表单信息');
      return;
    }
    setGenerationStatus('generating');
    setIsStreaming(true);
    setGeneratedContent('');
    setConnectionError('');
    // 组装API参数
    const userInfo = {
      background: `${formData.currentEducation}，${formData.institution}，${formData.major}，GPA: ${formData.gpa}，毕业时间: ${formData.graduationDate}`,
      achievements: formData.awards ? formData.awards.split(/[,，;；\n]/).map(s => s.trim()).filter(Boolean) : [],
      goals: formData.careerGoals,
      extracurricular_activities: [
        formData.workExperience,
        formData.researchExperience,
        formData.volunteerExperience
      ].filter(Boolean)
    };
    const targetInstitution = {
      name: formData.targetUniversity,
      program: formData.targetMajor,
      department: undefined
    };
    try {
      await generateDocument(
        userInfo,
        documentType,
        targetInstitution,
        handleStreamData
      );
    } catch (error) {
      console.error('生成文档失败:', error);
      setGenerationStatus('error');
      setIsStreaming(false);
      setConnectionError(error instanceof Error ? error.message : '生成失败，请重试');
    }
  }, [formData, documentType, handleStreamData]);

  // 处理文档下载
  const handleDownload = useCallback(async (options: DownloadOptions) => {
    try {
      await downloadDocument(generatedContent, options);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  }, [generatedContent]);

  // 清空表单
  const handleClearForm = useCallback(() => {
    if (window.confirm('确定要清空所有表单数据吗？此操作不可撤销。')) {
      setFormData(initialFormData);
      setGeneratedContent('');
      setGenerationStatus('idle');
      setErrors({});
      localStorage.removeItem('study-abroad-form-data');
    }
  }, []);

  // 重新生成
  const handleRegenerate = useCallback(() => {
    if (window.confirm('确定要重新生成文档吗？当前内容将被覆盖。')) {
      handleGenerateDocument();
    }
  }, [handleGenerateDocument]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <AcademicCapIcon className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">留学文书生成器</h1>
                <p className="text-sm text-gray-500">AI驱动的个性化留学文书生成工具</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {generatedContent && (
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="btn-secondary text-sm"
                  disabled={generationStatus === 'generating'}
                >
                  重新生成
                </button>
              )}
              
              <button
                type="button"
                onClick={handleClearForm}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                清空表单
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 连接错误提示 */}
      {connectionError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">连接错误</h3>
              <p className="text-sm text-red-700 mt-1">{connectionError}</p>
              <p className="text-xs text-red-600 mt-2">
                请检查网络连接或联系技术支持。您也可以尝试刷新页面重试。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* 左侧表单 */}
          <div className="card overflow-hidden">
            <UserForm
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleGenerateDocument}
              isGenerating={generationStatus === 'generating'}
              errors={errors}
              onErrorsChange={handleErrorsChange}
            />
          </div>

          {/* 右侧预览 */}
          <div className="card overflow-hidden">
            <DocumentPreview
              content={generatedContent}
              isGenerating={generationStatus === 'generating'}
              isStreaming={isStreaming}
              documentType={documentType}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </main>

      {/* 底部信息 */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>© 2024 留学文书生成器</span>
              <span>•</span>
              <span>AI驱动的智能文书生成</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                状态: 
                <span className={`ml-1 inline-block w-2 h-2 rounded-full ${
                  generationStatus === 'generating' ? 'bg-yellow-400 animate-pulse' :
                  generationStatus === 'completed' ? 'bg-green-400' :
                  generationStatus === 'error' ? 'bg-red-400' :
                  'bg-gray-400'
                }`}></span>
                <span className="ml-1">
                  {generationStatus === 'generating' ? '生成中' :
                   generationStatus === 'completed' ? '已完成' :
                   generationStatus === 'error' ? '错误' :
                   '就绪'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;