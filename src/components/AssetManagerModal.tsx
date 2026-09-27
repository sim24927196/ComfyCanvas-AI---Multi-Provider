import React, { useState, useRef } from 'react';
import {
  FolderOpen,
  Image as ImageIcon,
  Video,
  Download,
  Trash2,
  Copy,
  Check,
  Search,
  Plus,
  Play,
  Maximize2,
  Upload,
  Sparkles,
  Clock,
  Layers,
  ExternalLink,
  Film,
  RefreshCw,
} from 'lucide-react';
import { GenerationHistoryItem } from '../types/providers';

export interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  prompt: string;
  provider: string;
  model: string;
  timestamp: number;
  width?: number;
  height?: number;
  seed?: number;
  loras?: string[];
  isReference?: boolean;
}

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GenerationHistoryItem[];
  onAddToCanvasAsFrame: (asset: MediaAsset) => void;
  onUseAsReference: (asset: MediaAsset) => void;
  onPreviewImage: (url: string) => void;
  onDeleteAsset: (id: string) => void;
}

export const AssetManagerModal: React.FC<AssetManagerModalProps> = ({
  isOpen,
  onClose,
  history,
  onAddToCanvasAsFrame,
  onUseAsReference,
  onPreviewImage,
  onDeleteAsset,
}) => {
  const [activeType, setActiveType] = useState<'all' | 'image' | 'video' | 'reference'>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customUploads, setCustomUploads] = useState<MediaAsset[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Convert history items + default curated showcase + user uploads into unified MediaAsset list
  const historyAssets: MediaAsset[] = history
    .filter((item) => Boolean(item.url || item.imageUrl))
    .map((item, idx) => {
      const isVid =
        item.mediaType === 'video' ||
        item.url?.endsWith('.mp4') ||
        item.imageUrl?.endsWith('.mp4') ||
        item.model?.toLowerCase().includes('video') ||
        item.provider?.toLowerCase().includes('video');
      return {
        id: item.id || `hist-${idx}`,
        url: item.url || item.imageUrl || '',
        type: isVid ? 'video' : 'image',
        prompt: item.prompt,
        provider: item.provider || 'AI Engine',
        model: item.model || 'FLUX / SDXL',
        timestamp: item.timestamp || Date.now() - idx * 60000,
        width: item.width,
        height: item.height,
        seed: item.seed,
      };
    });

  const allAssets = [...customUploads, ...historyAssets].filter(
    (asset) => !deletedIds.has(asset.id)
  );

  // Filtering
  const filteredAssets = allAssets.filter((asset) => {
    if (activeType === 'image' && asset.type !== 'image') return false;
    if (activeType === 'video' && asset.type !== 'video') return false;
    if (activeType === 'reference' && !asset.isReference) return false;

    if (selectedProvider !== 'all') {
      const p = asset.provider.toLowerCase();
      if (!p.includes(selectedProvider.toLowerCase())) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchP = asset.prompt.toLowerCase().includes(q);
      const matchM = asset.model.toLowerCase().includes(q);
      const matchT = (asset.title || '').toLowerCase().includes(q);
      if (!matchP && !matchM && !matchT) return false;
    }

    return true;
  });

  const handleCopyPrompt = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.prompt);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const url = evt.target?.result as string;
      const isVideo = file.type.includes('video');
      const newAsset: MediaAsset = {
        id: `upload-${Date.now()}`,
        url,
        type: isVideo ? 'video' : 'image',
        title: file.name,
        prompt: `外部导入参考素材: ${file.name}`,
        provider: '本地导入',
        model: '用户参考资产',
        timestamp: Date.now(),
        isReference: true,
      };
      setCustomUploads((prev) => [newAsset, ...prev]);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (e: React.MouseEvent, asset: MediaAsset) => {
    e.stopPropagation();
    if (confirm('确定从资产库彻底删除此项资产吗？')) {
      setDeletedIds((prev) => new Set(prev).add(asset.id));
      if (asset.id.startsWith('upload-')) {
        setCustomUploads((prev) => prev.filter((a) => a.id !== asset.id));
      } else {
        onDeleteAsset(asset.id);
      }
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#15161c] border border-[#2b2d3a] rounded-2xl w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#252733] bg-[#111216] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-wide">
                  资产与素材管理中心 (Asset & Media Gallery)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {allAssets.length} 项资产
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                统一管理历次生成的 AI 图像、5秒电影级视频、图生图底图与本地上传素材，支持一键载入画布
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>上传参考素材</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadLocalFile}
              accept="image/*,video/mp4"
              className="hidden"
            />
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#22242e] hover:bg-[#2c2e3b] text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              关闭 (Esc)
            </button>
          </div>
        </div>

        {/* Filter Ribbon */}
        <div className="px-6 py-3 bg-[#171821] border-b border-[#242632] flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Media Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: '全部资产', icon: FolderOpen },
              { id: 'image', label: '🖼️ 静态图像', icon: ImageIcon },
              { id: 'video', label: '🎥 AI 动态视频 (Wan 2.1)', icon: Video },
              { id: 'reference', label: '📎 本地上传参考图', icon: Upload },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeType === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'bg-[#1b1c25] text-slate-400 hover:text-white border border-[#2b2d39]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Provider Filter & Search */}
          <div className="flex items-center gap-2">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-[#1b1c25] border border-[#2b2d39] rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-500 font-mono"
            >
              <option value="all">全服务商 (All Providers)</option>
              <option value="civitai">Civitai 社区引擎</option>
              <option value="fal">Fal.ai 极速云</option>
              <option value="agnes">Agnes AI 2.5 Flash</option>
              <option value="modelscope">ModelScope (阿里魔搭)</option>
              <option value="huggingface">Hugging Face</option>
              <option value="sensenova">SenseNova (商汤日日新)</option>
              <option value="nanogpt">NanoGPT</option>
              <option value="gemini">Google Imagen / Gemini</option>
            </select>

            <div className="relative w-48 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索提示词与模型..."
                className="w-full bg-[#1b1c25] border border-[#2b2d39] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Assets Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0f1014]">
          {filteredAssets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1b1c25] border border-[#2b2d39] flex items-center justify-center text-purple-400">
                <FolderOpen className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">未找到符合条件的资产</p>
              <p className="text-xs text-slate-500">你可以点击右上角上传本地图片或在画布中执行生成</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isVideo = asset.type === 'video';

                return (
                  <div
                    key={asset.id}
                    className="bg-[#171822] border border-[#262835] hover:border-purple-500/60 rounded-2xl overflow-hidden flex flex-col shadow-xl transition-all group"
                  >
                    {/* Media Thumbnail Container */}
                    <div className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center">
                      {isVideo ? (
                        <video
                          src={asset.url}
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                          onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      ) : (
                        <img
                          src={asset.url}
                          alt={asset.prompt}
                          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                          onClick={() => onPreviewImage(asset.url)}
                        />
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/70 text-purple-300 border border-purple-700/60 backdrop-blur-md flex items-center gap-1">
                          {isVideo ? <Video className="w-3 h-3 text-pink-400" /> : <ImageIcon className="w-3 h-3 text-cyan-400" />}
                          <span>{isVideo ? '动态视频' : '图像'}</span>
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/70 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                          {asset.provider}
                        </span>
                      </div>

                      {/* Hover Action Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCanvasAsFrame(asset);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg shadow-purple-600/30 transition-all"
                          title="在无限画布上放置以此资产为中心的取景框"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>送入画布</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUseAsReference(asset);
                            onClose();
                          }}
                          className="p-2 rounded-full bg-[#20222d] hover:bg-[#2b2d3c] text-white shadow-lg"
                          title="作为图生图 / 图生视频底模"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                        </button>

                        <button
                          onClick={(e) => handleDelete(e, asset)}
                          className="p-2 rounded-full bg-rose-950/80 hover:bg-rose-600 text-white shadow-lg border border-rose-500/40 transition-all"
                          title="从资产库彻底删除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={asset.url}
                          download={`asset_${asset.id}.${isVideo ? 'mp4' : 'jpg'}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-full bg-[#20222d] hover:bg-[#2b2d3c] text-white shadow-lg"
                          title="下载原文件"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Asset Info Footer */}
                    <div className="p-3 bg-[#15161f] border-t border-[#232532] space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-semibold text-white truncate max-w-[140px]" title={asset.model}>
                            {asset.model.split('/').pop()}
                          </span>
                          <span className="font-mono text-[10px]">
                            {new Date(asset.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2" title={asset.prompt}>
                          {asset.prompt}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#20222c] flex items-center justify-between">
                        <button
                          onClick={() => handleCopyPrompt(asset)}
                          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                        >
                          {copiedId === asset.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">已复制提示词</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>复制提示词</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            onAddToCanvasAsFrame(asset);
                            onClose();
                          }}
                          className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5"
                        >
                          <span>添加到画布</span>
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
