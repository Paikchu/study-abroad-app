# 安装指南

## 前置要求

在运行此项目之前，您需要安装以下软件：

### 1. 安装 Node.js 和 npm

#### 方法一：使用官方安装包（推荐）
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本（推荐版本 18.x 或更高）
3. 运行安装包并按照提示完成安装
4. 验证安装：
   ```bash
   node --version
   npm --version
   ```

#### 方法二：使用 Homebrew（macOS）
```bash
# 安装 Homebrew（如果尚未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node

# 验证安装
node --version
npm --version
```

#### 方法三：使用 nvm（Node Version Manager）
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重启终端或运行
source ~/.bashrc

# 安装最新的 LTS 版本
nvm install --lts
nvm use --lts

# 验证安装
node --version
npm --version
```

## 项目安装步骤

### 1. 克隆或下载项目
```bash
# 如果使用 Git
git clone <repository-url>
cd study-abroad-app

# 或者直接在项目目录中
cd /Users/max/Developer/study-abroad-app
```

### 2. 安装项目依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量文件
nano .env
# 或使用其他编辑器
code .env
```

### 4. 启动开发服务器
```bash
npm start
```

应用将在 http://localhost:3000 打开。

## 常见问题解决

### 问题1：npm 命令未找到
**解决方案**：确保已正确安装 Node.js，并且 npm 在系统 PATH 中。

### 问题2：权限错误
**解决方案**：
```bash
# 配置 npm 全局包安装目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# 添加到 PATH（添加到 ~/.bashrc 或 ~/.zshrc）
export PATH=~/.npm-global/bin:$PATH
```

### 问题3：依赖安装失败
**解决方案**：
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题4：端口被占用
**解决方案**：
```bash
# 查找占用端口的进程
lsof -ti:3000

# 终止进程
kill -9 <PID>

# 或使用不同端口启动
PORT=3001 npm start
```

## 验证安装

安装完成后，您应该能够：

1. ✅ 访问 http://localhost:3000
2. ✅ 看到留学文书生成器界面
3. ✅ 填写表单字段
4. ✅ 查看实时验证反馈

## 下一步

1. 阅读 [README.md](README.md) 了解项目详情
2. 查看 [使用指南](#使用指南) 学习如何使用
3. 配置后端API服务（如果需要）

## 技术支持

如果遇到安装问题，请：

1. 检查 Node.js 版本是否 >= 16.0.0
2. 确保网络连接正常
3. 查看错误日志获取详细信息
4. 搜索相关错误信息的解决方案

---

**注意**：此项目需要现代浏览器支持，推荐使用 Chrome、Firefox、Safari 或 Edge 的最新版本。