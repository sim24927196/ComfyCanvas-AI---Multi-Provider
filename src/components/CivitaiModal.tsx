import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Download,
  Star,
  Sparkles,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  Layers,
  Cpu,
  Heart,
  Globe,
  Filter,
  Zap,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import { CivitaiModelItem } from '../types/providers';
import { searchCivitaiModels, fetchLiveModels } from '../services/api';
import { identifyArchitectureFamily, ARCHITECTURE_PROFILES } from '../utils/baseModelMatcher';

export type LoraProviderFilter = 'all' | 'civitai' | 'huggingface' | 'modelscope' | 'modelscope_ai' | 'fal' | 'tensorart';

export interface UnifiedLoRAItem {
  id: string;
  name: string;
  provider: 'Civitai' | 'Hugging Face' | 'ModelScope CN' | 'ModelScope AI' | 'Fal.ai' | 'Tensor.Art';
  providerKey: LoraProviderFilter;
  baseModel: string;
  creator: string;
  rating?: number;
  downloadCount?: number;
  likes?: number;
  speed?: string;
  previewImg: string;
  triggerWords: string;
  civitaiId?: string;
  externalUrl?: string;
  badge?: string;
}

export interface CivitaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLoRA: (lora: { name: string; civitaiId?: string; triggerWords: string; baseModel?: string }) => void;
  onAddLoRANodeToCanvas: (lora: { name: string; civitaiId?: string; triggerWords: string; baseModel?: string }) => void;
  onSelectLoRAWithBaseModel?: (lora: { name: string; civitaiId?: string; triggerWords: string; baseModel?: string }) => void;
  initialProvider?: LoraProviderFilter;
}

export const CivitaiModal: React.FC<CivitaiModalProps> = ({
  isOpen,
  onClose,
  onSelectLoRA,
  onAddLoRANodeToCanvas,
  onSelectLoRAWithBaseModel,
  initialProvider = 'all',
}) => {
  const [activeProvider, setActiveProvider] = useState<LoraProviderFilter>(initialProvider);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('Highest Rated');
  const [models, setModels] = useState<UnifiedLoRAItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedTrigger, setCopiedTrigger] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const activeReqIdRef = useRef(0);

  const fetchModels = async (prov = activeProvider, searchTerm = query, sortOption = sort) => {
    const currentReqId = ++activeReqIdRef.current;
    setLoading(true);
    setErrorMsg(null);
    try {
      const items: UnifiedLoRAItem[] = [];

      // 1. Fetch from Civitai if activeProvider is 'all' or 'civitai'
      if (prov === 'all' || prov === 'civitai') {
        try {
          const cData = await searchCivitaiModels(searchTerm, 'LORA', sortOption, 1, 16);
          if (cData && Array.isArray(cData.items)) {
            cData.items.forEach((m: CivitaiModelItem) => {
              const latest = m.modelVersions?.[0];
              const trigger = latest?.trainedWords?.join(', ') || 'masterpiece, high detail';
              const rawBase = latest?.baseModel || '未知底模';
              const fam = identifyArchitectureFamily(rawBase, m.name);
              const displayBase = ARCHITECTURE_PROFILES[fam]?.displayName.split(' ')[0] || rawBase;

              items.push({
                id: `civitai-${m.id}`,
                name: m.name,
                provider: 'Civitai',
                providerKey: 'civitai',
                baseModel: displayBase,
                creator: m.creator?.username || 'Community Creator',
                rating: typeof m.stats?.rating === 'number' && m.stats.rating > 0 ? m.stats.rating : undefined,
                downloadCount: typeof m.stats?.downloadCount === 'number' && m.stats.downloadCount > 0 ? m.stats.downloadCount : undefined,
                previewImg: latest?.images?.[0]?.url || '',
                triggerWords: trigger,
                civitaiId: String(m.id),
                externalUrl: `https://civitai.com/models/${m.id}`,
                badge: fam.toUpperCase(),
              });
            });
          }
        } catch (cErr: any) {
          console.warn('Civitai query error:', cErr);
          setErrorMsg(`Civitai 检索异常: ${cErr.message || '网络连接或上游 API 限制'}`);
        }
      }

      // 2. Fetch from other LoRA engines (HuggingFace, ModelScope, Fal)
      if (prov !== 'civitai') {
        const liveData = await fetchLiveModels(prov === 'all' ? 'all' : prov, searchTerm, 'LORA', 'lora', sortOption);
        Object.entries(liveData).forEach(([provKey, list]) => {
          if (Array.isArray(list)) {
            list.forEach((m: any) => {
              const isLoraItem = m.category === "LoRA" || m.type === "LORA" || (m.tags && m.tags.includes("lora")) || (m.id && m.id.toLowerCase().includes("lora")) || (m.name && m.name.toLowerCase().includes("lora"));

              if (isLoraItem) {
                const fam = identifyArchitectureFamily(m.baseModel || m.name || m.id);
                const pName =
                  provKey === 'huggingface' ? 'Hugging Face' :
                  provKey === 'modelscope' ? 'ModelScope CN' :
                  provKey === 'modelscope_ai' ? 'ModelScope AI' :
                  provKey === 'fal' ? 'Fal.ai' :
                  (provKey === 'tensorart' || provKey === 'tensor') ? 'Tensor.Art' : 'Civitai';
                
                // Avoid duplicating civitai items already fetched
                if (provKey === 'civitai' && items.some((it) => it.id === `civitai-${m.id}`)) return;

                const normalizedProvKey: LoraProviderFilter =
                  provKey === 'huggingface' || provKey === 'modelscope' || provKey === 'modelscope_ai' || provKey === 'fal' || provKey === 'tensorart' || provKey === 'tensor'
                    ? (provKey === 'tensor' ? 'tensorart' : (provKey as LoraProviderFilter))
                    : 'civitai';

                const itemExternalUrl =
                  m.externalUrl
                    ? m.externalUrl
                    : provKey === 'huggingface'
                    ? `https://huggingface.co/${m.id}`
                    : provKey === 'modelscope'
                    ? `https://www.modelscope.cn/models/${m.id}`
                    : provKey === 'modelscope_ai'
                    ? `https://modelscope.ai/models/${m.id}`
                    : (provKey === 'tensorart' || provKey === 'tensor')
                    ? (/^\d+$/.test(m.id) ? `https://tensor.art/models/${m.id}` : `https://tensor.art/models?search=${encodeURIComponent(m.name || m.id)}`)
                    : provKey === 'civitai'
                    ? `https://civitai.com/models/${m.id}`
                    : undefined;

                items.push({
                  id: `${provKey}-${m.id}`,
                  name: m.name || m.id,
                  provider: pName as any,
                  providerKey: normalizedProvKey,
                  baseModel: m.baseModel || ARCHITECTURE_PROFILES[fam]?.displayName.split(' ')[0] || 'FLUX.1',
                  creator: m.creator || pName,
                  rating: typeof m.rating === 'number' && m.rating > 0 ? m.rating : undefined,
                  downloadCount: typeof m.downloads === 'number' && m.downloads > 0 ? m.downloads : undefined,
                  likes: typeof m.likes === 'number' && m.likes > 0 ? m.likes : undefined,
                  speed: m.speed,
                  previewImg: m.imageUrl || '',
                  triggerWords: Array.isArray(m.trainedWords) ? m.trainedWords.join(', ') : (m.triggers || 'hyperdetailed, masterpiece'),
                  civitaiId: provKey === 'civitai' ? String(m.id) : undefined,
                  externalUrl: itemExternalUrl,
                  badge: m.badge || fam.toUpperCase(),
                });
              }
            });
          }
        });
      }

      // Sort items across all providers according to selected sortOption
      items.sort((a, b) => {
        if (sortOption === 'Highest Rated' || sortOption.includes('Rate')) {
          return (b.rating || 0) - (a.rating || 0) || (b.downloadCount || 0) - (a.downloadCount || 0);
        }
        if (sortOption === 'Most Downloaded' || sortOption.includes('Download')) {
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        }
        if (sortOption === 'Most Liked' || sortOption.includes('Like')) {
          return (b.likes || 0) - (a.likes || 0) || (b.downloadCount || 0) - (a.downloadCount || 0);
        }
        if (sortOption === 'Name A-Z' || sortOption.includes('A-Z')) {
          return (a.name || '').localeCompare(b.name || '');
        }
        return (b.downloadCount || 0) - (a.downloadCount || 0);
      });

      if (currentReqId === activeReqIdRef.current) {
        setModels(items);
      }
    } catch (err: any) {
      console.warn('LoRA search error:', err);
      if (currentReqId === activeReqIdRef.current) {
        setErrorMsg(`模型检索异常: ${err.message || '网络连接或上游服务异常'}`);
      }
    } finally {
      if (currentReqId === activeReqIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchModels(activeProvider, query, sort);
    }
  }, [isOpen, activeProvider]);

  if (!isOpen) return null;

  const handleCopyTrigger = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTrigger(text);
    setTimeout(() => setCopiedTrigger(null), 2000);
  };

  const handleCustomUniversalLoraSubmit = () => {
    const inputEl = document.getElementById('custom-universal-lora-input') as HTMLInputElement;
    const rawVal = inputEl?.value?.trim() || '';
    if (!rawVal) return;
    const isCivitaiId = /^\d+$/.test(rawVal);
    const modelName = rawVal.includes('/') ? rawVal.split('/').pop()! : rawVal;
    onSelectLoRA({
      name: `[${activeProvider.toUpperCase()}] ${modelName}`,
      civitaiId: isCivitaiId ? rawVal : undefined,
      triggerWords: 'high quality, masterpiece, detailed',
      baseModel: 'FLUX.1 / SDXL',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#181920] border border-[#2e303c] rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#282a36] bg-[#13141a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-600/30 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                全生态 LoRA & 微调模型中心 (Universal LoRA Hub)
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                  跨引擎全聚合
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                涵盖 Civitai、Hugging Face、魔搭社区 (ModelScope)、Fal.ai、Tensor.Art (吐司) 全量风格与微调模型，支持一键配对适配底模
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-[#252731] transition-colors text-sm shrink-0"
            title="关闭"
          >
            ✕
          </button>
        </div>

        {/* Engine Provider Tabs */}
        <div className="px-6 pt-3 pb-1 bg-[#15161d] border-b border-[#242630] flex items-center gap-2 overflow-x-auto shrink-0 min-h-[44px]">
          {[
            { id: 'all', name: '🌐 全生态聚合 (Civitai/HF/魔搭/Fal/Tensor)' },
            { id: 'civitai', name: '🌟 Civitai (C站社区 LoRA)' },
            { id: 'huggingface', name: '🤗 Hugging Face (开源 LoRA 库)' },
            { id: 'modelscope', name: '🇨🇳 魔搭 CN (国内站 LoRA)' },
            { id: 'modelscope_ai', name: '🌐 魔搭 AI (国际站 LoRA)' },
            { id: 'fal', name: '⚡ Fal.ai (云端托管 LoRA 端点)' },
            { id: 'tensorart', name: '🎨 Tensor.Art (吐司 LoRA & 工作流)' },
          ].map((tab) => {
            const isActive = activeProvider === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveProvider(tab.id as any);
                  setModels([]);
                  fetchModels(tab.id as any, query, sort);
                }}
                className={`pb-2.5 px-3.5 font-semibold transition-all relative whitespace-nowrap text-xs flex items-center gap-1.5 shrink-0 ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.name}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar & Filters */}
        <div className="p-4 border-b border-[#242630] bg-[#181922] flex flex-wrap gap-3 items-center shrink-0">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchModels(activeProvider, query, sort)}
              placeholder="跨引擎检索 LoRA (如: Cyberpunk, Ghibli, Detail, Face, Armor, Realistic, Anime)..."
              className="w-full bg-[#111216] border border-[#2b2d38] focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              fetchModels(activeProvider, query, e.target.value);
            }}
            className="bg-[#111216] border border-[#2b2d38] text-[11px] font-semibold text-slate-300 rounded-xl px-3 py-2 outline-none cursor-pointer shrink-0"
          >
            <option value="Highest Rated">⭐ 最高评分 (Highest Rated)</option>
            <option value="Most Downloaded">🔥 最多下载 (Most Downloaded)</option>
            <option value="Most Liked">❤️ 最多点赞 (Most Liked)</option>
            <option value="Newest">⚡ 最新发布 (Newest)</option>
            <option value="Name A-Z">🔤 名称排序 (A → Z)</option>
          </select>

          <button
            onClick={() => fetchModels(activeProvider, query, sort)}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>搜索模型</span>
          </button>
        </div>

        {/* Universal Dynamic Custom Model / LoRA Import Bar */}
        <div className="px-6 py-2.5 bg-[#171424] border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-300">
            <Zap className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>自定义/任意 LoRA 动态导入：</strong>
              {activeProvider === 'huggingface'
                ? '输入任意 Hugging Face 模型 ID (如 Shakker-Labs/FLUX.1-Dev-LoRA-Realism)'
                : activeProvider === 'modelscope' || activeProvider === 'modelscope_ai'
                ? '输入任意 ModelScope 模型 ID (如 damo/wan2.1-t2i)'
                : activeProvider === 'fal'
                ? '输入任意 Fal.ai LoRA 路径或 Endpoint'
                : activeProvider === 'tensorart'
                ? '输入 Tensor.Art Model ID (如 683401567119280123) 或 OpenWorks 工具名'
                : '输入任意 Civitai 模型 ID / AIR URN (如 138944 或 urn:air:...)'}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              placeholder={
                activeProvider === 'huggingface'
                  ? '输入 HF Repo ID (如 user/model-name)...'
                  : activeProvider === 'modelscope' || activeProvider === 'modelscope_ai'
                  ? '输入 ModelScope ID (如 damo/model-id)...'
                  : activeProvider === 'fal'
                  ? '输入 Fal.ai LoRA path / Endpoint...'
                  : activeProvider === 'tensorart'
                  ? '输入 Tensor.Art Model ID 或工具名...'
                  : '输入 Civitai ID (如 138944) 或 URN...'
              }
              id="custom-universal-lora-input"
              className="flex-1 bg-[#100d1c] border border-purple-800/50 rounded-lg px-3 py-1.5 text-xs text-purple-100 placeholder-purple-400/50 outline-none focus:border-purple-400"
            />
            <button
              onClick={handleCustomUniversalLoraSubmit}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs whitespace-nowrap shadow-sm"
            >
              动态选用
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="px-6 py-2 bg-red-950/20 border-b border-red-800/20 text-red-300 text-xs flex items-center justify-between shrink-0 animate-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-red-500" />
              <span>{errorMsg}</span>
            </div>
            <button 
              onClick={() => fetchModels(activeProvider, query, sort)}
              className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 text-[9px] font-bold border border-red-500/30 transition-colors"
            >
              重试 (Retry)
            </button>
          </div>
        )}

        {/* Models Grid */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#141518]">
          {(() => {
            const displayedModels = models.filter((model) => {
              if (activeProvider === 'all') return true;
              return model.providerKey === activeProvider;
            });

            if (loading) {
              return (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  <p className="text-sm font-medium">正在实时检索云端 LoRA 模型库...</p>
                </div>
              );
            }

            if (displayedModels.length === 0) {
              return (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <Sparkles className="w-10 h-10 text-purple-400/40" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">
                      {activeProvider === 'tensorart'
                        ? '未在当前分类中检索到 Tensor.Art 工具'
                        : '未找到相关 LoRA 模型'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {errorMsg
                        ? `加载异常: ${errorMsg}`
                        : activeProvider === 'tensorart'
                        ? '可直接在上方「自定义/任意模型动态导入」输入 OpenWorks 工具名或 Tensor.Art Model ID 进行选用'
                        : '换个关键词试试？或切换到全生态 (All) 进行实时检索'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuery('');
                      setActiveProvider('all');
                      setModels([]);
                      fetchModels('all', '', sort);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 text-xs border border-purple-500/30 transition-all flex items-center gap-1.5"
                  >
                    <span>重置并搜索全生态</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedModels.map((model) => {
                  const isCivitai = model.provider === 'Civitai';
                  const baseArch = model.baseModel || '未知底模';

                  return (
                    <div
                      key={model.id}
                      className="bg-[#1c1d24] border border-[#2b2d37] hover:border-purple-500/50 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col group"
                    >
                      {/* Image Cover */}
                      <div className="relative h-48 bg-[#121316] overflow-hidden flex items-center justify-center">
                        {model.previewImg ? (
                          <img
                            src={model.previewImg}
                            alt={model.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              // Hide broken image and trigger parent visual fallback
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.model-card-fallback-banner') as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}

                        {/* Transparent genuine provider-themed fallback banner */}
                        <div
                          className={`model-card-fallback-banner w-full h-full p-4 flex flex-col justify-between items-center text-center ${
                            model.previewImg ? 'hidden' : 'flex'
                          } ${
                            model.providerKey === 'modelscope' || model.providerKey === 'modelscope_ai'
                              ? 'bg-gradient-to-br from-[#0e1e2d] via-[#121824] to-[#1a1329]'
                              : model.providerKey === 'fal'
                              ? 'bg-gradient-to-br from-[#2a130c] via-[#1c1218] to-[#12131a]'
                              : model.providerKey === 'huggingface'
                              ? 'bg-gradient-to-br from-[#29220c] via-[#1c1812] to-[#12131a]'
                              : model.providerKey === 'tensorart'
                              ? 'bg-gradient-to-br from-[#291038] via-[#1a1226] to-[#12131a]'
                              : 'bg-gradient-to-br from-[#1a122e] via-[#141220] to-[#12131a]'
                          }`}
                        >
                          <div className="w-full flex justify-between items-center opacity-80">
                            <span className="text-[10px] font-mono font-bold text-slate-300">
                              {model.provider}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-200">
                              {baseArch}
                            </span>
                          </div>
                          <div className="my-auto flex flex-col items-center gap-1.5 px-2">
                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 shadow-inner">
                              <Layers className="w-6 h-6 text-purple-400" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-200 line-clamp-1 max-w-[220px]">
                              {model.name}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              [官方原生权重 · 接口未附预览图]
                            </span>
                          </div>
                        </div>

                        {/* Engine Tag */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                          <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-purple-300 font-bold border border-purple-500/40">
                            {model.provider}
                          </span>
                          <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 font-bold border border-cyan-500/40">
                            {baseArch}
                          </span>
                        </div>

                        {/* Rating - Only display genuine rating > 0 */}
                        {typeof model.rating === 'number' && model.rating > 0 && (
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-amber-300 flex items-center gap-1 border border-amber-500/30 z-10">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{Number(model.rating).toFixed(1)}</span>
                          </div>
                        )}

                        {/* Download stats - Only display genuine downloads > 0 */}
                        {typeof model.downloadCount === 'number' && model.downloadCount > 0 && (
                          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-300 flex items-center gap-1 z-10">
                            <Download className="w-3 h-3 text-slate-400" />
                            <span>{model.downloadCount.toLocaleString()} 次</span>
                          </div>
                        )}

                        {/* Genuine Speed / Pricing Tag */}
                        {model.speed && (
                          <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-cyan-300 font-mono flex items-center gap-1 z-10 border border-cyan-500/30">
                            <Zap className="w-3 h-3 text-cyan-400" />
                            <span>{model.speed}</span>
                          </div>
                        )}
                      </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-sm text-white truncate" title={model.name}>
                            {model.name}
                          </h3>
                          {model.externalUrl && (
                            <a
                              href={model.externalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-cyan-400 transition-colors"
                              title="打开原始发布主页"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                          发布方: {model.creator}
                        </div>
                      </div>

                      {/* Trigger words */}
                      <div className="bg-[#141518] p-2.5 rounded-lg border border-[#262830] text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-purple-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            触发词 (Trigger Words):
                          </span>
                          <button
                            onClick={() => handleCopyTrigger(model.triggerWords)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                          >
                            {copiedTrigger === model.triggerWords ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>复制</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 font-mono line-clamp-2 leading-relaxed">
                          {model.triggerWords}
                        </p>
                      </div>

                      {/* Action buttons with Auto-pair Base Model (User Requested Feature) */}
                      <div className="space-y-1.5 pt-1">
                        {/* Primary requested feature: Auto-pair base model with LoRA */}
                        <button
                          onClick={() => {
                            if (onSelectLoRAWithBaseModel) {
                              onSelectLoRAWithBaseModel({
                                name: `${model.name.replace(/\.safetensors$/i, '')}.safetensors`,
                                civitaiId: model.civitaiId,
                                triggerWords: model.triggerWords,
                                baseModel: baseArch,
                              });
                            } else {
                              onSelectLoRA({
                                name: `${model.name.replace(/\.safetensors$/i, '')}.safetensors`,
                                civitaiId: model.civitaiId,
                                triggerWords: model.triggerWords,
                                baseModel: baseArch,
                              });
                            }
                            onClose();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-1.5 active:scale-98"
                          title={`选用此 LoRA 并自动将前置底模同步为兼容的 ${baseArch} 官方架构`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                          <span>🎯 选用 LoRA 并自动配对底模</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono text-cyan-200">
                            {baseArch}
                          </span>
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              onSelectLoRA({
                                name: `${model.name.replace(/\.safetensors$/i, '')}.safetensors`,
                                civitaiId: model.civitaiId,
                                triggerWords: model.triggerWords,
                                baseModel: baseArch,
                              });
                              onClose();
                            }}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[#242630] hover:bg-[#2e313e] text-[11px] font-semibold text-slate-300 transition-colors flex items-center justify-center gap-1 border border-[#353846]"
                            title="仅更新当前节点的 LoRA，不更改前置底模"
                          >
                            仅填入当前节点
                          </button>
                          <button
                            onClick={() => {
                              onAddLoRANodeToCanvas({
                                name: `${model.name.replace(/\.safetensors$/i, '')}.safetensors`,
                                civitaiId: model.civitaiId,
                                triggerWords: model.triggerWords,
                                baseModel: baseArch,
                              });
                              onClose();
                            }}
                            className="py-1.5 px-2.5 rounded-lg bg-[#242630] hover:bg-[#2e313e] text-[11px] font-semibold text-purple-300 hover:text-white transition-colors flex items-center gap-1 border border-[#353846]"
                            title="在画布上放置独立的 LoRALoader 节点"
                          >
                            <Plus className="w-3 h-3" />
                            <span>新建节点</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
        </div>
      </div>
    </div>
  );
};

