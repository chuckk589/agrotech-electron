// stores/errorStore.ts
import { defineStore } from 'pinia';
import { AtEventHandler, EventScope } from '../utils/errorHandler';


export const useErrorStore = defineStore('error', {
  state: () => ({
    alert: {
      title: 'Insert your alert title here!',
      message: 'asdsadddddddddsssssssssssssssssssssssssssssssssssssssssssssssssdddddddddd',
      type: 'error',
      icon: '$warning'
    },
    active: false,
  }),

  actions: {
    setEvent(scope: EventScope, code: number) {
      const handler = new AtEventHandler(scope, code);
      const type = handler.getType();
      this.alert.title = type === 'error' ? 'Ошибка' : 'Успех';
      this.alert.message = handler.getMessage();
      this.alert.type = type;
      this.alert.icon = type === 'error' ? '$warning' : '$success';
      this.active = true;
    },
    subscribeToErrors() {
      if (window.vmanager) {
        window.vmanager.onError((error) => {
          console.log(error)
          this.setEvent(EventScope.VersionManager, error);
        })
      }
    },
  }
})
