<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { appStore } from '../stores/appStore.js'

const emit = defineEmits(['close'])
const panelRef = ref(null)
let ctx = null

const form = reactive({
  endpoint: appStore.apiConfig.endpoint,
  model: appStore.apiConfig.model,
  apiKey: appStore.apiConfig.apiKey,
  temperature: appStore.apiConfig.temperature,
})

const showKey = ref(false)

function save() {
  appStore.setApiConfig({ ...form })
  emit('close')
}

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(panelRef.value?.children, {
      y: -6, autoAlpha: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out',
    })
  }, panelRef.value)
})

onUnmounted(() => { ctx?.revert() })
</script>

<template>
  <div ref="panelRef" class="api-panel">
    <div class="api-head">
      <h3>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        API 配置
      </h3>
      <button class="btn-ghost" @click="emit('close')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="api-body">
      <div class="fld">
        <label>API Endpoint</label>
        <input v-model="form.endpoint" placeholder="https://api.openai.com/v1" />
      </div>

      <div class="fld-row">
        <div class="fld flex-1">
          <label>模型</label>
          <input v-model="form.model" placeholder="gpt-4o / deepseek-chat / claude-3-opus..." />
        </div>
        <div class="fld flex-1">
          <label>Temperature</label>
          <div class="range-row">
            <input type="range" v-model.number="form.temperature" min="0" max="1" step="0.1" />
            <span class="range-val">{{ form.temperature }}</span>
          </div>
        </div>
      </div>

      <div class="fld">
        <label>API Key</label>
        <div class="key-wrap">
          <input :type="showKey ? 'text' : 'password'" v-model="form.apiKey" placeholder="sk-..." />
          <button class="key-eye" @click="showKey = !showKey">
            <svg v-if="!showKey" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="api-actions">
        <button class="btn-primary" @click="save">保存</button>
        <span class="api-note">配置保存在浏览器本地</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.api-panel {
  padding: 0.85rem 1.25rem 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.api-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.api-head h3 { display: flex; align-items: center; gap: 0.35rem; font-size: 0.92rem; }

.api-body { display: flex; flex-direction: column; gap: 0.6rem; }

.fld { display: flex; flex-direction: column; gap: 0.25rem; }
.fld label { font-size: 0.75rem; color: var(--text-secondary); font-weight: 600; }

.fld-row { display: flex; gap: 0.6rem; }
.flex-1 { flex: 1; }

.range-row { display: flex; align-items: center; gap: 0.4rem; }
.range-row input[type='range'] { flex: 1; padding: 0; border: none; accent-color: var(--green); box-shadow: none; }
.range-row input[type='range']:focus { box-shadow: none; }
.range-val { font-size: 0.82rem; color: var(--text-secondary); min-width: 1.4rem; text-align: center; font-variant-numeric: tabular-nums; }

.key-wrap { position: relative; }
.key-eye {
  position: absolute; right: 7px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 3px; display: flex;
}
.key-eye:hover { color: var(--text-secondary); }

.api-actions { display: flex; align-items: center; gap: 0.8rem; margin-top: 0.1rem; }
.api-note { font-size: 0.7rem; color: var(--text-muted); }
</style>
