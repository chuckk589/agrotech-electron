<template>
  <div>
    <router-view />
    <v-overlay :model-value="showOverlay" class="at-overlay">
      <div v-html="logo_big" class="at-logo"></div>
      <v-progress-circular size="40" indeterminate></v-progress-circular>
    </v-overlay>
    <v-alert class="at-alert" color="white" :icon="errorStore.alert.icon" v-model="errorStore.active" location="top"
      position="fixed" closable :text="errorStore.alert.message" :type="errorStore.alert.type" variant="elevated"
      :class="{
        'at-alert--error': errorStore.alert.type === 'error',
        'at-alert--warning': errorStore.alert.type === 'warning',
        'at-alert--info': errorStore.alert.type === 'info',
        'at-alert--success': errorStore.alert.type === 'success',
      }">
      <template v-slot:title>
        <div class="text-small">
          {{ errorStore.alert.title }}
        </div>
      </template>
      <template v-slot:text>
        <div class="text-small text-sub-500 ">
          {{ errorStore.alert.message }}
        </div>
      </template>
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logo_big } from './assets/svg/logo-big';
import { useConfigStore } from './stores/configStore';
import { useErrorStore } from './stores/errorStore';
import { useManagerStore } from './stores/managerStore';
import { useProductStore } from './stores/productStore';

const errorStore = useErrorStore();
const productStore = useProductStore();
const configStore = useConfigStore();
const managerStore = useManagerStore()
const router = useRouter();

const showOverlay = computed(() => {
  const routes = ['products', 'news', 'my-products']
  return productStore.loading && routes.includes(router.currentRoute.value.name as string)
});

onMounted(async () => {
  configStore.loadCurrentTheme()

  errorStore.subscribeToErrors()

  productStore.initializeStore()

  managerStore.initializeStore()


});
</script>
<style lang="scss">
.at-alert {
  padding: $type-scale-14 $type-scale-14 $type-scale-16;
  margin-top: 10px;
  z-index: 1000;

  i {
    font-size: $icon-20 !important;
    height: $icon-20 !important;
    width: $icon-20 !important;
  }

  .v-alert__close {
    height: $icon-20 !important;
    width: $icon-20 !important;
  }

  .v-btn--icon {
    all: unset !important;

    &:hover {
      cursor: pointer !important;
    }
  }
}

.at-alert--error .v-alert__prepend i {
  color: $state-error !important;
}

.at-alert--warning .v-alert__prepend i {
  color: $state-warning !important;
}

.at-alert--success .v-alert__prepend i {
  color: $state-success !important;
}
</style>