<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

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
  <div ref="panelRef" class="explain-panel surface">
    <div class="panel-head">
      <h3>讲解模式</h3>
      <span class="badge badge-green">AI 分析</span>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <div class="info-dot dot-green" />
        <div>
          <strong>数据范围分析</strong>
          <p>自动识别数据范围，推断算法复杂度上限</p>
        </div>
      </div>
      <div class="info-item">
        <div class="info-dot dot-rose" />
        <div>
          <strong>考点拆解</strong>
          <p>辨析真正考点与易混考点，提取关键特征</p>
        </div>
      </div>
      <div class="info-item">
        <div class="info-dot dot-green" />
        <div>
          <strong>算法对比</strong>
          <p>暴力到最优解路径，附完整 C++ 代码</p>
        </div>
      </div>
      <div class="info-item">
        <div class="info-dot dot-rose" />
        <div>
          <strong>易错点总结</strong>
          <p>常见陷阱、边界情况与实现注意事项</p>
        </div>
      </div>
    </div>

    <details class="toggle">
      <summary class="toggle-summary">
        <span>ACM 知识体系参考</span>
        <svg class="toggle-arrow" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 4.5l3 3 3-3"/></svg>
      </summary>
      <div class="toggle-body">
        <div class="k-group">
          <span class="k-lvl lvl-base">基础</span>
          <div class="k-tags"> <span>并查集</span><span>树状数组</span><span>ST 表</span><span>单调队列</span><span>Trie</span><span>Dijkstra</span><span>Tarjan</span><span>KMP</span><span>背包DP</span><span>GCD</span> </div>
        </div>
        <div class="k-group">
          <span class="k-lvl lvl-adv">进阶</span>
          <div class="k-tags"> <span>线段树</span><span>平衡树</span><span>树链剖分</span><span>莫队</span><span>AC自动机</span><span>Manacher</span><span>状压DP</span><span>斜率优化</span><span>凸包</span> </div>
        </div>
        <div class="k-group">
          <span class="k-lvl lvl-high">高阶</span>
          <div class="k-tags"> <span>LCT</span><span>主席树</span><span>网络流</span><span>SAM</span><span>杜教筛</span><span>FFT/NTT</span><span>动态DP</span> </div>
        </div>
      </div>
    </details>
  </div>
</template>

<style scoped>
.explain-panel { display: flex; flex-direction: column; gap: 0.65rem; }

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-head h3 { font-size: 0.92rem; }

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.55rem 0.65rem;
  background: var(--bg-inset);
  border-radius: var(--radius-sm);
}

.info-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.35rem;
}
.dot-green { background: var(--green); }
.dot-rose { background: var(--rose); }

.info-item strong { display: block; font-size: 0.8rem; margin-bottom: 0.05rem; }
.info-item p { font-size: 0.72rem; color: var(--text-muted); line-height: 1.4; }

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

.k-group { display: flex; flex-direction: column; gap: 0.25rem; }

.k-lvl {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.05rem 0.4rem;
  border-radius: 3px;
  width: fit-content;
}
.lvl-base { background: var(--green-light); color: var(--green); }
.lvl-adv { background: var(--rose-light); color: #c96a6b; }
.lvl-high { background: rgba(122,155,181,0.12); color: var(--info); }

.k-tags { display: flex; flex-wrap: wrap; gap: 0.25rem; }
.k-tags span {
  font-size: 0.7rem;
  padding: 0.1rem 0.45rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  color: var(--text-secondary);
}
</style>
