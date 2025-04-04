<template>
  <div>
    <div class="at-app-bar">
      <v-btn variant="tonal" @click="$router.go(-1)">back</v-btn>
        <v-btn :disabled="disableImport" variant="tonal" @click="selectImported">import</v-btn>
        <v-btn :disabled="disableExport" variant="tonal"
          @click="selectDirectory">export</v-btn>
      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="tonal">
            {{ productStore.activeVersion.versionStr }}
          </v-btn>
        </template>

        <v-list @update:selected="switchVersion">
          <v-list-item v-for="version in productStore.versions" :key="version.id" :value="version.id">
            <v-list-item-title>{{ version.versionStr }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="at-product-update" v-if="showNewVersion">
      <v-row>
        Доступна новая версия продукта {{ productStore.latestVersion.versionStr }}
        <v-btn @click="installLatest">Обновить продукт</v-btn>
      </v-row>
    </div>
    <div class="at-product-container">
      <div class="at-product-header">
        <v-row>
          <v-col>
            <div>{{ productStore.activeProduct.label }}</div>
            <div>Версия {{ productStore.activeVersion.versionStr }}</div>
            <ProductActionComponent/>
          </v-col>
        </v-row>
        <v-btn v-if="productStore.isInstalled" class="mb-2" icon="mdi-play" @click="productStore.launchVersion"></v-btn>
      </div>
      <div>
        <v-tabs v-model="tab" align-tabs="start">
          <v-tab :value="1">О продукте</v-tab>
          <v-tab :value="2">Новости</v-tab>
          <v-tab :value="3">Инструкции</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item :value="1">
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-card-text>
                    {{ productStore.activeProduct.description }}
                  </v-card-text>
                  <v-card-text class="at-product-info">
                    <div v-for="sys_info in sys_info" :key="sys_info">{{ sys_info }}</div>
                  </v-card-text>
                  <v-card-text class="at-product-links">
                    <a href="#">vk</a>
                    <a href="#">telegram</a>
                  </v-card-text>
                </v-col>
                <v-col>
                  <v-card class="at-product-specs h-100">
                    <v-tabs v-model="tab_spec" align-tabs="start">
                      <v-tab :value="1">Системные требования</v-tab>
                      <v-tab :value="2">Что нового в версии {{ productStore.activeVersion.versionStr }}</v-tab>
                    </v-tabs>
                    <v-tabs-window v-model="tab_spec">
                      <v-tabs-window-item :value="1">
                        <v-card>
                          <v-card-text>Системные требования (для большинства современных игр):</v-card-text>
                          <v-card-text class="at-product-sysreq">
                            {{ productStore.activeVersion.sys_req }}
                          </v-card-text>
                        </v-card>
                      </v-tabs-window-item>
                      <v-tabs-window-item :value="2">
                        <v-card-text>
                          {{ productStore.activeVersion.patchNote }}
                        </v-card-text>
                      </v-tabs-window-item>
                    </v-tabs-window>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <div>Фото продукта</div>
                <v-slide-group show-arrows class="at-product-slider">
                  <v-slide-group-item v-for="photo in productStore.activeProductImages" :key="photo">
                    <img :src="photo" alt="product">
                  </v-slide-group-item>
                </v-slide-group>
              </v-row>
            </v-container>
          </v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <div class="at-news-block">
              <NewsCard v-for="news in news" :key="news.title" :news="news" />
            </div>
          </v-tabs-window-item>
          <v-tabs-window-item :value="3">
            <div class="at-manual-block">
              <ManualCard v-for="manual in productStore.activeVersion.manuals" :key="manual.id" :manual="manual" />
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ManualCard from '../components/ManualCard.vue';
import NewsCard from '../components/NewsCard.vue';

import { useManagerStore } from '@/stores/managerStore';
import { useProductStore } from '@/stores/productStore';
import ProductActionComponent from '../components/ProductActionComponent.vue';
//@ts-ignore
const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const productStore = useProductStore();
const managerStore = useManagerStore();

const tab = ref(1);
const tab_spec = ref(1);

//temp values
const sys_info = [
  "Размер  приложения: 3.5 ГБ.",
  "Последний запуск: 12.10.2023, 15:30.",
  "Дата оканчания лицензии: 31.12.2023, бессрочная.",
  "Тип лицензии: индивидуальная"
]
const news = [{
  title: "Вышла новая версия",
  description: "Описание новой версии"
}, {
  title: "Презентация новой версии на выставке АГРО ЭКСПО",
  description: "Описание новой версии"
}, {
  title: "Вышла новая версия",
  description: "Описание новой версии"
}]
//computed
const disableImport = computed(() => {
  return !productStore.hasActiveLicense || !managerStore.isManagerIdle
});
const disableExport = computed(() => {
  return !productStore.hasActiveLicense || !(productStore.isInstalled && managerStore.isManagerIdle)
});
const showNewVersion = computed(() => {
  return productStore.hasActiveLicense && !productStore.isLastVersionInstalled
});
//computed
onMounted(async () => {
  // const entry = apiStore.products.find(product => product.id == product_id);

  // if (entry) {

  //   const fullVersioonInstalled = productStore.installedProducts.find((product) => product.productName == entry.label);

  //   let currentVersionId = null;

  //   if (fullVersioonInstalled) {
  //     currentVersionId = entry.versions.find((version) => version.fullName == fullVersioonInstalled.fullVersion)?.id;
  //   } else {
  //     currentVersionId = entry.versions[0].id;
  //   }
  //   console.log(`OnMounted, fullVersioonInstalled: ${fullVersioonInstalled?.fullVersion}, currentVersionId: ${currentVersionId}`);

  //   //TODO: implement version check
  //   latestVersion.value = entry.versions[0];

  //   product.value = entry;
  //   await switchVersion(currentVersionId);
  // }
  console.log(productStore.versionMeta, managerStore.managerState);
});
const installLatest = async () => {
  await switchVersion(productStore.latestVersion.id);
  await productStore.versionAction();
}

// const switchVersion = async (id: number) => {
//   const version = product.value.versions.find((version) => version.id == id);
//   if (version) {
//     currentVersion.value = version;
//     currentVersionIdx.value = id;
//     versionList.value = product.value.versions.filter((version) => version.id != id);
//     await productStore.refreshVersionState({ productName: product.value.label, fullVersion: version.fullName });
//     console.log(productStore.managerState, productStore.productState, productStore.productMeta);
//   }
// }
const switchVersion = async (id: number) => {
  productStore.setActiveVersion(id);
}

// //export / import 
const selectDirectory = async () => {
  const selectedPath = await window.filesystem.openDirectoryDialog('openDirectory');
  if (selectedPath) {
    await productStore.startExport(selectedPath);
  }
};

const selectImported = async () => {
  const selectedPath = await window.filesystem.openDirectoryDialog('openFile');
  if (selectedPath) {
    await productStore.startImport(selectedPath);
  }
};
</script>

<style>
.at-app-bar {
  background: rgba(0, 0, 0, 0) !important;
  /* position: fixed; */
  /* z-index: 1000; */
  /* width: calc(100% - var(--at-drawer-width)); */
  display: flex;
}

.at-app-bar .v-btn {
  margin-right: 2px;
}

.at-app-bar .v-btn:first-child {
  margin-right: auto;
}

.at-product-container {
  margin-top: 20px;
}

.at-product-header {
  display: flex;
  height: 420px;
  align-items: flex-end;
  background-color: var(--at-background-color) !important;
  padding: 30px;
  margin-bottom: 20px;
}

/* .at-product-header .v-btn {
  width: 255px;
} */

.at-product-info p {
  display: inline-block;
}

.at-product-links {
  display: flex;
  gap: 10px;
}

.at-product-sysreq {
  margin-left: 20px;
}

.at-product-specs,
.at-product-specs .v-card {
  background-color: var(--at-background-color) !important;
}

.at-product-slider {
  margin-top: 20px;
}

.at-product-slider img {
  margin: 4px;
  height: 364px;
}

.at-news-block {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.at-product-update {
  height: 90px;
  background-color: var(--at-background-color) !important;
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.at-product-update .v-row {
  justify-content: space-between;
  margin: 0 30px;
  align-items: center;
}

/* .at-products-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

}

.at-products-container .at-product-card:first-child {
  flex-basis: 100%;
  max-width: unset;
  height: 380px;
} */
</style>