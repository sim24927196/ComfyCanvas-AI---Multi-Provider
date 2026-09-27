# 模块交接与架构说明文档 (HANDOVER.md)

## 核心架构原则

1. **绝对禁止静默兜底与黑盒虚假成功**：
   - 当 API 请求、模型抽取或服务商接口执行失败时，系统**必须**立即透明透传上游返回的真实错误信息与 HTTP 状态码，禁止硬编码默认提示词、禁止隐蔽容灾降级。
2. ** Civitai 原生 URN 解析与逆向工作流**：
   - 支持从 Civitai 网页 `__NEXT_DATA__` 解析核心 `genData` 与 `imgGet`，提取底模、LoRA 列表、Sampler、Scheduler、CFG、Seed 及 Prompt。
   - 对 Krea 2、FLUX.1、Pony、SDXL 等全量架构进行精准 URN 归一化。
3. **前端点击导向与真实 UI 验证**：
   - 资产管理与历史记录删除操作均具有直接冒泡拦截 (`e.stopPropagation`) 与乐观 UI 状态更新。

---
*更新时间：2026-09-26*
