import { BaseEngineDriver } from '../BaseEngineDriver';
import {
  NormalizedGenerateParams,
  NormalizedGenerateResult,
  NormalizedChatParams,
  NormalizedChatResult,
  ModelSpec,
} from '../types';

export class GeminiDriver extends BaseEngineDriver {
  readonly id = 'gemini';
  readonly name = 'Google Imagen 3 (官方直连)';
  readonly label = 'Google 官方 Imagen 3 / Gemini';
  readonly badgeColor = '#10b981';
  readonly description = 'Google 官方 Imagen 3.0 旗舰高保真扩散模型与 Gemini 2.5 Flash 深度思考推理模型。系统级免配置直接可用。';
  readonly capabilities = ['text2img', 'reasoning'] as const;

  readonly supportedModels: ModelSpec[] = [
    {
      id: 'imagen-3.0-generate-002',
      name: 'Google Imagen 3.0 (高保真生图)',
      type: 'image',
      description: 'Google 官方旗舰，顶级光影折射与艺术审美',
      defaultSteps: 25,
      defaultCfg: 5.0,
      supportsLora: false,
    },
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash (多模态推理)',
      type: 'reasoning',
      description: '多模态视觉推理与超快文本生成',
    },
  ];

  protected async executeGenerate(
    params: NormalizedGenerateParams,
    keys: Record<string, string>
  ): Promise<NormalizedGenerateResult> {
    const effectiveKey = params.apiKey || keys.geminiKey || '';

    const resp = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(effectiveKey ? { 'x-gemini-key': effectiveKey } : {}),
      },
      body: JSON.stringify({
        prompt: params.prompt,
        negative_prompt: params.negative_prompt,
        width: params.width || 1024,
        height: params.height || 1024,
        cfg: params.cfg,
        seed: params.seed,
        loras: (params.loras || []).map((l) => ({
          name: l.name,
          strength: l.strength ?? l.modelStrength ?? 0.8,
          triggers: l.triggers,
        })),
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Google Imagen 3 生成失败' }));
      throw new Error(err.details || err.error || `Google Imagen 错误 (${resp.status})`);
    }

    const data = await resp.json();
    return {
      mediaUrl: data.imageUrl,
      mediaType: 'image',
      provider: this.name,
      providerId: this.id,
      model: data.model || params.model || 'imagen-3.0-generate-002',
      requestedModel: params.model,
      seed: data.seed ?? (params.seed || 12345),
      rawResponse: data,
    };
  }

  protected async executeChat(
    params: NormalizedChatParams,
    keys: Record<string, string>
  ): Promise<NormalizedChatResult> {
    const effectiveKey = params.apiKey || keys.geminiKey || '';

    const resp = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(effectiveKey ? { 'x-gemini-key': effectiveKey } : {}),
      },
      body: JSON.stringify({
        messages: params.messages,
        model: params.model || 'gemini-2.5-flash',
        temperature: params.temperature,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Gemini 聊天推理失败' }));
      throw new Error(err.details || err.error || `Gemini 错误 (${resp.status})`);
    }

    const data = await resp.json();
    return {
      content: data.content || '',
      provider: this.name,
      providerId: this.id,
      model: data.model || params.model || 'gemini-2.5-flash',
    };
  }
}
