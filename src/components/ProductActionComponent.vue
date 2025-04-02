<template>
  <div class="d-flex flex-column at-product-action-comp" style="width:30%">
    <v-btn v-if="showActionButton" :loading="productStore.loading" @click="action"> {{ buttonLabel }}</v-btn>
    <div class="d-flex flex-wrap" style="position: relative;" v-if="showProgressBar">
      <v-progress-linear color="secondary" v-model="productStore.versionMeta.progress" :height="42">
        <strong>{{ productStore.versionMeta.progress }}%</strong>
      </v-progress-linear>

      <div style="position: absolute; right:0">
        <v-btn :disabled="productStore.loading" variant="text" :icon="managerStore.isDownloading ? 'mdi-pause' : 'mdi-play'" size="small"
          @click="managerStore.isDownloading ? productStore.pauseDownload() : productStore.resumeDownload()"></v-btn>
        <v-btn :disabled="productStore.loading" variant="text" icon="mdi-stop" size="small"
          @click="productStore.cancelDownload"></v-btn>
      </div>
      <div v-if="managerStore.isDownloading">
        <strong> {{ productStore.versionMeta.downloadRate }} MB/s</strong>
      </div>
    </div>
    <!-- <div v-if="managerStore.isHandlingVersionMatchesActive && managerStore.isManagerHandlingFile">
      <v-progress-linear color="secondary" v-model="productStore.versionMeta.progress" :height="42">
        <strong>{{ productStore.versionMeta.progress }}%</strong>
      </v-progress-linear>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useManagerStore } from '@/stores/managerStore';
import { useProductStore } from '@/stores/productStore';
import { VersionState } from '@/types';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const managerStore = useManagerStore();
const productStore = useProductStore();
const router = useRouter();

const buttonLabel = computed(() => {
  if (productStore.hasActiveLicense) {
    switch (productStore.versionMeta.state) {
      case VersionState.NotInstalled:
        return 'Загрузить';
      case VersionState.Downloaded:
        return 'Установить';
      case VersionState.Installed:
        return 'Удалить';
    }
  } else {
    return 'Активировать';
  }
})


const action = () => {
  if (productStore.hasActiveLicense) {
    productStore.versionAction();
  } else {
    router.push({ path: 'codes' });
  }
}
//computed
const showActionButton = computed(() => {
  return managerStore.isManagerIdle && !productStore.isPartlyDownloaded
});
const showProgressBar = computed(() => {
  return managerStore.isHandlingVersionMatchesActive && (managerStore.isHandlingDownload || managerStore.isHandlingFile || productStore.isPartlyDownloaded)
});
</script>
<style></style>
