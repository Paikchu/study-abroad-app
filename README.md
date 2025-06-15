# 留学文书生成器

一个基于AI的智能留学文书生成工具，帮助用户快速生成个性化的留学申请文书。

## 🌟 功能特性

### 核心功能
- **智能表单填写**: 分步骤引导用户填写个人信息、教育背景、申请信息等
- **实时文书生成**: 支持流式输出，实时显示生成过程
- **多格式下载**: 支持PDF、Word、纯文本格式下载
- **响应式设计**: 适配桌面端和移动端设备
- **数据持久化**: 自动保存表单数据到本地存储

### 技术特性
- **现代化UI**: 使用Tailwind CSS构建美观的用户界面
- **类型安全**: 完整的TypeScript类型定义
- **组件化架构**: 可维护的React组件设计
- **流式API**: 支持Server-Sent Events (SSE)流式数据传输
- **错误处理**: 完善的错误处理和用户反馈机制

## 🛠️ 技术栈

### 前端技术
- **React 18**: 现代化的React框架
- **TypeScript**: 类型安全的JavaScript超集
- **Tailwind CSS**: 实用优先的CSS框架
- **Heroicons**: 精美的SVG图标库
- **React Markdown**: Markdown内容渲染

### 工具库
- **jsPDF**: PDF文档生成
- **html2canvas**: HTML转图片
- **Web Vitals**: 性能监控

### 开发工具
- **Create React App**: 项目脚手架
- **PostCSS**: CSS后处理器
- **ESLint**: 代码质量检查

## 📦 安装和运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
# 使用npm
npm install

# 或使用yarn
yarn install
```

### 开发环境运行
```bash
# 启动开发服务器
npm start

# 应用将在 http://localhost:3000 打开
```

### 生产环境构建
```bash
# 构建生产版本
npm run build

# 构建文件将输出到 build/ 目录
```

### 运行测试
```bash
# 运行测试套件
npm test
```

## 🔧 配置说明

### 环境变量
创建 `.env` 文件并配置以下变量：

```env
# API服务器地址
REACT_APP_API_URL=http://localhost:8000/api

# 应用标题
REACT_APP_TITLE=留学文书生成器

# 启用性能监控
REACT_APP_ENABLE_ANALYTICS=false
```

### API接口配置
应用需要对接后端API服务，主要接口包括：

- `POST /api/generate/stream` - 流式生成文书
- `POST /api/validate` - 验证表单数据
- `GET /api/document-types` - 获取支持的文档类型
- `POST /api/documents` - 保存生成的文档

## 📱 使用指南

### 基本使用流程

1. **填写个人信息**
   - 在左侧表单中填写基本个人信息
   - 包括姓名、邮箱、电话等必填项

2. **完善教育背景**
   - 填写当前教育水平、就读院校、专业等
   - 可选填写GPA和毕业日期

3. **设置申请信息**
   - 选择目标国家和大学
   - 填写目标专业和申请截止日期

4. **描述个人经历**
   - 详细描述工作经历、研究经历
   - 填写志愿服务和获奖情况

5. **语言成绩信息**
   - 选择英语考试类型和成绩
   - 描述其他语言能力

6. **个人陈述要点**
   - 描述职业目标和规划
   - 说明选择专业和大学的原因
   - 分享个人挑战和独特品质

7. **生成和下载**
   - 点击"生成留学文书"按钮
   - 实时查看生成过程
   - 选择格式下载文档

### 高级功能

#### 表单验证
- 实时验证必填字段
- 格式检查（邮箱、电话、GPA等）
- 字符长度限制提示

#### 数据管理
- 自动保存表单数据到本地
- 支持清空表单重新开始
- 重新生成文书功能

#### 文档预览
- 支持Markdown格式渲染
- 源码模式查看原始内容
- 复制内容到剪贴板
- 实时字符和词数统计

## 🎨 界面设计

### 设计原则
- **简洁明了**: 清晰的信息层次和导航结构
- **用户友好**: 直观的操作流程和及时的反馈
- **响应式**: 适配不同屏幕尺寸的设备
- **无障碍**: 支持键盘导航和屏幕阅读器

### 色彩方案
- **主色调**: 蓝色系 (#3b82f6) - 专业、可信赖
- **辅助色**: 灰色系 - 中性、平衡
- **状态色**: 绿色(成功)、红色(错误)、黄色(警告)

### 布局结构
- **双栏布局**: 左侧表单，右侧预览
- **分步导航**: 标签式导航切换表单部分
- **固定工具栏**: 顶部标题栏和底部操作栏

## 🔌 API集成

### 流式输出实现
应用使用Server-Sent Events (SSE)实现流式输出：

```typescript
// 流式生成示例
const response = await fetch('/api/generate/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ formData, documentType })
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // 处理数据块
}
```

### 错误处理
- 网络连接错误提示
- API响应错误处理
- 用户友好的错误信息显示

## 📊 性能优化

### 代码分割
- 组件懒加载
- 路由级别的代码分割
- 第三方库按需加载

### 缓存策略
- 表单数据本地缓存
- 静态资源缓存
- API响应缓存

### 用户体验优化
- 加载状态指示
- 防抖输入处理
- 平滑滚动和动画

## 🧪 测试

### 测试策略
- 单元测试：组件和工具函数
- 集成测试：API调用和数据流
- E2E测试：完整用户流程

### 运行测试
```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm test -- --coverage

# 监听模式运行测试
npm test -- --watch
```

## 🚀 部署

### 静态部署
```bash
# 构建生产版本
npm run build

# 部署到静态托管服务
# 如：Netlify, Vercel, GitHub Pages
```

### Docker部署
```dockerfile
FROM node:16-alpine as builder
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

## 🤝 贡献指南

### 开发流程
1. Fork项目仓库
2. 创建功能分支
3. 提交代码变更
4. 创建Pull Request

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint配置的代码规范
- 编写清晰的注释和文档
- 保持组件的单一职责原则

### 提交规范
```
type(scope): description

[optional body]

[optional footer]
```

类型包括：
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🆘 支持

如果您遇到问题或有建议，请：

1. 查看 [FAQ](docs/FAQ.md)
2. 搜索 [Issues](../../issues)
3. 创建新的 [Issue](../../issues/new)
4. 联系开发团队

## 🔄 更新日志

### v1.0.0 (2024-01-01)
- ✨ 初始版本发布
- 🎯 基础表单和文书生成功能
- 📱 响应式设计实现
- 🔄 流式输出支持
- 📥 多格式文档下载

---

**感谢使用留学文书生成器！** 🎓✨