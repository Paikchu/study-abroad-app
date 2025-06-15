# 开发指南

## 项目结构

```
study-abroad-app/
├── public/                 # 静态资源
│   ├── index.html         # HTML 模板
│   └── manifest.json      # PWA 配置
├── src/                   # 源代码
│   ├── components/        # React 组件
│   │   ├── UserForm.tsx   # 用户表单组件
│   │   └── DocumentPreview.tsx # 文档预览组件
│   ├── services/          # 服务层
│   │   └── api.ts         # API 客户端
│   ├── utils/             # 工具函数
│   │   ├── download.ts    # 下载功能
│   │   └── validation.ts  # 表单验证
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts       # 类型声明
│   ├── App.tsx            # 主应用组件
│   ├── index.tsx          # 应用入口
│   └── index.css          # 全局样式
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.js     # Tailwind CSS 配置
└── postcss.config.js      # PostCSS 配置
```

## 开发环境设置

### 1. 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 2. 安装依赖
```bash
npm install
```

### 3. 环境变量配置
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# API配置
REACT_APP_API_URL=http://localhost:8000/api

# 应用配置
REACT_APP_TITLE=留学文书生成器
REACT_APP_DESCRIPTION=AI驱动的智能留学文书生成工具

# 开发环境配置
REACT_APP_DEV_MODE=true
REACT_APP_MOCK_API=false
```

### 4. 启动开发服务器
```bash
npm start
```

## 可用脚本

### 开发
```bash
npm start          # 启动开发服务器
npm run dev        # 同上（别名）
```

### 构建
```bash
npm run build      # 生产环境构建
npm run build:dev  # 开发环境构建
```

### 测试
```bash
npm test           # 运行测试
npm run test:watch # 监听模式运行测试
npm run test:coverage # 生成测试覆盖率报告
```

### 代码质量
```bash
npm run lint       # ESLint 检查
npm run lint:fix   # 自动修复 ESLint 问题
npm run format     # Prettier 格式化
npm run type-check # TypeScript 类型检查
```

### 分析
```bash
npm run analyze    # 分析打包大小
npm run eject      # 弹出 CRA 配置（不可逆）
```

## 技术栈详解

### 前端框架
- **React 18**: 用户界面库
- **TypeScript**: 类型安全的 JavaScript
- **Create React App**: 项目脚手架

### 样式
- **Tailwind CSS**: 实用优先的 CSS 框架
- **PostCSS**: CSS 后处理器
- **Heroicons**: 图标库

### 状态管理
- **React Hooks**: 内置状态管理
- **Local Storage**: 数据持久化

### 工具库
- **React Markdown**: Markdown 渲染
- **jsPDF**: PDF 生成
- **html2canvas**: HTML 转图片
- **Web Vitals**: 性能监控

## 组件开发指南

### 1. 组件结构
```typescript
import React from 'react';
import { ComponentProps } from '../types';

interface Props {
  // 定义组件属性
}

const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // 组件逻辑
  
  return (
    <div className="component-container">
      {/* 组件内容 */}
    </div>
  );
};

export default ComponentName;
```

### 2. 样式规范
- 使用 Tailwind CSS 类名
- 遵循响应式设计原则
- 保持一致的间距和颜色

```typescript
// 好的实践
<div className="bg-white rounded-lg shadow-md p-6 mb-4">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">
    标题
  </h2>
</div>

// 避免内联样式
<div style={{ backgroundColor: 'white' }}> // ❌
```

### 3. 类型定义
```typescript
// types/index.ts
export interface UserFormData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  // 其他字段...
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## API 集成

### 1. API 客户端
```typescript
// services/api.ts
class ApiClient {
  private baseURL: string;
  
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  }
  
  async generateDocument(data: UserFormData): Promise<ApiResponse<string>> {
    // API 调用逻辑
  }
}
```

### 2. 流式输出处理
```typescript
async streamGeneration(
  data: UserFormData,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  // 流式处理逻辑
}
```

## 状态管理

### 1. 应用状态
```typescript
const [appState, setAppState] = useState<AppState>({
  formData: initialFormData,
  generatedContent: '',
  isGenerating: false,
  errors: {},
});
```

### 2. 本地存储
```typescript
// 保存到本地存储
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('保存到本地存储失败:', error);
  }
};

// 从本地存储读取
const loadFromLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('从本地存储读取失败:', error);
    return null;
  }
};
```

## 表单验证

### 1. 验证规则
```typescript
const validationRules = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || '请输入有效的邮箱地址';
  },
  required: (value: string) => {
    return value.trim() !== '' || '此字段为必填项';
  },
};
```

### 2. 实时验证
```typescript
const handleFieldChange = (field: string, value: string) => {
  // 更新表单数据
  setFormData(prev => ({ ...prev, [field]: value }));
  
  // 实时验证
  const error = validateField(field, value);
  setErrors(prev => ({ ...prev, [field]: error }));
};
```

## 性能优化

### 1. 组件优化
```typescript
// 使用 React.memo 避免不必要的重渲染
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// 使用 useCallback 缓存函数
const handleSubmit = useCallback((data: UserFormData) => {
  // 处理逻辑
}, [dependency]);

// 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 2. 代码分割
```typescript
// 懒加载组件
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// 使用 Suspense
<Suspense fallback={<div>加载中...</div>}>
  <LazyComponent />
</Suspense>
```

## 错误处理

### 1. 错误边界
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>出现了错误</h1>;
    }
    
    return this.props.children;
  }
}
```

### 2. API 错误处理
```typescript
try {
  const response = await apiClient.generateDocument(formData);
  if (response.success) {
    setGeneratedContent(response.data);
  } else {
    setError(response.error || '生成失败');
  }
} catch (error) {
  setError('网络错误，请稍后重试');
  console.error('API 调用失败:', error);
}
```

## 测试

### 1. 单元测试
```typescript
// __tests__/UserForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import UserForm from '../components/UserForm';

test('应该渲染用户表单', () => {
  render(<UserForm onSubmit={jest.fn()} />);
  expect(screen.getByText('个人信息')).toBeInTheDocument();
});

test('应该验证必填字段', () => {
  render(<UserForm onSubmit={jest.fn()} />);
  const submitButton = screen.getByText('生成文书');
  fireEvent.click(submitButton);
  expect(screen.getByText('姓名为必填项')).toBeInTheDocument();
});
```

### 2. 集成测试
```typescript
test('应该完成完整的文书生成流程', async () => {
  // 模拟 API
  jest.spyOn(apiClient, 'generateDocument').mockResolvedValue({
    success: true,
    data: '生成的文书内容'
  });
  
  render(<App />);
  
  // 填写表单
  fireEvent.change(screen.getByLabelText('姓名'), {
    target: { value: '张三' }
  });
  
  // 提交表单
  fireEvent.click(screen.getByText('生成文书'));
  
  // 验证结果
  await waitFor(() => {
    expect(screen.getByText('生成的文书内容')).toBeInTheDocument();
  });
});
```

## 部署

### 1. 构建生产版本
```bash
npm run build
```

### 2. 静态部署
```bash
# 部署到 Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=build

# 部署到 Vercel
npm install -g vercel
vercel --prod
```

### 3. Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 贡献指南

### 1. 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 配置
- 编写有意义的提交信息

### 2. 提交流程
```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发和测试
npm test
npm run lint

# 3. 提交代码
git add .
git commit -m "feat: 添加新功能"

# 4. 推送分支
git push origin feature/new-feature

# 5. 创建 Pull Request
```

### 3. 代码审查
- 确保所有测试通过
- 检查代码质量和性能
- 验证功能完整性
- 更新相关文档

## 常见问题

### Q: 如何添加新的表单字段？
A: 
1. 在 `types/index.ts` 中更新 `UserFormData` 接口
2. 在 `UserForm.tsx` 中添加对应的输入组件
3. 在 `validation.ts` 中添加验证规则
4. 更新初始状态和处理函数

### Q: 如何自定义样式？
A: 
1. 优先使用 Tailwind CSS 类名
2. 在 `tailwind.config.js` 中扩展主题
3. 在 `index.css` 中添加自定义 CSS

### Q: 如何处理大文件下载？
A: 
1. 使用流式下载
2. 显示下载进度
3. 处理下载错误
4. 提供取消下载功能

---

更多问题请查看项目 Issues 或联系开发团队。