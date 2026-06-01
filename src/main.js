import { createApp } from 'vue'
import { gsap } from 'gsap'
import App from './App.vue'
import './styles/main.css'

const app = createApp(App)
app.mount('#app')

// Fade out loading screen
const ls = document.getElementById('ls')
if (ls) {
  gsap.to(ls, { autoAlpha: 0, duration: 0.25, delay: 0.05, onComplete: () => ls.remove() })
}
