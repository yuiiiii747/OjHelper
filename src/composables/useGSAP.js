import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'

/**
 * useGSAP — Vue 3 composable wrapping gsap.context() for proper lifecycle.
 */
export function useGSAP(setupFn) {
  const container = ref(null)
  let ctx = null

  onMounted(() => {
    if (!container.value) return
    ctx = gsap.context(() => {
      setupFn(gsap, container.value)
    }, container.value)
  })

  onUnmounted(() => {
    ctx?.revert()
    ctx = null
  })

  return { container }
}

/**
 * Stagger entrance for items inside a container
 */
export function staggerIn(gsapInstance, selector, opts = {}) {
  const {
    y = 24,
    duration = 0.5,
    stagger = 0.06,
    ease = 'power3.out',
    delay = 0,
  } = opts

  return gsapInstance.from(selector, {
    y,
    autoAlpha: 0,
    duration,
    stagger,
    ease,
    delay,
    clearProps: 'opacity',
  })
}

/**
 * Tab switch transition — old content out, new content in
 */
export function tabTransition(gsapInstance, containerEl, nextContentFn, opts = {}) {
  const { duration = 0.3, ease = 'power2.inOut' } = opts

  const tl = gsapInstance.timeline({
    onComplete: () => nextContentFn?.(),
  })

  tl.to(containerEl.children, {
    autoAlpha: 0,
    y: -12,
    duration: duration * 0.6,
    ease,
    stagger: 0.02,
  })
    .set(containerEl.children, { clearProps: 'all' })
    .from(containerEl.children, {
      autoAlpha: 0,
      y: 16,
      duration: duration * 0.8,
      ease: 'power3.out',
      stagger: 0.04,
    })

  return tl
}
