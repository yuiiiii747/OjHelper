<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { appStore, MODES } from './stores/appStore.js'
import HistoryPanel from './components/HistoryPanel.vue'
import ModeTabs from './components/ModeTabs.vue'
import InputPanel from './components/InputPanel.vue'
import ApiConfig from './components/ApiConfig.vue'
import ExplanationMode from './components/ExplanationMode.vue'
import DebugMode from './components/DebugMode.vue'
import ReviewMode from './components/ReviewMode.vue'
import ResultPanel from './components/ResultPanel.vue'

const headerRef = ref(null)
const mainRef = ref(null)
const showApiConfig = ref(false)
let ctx = null

onMounted(() => {
  if (!headerRef.value) return
  ctx = gsap.context(() => {
    gsap.from(headerRef.value, { y: -16, autoAlpha: 0, duration: 0.4, ease: 'power2.out' })
  }, headerRef.value)
})

onUnmounted(() => { ctx?.revert() })
</script>

<template>
  <div class="app-shell">
    <!-- Header -->
    <header ref="headerRef" class="app-header">
      <div class="header-inner">
        <h1 class="logo">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" fill="#567357"/>
            <path d="M10 16l4 4 8-8" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="logo-text">Carol</span>
          <span class="logo-sub">OJ & 程序设计</span>
        </h1>
        <button
          class="btn-config"
          :class="{ active: showApiConfig }"
          @click="showApiConfig = !showApiConfig"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>API</span>
        </button>
      </div>
    </header>

    <!-- API Config -->
    <transition name="fade">
      <div v-if="showApiConfig" class="api-config-wrapper">
        <ApiConfig @close="showApiConfig = false" />
      </div>
    </transition>

    <!-- Three-column body -->
    <div class="app-body">
      <!-- Left: History -->
      <aside class="sidebar sidebar-left">
        <HistoryPanel />
      </aside>

      <!-- Center: Main -->
      <main ref="mainRef" class="app-main">
        <InputPanel />
        <ExplanationMode v-if="appStore.activeMode === MODES.EXPLAIN" />
        <DebugMode v-if="appStore.activeMode === MODES.DEBUG" />
        <ReviewMode v-if="appStore.activeMode === MODES.REVIEW" />
        <ResultPanel />
      </main>

      <!-- Right: Mode tabs -->
      <aside class="sidebar sidebar-right">
        <ModeTabs />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== Header ===== */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-light);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.6rem 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
}

.logo-text {
  font-weight: 700;
  color: var(--green);
}

.logo-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 400;
}

.btn-config {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.7rem;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
}
.btn-config:hover { background: var(--bg-hover); color: var(--text-secondary); }
.btn-config.active { background: var(--green-light); color: var(--green); border-color: var(--green); }

/* ===== API Config ===== */
.api-config-wrapper {
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-surface);
}

/* ===== Body ===== */
.app-body {
  display: flex;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
  align-items: flex-start;
}

.sidebar {
  position: sticky;
  top: 64px;
  flex-shrink: 0;
}

.sidebar-left {
  width: 220px;
}

.sidebar-right {
  width: 80px;
}

.app-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
