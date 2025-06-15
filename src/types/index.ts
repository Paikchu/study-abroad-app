// 用户表单数据类型
export interface UserFormData {
  // 个人信息
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  
  // 教育背景
  currentEducation: string;
  institution: string;
  major: string;
  gpa: string;
  graduationDate: string;
  
  // 申请信息
  targetCountry: string;
  targetUniversity: string;
  targetMajor: string;
  applicationDeadline: string;
  
  // 个人经历
  workExperience: string;
  researchExperience: string;
  volunteerExperience: string;
  awards: string;
  
  // 语言成绩
  englishTest: string;
  englishScore: string;
  otherLanguages: string;
  
  // 个人陈述相关
  careerGoals: string;
  whyThisMajor: string;
  whyThisUniversity: string;
  personalChallenges: string;
  uniqueQualities: string;
  
  // 其他信息
  additionalInfo: string;
}

// 文书类型
export type DocumentType = 'personal-statement' | 'motivation-letter' | 'research-proposal' | 'recommendation-letter';

// 生成状态
export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';

// API响应类型
export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

// 流式响应数据
export interface StreamData {
  content: string;
  isComplete: boolean;
  error?: string;
}

// 文档下载选项
export interface DownloadOptions {
  format: 'pdf' | 'docx' | 'txt';
  fileName: string;
}

// 表单验证错误
export interface FormErrors {
  [key: string]: string;
}

// 应用状态
export interface AppState {
  formData: UserFormData;
  generatedContent: string;
  generationStatus: GenerationStatus;
  errors: FormErrors;
  isStreaming: boolean;
}