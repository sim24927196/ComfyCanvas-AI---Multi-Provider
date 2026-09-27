# ComfyUI Web Studio (AI 节点式工作流生成平台)

基于 React 18 + TypeScript + Tailwind CSS 构建的下一代 Web 版 ComfyUI 节点式 AI 图像/视频/推理生成工作流平台。支持专业级可视化节点连线、ComfyUI 原生拓扑调度、多渠道后端统一引擎壳（Google Imagen 3、Fal.ai FLUX/SDXL、Agnes AI 极速生图、SenseNova 商汤日日新深度思考、Wan 2.1 电影级视频、Civitai 权重、ModelScope、Hugging Face、NanoGPT）以及丰富的社区经典预设工作流一键载入与全透明执行。

---

## 🌟 核心特性

- 🎨 **专业级可视化节点画布 (Graph Canvas)**
  - 无限平移缩放、网格吸附、多节点框选、拓扑自动重排
  - 贝塞尔曲线连接端口（支持 `MODEL`、`CLIP`、`LATENT`、`IMAGE`、`CONDITIONING`、`STRING` 等强类型安全检测）
  - 节点折叠、跳过 (Bypass)、克隆、快速重命名、动态进度条与实时状态光晕
- 🧠 **前置 AI 深度思考推理节点 (LLM Reasoning Node)**
  - 首创第一类画布推理节点，接入 **商汤日日新 (SenseNova DeepSeek V4 / GLM-5.2)** 与 **Agnes 3.0 Flash** 顶级大模型
  - 支持 **思维链 (CoT) 构图推演**、**专业摄影构思**、**产品渲染扩展**、**二次元风格增强** 等多维推演
  - 既可独立点击单节点推理，也可作为工作流前置管道，自动推演精炼提示词并动态注向下游
- 🖼️ **纯正 ComfyUI 图像/潜空间拓扑生态 (Img2Img & Latent)**
  - `CheckpointLoaderSimple` (底模加载与族系适配)
  - `LoRALoader` (LoRA 加载、权重调节与触发词注入)
  - `CLIPTextEncode` / `CLIPTextEncodeNegative` (正向/负向提示词文本编码)
  - `EmptyLatentImage` (分辨率与 Batch 尺寸定义)
  - `LoadImage` + `VAEEncode` + `VAEDecode` (工业级图像转潜空间编码、潜空间解码与全链路图生图溯源)
  - `KSampler` (步数、CFG、采样器、调度器、种子与去噪强度 `denoise` 控制)
  - `AIVideoNode` + 专有 `VideoDriver` (Wan 2.1 电影级文生视频与图生视频管线)
  - `SaveImage` / `PreviewImage` (高清无损预览、原图对比与一键导出)
- ⚡ **模块化统一引擎壳架构 (Central Engine Registry & Drivers)**
  - 基于面向对象设计原则 (Template Method 模式)，构建 `BaseEngineDriver` 统一标准
  - 插件化接入 8 大核心驱动：
    - ⚡ **Fal.ai Driver**: FLUX.1 (Dev / Schnell / Pro)、SDXL 1.0、原生 LoRA 挂载
    - 🚀 **Agnes AI Driver**: 秒级极速生图 (`agnes-image-2.5-flash`) 与文本推理 (`agnes-3.0-flash`)
    - 🧠 **SenseNova Driver**: 商汤百万长上下文深度推理 (`deepseek-v4-flash`, `glm-5.2`)
    - 🎬 **Video Driver**: Wan 2.1 文生视频 / 首帧图生视频专用通道
    - 🔮 **Google Gemini / Imagen Driver**: Imagen 3 真实感大作
    - 🟣 **ModelScope Driver**: 阿里魔搭社区开源模型
    - 🤗 **Hugging Face Driver**: Serverless 扩散模型管线
    - 🟢 **NanoGPT Driver**: 轻量化高性价比接口
- 🛡️ **严格意图遵从与反黑盒透明准则 (Anti-Black-Box Transparency Rule)**
  - **严禁后台暗中剥离 LoRA**：绝不在服务端偷偷丢弃用户挂载的 LoRA 来伪造“生成成功”
  - **严禁静默更换端点与模型**：绝不在用户不知情的情况下随意偷换请求路径
  - **全链路端点可审计返回**：每一次生成强制透传 `exactEndpointCalled`、`requestedModel`、`wasAdapted`、`adaptationNotice`
  - **架构不兼容显式透明指引**：如遇到 Krea 2 Turbo 等闭源模型（原生不支持 safetensors 外挂 LoRA，相关 LoRA 基于 SDXL 训练），导入与界面均明确给出 `architectureExplanation`，并提供 **【一键切换兼容底模 (SDXL 1.0)】** 选项，控制权 100% 归还用户
- 📚 **全生态 LoRA & 微调模型中心 (Universal LoRA Hub)**
  - 聚合 Civitai、Hugging Face、ModelScope、Fal.ai 全网热门风格微调模型
  - **一键选用 LoRA 并自动配对底模 (Auto-Pairing)**：智能感知 LoRA 架构，自动同步画布底模与采样器黄金参数
- 📥 **Civitai 真实 API 一键逆向提取工作流**
  - 支持直接粘贴 Civitai 网址、图片链接或生成参数文本
  - 自动调用官方 API 解析底模、Trigger Words、LoRA 权重与采样参数，智能生成并连线完整工作流

---

## 🚀 快速启动

### 1. 环境准备
本项目基于 Node.js 18+ 环境构建。

### 2. 安装依赖
```bash
npm install
```

### 3. 启动全栈开发服务器
```bash
npm run dev
```
开发服务器将默认运行在 `http://localhost:3000`。
前台为 Vite 驱动的 React SPA，后台由 `server.ts` 提供统一引擎代理、Civitai API 解析与端点审计服务。

### 4. 生产构建与代码检查
```bash
# 验证 TypeScript 类型与语法规范
npm run lint

# 生产环境打包构建
npm run build
```

---

## 🛠️ 项目目录结构

```
├── README.md                      # 项目主说明与功能全景
├── HANDOVER.md                    # 核心交接指南、数据流与维护准则
├── UNRESOLVED_ISSUES.md           # 技术审计报告、攻坚历程与待办规划
├── ENGINE_LORA_SPECIFICATION.md   # 各引擎 LoRA 原生形状规范与反黑盒准则
├── server.ts                      # 全栈后端代理服务 (Fal, Agnes, SenseNova, Gemini, Civitai)
├── package.json                   # 项目依赖与启动脚本
├── vite.config.ts                 # Vite 配置文件
├── src/
│   ├── App.tsx                    # 主视图编排、全局状态、快捷工具栏与历史抽屉
│   ├── index.css                  # 全局样式与 Tailwind 指令
│   ├── components/                # 业务 UI 组件
│   │   ├── Canvas.tsx             # 节点画布缩放、平移与连线渲染
│   │   ├── NodeItem.tsx           # 单个节点渲染 (KSampler, LoRA, VAE, LLM 推理等)
│   │   ├── ModelHubModal.tsx      # 全生态 LoRA 模型中心 (支持一键配对底模)
│   │   ├── WorkflowPresetsModal.tsx # 官方预设与 Civitai 逆向一键生成工作流弹窗
│   │   ├── ParameterInspector.tsx # 右侧属性检查器与架构兼容性检测面板
│   │   └── ResultGalleryModal.tsx # 生成结果大图画廊与参数回溯面板
│   ├── constants/
│   │   ├── nodes.ts               # 节点定义字典 (LLMReasoning, VAEEncode, KSampler, etc.)
│   │   └── presets.ts             # 官方顶流预设工作流 (涵盖生图、推理、视频)
│   ├── engines/                   # 模块化统一引擎核心 (Shell & Registry Pattern)
│   │   ├── types.ts               # 引擎接口定义、归一化入参与出参规范
│   │   ├── BaseEngineDriver.ts    # 抽象引擎基类，实现能力校验与生命周期拦截
│   │   ├── EngineRegistry.ts      # 引擎注册管理中心，统一调度入口
│   │   └── drivers/               # 各服务商独立驱动实现
│   │       ├── AgnesDriver.ts     # Agnes AI 极速生图与对话驱动
│   │       ├── SenseNovaDriver.ts # 商汤日日新思维链推理驱动
│   │       ├── VideoDriver.ts     # Wan 2.1 电影级文生/图生视频驱动
│   │       ├── FalDriver.ts       # Fal.ai FLUX / SDXL 官方驱动
│   │       ├── GeminiDriver.ts    # Google Imagen 3 / Gemini 驱动
│   │       ├── ModelScopeDriver.ts# 阿里魔搭开源模型驱动
│   │       ├── HuggingFaceDriver.ts # HF Serverless 推理驱动
│   │       └── NanoGPTDriver.ts   # NanoGPT 按量极速驱动
│   ├── types/
│   │   └── graph.ts               # 核心拓扑数据结构 (NodeInstance, Connection, etc.)
│   └── utils/
│       ├── graphEngine.ts         # ComfyUI 图执行引擎、参数提取、Img2Img/Video溯源
│       ├── baseModelMatcher.ts    # 底模架构与 LoRA 兼容性匹配引擎
│       └── formatters.ts          # 格式化与高精度换算工具函数
```

---

## 🔑 环境变量与 API 鉴权说明

在 `.env` 或运行时环境变量中配置以下密钥，后端将自动载入并代理转发：

| 环境变量名 | 说明 | 对应服务商与核心能力 |
|---|---|---|
| `AGNES_API_KEY` | Agnes AI 访问密钥 | 极速生图 (`agnes-image-2.5-flash`)、LLM 对话 (`agnes-3.0-flash`) |
| `SENSENOVA_API_KEY` | 商汤日日新 API Token | 深度思考推理大模型 (`deepseek-v4-flash`, `glm-5.2`) |
| `FAL_KEY` | Fal.ai 访问密钥 | FLUX.1 [dev/schnell]、SDXL 1.0、Wan 2.1 视频 |
| `GEMINI_API_KEY` | Google AI Studio 密钥 | Google Imagen 3 原生真实感生图 |
| `CIVITAI_API_TOKEN` | Civitai 访问令牌 | C 站受保护模型权重高速下载与元数据解析 |
| `MODELSCOPE_API_KEY`| 阿里魔搭 Token | ModelScope 开源模型推理通道 |

> 💡 **提示**：系统在主界面右上角「设置」面板和各个节点属性面板中，均支持临时配置个人 API Key，无需重启服务即可立即生效。

---

## 📋 开发者规范与质量保障

- **类型安全**：严格使用 TypeScript，杜绝 `any` 滥用。
- **构建健康**：提交前必须通过 `npm run lint` 与 `npm run build`。
- **透明审计**：严禁编写任何静默兜底、私自剥离 LoRA 或假图欺瞒代码，所有调用必须在控制台与界面给出明确的端点审计回显。
