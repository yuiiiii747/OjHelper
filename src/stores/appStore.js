import { reactive } from 'vue'

export const MODES = {
  EXPLAIN: 'explain',
  DEBUG: 'debug',
  REVIEW: 'review',
}

export const MODE_LABELS = {
  [MODES.EXPLAIN]: '讲解',
  [MODES.DEBUG]: '纠错',
  [MODES.REVIEW]: '复习',
}

export const MODE_DESCRIPTIONS = {
  [MODES.EXPLAIN]: '上传 OJ 题目截图，获取考点分析与代码实现',
  [MODES.DEBUG]: '提交代码与错误状态，AI 定位问题并给出修改方案',
  [MODES.REVIEW]: '基于错题本，生成个性化复习计划',
}

export const ERROR_TYPES = [
  { value: 'WA', label: 'Wrong Answer', badge: 'danger' },
  { value: 'PE', label: 'Presentation Error', badge: 'warning' },
  { value: 'RE', label: 'Runtime Error', badge: 'danger' },
  { value: 'SO', label: 'Stack Overflow', badge: 'danger' },
  { value: 'FPE', label: 'Floating Point Error', badge: 'warning' },
  { value: 'TLE', label: 'Time Limit Exceeded', badge: 'warning' },
  { value: 'MLE', label: 'Memory Limit Exceeded', badge: 'warning' },
  { value: 'CE', label: 'Compile Error', badge: 'info' },
  { value: 'OLE', label: 'Output Limit Exceeded', badge: 'warning' },
  { value: 'SE', label: 'System Error', badge: 'info' },
  { value: 'UNSUBMITTED', label: '未提交', badge: 'info' },
]

export const REVIEW_SCOPES = [
  { value: 'all', label: '全部错题' },
  { value: 'week', label: '最近一周' },
  { value: 'topic', label: '指定考点' },
  { value: 'errorType', label: '指定错误类型' },
]

export const PRACTICE_TYPES = [
  { value: 'idea', label: '只看思路' },
  { value: 'full', label: '写完整代码' },
  { value: 'fill', label: '代码填空' },
  { value: 'core', label: '只写核心函数' },
]

const savedApi = JSON.parse(localStorage.getItem('carol_api_config') || 'null')
const savedHistory = JSON.parse(localStorage.getItem('carol_history') || '[]')

export const appStore = reactive({
  activeMode: MODES.EXPLAIN,
  apiConfig: {
    endpoint: savedApi?.endpoint || 'https://api.openai.com/v1',
    model: savedApi?.model || 'gpt-4o',
    apiKey: savedApi?.apiKey || '',
    temperature: savedApi?.temperature ?? 0.7,
  },

  // Input state
  inputText: '',
  uploadedImage: null,
  uploadedImageUrl: null,

  // Debug mode state
  debugErrorType: 'WA',
  userCode: '',

  // Review mode state
  reviewScope: 'all',
  practiceType: 'idea',

  // Results
  isProcessing: false,
  result: null,

  // History
  history: savedHistory,

  setMode(mode) {
    this.activeMode = mode
    this.result = null
  },

  setApiConfig(config) {
    Object.assign(this.apiConfig, config)
    localStorage.setItem('carol_api_config', JSON.stringify(this.apiConfig))
  },

  setImage(file) {
    this.uploadedImage = file
    if (file) {
      this.uploadedImageUrl = URL.createObjectURL(file)
    } else {
      this.uploadedImageUrl = null
    }
  },

  clearInput() {
    this.inputText = ''
    this.uploadedImage = null
    this.uploadedImageUrl = null
    this.userCode = ''
  },

  clearResult() {
    this.result = null
  },

  // History
  addHistory(entry) {
    this.history.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      mode: this.activeMode,
      inputPreview: (this.inputText || '(图片)').slice(0, 60),
      hasImage: !!this.uploadedImage,
      hasCode: !!this.userCode,
      resultTitle: entry?.title || '',
      summary: entry?.sections?.[0]?.title || '',
    })
    if (this.history.length > 50) this.history.pop()
    localStorage.setItem('carol_history', JSON.stringify(this.history))
  },

  loadHistoryItem(item) {
    this.setMode(item.mode)
    // Don't restore full input state from history for now
    // Just switch to that mode
  },

  clearHistory() {
    this.history = []
    localStorage.setItem('carol_history', JSON.stringify(this.history))
  },
})
