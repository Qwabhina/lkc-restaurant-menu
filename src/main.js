import { createApp } from 'vue'
import './assets/scss/styles.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
