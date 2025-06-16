import React, { useState, useCallback } from 'react';
import { UserFormData, FormErrors } from '../types';
import { validateForm, validateField, hasFormErrors } from '../utils/validation';
import { UserIcon, AcademicCapIcon, GlobeAltIcon, DocumentTextIcon, LanguageIcon } from '@heroicons/react/24/outline';

interface UserFormProps {
  formData: UserFormData;
  onFormChange: (data: UserFormData) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  errors: FormErrors;
  onErrorsChange: (errors: FormErrors) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isGenerating,
  errors,
  onErrorsChange
}) => {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [localErrors, setLocalErrors] = useState<FormErrors>({});

  // 处理表单字段变化
  const handleFieldChange = useCallback((field: keyof UserFormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    onFormChange(newFormData);

    // 实时验证
    const fieldError = validateField(field, value, formData);
    const newErrors = { ...localErrors };
    if (fieldError) {
      newErrors[field] = fieldError;
    } else {
      delete newErrors[field];
    }
    setLocalErrors(newErrors);
    onErrorsChange(newErrors);
  }, [formData, localErrors, onFormChange, onErrorsChange]);

  // 处理表单提交
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setLocalErrors(validationErrors);
    onErrorsChange(validationErrors);
    
    if (!hasFormErrors(validationErrors)) {
      onSubmit();
    } else {
      // 滚动到第一个错误字段
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [formData, onSubmit, onErrorsChange]);

  // 表单部分配置
  const sections = [
    { id: 'personal', title: '个人信息', icon: UserIcon },
    { id: 'education', title: '教育背景', icon: AcademicCapIcon },
    { id: 'application', title: '申请信息', icon: GlobeAltIcon },
    { id: 'experience', title: '个人经历', icon: DocumentTextIcon },
    { id: 'language', title: '语言成绩', icon: LanguageIcon },
    { id: 'statement', title: '个人陈述', icon: DocumentTextIcon }
  ];

  // 渲染输入字段
  const renderInput = (
    field: keyof UserFormData,
    label: string,
    type: string = 'text',
    placeholder?: string,
    required: boolean = false
  ) => {
    const error = localErrors[field] || errors[field];
    return (
      <div className="mb-4">
        <label htmlFor={field} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          id={field}
          type={type}
          value={formData[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          placeholder={placeholder}
          className={`form-input ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          required={required}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

  // 渲染选择字段
  const renderSelect = (
    field: keyof UserFormData,
    label: string,
    options: { value: string; label: string }[],
    required: boolean = false
  ) => {
    const error = localErrors[field] || errors[field];
    return (
      <div className="mb-4">
        <label htmlFor={field} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          id={field}
          value={formData[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className={`form-input ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          required={required}
        >
          <option value="">请选择...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

  // 渲染文本域
  const renderTextarea = (
    field: keyof UserFormData,
    label: string,
    placeholder?: string,
    required: boolean = false,
    rows: number = 4
  ) => {
    const error = localErrors[field] || errors[field];
    return (
      <div className="mb-4">
        <label htmlFor={field} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          id={field}
          value={formData[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`form-input resize-none ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          required={required}
        />
        <div className="flex justify-between mt-1">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {formData[field].length} 字符
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* 表单导航 */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white overflow-hidden">
        <nav className="nav-tabs-container space-x-1 p-4 scrollbar-hide w-full">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`nav-tab-button flex items-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {section.title}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 表单内容 */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 个人信息 */}
          {activeSection === 'personal' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">个人信息</h3>
              {renderInput('fullName', '姓名', 'text', '请输入您的姓名', true)}
              {renderInput('email', '邮箱', 'email', 'your@email.com', true)}
              {renderInput('phone', '手机号', 'tel', '请输入手机号码')}
              {renderInput('dateOfBirth', '出生日期', 'date')}
              {renderInput('nationality', '国籍', 'text', '请输入国籍', true)}
            </div>
          )}

          {/* 教育背景 */}
          {activeSection === 'education' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">教育背景</h3>
              {renderSelect('currentEducation', '当前教育水平', [
                { value: 'high-school', label: '高中' },
                { value: 'undergraduate', label: '本科' },
                { value: 'graduate', label: '研究生' },
                { value: 'phd', label: '博士' }
              ], true)}
              {renderInput('institution', '就读院校', 'text', '请输入院校名称', true)}
              {renderInput('major', '专业', 'text', '请输入专业名称', true)}
              {renderInput('gpa', 'GPA', 'text', '请输入GPA（0-4.0）')}
              {renderInput('graduationDate', '毕业日期', 'date')}
            </div>
          )}

          {/* 申请信息 */}
          {activeSection === 'application' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">申请信息</h3>
              {renderSelect('targetCountry', '目标国家', [
                { value: 'usa', label: '美国' },
                { value: 'uk', label: '英国' },
                { value: 'canada', label: '加拿大' },
                { value: 'australia', label: '澳大利亚' },
                { value: 'germany', label: '德国' },
                { value: 'france', label: '法国' },
                { value: 'singapore', label: '新加坡' },
                { value: 'other', label: '其他' }
              ], true)}
              {renderInput('targetUniversity', '目标大学', 'text', '请输入目标大学名称', true)}
              {renderInput('targetMajor', '目标专业', 'text', '请输入目标专业', true)}
              {renderInput('applicationDeadline', '申请截止日期', 'date')}
            </div>
          )}

          {/* 个人经历 */}
          {activeSection === 'experience' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">个人经历</h3>
              {renderTextarea('workExperience', '工作经历', '请描述您的工作经历...')}
              {renderTextarea('researchExperience', '研究经历', '请描述您的研究经历...')}
              {renderTextarea('volunteerExperience', '志愿服务经历', '请描述您的志愿服务经历...')}
              {renderTextarea('awards', '获奖情况', '请列出您的获奖情况...')}
            </div>
          )}

          {/* 语言成绩 */}
          {activeSection === 'language' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">语言成绩</h3>
              {renderSelect('englishTest', '英语考试类型', [
                { value: 'toefl', label: 'TOEFL' },
                { value: 'ielts', label: 'IELTS' },
                { value: 'gre', label: 'GRE' },
                { value: 'gmat', label: 'GMAT' },
                { value: 'other', label: '其他' }
              ])}
              {renderInput('englishScore', '英语考试成绩', 'text', '请输入考试成绩')}
              {renderTextarea('otherLanguages', '其他语言能力', '请描述您的其他语言能力...')}
            </div>
          )}

          {/* 个人陈述 */}
          {activeSection === 'statement' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">个人陈述相关</h3>
              {renderTextarea('careerGoals', '职业目标（API: goals）', '请描述您的职业目标和规划...', true, 6)}
              {renderTextarea('whyThisMajor', '选择专业的原因', '请说明为什么选择这个专业...', true, 6)}
              {renderTextarea('whyThisUniversity', '选择大学的原因', '请说明为什么选择这所大学...', true, 6)}
              {renderTextarea('personalChallenges', '个人挑战与成长', '请描述您面临的挑战和成长经历...', false, 6)}
              {renderTextarea('uniqueQualities', '独特品质', '请描述您的独特品质和优势...', false, 6)}
              {renderTextarea('additionalInfo', '其他信息', '请补充其他相关信息...', false, 4)}
            </div>
          )}
        </form>
      </div>

      {/* 提交按钮 */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isGenerating}
          className={`w-full btn-primary ${
            isGenerating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              生成中...
            </div>
          ) : (
            '生成留学文书'
          )}
        </button>
        
        {hasFormErrors(localErrors) && (
          <p className="mt-2 text-sm text-red-600 text-center">
            请检查并修正表单中的错误
          </p>
        )}
      </div>
    </div>
  );
};

export default UserForm;