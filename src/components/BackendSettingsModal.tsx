import React from 'react';
import { ExternalLink, Key, CheckCircle2, XCircle, Loader2, Sparkles, ShieldCheck, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { ApiKeysState, ProviderConfig, ProviderId } from '../types/providers';
import { testProviderConnection, DEFAULT_TEST_KEYS } from '../services/api';

interface BackendSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKeysState;
  onSaveKeys: (newKeys: ApiKeysState) => void;
}

export const BackendSettingsModal: React.FC<BackendSettingsModalProps> = ({
  isOpen,
  onClose,
  apiKeys,
  onSaveKeys,
}) => {
  const [keys, setKeys] = React.useState<ApiKeysState>(apiKeys);
  const [testResults, setTestResults] = React.useState<Record<string, { status: string; message: string; latency?: number }>>({});
  const [testingProvider, setTestingProvider] = React.useState<string | null>(null);
  const [testingAll, setTestingAll] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<ProviderId>('fal');

  React.useEffect(() => {
    setKeys(apiKeys);
  }, [apiKeys, isOpen]);

  if (!isOpen) return null;

  const providers: ProviderConfig[] = [
    {
      id: 'fal',
      name: 'Fal.ai',
      badge: 'FLUX & SDXL 极速云',
      docsUrl: 'https://docs.fal.ai',
      description: '极速无服务器 (Serverless) 推理平台，支持 FLUX.1 dev/schnell 和 SDXL 以及多 LoRA 栈式加载。',
      apiUrl: 'https://fal.run',
      keyName: 'falKey',
      keyPlaceholder: 'fal_key_xxxxxxxxxxxxxxxxxxxxxxxx',
      status: 'unconfigured',
      popularModels: ['fal-ai/flux/dev', 'fal-ai/flux/schnell', 'fal-ai/fast-sdxl', 'fal-ai/flux-lora'],
    },
    {
      id: 'agnes',
      name: 'Agnes AI (ApiHub)',
      badge: '聚合引擎 / 2.5 Flash / 3.0 推理',
      docsUrl: 'https://apihub.agnes-ai.com',
      description: 'Agnes AI 官方高并发聚合接口，提供秒级 Flash 生图、动态运镜视频及 3.0 Flash 深度思考推理大模型。',
      apiUrl: 'https://apihub.agnes-ai.com/v1',
      keyName: 'agnesKey',
      keyPlaceholder: 'sk-l8Uv51aVIMDhKs6w9Ju6EVZnj2ryBfvaVWZlCAr1iEpgPv6L',
      status: 'unconfigured',
      popularModels: ['agnes-image-2.5-flash', 'agnes-image-2.1-flash', 'agnes-video-2.5-flash', 'agnes-3.0-flash'],
    },
    {
      id: 'sensenova',
      name: 'SenseNova (商汤日日新)',
      badge: '商汤科技 / DeepSeek V4 / GLM-5.2',
      docsUrl: 'https://token.sensenova.cn',
      description: '商汤日日新大模型开放平台，集成 DeepSeek V4 极速推理思考、清华智谱 GLM-5.2、SenseNova 6.8 及多模态视觉理解。',
      apiUrl: 'https://token.sensenova.cn/v1',
      keyName: 'sensenovaKey',
      keyPlaceholder: 'sk-GcynheMjRQuZTvUd1V9KpJ4OKKx6vao5',
      status: 'unconfigured',
      popularModels: ['deepseek-v4-flash', 'deepseek-v4-pro', 'glm-5.2', 'sensenova-6.8-flash-lite'],
    },
    {
      id: 'civitai',
      name: 'Civitai API',
      badge: 'C站 LoRA 与底模库',
      docsUrl: 'https://developer.civitai.com',
      description: '直连 Civitai.com 官方开放接口，检索与下载社区数以万计的真实 LoRA、触发词与 Checkpoints。',
      apiUrl: 'https://civitai.com/api/v1',
      keyName: 'civitaiKey',
      keyPlaceholder: 'Civitai 个人 API Key (检索公开模型可免填)',
      status: 'unconfigured',
      popularModels: ['10,000+ SDXL LoRAs', 'FLUX LoRAs', '二次元与写实人物 LoRA'],
    },
    {
      id: 'huggingface',
      name: 'Hugging Face',
      badge: '抱脸开源大模型社区',
      docsUrl: 'https://huggingface.co/docs',
      description: 'Hugging Face 官方推理接口与模型 Hub，覆盖全量开源 Diffusers、SafeTensors 与 PEFT LoRA。',
      apiUrl: 'https://api-inference.huggingface.co',
      keyName: 'hfToken',
      keyPlaceholder: 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      status: 'unconfigured',
      popularModels: ['black-forest-labs/FLUX.1-schnell', 'stabilityai/stable-diffusion-xl-base-1.0'],
    },
    {
      id: 'modelscope',
      name: 'ModelScope CN (魔搭社区国内站)',
      badge: '国内站 / 消耗国内魔粒',
      docsUrl: 'https://modelscope.cn/docs',
      description: '魔搭社区国内站 (modelscope.cn) 官方推理接口，消耗国内魔粒额度，支持 Wan 2.1、Z-Image-Turbo 及国内全量微调 LoRA。',
      apiUrl: 'https://api-inference.modelscope.cn/v1',
      keyName: 'modelscopeToken',
      keyPlaceholder: '国内站 Access Token (ms-xxxxxxxx，从 modelscope.cn 获取)',
      status: 'unconfigured',
      popularModels: ['Tongyi-MAI/Z-Image-Turbo', 'damo/wan2.1-t2i', 'laonansheng Z-Image LoRA'],
    },
    {
      id: 'modelscope_ai',
      name: 'ModelScope AI (魔搭国际站)',
      badge: '国际站 / 消耗国际魔粒',
      docsUrl: 'https://modelscope.ai/docs',
      description: '魔搭社区国际站 (modelscope.ai) 官方推理接口，需绑定阿里云账号激活，消耗国际站魔粒。',
      apiUrl: 'https://api-inference.modelscope.ai/v1',
      keyName: 'modelscopeAiToken',
      keyPlaceholder: '国际站 Access Token (ms-xxxxxxxx，从 modelscope.ai 获取)',
      status: 'unconfigured',
      popularModels: ['Tongyi-MAI/Z-Image-Turbo', 'damo/wan2.1-t2i', 'AI-ModelScope/flux.1-dev'],
    },
    {
      id: 'nanogpt',
      name: 'NanoGPT',
      badge: '按张计费极速 API',
      docsUrl: 'https://docs.nano-gpt.com',
      description: 'NanoGPT.com 图像生成接口，提供超低延迟单次生图，无需维护 GPU 服务器。',
      apiUrl: 'https://nano-gpt.com/api',
      keyName: 'nanogptKey',
      keyPlaceholder: 'NanoGPT API Key (sk-nano-xxxxxxxx)',
      status: 'unconfigured',
      popularModels: ['flux-schnell', 'flux-dev', 'sdxl-turbo', 'midjourney-v6'],
    },
    {
      id: 'tensorart',
      name: 'Tensor.Art / TusiArt',
      badge: '吐司 AI 模型中心',
      docsUrl: 'https://tensor.art',
      description: 'Tensor.Art / 吐司 AI 模型社区，集成 FLUX.1、SDXL、Pony、Illustrious、Wan 2.1 等海量真实开源模型与微调 LoRA。',
      apiUrl: 'https://openapi.tensor.art/openworks/v1 (或 openapi.tusiart.cn)',
      keyName: 'tensorartKey',
      keyPlaceholder: 'Tensor.Art / 吐司 API Key (ak_tensor_... / ak_tusi_...)',
      status: 'unconfigured',
      popularModels: ['FLUX.1 [dev]', 'SDXL 1.0 Base', 'Pony Diffusion V6 XL', 'Illustrious-XL', 'Wan 2.1 Cinematic Video'],
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      badge: '内置官方 Imagen 3 引擎',
      docsUrl: 'https://ai.google.dev',
      description: 'Google 官方 Imagen 3 超高清生图引擎与 Gemini 3.8 Flash 提示词/参数重绘器，免配可用。',
      apiUrl: 'Google GenAI SDK (Imagen 3 / Gemini 3.8 Flash)',
      keyName: 'geminiKey',
      keyPlaceholder: '系统自动注入环境变量 GEMINI_API_KEY',
      status: 'connected',
      popularModels: ['imagen-3.0-generate-002', 'gemini-3.8-flash'],
    },
  ];

  const handleTest = async (providerId: ProviderId) => {
    setTestingProvider(providerId);
    const key = (keys as any)[providers.find((p) => p.id === providerId)?.keyName || ''];
    try {
      const res = await testProviderConnection(providerId, key);
      setTestResults((prev) => ({
        ...prev,
        [providerId]: {
          status: res.status,
          message: res.message || (res.status === 'ok' ? '连接成功' : '连接失败'),
          latency: res.latency,
        },
      }));
    } catch (e: any) {
      setTestResults((prev) => ({
        ...prev,
        [providerId]: {
          status: 'error',
          message: e.message || '网络连接异常',
        },
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const handleTestAll = async () => {
    setTestingAll(true);
    for (const p of providers) {
      const key = (keys as any)[p.keyName] || '';
      try {
        const res = await testProviderConnection(p.id, key);
        setTestResults((prev) => ({
          ...prev,
          [p.id]: {
            status: res.status,
            message: res.message || (res.status === 'ok' ? '连接成功' : '连接失败'),
            latency: res.latency,
          },
        }));
      } catch (err: any) {
        setTestResults((prev) => ({
          ...prev,
          [p.id]: {
            status: 'error',
            message: err.message || '测试失败',
          },
        }));
      }
    }
    setTestingAll(false);
  };

  const handleFillTestKeys = () => {
    const updated = {
      ...keys,
      ...DEFAULT_TEST_KEYS,
    };
    setKeys(updated);
  };

  const handleSave = () => {
    onSaveKeys(keys);
    onClose();
  };

  const currentProvider = providers.find((p) => p.id === activeTab) || providers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#1b1c22] border border-[#2e303c] rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2c38] bg-[#14151a]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-bold shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                后台模型与云端 API 接入管理
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  多引擎即插即用
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                管理 Civitai、Fal.ai、Hugging Face、魔搭社区 (ModelScope)、NanoGPT 及 Gemini 的接入状态
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFillTestKeys}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all"
              title="一键填入您提供的测试 Key"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>载入测试密钥</span>
            </button>
            <button
              onClick={handleTestAll}
              disabled={testingAll}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 disabled:opacity-50 transition-all"
            >
              {testingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>全量测试</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-[#252731] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Provider Sidebar */}
          <div className="w-64 border-r border-[#262833] bg-[#131418] p-3 space-y-1.5 overflow-y-auto">
            {providers.map((p) => {
              const test = testResults[p.id];
              const hasKey = Boolean((keys as any)[p.keyName]);
              const isActive = activeTab === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-white shadow-sm'
                      : 'hover:bg-[#1f2027] text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate flex items-center gap-1.5">
                      {p.name}
                      {p.id === 'gemini' && (
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                          内置
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{p.badge}</div>
                  </div>
                  <div>
                    {test?.status === 'ok' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : test?.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : test?.status === 'error' ? (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    ) : hasKey ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Provider Details & Input */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#17181f] space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {currentProvider.name}
                  <a
                    href={currentProvider.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40"
                  >
                    <span>官方文档</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentProvider.description}
                </p>
              </div>
            </div>

            {/* API Endpoint badge */}
            <div className="bg-[#111216] border border-[#252733] rounded-xl p-3 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">接口基址 (API Endpoint):</span>
              <span className="text-cyan-400 font-semibold">{currentProvider.apiUrl}</span>
            </div>

            {/* Popular Models */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                支持与常用模型
              </label>
              <div className="flex flex-wrap gap-2">
                {currentProvider.popularModels.map((m, mIdx) => (
                  <span
                    key={`pop-${currentProvider.id}-${m}-${mIdx}`}
                    className="text-[11px] font-mono bg-[#20222a] border border-[#2e313d] text-slate-300 px-2.5 py-1 rounded-lg"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  API 密钥 / Access Token
                </span>
                {currentProvider.id === 'civitai' && (
                  <span className="text-[11px] text-amber-400">公开模型搜索免 Key，下载私有模型需填</span>
                )}
                {currentProvider.id === 'modelscope' && (
                  <span className="text-[11px] text-emerald-400">国内站 (modelscope.cn) Access Token</span>
                )}
                {currentProvider.id === 'modelscope_ai' && (
                  <span className="text-[11px] text-purple-400">国际站 (modelscope.ai) Access Token</span>
                )}
              </label>

              <div className="flex gap-2">
                <input
                  type="password"
                  value={(keys as any)[currentProvider.keyName] || ''}
                  onChange={(e) =>
                    setKeys({
                      ...keys,
                      [currentProvider.keyName]: e.target.value,
                    })
                  }
                  placeholder={currentProvider.keyPlaceholder}
                  className="flex-1 bg-[#111216] border border-[#2b2d38] focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono"
                />
                <button
                  onClick={() => handleTest(currentProvider.id)}
                  disabled={testingProvider === currentProvider.id}
                  className="px-4 py-2.5 rounded-xl bg-[#23252f] hover:bg-[#2e313e] border border-[#353846] text-xs font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
                >
                  {testingProvider === currentProvider.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>测试中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>测试连接</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status report */}
              {testResults[currentProvider.id] && (
                <div
                  className={`mt-2 p-3 rounded-xl text-xs flex items-center gap-2.5 border ${
                    testResults[currentProvider.id].status === 'ok'
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                      : testResults[currentProvider.id].status === 'warning'
                      ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
                      : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                  }`}
                >
                  {testResults[currentProvider.id].status === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : testResults[currentProvider.id].status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div className="flex-1">
                    <span>{testResults[currentProvider.id].message}</span>
                    {testResults[currentProvider.id].latency && (
                      <span className="ml-2 font-mono opacity-75">
                        ({testResults[currentProvider.id].latency}ms)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Transparent Execution & Intent Compliance Tip */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-cyan-400 flex items-center gap-1">
                💡 严格意图遵从与透明报错体系
              </span>
              <p className="leading-relaxed text-[11px]">
                拒绝假图欺骗与静默降级：系统 100% 遵从您在画布中编排的节点与指定服务商，绝不擅自篡改 Provider 或用虚假图片兜底。若未配置 API Key 或上游接口限流报错，系统将直接透传真实状态码与错误信息，便于快速定位与排障。
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#262833] bg-[#14151a] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">密钥保存在浏览器安全 LocalStorage 中，不会泄露给第三方</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#23252f] hover:bg-[#2e313e] text-xs font-semibold text-slate-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/20 transition-all"
            >
              保存所有配置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
