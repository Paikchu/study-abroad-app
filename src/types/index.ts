// 用户信息（对齐API）
export interface UserInfo {
  background: string;
  achievements: string[];
  goals: string;
  extracurricular_activities: string[];
}

// 目标院校信息（对齐API）
export interface TargetInstitution {
  name: string;
  program: string;
  department?: string | null;
}

// 生成配置（对齐API）
export interface GenerationConfig {
  model_id?: string;
  tone?: 'formal' | 'persuasive' | 'reflective' | 'creative' | 'analytical' | 'objective';
  style?: 'concise' | 'detailed' | 'narrative' | 'academic';
  length_preference?: 'short' | 'medium' | 'long';
  custom_prompts?: string[];
}

// 表单数据（用于前端表单收集，后续需组装为API结构）
export interface UserFormData {
  // 个人信息
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
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

// 文书类型（API枚举）
export type DocumentType =
  | 'personal_statement'
  | 'statement_of_purpose'
  | 'recommendation_letter_request'
  | 'cv_enhancement'
  | 'cover_letter'
  | 'research_proposal_summary'
  | 'motivation_letter';

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