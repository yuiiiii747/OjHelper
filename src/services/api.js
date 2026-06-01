/**
 * API 服务 — 调用 OpenAI 兼容接口
 * 支持 OpenAI / DeepSeek / 任意兼容 Endpoint
 */

const DEFAULT_CONFIG = {
  endpoint: 'https://api.openai.com/v1',
  model: 'gpt-4o',
  apiKey: '',
  temperature: 0.7,
}

function getConfig() {
  try {
    const raw = localStorage.getItem('carol_api_config')
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_CONFIG
}

export function isApiReady() {
  const cfg = getConfig()
  return !!(cfg.apiKey && cfg.apiKey.startsWith('sk-'))
}

/**
 * 发送 Chat Completion 请求
 * @param {object[]} messages - [{role, content}]
 * @param {object} overrides  - 可选覆盖配置
 * @returns {Promise<string>} response text
 */
export async function chatComplete(messages, overrides = {}) {
  const cfg = { ...getConfig(), ...overrides }

  if (!cfg.apiKey) {
    throw new Error('API_KEY_MISSING')
  }

  const body = {
    model: cfg.model,
    messages,
    temperature: cfg.temperature,
    stream: false,
  }

  const endpoint = `${cfg.endpoint.replace(/\/+$/, '')}/chat/completions`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    let msg = `API 请求失败 (${res.status})`
    try {
      const err = JSON.parse(errBody)
      if (err.error?.message) msg = err.error.message
    } catch { /* */ }
    throw new Error(msg)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}
