// stores/errorStore.ts
import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', {
  state: () => ({
    error: '',
    active: false,
  }),

  actions: {
    setError(error: string) {
      this.error = error
      this.active = true
    },

    clearError() {
      this.error = null
      this.active = false
    },

    subscribeToErrors() {
      if (window.vmanager) {
        window.vmanager.onError((error) => {
          this.setError(error.message || 'Неизвестная ошибка')
        })
      }
    },
  }
})
