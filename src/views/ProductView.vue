<template>
  <div>
    <div class="at-app-bar">
      <v-btn variant="tonal" @click="$router.go(-1)">back</v-btn>
      <v-btn variant="tonal">import</v-btn>
      <v-btn variant="tonal">export</v-btn>
      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="tonal">
            {{ product.version }}
          </v-btn>
        </template>

        <v-list v-for="version in product.versions" :key="version">
          <v-list-item>
            <v-list-item-title>{{ version }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="at-product-container">
      <div class="at-product-header">
        <v-row>
          <v-col>
            <div>{{ product.name }}</div>
            <div>Версия {{ product.version }}</div>
            <v-btn :loading="loading" variant="tonal">Action</v-btn>
          </v-col>
        </v-row>
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
                    {{ product.info }}
                  </v-card-text>
                  <v-card-text class="at-product-info">
                    <div v-for="sys_info in product.sys_info" :key="sys_info">{{ sys_info }}</div>
                  </v-card-text>
                  <v-card-text class="at-product-links">
                    <a :href="temp_vk">vk</a>
                    <a :href="temp_telegram">telegram</a>
                  </v-card-text>
                </v-col>
                <v-col>
                  <v-card class="at-product-specs h-100">
                    <v-tabs v-model="tab_spec" align-tabs="start">
                      <v-tab :value="1">Системные требования</v-tab>
                      <v-tab :value="2">Что нового в версии {{ product.version }}</v-tab>
                    </v-tabs>
                    <v-tabs-window v-model="tab_spec">
                      <v-tabs-window-item :value="1">
                        <v-card>
                          <v-card-text>Системные требования (для большинства современных игр):</v-card-text>
                          <v-card-text class="at-product-sysreq">
                            <ul>
                              <li v-for="sys_req in product.sys_req" :key="sys_req">{{ sys_req }}</li>
                            </ul>
                          </v-card-text>
                        </v-card>
                      </v-tabs-window-item>
                      <v-tabs-window-item :value="2">
                        <v-card-text>
                          {{ currentPatchNotes }}
                        </v-card-text>
                      </v-tabs-window-item>
                    </v-tabs-window>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <div>Фото продукта</div>
                <v-slide-group show-arrows class="at-product-slider">
                  <v-slide-group-item v-for="photo in product.photos" :key="photo">
                    <img :src="photo" alt="product">
                  </v-slide-group-item>
                </v-slide-group>
              </v-row>
            </v-container>
          </v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <div class="at-news-container">
              <NewsCard v-for="news in news" :key="news.title" :news="news" />
            </div>
          </v-tabs-window-item>
          <v-tabs-window-item :value="3">
            <div class ="at-manual-container">
              <ManualCard v-for="manual in manuals" :key="manual" :manual="manual" />
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Product } from '@/types';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ManualCard from '../components/ManualCard.vue';
import NewsCard from '../components/NewsCard.vue';

const route = useRoute();
const product: Product = JSON.parse((route.query.product || '{}') as string);

const loading = ref(false);
const tab = ref(1);
const tab_spec = ref(1);

const temp_vk = 'vk.com';
const temp_telegram = 'telegram.com';

const currentPatchNotes = computed(() => {
  return product.patch_notes.find(patch => patch.version == product.version)?.notes;
});

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

const manuals = ["О симуляторе", "Калибровка пульта", "Режим мультиплеера", "Режим удаленного наблюдения", "Режим приложения", "Общая инструкция"]
onMounted(() => {
  console.log(product)
});
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
  margin-top: 80px;
}

.at-product-header {
  display: flex;
  height: 420px;
  align-items: flex-end;
  background-color: var(--at-background-color) !important;
  padding: 30px;
  margin-bottom: 20px;
}

.at-product-header .v-btn {
  width: 255px;
}

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

.at-news-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
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