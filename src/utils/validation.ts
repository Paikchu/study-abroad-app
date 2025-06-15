import { UserFormData, FormErrors } from '../types';

// 验证邮箱格式
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证手机号格式（支持中国大陆手机号）
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

// 验证日期格式
export const validateDate = (date: string): boolean => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// 验证GPA格式
export const validateGPA = (gpa: string): boolean => {
  if (!gpa) return true; // GPA可以为空
  const gpaNum = parseFloat(gpa);
  return !isNaN(gpaNum) && gpaNum >= 0 && gpaNum <= 4.0;
};

// 验证必填字段
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// 验证字符串长度
export const validateLength = (
  value: string,
  minLength: number = 0,
  maxLength: number = Infinity
): boolean => {
  const length = value.trim().length;
  return length >= minLength && length <= maxLength;
};

// 验证英语考试成绩
export const validateEnglishScore = (test: string, score: string): boolean => {
  if (!score) return true; // 成绩可以为空
  
  const scoreNum = parseInt(score);
  if (isNaN(scoreNum)) return false;
  
  switch (test.toLowerCase()) {
    case 'toefl':
      return scoreNum >= 0 && scoreNum <= 120;
    case 'ielts':
      return scoreNum >= 0 && scoreNum <= 9;
    case 'gre':
      return scoreNum >= 260 && scoreNum <= 340;
    case 'gmat':
      return scoreNum >= 200 && scoreNum <= 800;
    default:
      return true; // 其他考试类型不做限制
  }
};

// 完整表单验证
export const validateForm = (formData: UserFormData): FormErrors => {
  const errors: FormErrors = {};
  
  // 个人信息验证
  if (!validateRequired(formData.fullName)) {
    errors.fullName = '请输入姓名';
  } else if (!validateLength(formData.fullName, 2, 50)) {
    errors.fullName = '姓名长度应在2-50个字符之间';
  }
  
  if (!validateRequired(formData.email)) {
    errors.email = '请输入邮箱地址';
  } else if (!validateEmail(formData.email)) {
    errors.email = '请输入有效的邮箱地址';
  }
  
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = '请输入有效的手机号码';
  }
  
  if (formData.dateOfBirth && !validateDate(formData.dateOfBirth)) {
    errors.dateOfBirth = '请输入有效的出生日期';
  }
  
  if (!validateRequired(formData.nationality)) {
    errors.nationality = '请输入国籍';
  }
  
  // 教育背景验证
  if (!validateRequired(formData.currentEducation)) {
    errors.currentEducation = '请选择当前教育水平';
  }
  
  if (!validateRequired(formData.institution)) {
    errors.institution = '请输入就读院校';
  }
  
  if (!validateRequired(formData.major)) {
    errors.major = '请输入专业';
  }
  
  if (formData.gpa && !validateGPA(formData.gpa)) {
    errors.gpa = '请输入有效的GPA（0-4.0）';
  }
  
  if (formData.graduationDate && !validateDate(formData.graduationDate)) {
    errors.graduationDate = '请输入有效的毕业日期';
  }
  
  // 申请信息验证
  if (!validateRequired(formData.targetCountry)) {
    errors.targetCountry = '请选择目标国家';
  }
  
  if (!validateRequired(formData.targetUniversity)) {
    errors.targetUniversity = '请输入目标大学';
  }
  
  if (!validateRequired(formData.targetMajor)) {
    errors.targetMajor = '请输入目标专业';
  }
  
  if (formData.applicationDeadline && !validateDate(formData.applicationDeadline)) {
    errors.applicationDeadline = '请输入有效的申请截止日期';
  }
  
  // 语言成绩验证
  if (formData.englishTest && formData.englishScore) {
    if (!validateEnglishScore(formData.englishTest, formData.englishScore)) {
      errors.englishScore = '请输入有效的考试成绩';
    }
  }
  
  // 个人陈述相关验证
  if (!validateRequired(formData.careerGoals)) {
    errors.careerGoals = '请描述您的职业目标';
  } else if (!validateLength(formData.careerGoals, 50, 1000)) {
    errors.careerGoals = '职业目标描述应在50-1000个字符之间';
  }
  
  if (!validateRequired(formData.whyThisMajor)) {
    errors.whyThisMajor = '请说明选择该专业的原因';
  } else if (!validateLength(formData.whyThisMajor, 50, 1000)) {
    errors.whyThisMajor = '专业选择原因应在50-1000个字符之间';
  }
  
  if (!validateRequired(formData.whyThisUniversity)) {
    errors.whyThisUniversity = '请说明选择该大学的原因';
  } else if (!validateLength(formData.whyThisUniversity, 50, 1000)) {
    errors.whyThisUniversity = '大学选择原因应在50-1000个字符之间';
  }
  
  if (formData.personalChallenges && !validateLength(formData.personalChallenges, 0, 1000)) {
    errors.personalChallenges = '个人挑战描述不应超过1000个字符';
  }
  
  if (formData.uniqueQualities && !validateLength(formData.uniqueQualities, 0, 1000)) {
    errors.uniqueQualities = '独特品质描述不应超过1000个字符';
  }
  
  return errors;
};

// 检查表单是否有错误
export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// 获取错误信息数组
export const getErrorMessages = (errors: FormErrors): string[] => {
  return Object.values(errors);
};

// 验证单个字段
export const validateField = (
  fieldName: keyof UserFormData,
  value: string,
  formData?: UserFormData
): string | null => {
  const errors = validateForm({ ...formData, [fieldName]: value } as UserFormData);
  return errors[fieldName] || null;
};

// 实时验证配置
export const getValidationConfig = () => {
  return {
    // 需要实时验证的字段
    realTimeFields: [
      'email',
      'phone',
      'gpa',
      'englishScore'
    ],
    // 需要在失去焦点时验证的字段
    blurValidationFields: [
      'fullName',
      'careerGoals',
      'whyThisMajor',
      'whyThisUniversity'
    ],
    // 提交时必须验证的字段
    submitValidationFields: [
      'fullName',
      'email',
      'nationality',
      'currentEducation',
      'institution',
      'major',
      'targetCountry',
      'targetUniversity',
      'targetMajor',
      'careerGoals',
      'whyThisMajor',
      'whyThisUniversity'
    ]
  };
};