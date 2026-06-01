<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { appStore, MODES } from '../stores/appStore.js'

const panelRef = ref(null)
const indicatorRef = ref(null)
let ctx = null

const modes = [
  { key: MODES.EXPLAIN, label: '讲解' },
  { key: MODES.DEBUG, label: '纠错' },
  { key: MODES.REVIEW, label: '复习' },
]

const isDebugMode = computed(() => appStore.activeMode === MODES.DEBUG)

function selectMode(mode) {
  if (appStore.activeMode === mode) return
  appStore.setMode(mode)
  moveIndicator()
}

function moveIndicator() {
  if (!indicatorRef.value || !panelRef.value) return
  const btn = panelRef.value.querySelector(`.mode-btn[data-mode="${appStore.activeMode}"]`)
  if (!btn) return
  gsap.to(indicatorRef.value, {
    y: btn.offsetTop,
    height: btn.offsetHeight,
    duration: 0.35,
    ease: 'power3.out',
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(panelRef.value?.children, {
      autoAlpha: 0, x: 8, duration: 0.35, stagger: 0.05, ease: 'power2.out',
    })
  }, panelRef.value)

  requestAnimationFrame(() => moveIndicator())
})

onUnmounted(() => { ctx?.revert() })
</script>

<template>
  <div ref="panelRef" class="mode-tabs surface">
    <div class="tabs-track">
      <button
        v-for="m in modes"
        :key="m.key"
        class="mode-btn"
        :data-mode="m.key"
        :class="{ active: appStore.activeMode === m.key }"
        @click="selectMode(m.key)"
      >
        {{ m.label }}
      </button>
      <div
        ref="indicatorRef"
        class="tab-indicator"
        :class="{ 'ind-rose': isDebugMode }"
      />
    </div>
  </div>
</template>

<style scoped>
.mode-tabs {
  padding: 0.35rem;
  position: sticky;
  top: 64px;
}

.tabs-track {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.mode-btn {
  position: relative;
  z-index: 2;
  padding: 0.7rem 0.5rem;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.04em;
  transition: color 0.2s;
}
.mode-btn:hover { color: var(--text-secondary); }
.mode-btn.active { color: var(--text-primary); }

.tab-indicator {
  position: absolute;
  left: 0.15rem;
  width: calc(100% - 0.3rem);
  height: 38px;
  background: var(--green-light);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(86, 115, 87, 0.15);
  z-index: 1;
  pointer-events: none;
  transition: background 0.3s, border-color 0.3s;
}
.tab-indicator.ind-rose {
  background: var(--rose-light);
  border-color: rgba(229, 136, 137, 0.2);
}
</style>
