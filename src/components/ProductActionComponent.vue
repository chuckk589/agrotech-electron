<template>
  <div class="at-product-action-comp">
    <v-btn class="at-action-button at-button text-medium" v-if="showActionButton" :loading="productStore.loading" @click="action">
      {{
        buttonLabel }}
    </v-btn>


    <div class="d-flex flex-wrap align-self-start" style="position: relative;" v-if="showProgressBar">
      <v-progress-linear class="at-action-button" v-model="productStore.versionMeta.progress" :height="42">
        <strong>{{ productStore.versionMeta.progress }}%</strong>
      </v-progress-linear>

      <div style="position: absolute; right:0">
        <v-btn :disabled="productStore.loading" variant="text"
          :icon="managerStore.isDownloading ? 'mdi-pause' : 'mdi-play'" size="small"
          @click="managerStore.isDownloading ? productStore.pauseDownload() : productStore.resumeDownload()"></v-btn>
        <v-btn :disabled="productStore.loading" variant="text" icon="mdi-stop" size="small"
          @click="productStore.cancelDownload"></v-btn>
      </div>
      <!-- <div v-if="managerStore.isDownloading">
        <strong> {{ productStore.versionMeta.downloadRate }} MB/s</strong>
      </div> -->
    </div>
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
        return 'Загрузить  ' + productStore.activeVersion.archiveSize + ' ГБ';
      case VersionState.Downloaded:
        return 'Установить';
      case VersionState.Installed:
        return 'Запустить';
    }
  } else {
    return 'Активировать';
  }
})


const action = () => {
  if (productStore.hasActiveLicense) {
    productStore.versionAction();
  } else {
    router.push({ path: '/main/codes' });
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
<style lang="scss" scoped>
@use '../styles/typography.scss';

.at-action-button {
  height: 48px;
  letter-spacing: 0.1em;
}
</style>
<style lang="scss">
.v-progress-linear__determinate {
  -webkit-mask-image: linear-gradient(to right, rgb(var(--v-theme-primary-base)) 0%, #f9131300 105%) !important;
  background: rgb(var(--v-theme-primary-base))
}

.at-product-action-comp {
  display: flex;

  .v-progress-circular__overlay {
    color: rgb(var(--v-theme-primary-base));
  }
}
</style>
