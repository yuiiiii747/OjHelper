<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { appStore, MODES, MODE_LABELS } from '../stores/appStore.js'
import { isApiReady, chatComplete } from '../services/api.js'
import { explainSystemPrompt, debugSystemPrompt, reviewSystemPrompt, buildMessages } from '../services/prompts.js'
import { parseResult } from '../services/parser.js'

const panelRef = ref(null)
const resultRef = ref(null)
const submitBtnRef = ref(null)
const errorMsg = ref('')
let ctx = null

const apiReady = computed(() => isApiReady())

function btnClass() {
  return appStore.activeMode === MODES.DEBUG ? 'btn-rose' : 'btn-green'
}

async function handleSubmit() {
  if (appStore.isProcessing) return
  errorMsg.value = ''

  if (!isApiReady()) {
    errorMsg.value = '请先在顶部配置 API Key'
    shakeBtn()
    return
  }

  if (!appStore.inputText.trim() && !appStore.uploadedImage && !appStore.userCode.trim()) {
    errorMsg.value = appStore.activeMode === MODES.DEBUG ? '请粘贴代码' : '请输入题目描述或上传截图'
    shakeBtn()
    return
  }

  if (appStore.activeMode === MODES.DEBUG && !appStore.userCode.trim()) {
    errorMsg.value = '请粘贴需要调试的代码'
    shakeBtn()
    return
  }

  appStore.isProcessing = true
  appStore.clearResult()
  pulseBtn()

  try {
    let result

    switch (appStore.activeMode) {
      case MODES.EXPLAIN: {
        const sys = explainSystemPrompt()
        const desc = appStore.inputText.trim() || '请分析截图中这道 OJ 题目'
        if (appStore.uploadedImage) {
          const b64 = await toBase64(appStore.uploadedImage)
          const c = [{ type: 'text', text: desc }, { type: 'image_url', image_url: { url: b64 } }]
          const raw = await chatComplete(buildMessages(MODES.EXPLAIN, sys, c))
          result = parseResult(raw, MODES.EXPLAIN)
        } else {
          const raw = await chatComplete(buildMessages(MODES.EXPLAIN, sys, desc))
          result = parseResult(raw, MODES.EXPLAIN)
        }
        break
      }
      case MODES.DEBUG: {
        const sys = debugSystemPrompt()
        const desc = appStore.inputText.trim() ? `题目描述：${appStore.inputText.trim()}\n\n` : ''
        const err = `提交状态：${appStore.debugErrorType}`
        const code = `用户代码：\n\`\`\`\n${appStore.userCode}\n\`\`\``
        const msg = `${desc}${err}\n\n${code}`
        if (appStore.uploadedImage) {
          const b64 = await toBase64(appStore.uploadedImage)
          const c = [{ type: 'text', text: msg }, { type: 'image_url', image_url: { url: b64 } }]
          const raw = await chatComplete(buildMessages(MODES.DEBUG, sys, c))
          result = parseResult(raw, MODES.DEBUG)
        } else {
          const raw = await chatComplete(buildMessages(MODES.DEBUG, sys, msg))
          result = parseResult(raw, MODES.DEBUG)
        }
        break
      }
      case MODES.REVIEW: {
        const sys = reviewSystemPrompt()
        const scopeMap = { all: '全部错题', week: '最近一周', topic: '指定考点', errorType: '指定错误类型' }
        const typeMap = { idea: '只看思路', full: '写完整代码', fill: '代码填空', core: '只写核心函数' }
        const msg =
          `复习范围：${scopeMap[appStore.reviewScope]}\n` +
          `练习形式：${typeMap[appStore.practiceType]}\n\n` +
          (appStore.inputText.trim() ? `补充：${appStore.inputText.trim()}\n` : '')
        const raw = await chatComplete(buildMessages(MODES.REVIEW, sys, msg))
        result = parseResult(raw, MODES.REVIEW)
        break
      }
    }

    // Save to history
    appStore.addHistory(result)
    nextTick(() => animateResult())
  } catch (err) {
    errorMsg.value = err.message === 'API_KEY_MISSING'
      ? '请先配置 API Key'
      : `请求失败：${err.message}`
  } finally {
    appStore.isProcessing = false
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

/* GSAP */
function pulseBtn() {
  if (!submitBtnRef.value) return
  gsap.timeline()
    .to(submitBtnRef.value, { scale: 0.95, duration: 0.1, ease: 'power2.out' })
    .to(submitBtnRef.value, { scale: 1, duration: 0.1, ease: 'back.out(2)' })
}

function shakeBtn() {
  if (!submitBtnRef.value) return
  gsap.to(submitBtnRef.value, { x: [-4, 4, -2, 2, -1, 1, 0], duration: 0.35, ease: 'power3.out' })
}

function animateResult() {
  if (!resultRef.value) return
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  const h = resultRef.value.querySelector('.result-head')
  if (h) tl.from(h, { y: -12, autoAlpha: 0, duration: 0.3 })
  const items = resultRef.value.querySelectorAll('.result-sec, .result-code')
  if (items.length) tl.from(items, { y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.06 }, '-=0.05')
}

function copyCode() {
  if (appStore.result?.code) navigator.clipboard?.writeText(appStore.result.code)
}

function clearAll() {
  appStore.clearInput()
  appStore.clearResult()
  errorMsg.value = ''
}

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(panelRef.value?.children, {
      y: 10, autoAlpha: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out',
    })
  }, panelRef.value)
})

onUnmounted(() => { ctx?.revert() })
</script>

<template>
  <div ref="panelRef" class="result-panel surface">
    <!-- API warning -->
    <div v-if="!apiReady && !appStore.isProcessing" class="warn-bar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span>API 未配置 — 点击顶部 <strong>API</strong> 按钮设置</span>
    </div>

    <!-- Error -->
    <transition name="fade">
      <div v-if="errorMsg" class="err-bar">
        <span>{{ errorMsg }}</span>
      </div>
    </transition>

    <!-- Submit -->
    <div class="submit-row">
      <button
        ref="submitBtnRef"
        class="btn-submit"
        :class="[btnClass(), { loading: appStore.isProcessing }]"
        :disabled="appStore.isProcessing"
        @click="handleSubmit"
      >
        <span v-if="!appStore.isProcessing" class="s-content">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          开始分析
        </span>
        <span v-else class="s-content">
          <span class="spin" />
          AI 分析中...
        </span>
      </button>

      <button
        v-if="appStore.result || appStore.inputText || appStore.uploadedImage || appStore.userCode"
        class="btn-secondary"
        @click="clearAll"
      >清空</button>
    </div>

    <!-- Skeleton -->
    <div v-if="appStore.isProcessing" class="skeleton">
      <div class="sk-l w-65" /><div class="sk-l w-85" /><div class="sk-l w-50" />
      <div class="sk-l w-75" /><div class="sk-l w-55" />
    </div>

    <!-- Result -->
    <div v-if="appStore.result && !appStore.isProcessing" ref="resultRef" class="result-area">
      <div class="result-head">
        <h2>{{ appStore.result.title }}</h2>
        <span class="badge" :class="appStore.result.type === MODES.DEBUG ? 'badge-rose' : 'badge-green'">
          {{ MODE_LABELS[appStore.result.type] }}
        </span>
      </div>

      <div
        v-for="(sec, i) in appStore.result.sections"
        :key="i"
        class="result-sec"
        :style="{ borderLeftColor: appStore.result.type === MODES.DEBUG ? 'var(--rose)' : 'var(--green)' }"
      >
        <h3 class="sec-title" :class="appStore.result.type === MODES.DEBUG ? 't-rose' : 't-green'">
          {{ sec.title }}
        </h3>
        <div class="sec-body">
          <p v-for="(l, li) in sec.content" :key="li" class="sec-line">{{ l }}</p>
        </div>
      </div>

      <!-- Code -->
      <div v-if="appStore.result.code" class="result-code">
        <h3 class="sec-title t-green">代码实现</h3>
        <div class="code-block">
          <button class="cpy-btn" @click="copyCode">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            复制
          </button>
          <pre><code>{{ appStore.result.code }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-panel { display: flex; flex-direction: column; gap: 0.6rem; }

/* Warning */
.warn-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.7rem;
  background: var(--green-light);
  border: 1px solid rgba(86,115,87,0.2);
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  color: var(--text-secondary);
}
.warn-bar strong { color: var(--green); }

/* Error */
.err-bar {
  padding: 0.4rem 0.65rem;
  background: var(--rose-light);
  border: 1px solid rgba(229,136,137,0.2);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--danger);
}

/* Submit */
.submit-row { display: flex; gap: 0.4rem; align-items: center; }

.btn-submit {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 1.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  color: #fff;
  transition: background 0.2s, transform 0.15s;
}
.btn-submit.btn-green { background: var(--green); }
.btn-submit.btn-rose { background: var(--rose); }
.btn-submit.btn-green:hover { background: #4a654a; }
.btn-submit.btn-rose:hover { background: #d47778; }
.btn-submit:active { transform: scale(0.97); }
.btn-submit.loading { opacity: 0.8; cursor: not-allowed; }
.btn-submit:disabled { cursor: not-allowed; transform: none !important; }

.s-content { display: flex; align-items: center; gap: 0.35rem; }

.spin {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: sp 0.7s linear infinite;
}
@keyframes sp { to { transform: rotate(360deg); } }

/* Skeleton */
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.8rem;
  background: var(--bg-inset);
  border-radius: var(--radius-sm);
}
.sk-l {
  height: 12px;
  border-radius: 4px;
  animation: sh 1.5s ease-in-out infinite;
  background: linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-surface) 50%, var(--bg-hover) 75%);
  background-size: 200% 100%;
}
@keyframes sh { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.w-65 { width: 65%; } .w-85 { width: 85%; } .w-50 { width: 50%; } .w-75 { width: 75%; } .w-55 { width: 55%; }

/* Result */
.result-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.result-head h2 { font-size: 1.05rem; }

.result-sec {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-left: 3px solid var(--green);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.85rem;
}

.sec-title {
  font-size: 0.84rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.sec-title.t-green { color: var(--green); }
.sec-title.t-rose { color: #c96a6b; }

.sec-body { display: flex; flex-direction: column; gap: 0.15rem; }
.sec-line {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Code */
.result-code { }
.code-block {
  position: relative;
  background: #2a2624;
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-top: 0.35rem;
}
.code-block pre {
  padding: 0.85rem;
  overflow-x: auto;
  font-size: 0.75rem;
  line-height: 1.5;
}
.code-block code {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', 'Courier New', monospace;
  color: #e8e0dc;
  white-space: pre;
}
.cpy-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  background: rgba(255,255,255,0.08);
  color: var(--text-muted);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 4px;
  font-size: 0.65rem;
  cursor: pointer;
}
.cpy-btn:hover { background: rgba(255,255,255,0.15); color: var(--text-secondary); }
</style>
