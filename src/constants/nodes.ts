import { NodeDefinition } from '../types/graph';

export const SAMPLER_OPTIONS = [
  { label: 'euler', value: 'euler' },
  { label: 'euler_ancestral', value: 'euler_ancestral' },
  { label: 'dpmpp_2m', value: 'dpmpp_2m' },
  { label: 'dpmpp_sde', value: 'dpmpp_sde' },
  { label: 'dpmpp_2m_sde', value: 'dpmpp_2m_sde' },
  { label: 'dpmpp_3m_sde', value: 'dpmpp_3m_sde' },
  { label: 'dpmpp_2s_ancestral', value: 'dpmpp_2s_ancestral' },
  { label: 'er_sde_simple', value: 'er_sde_simple' },
  { label: 'er_sde', value: 'er_sde' },
  { label: 'dpm_fast', value: 'dpm_fast' },
  { label: 'dpm_adaptive', value: 'dpm_adaptive' },
  { label: 'heun', value: 'heun' },
  { label: 'lms', value: 'lms' },
  { label: 'uni_pc', value: 'uni_pc' },
  { label: 'ddim', value: 'ddim' },
];

export const SCHEDULER_OPTIONS = [
  { label: 'normal', value: 'normal' },
  { label: 'karras', value: 'karras' },
  { label: 'exponential', value: 'exponential' },
  { label: 'sgm_uniform', value: 'sgm_uniform' },
  { label: 'simple', value: 'simple' },
  { label: 'ddim_uniform', value: 'ddim_uniform' },
];

export interface BaseModelOption {
  label: string;
  value: string;
  provider: 'fal' | 'agnes' | 'civitai' | 'modelscope' | 'modelscope_ai' | 'huggingface' | 'nanogpt' | 'gemini' | 'sensenova' | 'video' | 'tensorart';
  category?: 'checkpoint' | 'video' | 'reasoning' | 'edit' | 'lora';
}

export const BASE_MODELS: BaseModelOption[] = [
  // ===================== TENSOR.ART (OpenWorks) =====================
  { label: '🎨 [Tensor] FLUX.1 [dev] 旗舰生图 (flux_1_dev)', value: 'flux_1_dev', provider: 'tensorart', category: 'checkpoint' },
  { label: '🎨 [Tensor] FLUX.1 [schnell] 极速生图 (flux_1_schnell)', value: 'flux_1_schnell', provider: 'tensorart', category: 'checkpoint' },
  { label: '🎨 [Tensor] SDXL 1.0 Base 官方基模 (sdxl_base_1_0)', value: 'sdxl_base_1_0', provider: 'tensorart', category: 'checkpoint' },
  { label: '🎨 [Tensor] Pony Diffusion V6 XL (pony_diffusion_v6_xl)', value: 'pony_diffusion_v6_xl', provider: 'tensorart', category: 'checkpoint' },
  { label: '🎨 [Tensor] Realistic Pony Diffusion (realistic_pony_diffusion)', value: 'realistic_pony_diffusion', provider: 'tensorart', category: 'checkpoint' },
  { label: '🎨 [Tensor] Illustrious-XL (illustrious_xl)', value: 'illustrious_xl', provider: 'tensorart', category: 'checkpoint' },
  { label: '🎨 [Tensor] DreamShaper XL (dreamshaper_xl)', value: 'dreamshaper_xl', provider: 'tensorart', category: 'checkpoint' },
  { label: '🎨 [Tensor] Wan 2.1 Video 运镜模型 (wan_video)', value: 'wan_video', provider: 'tensorart', category: 'video' },

  // ===================== MODELSCOPE (CN/AI) =====================
  { label: '🇨🇳 [魔搭] Tongyi-MAI Z-Image-Turbo (免 Token 直连)', value: 'Tongyi-MAI/Z-Image-Turbo', provider: 'modelscope', category: 'checkpoint' },
  { label: '🇨🇳 [魔搭] SDXL 1.0 官方基模 (AI-ModelScope/stable-diffusion-xl-base-1.0)', value: 'AI-ModelScope/stable-diffusion-xl-base-1.0', provider: 'modelscope', category: 'checkpoint' },
  { label: '🇨🇳 [魔搭] FLUX.1 [dev] (AI-ModelScope/flux.1-dev)', value: 'AI-ModelScope/flux.1-dev', provider: 'modelscope', category: 'checkpoint' },
  { label: '🇨🇳 [魔搭] Wan 2.1 文生图 (damo/wan2.1-t2i-1.3b)', value: 'damo/wan2.1-t2i-1.3b', provider: 'modelscope', category: 'checkpoint' },
  { label: '🇨🇳 [魔搭] Wan 2.1 视频生图 (damo/wan2.1-i2v-480p-14b)', value: 'damo/wan2.1-i2v-480p-14b', provider: 'modelscope', category: 'video' },
  { label: '🇨🇳 [魔搭] CogVideoX-5B 视频模型 (THUDM/CogVideoX-5b)', value: 'THUDM/CogVideoX-5b', provider: 'modelscope', category: 'video' },
  { label: '🇨🇳 [魔搭] SDXL 宫崎骏风格 LoRA (Ghibli Style)', value: 'Ghibli-Style-LoRA', provider: 'modelscope', category: 'lora' },
  { label: '🇨🇳 [魔搭] Qwen-VL-Plus 视觉解析 (qwen/qwen-vl-plus)', value: 'qwen/qwen-vl-plus', provider: 'modelscope', category: 'edit' },
  { label: '🇨🇳 [魔搭] Kolors 旗舰基模 (Kwai-Kolors/Kolors)', value: 'Kwai-Kolors/Kolors', provider: 'modelscope', category: 'checkpoint' },

  // ===================== HUGGING FACE =====================
  { label: '🤗 [HF] FLUX.1-dev (black-forest-labs/FLUX.1-dev)', value: 'black-forest-labs/FLUX.1-dev', provider: 'huggingface', category: 'checkpoint' },
  { label: '🤗 [HF] SDXL 1.0 (stabilityai/stable-diffusion-xl-base-1.0)', value: 'stabilityai/stable-diffusion-xl-base-1.0', provider: 'huggingface', category: 'checkpoint' },
  { label: '🤗 [HF] Stable Diffusion 3.5 Large (stabilityai/stable-diffusion-3.5-large)', value: 'stabilityai/stable-diffusion-3.5-large', provider: 'huggingface', category: 'checkpoint' },
  { label: '🤗 [HF] Kolors (Kwai-Kolors/Kolors)', value: 'Kwai-Kolors/Kolors', provider: 'huggingface', category: 'checkpoint' },
  { label: '🤗 [HF] SD 1.5 (runwayml/stable-diffusion-v1-5)', value: 'runwayml/stable-diffusion-v1-5', provider: 'huggingface', category: 'checkpoint' },

  // ===================== FAL.AI =====================
  { label: '⚡ [Fal] FLUX.1 Schnell (fal-ai/flux/schnell)', value: 'fal-ai/flux/schnell', provider: 'fal', category: 'checkpoint' },
  { label: '⚡ [Fal] FLUX.1 [dev] (fal-ai/flux/dev)', value: 'fal-ai/flux/dev', provider: 'fal', category: 'checkpoint' },
  { label: '⚡ [Fal] SDXL 1.0 (fal-ai/stable-diffusion-xl-base-1.0)', value: 'fal-ai/stable-diffusion-xl-base-1.0', provider: 'fal', category: 'checkpoint' },
  { label: '⚡ [Fal] Wan 2.1 Video (fal-ai/wan/t2v)', value: 'fal-ai/wan/t2v', provider: 'fal', category: 'video' },

  // ===================== CIVITAI =====================
  { label: '🌟 [Civitai] Krea 2 Turbo 原生极速 (urn:air:krea2:checkpoint:civitai:2726029@3091481)', value: 'urn:air:krea2:checkpoint:civitai:2726029@3091481', provider: 'civitai', category: 'checkpoint' },
  { label: '🌟 [Civitai] SDXL 1.0 Base (urn:air:sdxl:checkpoint:civitai:101055@128078)', value: 'urn:air:sdxl:checkpoint:civitai:101055@128078', provider: 'civitai', category: 'checkpoint' },
  { label: '🌟 [Civitai] FLUX.1 [dev] (urn:air:flux1:checkpoint:civitai:618692@691639)', value: 'urn:air:flux1:checkpoint:civitai:618692@691639', provider: 'civitai', category: 'checkpoint' },

  // ===================== SPECIALIZED =====================
  { label: '🧠 [商汤] SenseNova V5 (sensenova-v5)', value: 'sensenova-v5', provider: 'sensenova', category: 'checkpoint' },
  { label: '🚀 [Agnes] Agnes 2.5 Flash (agnes-v2.5)', value: 'agnes-v2.5', provider: 'agnes', category: 'checkpoint' },
  { label: '💎 [Google] Imagen 3.0 (imagen-3.0-generate-002)', value: 'imagen-3.0-generate-002', provider: 'gemini', category: 'checkpoint' },
];

export const NODE_DEFINITIONS: Record<string, NodeDefinition> = {
  // ===================== LOADERS =====================
  CheckpointLoaderSimple: {
    type: 'CheckpointLoaderSimple',
    title: 'Load Checkpoint',
    category: 'loaders',
    colorTag: '#00f0ff',
    description: 'Loads the base generative model, CLIP text encoder, and VAE autoencoder.',
    inputs: [],
    outputs: [
      { id: 'MODEL', name: 'MODEL', type: 'MODEL', label: 'MODEL' },
      { id: 'CLIP', name: 'CLIP', type: 'CLIP', label: 'CLIP' },
      { id: 'VAE', name: 'VAE', type: 'VAE', label: 'VAE' },
    ],
    widgets: [
      {
        name: 'targetProvider',
        label: '目标执行引擎 (Provider)',
        type: 'select',
        default: 'huggingface',
        options: [
          { label: '🤗 Hugging Face Diffusers', value: 'huggingface' },
          { label: '🌟 Civitai 官方原生引擎', value: 'civitai' },
          { label: '🎨 Tensor.Art (OpenWorks 算力)', value: 'tensorart' },
          { label: '⚡ Fal.ai 极速云引擎', value: 'fal' },
          { label: '🇨🇳 魔搭 CN (modelscope.cn 国内站)', value: 'modelscope' },
          { label: '🌐 魔搭 AI (modelscope.ai 国际站)', value: 'modelscope_ai' },
          { label: '💎 Google Imagen 3 (内置)', value: 'gemini' },
          { label: '⚡ NanoGPT (按次)', value: 'nanogpt' },
          { label: '🚀 Agnes AI 2.5 Flash', value: 'agnes' },
          { label: '🧠 SenseNova 商汤日日新', value: 'sensenova' },
          { label: '🎬 AI Video 视频引擎', value: 'video' },
        ],
      },
      {
        name: 'ckpt_name',
        label: 'ckpt_name (模型名称/路径/ID)',
        type: 'select',
        default: 'Tongyi-MAI/Z-Image-Turbo',
        options: BASE_MODELS,
        placeholder: '输入模型 ID/路径，或点击右上角「模型中心」实时拉取选用',
      },
    ],
    defaultValues: {
      targetProvider: 'huggingface',
      ckpt_name: 'Tongyi-MAI/Z-Image-Turbo',
    },
  },

  LoRALoader: {
    type: 'LoRALoader',
    title: 'Load LoRA (Civitai / Local)',
    category: 'loaders',
    colorTag: '#a855f7',
    description: 'Applies fine-tuned LoRA weights onto MODEL and CLIP with customizable strengths.',
    inputs: [
      { id: 'model', name: 'model', type: 'MODEL', label: 'MODEL' },
      { id: 'clip', name: 'clip', type: 'CLIP', label: 'CLIP' },
    ],
    outputs: [
      { id: 'MODEL', name: 'MODEL', type: 'MODEL', label: 'MODEL' },
      { id: 'CLIP', name: 'CLIP', type: 'CLIP', label: 'CLIP' },
    ],
    widgets: [
      {
        name: 'lora_name',
        label: 'lora_name',
        type: 'text',
        default: 'DetailTweaker_SDXL_v1.0.safetensors',
        placeholder: 'e.g. Makoto_Shinkai_Style or Civitai LoRA Name',
      },
      {
        name: 'strength_model',
        label: 'strength_model',
        type: 'slider',
        default: 0.8,
        min: -2.0,
        max: 2.0,
        step: 0.05,
      },
      {
        name: 'strength_clip',
        label: 'strength_clip',
        type: 'slider',
        default: 0.8,
        min: -2.0,
        max: 2.0,
        step: 0.05,
      },
      {
        name: 'trigger_words',
        label: 'trigger_words',
        type: 'text',
        default: 'masterpiece, high detail, vibrant lighting',
        placeholder: 'Civitai trigger words',
      },
      {
        name: 'civitai_id',
        label: 'civitai_id',
        type: 'text',
        default: '122359',
        placeholder: 'Civitai Model ID (optional)',
      },
    ],
    defaultValues: {
      lora_name: 'DetailTweaker_SDXL_v1.0.safetensors',
      strength_model: 0.8,
      strength_clip: 0.8,
      trigger_words: 'masterpiece, high detail, vibrant lighting',
      civitai_id: '122359',
    },
  },

  // ===================== CONDITIONING =====================
  CLIPTextEncode: {
    type: 'CLIPTextEncode',
    title: 'CLIP Text Encode (Positive Prompt)',
    category: 'conditioning',
    colorTag: '#ff8800',
    description: 'Encodes text into a conditioning tensor to guide the diffusion process.',
    inputs: [{ id: 'clip', name: 'clip', type: 'CLIP', label: 'CLIP' }],
    outputs: [{ id: 'CONDITIONING', name: 'CONDITIONING', type: 'CONDITIONING', label: 'CONDITIONING' }],
    widgets: [
      {
        name: 'text',
        label: 'text',
        type: 'textarea',
        default: 'A futuristic cybernetic city at twilight, neon reflections on wet asphalt, volumetric mist, intricate architectural details, photorealistic, 8k resolution',
        placeholder: 'Enter positive prompt...',
      },
    ],
    defaultValues: {
      text: 'A futuristic cybernetic city at twilight, neon reflections on wet asphalt, volumetric mist, intricate architectural details, photorealistic, 8k resolution',
    },
  },

  CLIPTextEncodeNegative: {
    type: 'CLIPTextEncodeNegative',
    title: 'CLIP Text Encode (Negative Prompt)',
    category: 'conditioning',
    colorTag: '#ef4444',
    description: 'Encodes negative prompt text to repel unwanted artifacts.',
    inputs: [{ id: 'clip', name: 'clip', type: 'CLIP', label: 'CLIP' }],
    outputs: [{ id: 'CONDITIONING', name: 'CONDITIONING', type: 'CONDITIONING', label: 'CONDITIONING' }],
    widgets: [
      {
        name: 'text',
        label: 'text',
        type: 'textarea',
        default: 'blurry, distorted, low quality, bad anatomy, deformed limbs, watermark, text, out of focus',
        placeholder: 'Enter negative prompt...',
      },
    ],
    defaultValues: {
      text: 'blurry, distorted, low quality, bad anatomy, deformed limbs, watermark, text, out of focus',
    },
  },

  PromptRefinerLLM: {
    type: 'PromptRefinerLLM',
    title: 'AI Prompt Refiner (Gemini)',
    category: 'conditioning',
    colorTag: '#10b981',
    description: 'Expands short concepts into rich, atmospheric prompts optimized for Flux and SDXL.',
    inputs: [],
    outputs: [{ id: 'STRING', name: 'STRING', type: 'STRING', label: 'PROMPT_TEXT' }],
    widgets: [
      {
        name: 'concept',
        label: 'concept',
        type: 'textarea',
        default: 'cyberpunk tea house in Neo-Tokyo rain with glowing lanterns',
        placeholder: 'Quick concept...',
      },
      {
        name: 'style',
        label: 'style',
        type: 'select',
        default: 'cinematic photorealistic',
        options: [
          { label: 'Cinematic Photorealistic', value: 'cinematic photorealistic' },
          { label: 'Anime / Makoto Shinkai', value: 'anime makoto shinkai aesthetic' },
          { label: 'Dark Fantasy Concept Art', value: 'dark fantasy concept art' },
          { label: 'Studio Product Shot', value: 'studio lighting commercial photography' },
          { label: 'Cyberpunk Neon Noir', value: 'cyberpunk neon noir 8k' },
        ],
      },
    ],
    defaultValues: {
      concept: 'cyberpunk tea house in Neo-Tokyo rain with glowing lanterns',
      style: 'cinematic photorealistic',
    },
  },

  LLMReasoningNode: {
    type: 'LLMReasoningNode',
    title: 'LLM 深度思考推理节点 (DeepSeek V4 / Agnes 3.0)',
    category: 'conditioning',
    colorTag: '#6366f1',
    description: '商汤日日新 DeepSeek V4 / Agnes 3.0 深度推理思考节点，具备思维链 (CoT) 推理能力，支持视觉构图反推、提示词高精扩写与负向词自动提炼。',
    inputs: [
      { id: 'clip', name: 'clip', type: 'CLIP', label: 'CLIP' },
      { id: 'input_text', name: 'input_text', type: 'STRING', label: '输入概念/文本' },
    ],
    outputs: [
      { id: 'CONDITIONING', name: 'CONDITIONING', type: 'CONDITIONING', label: 'CONDITIONING' },
      { id: 'STRING', name: 'STRING', type: 'STRING', label: '精炼提示词' },
      { id: 'THOUGHTS', name: 'THOUGHTS', type: 'STRING', label: '思维链 (Reasoning)' },
    ],
    widgets: [
      {
        name: 'provider',
        label: '推理服务商',
        type: 'select',
        default: 'sensenova',
        options: [
          { label: '商汤日日新 (SenseNova DeepSeek V4)', value: 'sensenova' },
          { label: 'Agnes AI (ApiHub Agnes 3.0 Flash)', value: 'agnes' },
          { label: 'Google Gemini (Gemini 2.5 Flash)', value: 'gemini' },
        ],
      },
      {
        name: 'model',
        label: '推理模型',
        type: 'select',
        default: 'deepseek-v4-flash',
        options: [
          { label: 'deepseek-v4-flash (商汤深度思考 1M 上下文)', value: 'deepseek-v4-flash' },
          { label: 'deepseek-v4-pro (商汤满血旗舰推理)', value: 'deepseek-v4-pro' },
          { label: 'glm-5.2 (清华智谱通用大模型)', value: 'glm-5.2' },
          { label: 'sensenova-6.8-flash-lite (商汤轻量多模态)', value: 'sensenova-6.8-flash-lite' },
          { label: 'agnes-3.0-flash (Agnes 深度推理)', value: 'agnes-3.0-flash' },
          { label: 'agnes-2.5-pro-alpha (Agnes 逻辑分析)', value: 'agnes-2.5-pro-alpha' },
          { label: 'gemini-2.5-flash (Google 多模态)', value: 'gemini-2.5-flash' },
        ],
      },
      {
        name: 'task_type',
        label: '推理任务模式',
        type: 'select',
        default: 'cinematic_photoreal',
        options: [
          { label: '超写实电影感扩写 (8k摄影/光影构图)', value: 'cinematic_photoreal' },
          { label: '二次元美学精修 (新海诚/吉卜力动漫)', value: 'anime_aesthetic' },
          { label: '商业广告与静物渲染 (Studio摄影/质感)', value: 'commercial_product' },
          { label: '暗黑神话与奇幻场景 (虚幻5/概念艺术)', value: 'dark_fantasy' },
          { label: '自由逻辑推理与提示词翻译', value: 'free_reasoning' },
        ],
      },
      {
        name: 'prompt',
        label: '初始构思 (Prompt Concept)',
        type: 'textarea',
        default: 'a cyberpunk girl holding an umbrella under neon lights in rain',
        placeholder: '输入原始概念或词组，模型将开启思维链推理并生成终极提示词...',
      },
    ],
    defaultValues: {
      provider: 'sensenova',
      model: 'deepseek-v4-flash',
      task_type: 'cinematic_photoreal',
      prompt: 'a cyberpunk girl holding an umbrella under neon lights in rain',
      reasoning_output: '',
      refined_output: '',
    },
  },

  // ===================== LATENT =====================
  EmptyLatentImage: {
    type: 'EmptyLatentImage',
    title: 'Empty Latent Image',
    category: 'latent',
    colorTag: '#b347ff',
    description: 'Creates a blank latent tensor space with specified dimensions and batch size.',
    inputs: [],
    outputs: [{ id: 'LATENT', name: 'LATENT', type: 'LATENT', label: 'LATENT' }],
    widgets: [
      {
        name: 'width',
        label: 'width',
        type: 'number',
        default: 1024,
      },
      {
        name: 'height',
        label: 'height',
        type: 'number',
        default: 1024,
      },
      {
        name: 'batch_size',
        label: 'batch_size',
        type: 'slider',
        default: 1,
        min: 1,
        max: 4,
        step: 1,
      },
    ],
    defaultValues: {
      width: 1024,
      height: 1024,
      batch_size: 1,
    },
  },

  // ===================== SAMPLING =====================
  KSampler: {
    type: 'KSampler',
    title: 'KSampler',
    category: 'sampling',
    colorTag: '#3b82f6',
    description: 'The core ComfyUI sampler node. Iteratively denoises latent tensors guided by conditioning.',
    inputs: [
      { id: 'model', name: 'model', type: 'MODEL', label: 'MODEL' },
      { id: 'positive', name: 'positive', type: 'CONDITIONING', label: 'positive' },
      { id: 'negative', name: 'negative', type: 'CONDITIONING', label: 'negative' },
      { id: 'latent_image', name: 'latent_image', type: 'LATENT', label: 'latent_image' },
    ],
    outputs: [{ id: 'LATENT', name: 'LATENT', type: 'LATENT', label: 'LATENT' }],
    widgets: [
      {
        name: 'seed',
        label: 'seed',
        type: 'seed',
        default: 428912389,
      },
      {
        name: 'control_after_generate',
        label: 'control_after_generate',
        type: 'select',
        default: 'randomize',
        options: [
          { label: 'randomize', value: 'randomize' },
          { label: 'fixed', value: 'fixed' },
          { label: 'increment', value: 'increment' },
          { label: 'decrement', value: 'decrement' },
        ],
      },
      {
        name: 'steps',
        label: 'steps',
        type: 'slider',
        default: 25,
        min: 1,
        max: 80,
        step: 1,
      },
      {
        name: 'cfg',
        label: 'cfg',
        type: 'slider',
        default: 4.5,
        min: 1.0,
        max: 20.0,
        step: 0.1,
      },
      {
        name: 'sampler_name',
        label: 'sampler_name',
        type: 'select',
        default: 'euler',
        options: SAMPLER_OPTIONS,
      },
      {
        name: 'scheduler',
        label: 'scheduler',
        type: 'select',
        default: 'normal',
        options: SCHEDULER_OPTIONS,
      },
      {
        name: 'denoise',
        label: 'denoise',
        type: 'slider',
        default: 1.0,
        min: 0.0,
        max: 1.0,
        step: 0.01,
      },
    ],
    defaultValues: {
      seed: 428912389,
      control_after_generate: 'randomize',
      steps: 25,
      cfg: 4.5,
      sampler_name: 'euler',
      scheduler: 'normal',
      denoise: 1.0,
    },
  },

  // ===================== IMAGE & VAE =====================
  VAEEncode: {
    type: 'VAEEncode',
    title: 'VAE 编码器 (VAE Encode / 图像转潜空间)',
    category: 'latent',
    colorTag: '#ff3366',
    description: '将输入像素图像通过 VAE 变分自编码器压缩为 Latent 潜空间张量，用于图生图 (Img2Img) 或重绘。',
    inputs: [
      { id: 'pixels', name: 'pixels', type: 'IMAGE', label: 'pixels' },
      { id: 'vae', name: 'vae', type: 'VAE', label: 'vae' },
    ],
    outputs: [{ id: 'LATENT', name: 'LATENT', type: 'LATENT', label: 'LATENT' }],
    widgets: [],
    defaultValues: {},
  },

  VAEDecode: {
    type: 'VAEDecode',
    title: 'VAE Decode',
    category: 'image',
    colorTag: '#ff3366',
    description: 'Decodes a compressed latent representation into full pixel RGB image space.',
    inputs: [
      { id: 'samples', name: 'samples', type: 'LATENT', label: 'samples' },
      { id: 'vae', name: 'vae', type: 'VAE', label: 'vae' },
    ],
    outputs: [{ id: 'IMAGE', name: 'IMAGE', type: 'IMAGE', label: 'IMAGE' }],
    widgets: [],
    defaultValues: {},
  },

  SaveImage: {
    type: 'SaveImage',
    title: 'Save Image',
    category: 'image',
    colorTag: '#10b981',
    description: 'Displays the final decoded image with download and metadata inspection options.',
    inputs: [{ id: 'images', name: 'images', type: 'IMAGE', label: 'images' }],
    outputs: [],
    widgets: [
      {
        name: 'filename_prefix',
        label: 'filename_prefix',
        type: 'text',
        default: 'ComfyCanvas',
      },
    ],
    defaultValues: {
      filename_prefix: 'ComfyCanvas',
    },
  },

  // ===================== PROVIDERS / HUBS =====================
  CivitaiLoRABrowserNode: {
    type: 'CivitaiLoRABrowserNode',
    title: 'Civitai LoRA Hub',
    category: 'providers',
    colorTag: '#3b82f6',
    description: 'Search & pick real-time LoRAs from developer.civitai.com directly on canvas.',
    inputs: [],
    outputs: [
      { id: 'STRING', name: 'STRING', type: 'STRING', label: 'TRIGGER_WORDS' },
    ],
    widgets: [
      {
        name: 'search_keyword',
        label: 'search_keyword',
        type: 'text',
        default: 'Anime style',
        placeholder: 'Search Civitai LoRAs...',
      },
      {
        name: 'selected_model_name',
        label: 'selected_model_name',
        type: 'text',
        default: 'Ghibli Style XL',
      },
      {
        name: 'selected_triggers',
        label: 'selected_triggers',
        type: 'text',
        default: 'ghibli style, studio ghibli anime, painterly sky',
      },
    ],
    defaultValues: {
      search_keyword: 'Anime style',
      selected_model_name: 'Ghibli Style XL',
      selected_triggers: 'ghibli style, studio ghibli anime, painterly sky',
    },
  },

  ModelScopeNode: {
    type: 'ModelScopeNode',
    title: '魔搭 CN (modelscope.cn 国内站)',
    category: 'providers',
    colorTag: '#6366f1',
    description: '通过魔搭社区国内站 (modelscope.cn) API 执行推理。',
    inputs: [
      { id: 'positive', name: 'positive', type: 'CONDITIONING', label: 'prompt' },
      { id: 'negative', name: 'negative', type: 'CONDITIONING', label: 'negative' },
    ],
    outputs: [{ id: 'IMAGE', name: 'IMAGE', type: 'IMAGE', label: 'IMAGE' }],
    widgets: [
      {
        name: 'model_endpoint',
        label: 'model_endpoint',
        type: 'text',
        default: 'Tongyi-MAI/Z-Image-Turbo',
        placeholder: '输入 ModelScope 模型 ID (如 damo/wan2.1-t2i)',
      },
      {
        name: 'steps',
        label: 'steps',
        type: 'slider',
        default: 8,
        min: 4,
        max: 60,
        step: 1,
      },
    ],
    defaultValues: {
      model_endpoint: 'Tongyi-MAI/Z-Image-Turbo',
      steps: 8,
    },
  },

  ModelScopeAiNode: {
    type: 'ModelScopeAiNode',
    title: '魔搭 AI (modelscope.ai 国际站)',
    category: 'providers',
    colorTag: '#7c3aed',
    description: '通过魔搭社区国际站 (modelscope.ai) API 执行推理。',
    inputs: [
      { id: 'positive', name: 'positive', type: 'CONDITIONING', label: 'prompt' },
      { id: 'negative', name: 'negative', type: 'CONDITIONING', label: 'negative' },
    ],
    outputs: [{ id: 'IMAGE', name: 'IMAGE', type: 'IMAGE', label: 'IMAGE' }],
    widgets: [
      {
        name: 'model_endpoint',
        label: 'model_endpoint',
        type: 'text',
        default: 'Tongyi-MAI/Z-Image-Turbo',
        placeholder: '输入 ModelScope AI 模型 ID',
      },
      {
        name: 'steps',
        label: 'steps',
        type: 'slider',
        default: 8,
        min: 4,
        max: 60,
        step: 1,
      },
    ],
    defaultValues: {
      model_endpoint: 'Tongyi-MAI/Z-Image-Turbo',
      steps: 8,
    },
  },

  NanoGPTNode: {
    type: 'NanoGPTNode',
    title: 'NanoGPT Fast Engine',
    category: 'providers',
    colorTag: '#06b6d4',
    description: 'Ultra-fast pay-per-image inference via nano-gpt.com API (Flux, SDXL).',
    inputs: [
      { id: 'positive', name: 'positive', type: 'CONDITIONING', label: 'prompt' },
    ],
    outputs: [{ id: 'IMAGE', name: 'IMAGE', type: 'IMAGE', label: 'IMAGE' }],
    widgets: [
      {
        name: 'model',
        label: 'model',
        type: 'text',
        default: 'flux-schnell',
        placeholder: 'NanoGPT 模型 ID',
      },
      {
        name: 'resolution',
        label: 'resolution',
        type: 'select',
        default: '1024x1024',
        options: [
          { label: '1024x1024 (Square)', value: '1024x1024' },
          { label: '1280x720 (16:9 Wide)', value: '1280x720' },
          { label: '720x1280 (9:16 Portrait)', value: '720x1280' },
        ],
      },
    ],
    defaultValues: {
      model: 'flux-schnell',
      resolution: '1024x1024',
    },
  },

  FalAIEngineNode: {
    type: 'FalAIEngineNode',
    title: 'Fal.ai 旗舰推理引擎',
    category: 'providers',
    colorTag: '#00f0ff',
    description: '直连 Fal.ai 官方极速云端 GPU，原生支持 FLUX 全系列与带 LoRA 高阶推理。',
    inputs: [
      { id: 'positive', name: 'positive', type: 'CONDITIONING', label: 'prompt' },
      { id: 'negative', name: 'negative', type: 'CONDITIONING', label: 'negative' },
      { id: 'lora', name: 'lora', type: 'MODEL', label: 'lora_model' },
    ],
    outputs: [{ id: 'IMAGE', name: 'IMAGE', type: 'IMAGE', label: 'IMAGE' }],
    widgets: [
      {
        name: 'model',
        label: 'model',
        type: 'text',
        default: 'fal-ai/flux/dev',
        placeholder: '从模型枢纽中选用端点 ID',
      },
      {
        name: 'steps',
        label: 'steps',
        type: 'slider',
        default: 28,
        min: 4,
        max: 50,
        step: 1,
      },
      {
        name: 'guidance_scale',
        label: 'guidance_scale',
        type: 'slider',
        default: 3.5,
        min: 1.0,
        max: 12.0,
        step: 0.1,
      },
      {
        name: 'resolution',
        label: 'resolution',
        type: 'select',
        default: '1024x1024',
        options: [
          { label: '1024x1024 (1:1 正方形)', value: '1024x1024' },
          { label: '1152x768 (16:9 横版风景)', value: '1152x768' },
          { label: '768x1152 (9:16 竖屏人像)', value: '768x1152' },
          { label: '1280x720 (720p 电影画幅)', value: '1280x720' },
          { label: '2048x2048 (2K 超大解析度)', value: '2048x2048' },
        ],
      },
    ],
    defaultValues: {
      model: 'fal-ai/flux/dev',
      steps: 28,
      guidance_scale: 3.5,
      resolution: '1024x1024',
    },
  },

  GoogleImagenNode: {
    type: 'GoogleImagenNode',
    title: 'Google Imagen 3 (官方直连引擎)',
    category: 'providers',
    colorTag: '#4285F4',
    description: '直连 Google Imagen 3.0 / Gemini 视觉大模型，官方原生超高保真扩散画质，开箱即用。',
    inputs: [
      { id: 'positive', name: 'positive', type: 'CONDITIONING', label: 'prompt' },
      { id: 'negative', name: 'negative', type: 'CONDITIONING', label: 'negative' },
    ],
    outputs: [{ id: 'IMAGE', name: 'IMAGE', type: 'IMAGE', label: 'IMAGE' }],
    widgets: [
      {
        name: 'model',
        label: 'model',
        type: 'select',
        default: 'imagen-3.0-generate-002',
        options: [
          { label: 'Google Imagen 3.0 (高保真写实旗舰)', value: 'imagen-3.0-generate-002' },
          { label: 'Gemini 3.8 Flash (视觉扩展)', value: 'gemini-3.8-flash' },
        ],
      },
      {
        name: 'aspect_ratio',
        label: 'aspect_ratio',
        type: 'select',
        default: '1:1',
        options: [
          { label: '1:1 (正方形 1024x1024)', value: '1:1' },
          { label: '16:9 (电影横屏 1280x720)', value: '16:9' },
          { label: '9:16 (手机竖屏 720x1280)', value: '9:16' },
          { label: '4:3 (标准画幅 1024x768)', value: '4:3' },
          { label: '3:4 (竖向画幅 768x1024)', value: '3:4' },
        ],
      },
    ],
    defaultValues: {
      model: 'imagen-3.0-generate-002',
      aspect_ratio: '1:1',
    },
  },

  AIVideoNode: {
    type: 'AIVideoNode',
    title: 'AI 电影级视频生成 (Wan 2.1 / LTX / Kling)',
    category: 'providers',
    colorTag: '#a3e635',
    description: '生成电影级 AI 动态视频，支持 Wan 2.1、LTX-Video、可灵 Kling 1.5、CogVideoX 及海螺 MiniMax。',
    inputs: [
      { id: 'positive', name: 'positive', type: 'CONDITIONING', label: 'prompt' },
      { id: 'negative', name: 'negative', type: 'CONDITIONING', label: 'negative' },
      { id: 'init_image', name: 'init_image', type: 'IMAGE', label: 'init_image' },
    ],
    outputs: [
      { id: 'VIDEO', name: 'VIDEO', type: 'VIDEO', label: 'VIDEO' },
      { id: 'IMAGE', name: 'IMAGE', type: 'IMAGE', label: 'FIRST_FRAME' },
    ],
    widgets: [
      {
        name: 'model',
        label: 'model (AI视频大模型)',
        type: 'text',
        default: 'fal-ai/wan/v2.1/text-to-video',
        placeholder: '输入视频大模型端点 ID',
      },
      {
        name: 'prompt',
        label: '运镜与动态描述 (Prompt)',
        type: 'text',
        default: 'cinematic aerial orbit shot, floating castle islands in the sky, warm golden hour, 8k cinematic masterpiece',
        placeholder: '输入动态运镜与场景描述...',
      },
      {
        name: 'negative_prompt',
        label: '负向排畸词 (Negative Prompt)',
        type: 'text',
        default: 'jittery motion, fast sudden cut, blur, morphing distortion, low quality',
        placeholder: '输入负向排畸特征...',
      },
      {
        name: 'duration',
        label: 'duration (秒)',
        type: 'slider',
        default: 5,
        min: 3,
        max: 10,
        step: 1,
      },
      {
        name: 'fps',
        label: 'fps',
        type: 'select',
        default: 16,
        options: [
          { label: '16 fps (标准动态)', value: 16 },
          { label: '24 fps (电影胶片帧率)', value: 24 },
          { label: '30 fps (高流畅)', value: 30 },
        ],
      },
      {
        name: 'aspect_ratio',
        label: 'aspect_ratio',
        type: 'select',
        default: '16:9',
        options: [
          { label: '16:9 (电影横屏)', value: '16:9' },
          { label: '9:16 (短视频竖屏)', value: '9:16' },
          { label: '1:1 (正方形)', value: '1:1' },
          { label: '4:3 (经典比例)', value: '4:3' },
        ],
      },
    ],
    defaultValues: {
      model: 'fal-ai/wan/v2.1/text-to-video',
      duration: 5,
      fps: 16,
      aspect_ratio: '16:9',
    },
  },

  SaveVideo: {
    type: 'SaveVideo',
    title: '保存视频 (Save Video)',
    category: 'image',
    colorTag: '#a3e635',
    description: '播放并导出解算完成的 MP4 动态视频流。',
    inputs: [{ id: 'video', name: 'video', type: 'VIDEO', label: 'video' }],
    outputs: [],
    widgets: [
      {
        name: 'filename_prefix',
        label: 'filename_prefix',
        type: 'text',
        default: 'ComfyCanvas_Video',
      },
    ],
    defaultValues: {
      filename_prefix: 'ComfyCanvas_Video',
    },
  },

  LoadImage: {
    type: 'LoadImage',
    title: '加载参考图 (Load Image)',
    category: 'loaders',
    colorTag: '#38bdf8',
    description: '加载输入图像，作为图生图 (Img2Img)、图生视频 (I2V) 或 ControlNet 参考图。',
    inputs: [],
    outputs: [{ id: 'IMAGE', name: 'IMAGE', type: 'IMAGE', label: 'IMAGE' }],
    widgets: [
      {
        name: 'image_url',
        label: 'image_url',
        type: 'text',
        default: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0695b6d7-40ad-4df5-b99a-ba27550b9a58/original=true/preview.jpeg',
        placeholder: '输入图像 URL 或从资产库选择...',
      },
    ],
    defaultValues: {
      image_url: 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0695b6d7-40ad-4df5-b99a-ba27550b9a58/original=true/preview.jpeg',
    },
  },

  ImageUpscaleWithModel: {
    type: 'ImageUpscaleWithModel',
    title: '4K/8K 图像高清放大器 (Upscaler)',
    category: 'image',
    colorTag: '#10b981',
    description: '采用 Clarity AI / CCSR 超分辨率模型，对图像进行 2x/4x 细节重塑与毛孔纹理放大。',
    inputs: [{ id: 'image', name: 'image', type: 'IMAGE', label: 'image' }],
    outputs: [{ id: 'IMAGE', name: 'IMAGE', type: 'IMAGE', label: 'IMAGE' }],
    widgets: [
      {
        name: 'model_name',
        label: 'model_name',
        type: 'select',
        default: 'fal-ai/clarity-upscaler',
        options: [
          { label: 'Clarity AI (人像皮肤纹理高清增强放大)', value: 'fal-ai/clarity-upscaler' },
          { label: 'CCSR 4K/8K (超分辨率细节重塑放大器)', value: 'fal-ai/ccsr' },
          { label: 'RealESRGAN_x4plus (通用动漫与二次元)', value: 'RealESRGAN_x4plus' },
        ],
      },
      {
        name: 'scale_by',
        label: 'scale_by',
        type: 'slider',
        default: 2.0,
        min: 1.5,
        max: 4.0,
        step: 0.5,
      },
    ],
    defaultValues: {
      model_name: 'fal-ai/clarity-upscaler',
      scale_by: 2.0,
    },
  },
};
