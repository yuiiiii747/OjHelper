<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { appStore } from '../stores/appStore.js'

const panelRef = ref(null)
const dropZoneRef = ref(null)
const fileInputRef = ref(null)
const isDragging = ref(false)
let ctx = null

function handleDragOver(e) { e.preventDefault(); isDragging.value = true }
function handleDragLeave(e) { e.preventDefault(); isDragging.value = false }

function handleDrop(e) {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file?.type.startsWith('image/')) appStore.setImage(file)
}

function handleFileSelect(e) {
  const file = e.target?.files?.[0]
  if (file) appStore.setImage(file)
}

function triggerFileInput() { fileInputRef.value?.click() }

function removeImage() {
  appStore.setImage(null)
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function handlePaste(e) {
  const item = e.clipboardData?.items?.[0]
  if (item?.type.startsWith('image/')) {
    const file = item.getAsFile()
    if (file) appStore.setImage(file)
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(panelRef.value?.children, {
      y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out',
    })
  }, panelRef.value)
})

onUnmounted(() => { ctx?.revert() })
</script>

<template>
  <div ref="panelRef" class="input-panel surface">
    <div class="input-group">
      <label class="input-label">题目描述 / 补充信息</label>
      <textarea
        v-model="appStore.inputText"
        placeholder="粘贴题目描述、输入输出样例，或任何补充说明..."
        rows="3"
        @paste="handlePaste"
      />
    </div>

    <div
      ref="dropZoneRef"
      class="drop-zone"
      :class="{ dragging: isDragging, hasImage: !!appStore.uploadedImageUrl }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="!appStore.uploadedImageUrl && triggerFileInput()"
    >
      <input ref="fileInputRef" type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden @change="handleFileSelect" />

      <template v-if="appStore.uploadedImageUrl">
        <div class="image-preview">
          <img :src="appStore.uploadedImageUrl" alt="screenshot" />
          <button class="btn-remove" @click.stop="removeImage">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p class="drop-hint">拖拽或点击更换 · Ctrl+V 粘贴</p>
      </template>

      <template v-else>
        <div class="drop-placeholder">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p class="drop-title">拖拽 OJ 题目截图到此处</p>
          <p class="drop-subtitle">或点击选择文件 · 支持 PNG / JPG / WebP</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.input-panel {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Drop Zone */
.drop-zone {
  border: 1.5px dashed var(--border);
  border-radius: var(--radius-sm);
  padding: 1.25rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  background: var(--bg-inset);
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}
.drop-zone:hover {
  border-color: var(--green-mid);
  background: var(--green-light);
}
.drop-zone.dragging {
  border-color: var(--green);
  background: var(--green-light);
  border-style: solid;
}
.drop-zone.hasImage {
  border-style: solid;
  border-color: var(--border);
  background: transparent;
}

.drop-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}
.drop-title {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.88rem;
}
.drop-subtitle {
  color: var(--text-muted);
  font-size: 0.75rem;
}

/* Image Preview */
.image-preview {
  position: relative;
  max-width: 100%;
  max-height: 280px;
  overflow: hidden;
  border-radius: var(--radius-sm);
}
.image-preview img {
  max-width: 100%;
  max-height: 240px;
  object-fit: contain;
  display: block;
  border-radius: var(--radius-sm);
}
.btn-remove {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}
.btn-remove:hover { background: var(--danger); }

.drop-hint {
  color: var(--text-muted);
  font-size: 0.72rem;
}
</style>
