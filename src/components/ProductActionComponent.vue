<template>
  <div class="d-flex flex-column at-product-action-comp" style="width:30%">
    <v-btn v-if="!versionStore.isManagerBusy" :loading="versionStore.loading"
      @click="versionStore.action(props.label, props.version.fullName)">{{ buttonLabel
      }}</v-btn>
    <div class="d-flex flex-wrap" style="position: relative;"
      v-if="versionMatchesCurrentOrNone && versionStore.isManagerBusy">
      <v-progress-linear color="secondary" v-model="versionStore.productState.progress" :height="42">
        <strong>{{ versionStore.productState.progress }}%</strong>
      </v-progress-linear>

      <div style="position: absolute; right:0">
        <v-btn :disabled="versionStore.loading" variant="text"
          :icon="versionStore.isDownloading ? 'mdi-pause' : 'mdi-play'" size="small"
          @click="versionStore.isDownloading ? versionStore.pauseDownload() : versionStore.resumeDownload()"></v-btn>
        <v-btn :disabled="versionStore.loading" variant="text" icon="mdi-stop" size="small"
          @click="versionStore.cancelDownload(props.label, props.version.fullName)"></v-btn>
      </div>
      <div v-if="versionStore.isDownloading">
        <strong> {{ versionStore.productMeta.rate }} MB/s</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVersionStore } from '@/stores/version';
import { VersionState } from '@/types';
import { computed } from 'vue';
import { RetrieveVersionDto } from '../../../agrotech-back/shared';

const versionStore = useVersionStore();


const props = defineProps<{ version: RetrieveVersionDto, label: string }>()


const buttonLabel = computed(() => {
  switch (versionStore.productState.state) {
    case VersionState.NotInstalled:
      return 'Загрузить';
    case VersionState.Downloaded:
      return 'Установить';
    case VersionState.Installed:
      return 'Удалить';
  }
})

const versionMatchesCurrentOrNone = computed(() => {
  return !versionStore.managerState.currentHandlingVersion || versionStore.managerState.currentHandlingVersion == props.version.fullName;
})


</script>
<style></style>
