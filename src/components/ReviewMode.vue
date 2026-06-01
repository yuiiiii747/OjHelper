<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { appStore, REVIEW_SCOPES, PRACTICE_TYPES } from '../stores/appStore.js'

const panelRef = ref(null)
let ctx = null

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
  <div ref="panelRef" class="review-panel surface">
    <div class="panel-head">
      <h3>复习模式</h3>
    </div>

    <div class="form-group">
      <label class="form-label">复习范围</label>
      <div class="option-row">
        <button v-for="s in REVIEW_SCOPES" :key="s.value" class="opt-btn" :class="{ active: appStore.reviewScope === s.value }" @click="appStore.reviewScope = s.value">{{ s.label }}</button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">练习形式</label>
      <div class="option-row">
        <button v-for="p in PRACTICE_TYPES" :key="p.value" class="opt-btn" :class="{ active: appStore.practiceType === p.value }" @click="appStore.practiceType = p.value">{{ p.label }}</button>
      </div>
    </div>

    <details class="toggle">
      <summary class="toggle-summary">
        <span>分析预览</span>
        <svg class="toggle-arrow" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 4.5l3 3 3-3"/></svg>
      </summary>
      <div class="toggle-body">
        <div class="anal-sec">
          <h4>错题统计</h4>
          <div class="stat-row">
            <div class="stat-item"><strong>—</strong><span>错误最多考点</span></div>
            <div class="stat-item"><strong>—</strong><span>错误最多原因</span></div>
            <div class="stat-item"><strong>—</strong><span>反复错类型</span></div>
          </div>
        </div>
        <div class="anal-sec">
          <h4>掌握度</h4>
          <div class="mastery-bar">
            <span class="m-seg m-mastered">已掌握</span>
            <span class="m-seg m-mostly">基本掌握</span>
            <span class="m-seg m-half">半掌握</span>
            <span class="m-seg m-none">未掌握</span>
          </div>
        </div>
        <div class="anal-sec">
          <h4>输出内容</h4>
          <ul class="output-list">
            <li>考点错误排行榜</li>
            <li>错因排行榜</li>
            <li>今日复习建议</li>
            <li>错题重做列表</li>
            <li>模板代码复习</li>
            <li>高频坑点提醒</li>
          </ul>
        </div>
      </div>
    </details>
  </div>
</template>

<style scoped>
.review-panel { display: flex; flex-direction: column; gap: 0.65rem; }

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-head h3 { font-size: 0.92rem; }

.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }

.option-row { display: flex; gap: 0.25rem; flex-wrap: wrap; }

.opt-btn {
  padding: 0.3rem 0.65rem;
  background: var(--bg-inset);
  border: 1.5px solid var(--border-light);
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.78rem;
  color: var(--text-secondary);
  transition: all 0.15s;
  font-weight: 500;
}
.opt-btn:hover { border-color: var(--green-mid); background: var(--green-light); }
.opt-btn.active { border-color: var(--green); background: var(--green-light); color: var(--green); }

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
  gap: 0.5rem;
}

.anal-sec h4 {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.stat-row { display: flex; gap: 0.3rem; }
.stat-item {
  flex: 1;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xs);
  padding: 0.35rem;
  text-align: center;
}
.stat-item strong { display: block; font-size: 1rem; color: var(--text-muted); }
.stat-item span { font-size: 0.62rem; color: var(--text-muted); }

.mastery-bar { display: flex; gap: 2px; border-radius: var(--radius-xs); overflow: hidden; }
.m-seg { flex: 1; text-align: center; padding: 0.3rem 0.1rem; font-size: 0.65rem; font-weight: 600; }
.m-mastered { background: var(--green-light); color: var(--green); }
.m-mostly { background: rgba(86,115,87,0.06); color: var(--green-mid); }
.m-half { background: var(--rose-light); color: #c96a6b; }
.m-none { background: rgba(212,106,107,0.06); color: var(--danger); }

.output-list { list-style: none; display: flex; flex-direction: column; gap: 0.15rem; padding-left: 0; }
.output-list li {
  font-size: 0.72rem;
  color: var(--text-muted);
  padding-left: 0.8rem;
  position: relative;
}
.output-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.4em;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--green);
}
</style>
