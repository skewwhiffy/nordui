import Vue from 'vue';
import App from './App.vue';
const { ipcRenderer } = require('electron');

Vue.config.productionTip = false;

console.log('main.js');
ipcRenderer.on('poo-message', (event, arg) => {
  console.log('poo message received');
});

new Vue({
  render: h => h(App)
}).$mount('#app');
