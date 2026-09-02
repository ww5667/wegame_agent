# WeGame Agent Demo

> 理解玩家当前游戏状态的全旅程 AI 游戏助手概念 Demo。

[在线体验 WeGame Agent Demo](https://ww5667.github.io/wegame_agent/)

> 本项目为产品概念验证与交互原型，并非腾讯或 WeGame 官方产品。

## 作品介绍

WeGame Agent 希望把传统的“游戏启动器”升级为理解玩家完整游戏旅程的智能助手。Agent 共享同一份玩家上下文，在游戏前、游戏中和游戏后分别提供三类能力：

```text
玩家行为、游戏事件、好友状态、历史偏好
                    │
                    ↓
              玩家状态理解
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
       找           玩           社
   推荐玩什么    告诉你怎么做    帮你找到人
```

## 核心体验

- **找游戏**：结合空闲时间、游戏偏好、疲劳度和在线好友推荐合适的游戏。
- **陪你玩**：通过模拟游戏事件理解当前对局状态，只在关键决策窗口主动提醒。
- **赛后复盘**：总结本局有效调整和下一局最值得关注的改进点。
- **找队友**：根据位置、沟通习惯、游戏风格和活跃时间推荐合适队友。
- **自由追问**：玩家可以围绕当前状态继续询问 Agent；当前未配置 API Key，默认触发未接入模型的兜底提示。
- **AI 调试台**：展示 Context、Prompt、RAG 检索结果、工具链路和 Harness 状态。
- **安全降级**：默认展示模型未接入状态，也可以模拟模型超时和知识不足，观察规则兜底与防编造机制。

## 推荐演示流程

1. 打开[在线 Demo](https://ww5667.github.io/wegame_agent/)。
2. 点击底部的“自动演示”，观看“找游戏 → 对局辅助 → 赛后复盘 → 找队友”的完整流程。
3. 在关键建议出现后点击“为什么？”，查看 Agent 的解释。
4. 打开“AI 调试台”，切换“模型未接入 / 本地模拟 / 模拟超时 / 知识不足”。
5. 在右侧输入框中向 Agent 追问；默认返回“暂未接入大模型，请稍后再试”。

## Agent 设计

```text
游戏事件 / 玩家画像 / 用户输入
              │
              ↓
        Context Builder
              │
              ↓
          Scene Router
        找 / 玩 / 社场景路由
              │
              ↓
       Knowledge Retrieval
              │
              ↓
           LLM Agent
      理解意图、判断、生成计划
              │
              ↓
      Harness 校验与工具执行
              │
              ↓
建议卡片 / 主动提醒 / 队友匹配
```

当前 Demo 使用本地模拟数据和确定性 Agent 逻辑，重点展示产品交互与 Harness 链路，尚未接入真实游戏数据和在线大模型 API。

## 技术实现

- React 19 + TypeScript
- Vite 8
- Tailwind CSS
- Lucide 图标
- 本地事件状态机
- 响应式桌面端界面
- GitHub Actions + GitHub Pages 自动部署

## 在线部署

项目通过 `.github/workflows/deploy-pages.yml` 接入 GitHub Pages。每次向 `main` 分支推送代码后，GitHub Actions 会自动完成依赖安装、静态构建和线上发布。

线上地址：<https://ww5667.github.io/wegame_agent/>

## 本地运行

环境要求：Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

打开 `http://localhost:3000` 即可体验。

生产构建：

```bash
npm run build
```

## 项目结构

```text
src/
├── App.tsx        # Demo 场景、状态机和主要交互
├── index.css      # 视觉主题和响应式样式
└── main.tsx       # Vite 应用入口

.github/workflows/ # GitHub Pages 自动部署
index.html         # 静态页面入口
vite.config.ts     # Vite 与仓库子路径配置
```

## 当前边界

- 游戏对局、游戏目录和队友资料均为演示数据。
- “邀请组队”只模拟交互反馈，不会真实发送邀请。
- Agent 的 Prompt、RAG 和工具调用以可解释原型形式呈现。
- 后续可接入真实游戏事件适配器、大模型 API、攻略知识库和社交关系数据。
