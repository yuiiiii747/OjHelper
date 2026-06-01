<script setup>
import { ref } from 'vue'
import { appStore, MODE_LABELS } from '../stores/appStore.js'

const showClearConfirm = ref(false)

function loadItem(item) {
  appStore.loadHistoryItem(item)
}

function confirmClear() {
  if (showClearConfirm.value) {
    appStore.clearHistory()
    showClearConfirm.value = false
  } else {
    showClearConfirm.value = true
    setTimeout(() => { showClearConfirm.value = false }, 3000)
  }
}
</script>

<template>
  <div class="history-panel surface">
    <div class="panel-head">
      <h3 class="panel-title">历史记录</h3>
      <button
        v-if="appStore.history.length"
        class="btn-clear"
        :class="{ confirming: showClearConfirm }"
        @click="confirmClear"
      >
        {{ showClearConfirm ? '确认清空' : '清空' }}
      </button>
    </div>

    <div class="history-list" v-if="appStore.history.length">
      <button
        v-for="item in appStore.history"
        :key="item.id"
        class="history-item"
        @click="loadItem(item)"
      >
        <div class="hi-head">
          <span class="hi-badge" :class="item.mode === 'debug' ? 'badge-rose' : 'badge-green'">
            {{ MODE_LABELS[item.mode] || item.mode }}
          </span>
          <span class="hi-time">{{ item.time }}</span>
        </div>
        <p class="hi-preview">{{ item.inputPreview }}</p>
        <p v-if="item.resultTitle" class="hi-result">{{ item.resultTitle }}</p>
      </button>
    </div>

    <div v-else class="history-empty">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <p>暂无记录</p>
    </div>
  </div>
</template>

<style scoped>
.history-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.btn-clear {
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 4px;
}
.btn-clear:hover { color: var(--text-secondary); background: var(--bg-hover); }
.btn-clear.confirming { color: var(--danger); border-color: var(--danger); background: rgba(212,106,107,0.08); }

/* List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.history-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.5rem 0.6rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.history-item:hover {
  background: var(--bg-hover);
  border-color: var(--border-light);
}

.hi-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.3rem;
}

.hi-badge {
  font-size: 0.62rem;
  font-weight: 600;
  padding: 0.05rem 0.35rem;
  border-radius: 3px;
}
.hi-badge.badge-green { background: var(--green-light); color: var(--green); }
.hi-badge.badge-rose { background: var(--rose-light); color: #c96a6b; }

.hi-time {
  font-size: 0.62rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.hi-preview {
  font-size: 0.72rem;
  color: var(--text-secondary);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hi-result {
  font-size: 0.65rem;
  color: var(--green-mid);
}

/* Empty */
.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1.5rem 0;
  color: var(--text-muted);
}
.history-empty p { font-size: 0.75rem; }
</style>
