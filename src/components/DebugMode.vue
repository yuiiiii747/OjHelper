<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { appStore, ERROR_TYPES } from '../stores/appStore.js'

const panelRef = ref(null)
let ctx = null

const errorTypeInfo = computed(() => ERROR_TYPES.find(e => e.value === appStore.debugErrorType))

function selectErrorType(value) { appStore.debugErrorType = value }

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(panelRef.value?.children, {
      y: 10, autoAlpha: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out',
    })
  }, panelRef.value)
})

onUnmounted(() => { ctx?.revert() })
</script>

<template>
  <div ref="panelRef" class="debug-panel surface">
    <div class="panel-head">
      <h3>纠错模式</h3>
      <span v-if="errorTypeInfo" class="badge" :class="errorTypeInfo.badge === 'danger' ? 'badge-danger' : errorTypeInfo.badge === 'warning' ? 'badge-warning' : 'badge-green'">
        {{ errorTypeInfo.label }}
      </span>
    </div>

    <div class="form-group">
      <label class="form-label">提交状态</label>
      <div class="error-grid">
        <button
          v-for="et in ERROR_TYPES"
          :key="et.value"
          class="error-btn"
          :class="{
            active: appStore.debugErrorType === et.value,
            'act-danger': et.badge === 'danger',
            'act-warning': et.badge === 'warning',
            'act-info': et.badge === 'info',
          }"
          @click="selectErrorType(et.value)"
        >
          <span class="et-code">{{ et.value }}</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">用户代码</label>
      <textarea
        v-model="appStore.userCode"
        placeholder="粘贴你的代码...&#10;支持 C/C++、Java、Python 等"
        rows="7"
        class="code-input"
        spellcheck="false"
      />
    </div>

    <details class="toggle">
      <summary class="toggle-summary">
        <span>AI 诊断流程</span>
        <svg class="toggle-arrow" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 4.5l3 3 3-3"/></svg>
      </summary>
      <div class="toggle-body">
        <div class="flow-item">
          <span class="flow-num" style="background:var(--green-light);color:var(--green)">1</span>
          <div><strong>代码想法识别</strong><p>推断方法、考点匹配、复杂度评估</p></div>
        </div>
        <div class="flow-item">
          <span class="flow-num" style="background:var(--rose-light);color:#c96a6b">2</span>
          <div>
            <strong>错误类型排查</strong>
            <p v-if="appStore.debugErrorType === 'WA'">优先查逻辑/边界/题意</p>
            <p v-else-if="appStore.debugErrorType === 'TLE'">优先查复杂度/死循环</p>
            <p v-else-if="appStore.debugErrorType === 'RE'">优先查越界/除0/非法访问</p>
            <p v-else-if="appStore.debugErrorType === 'CE'">优先查语法/头文件/类型</p>
            <p v-else>针对性排查</p>
          </div>
        </div>
        <div class="flow-item">
          <span class="flow-num" style="background:var(--green-light);color:var(--green)">3</span>
          <div><strong>定位错误</strong><p>语法 → 逻辑 → 方法 → 边界 → 输出</p></div>
        </div>
        <div class="flow-item">
          <span class="flow-num" style="background:var(--rose-light);color:#c96a6b">4</span>
          <div><strong>输出反馈</strong><p>结论 → 反例 → 修改 → 沉淀</p></div>
        </div>
      </div>
    </details>
  </div>
</template>

<style scoped>
.debug-panel { display: flex; flex-direction: column; gap: 0.65rem; }

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-head h3 { font-size: 0.92rem; }

.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }

.error-grid { display: flex; flex-wrap: wrap; gap: 0.25rem; }

.error-btn {
  padding: 0.2rem 0.45rem;
  background: var(--bg-inset);
  border: 1.5px solid var(--border-light);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
}
.error-btn:hover { border-color: var(--green-mid); background: var(--green-light); }
.error-btn.active { border-color: var(--green); background: var(--green-light); color: var(--green); }
.error-btn.act-danger.active { border-color: var(--danger); background: rgba(212,106,107,0.08); color: var(--danger); }
.error-btn.act-warning.active { border-color: var(--warning); background: rgba(201,168,76,0.08); color: var(--warning); }
.error-btn.act-info.active { border-color: var(--info); background: rgba(122,155,181,0.08); color: var(--info); }

.et-code { font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace; }

.code-input {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.5;
  tab-size: 4;
  padding: 0.65rem;
  min-height: 130px;
}

/* Toggle */
.toggle {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-inset);
}
.toggle-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.65rem;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  user-select: none;
}
.toggle-summary:hover { background: var(--bg-hover); }
.toggle-arrow { transition: transform 0.2s; }
details[open] .toggle-arrow { transform: rotate(180deg); }

.toggle-body {
  padding: 0.4rem 0.65rem 0.65rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.flow-item { display: flex; gap: 0.5rem; align-items: flex-start; }
.flow-num {
  flex-shrink: 0;
  width: 22px; height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.68rem;
  font-weight: 700;
}
.flow-item strong { display: block; font-size: 0.78rem; margin-bottom: 0.05rem; }
.flow-item p { font-size: 0.72rem; color: var(--text-muted); }
</style>
