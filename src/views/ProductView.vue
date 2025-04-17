<template>
  <div class="h-100">
    <div class="at-app-bar" :class="{ scrolled: appBarThreshold }">
      <v-btn @click="$router.go(-1)" class="at-button">
        <template v-slot:prepend>
          <img src="../assets/arrow.png">
        </template>
        <span class="text-medium">Назад</span>
      </v-btn>
      <v-btn :disabled="disableImport" class="at-button at-import" @click="selectImported">
        <template v-slot:prepend>
          <img src="../assets/import.png">
        </template>
        <span class="text-medium">Импорт</span>
      </v-btn>
      <v-btn :disabled="disableExport" class="at-button at-export" @click="selectDirectory">
        <template v-slot:prepend>
          <img src="../assets/export.png">
        </template>
        <span class="text-medium">Экспорт</span>
      </v-btn>
      <v-menu location="bottom" v-model="openedMenu">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="at-button at-vmenu">
            <template v-slot:append>
              <img src="../assets/arrow.png" :class="{ opened: openedMenu }">
            </template>
            <span class="text-medium">Версия {{ productStore.activeVersion.versionStr }}</span>
          </v-btn>
        </template>

        <v-list @update:selected="switchVersion" class="at-vmenu-list">
          <v-list-item v-for="version in productStore.versions" :key="version.id" :value="version.id">
            <v-list-item-title>{{ version.versionStr }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="at-product-update" v-show="showNewVersion">
      <span class="text-base">Доступна новая версия продукта {{ productStore.latestVersion.versionStr }}</span>
      <v-btn class="at-button text-medium" @click="installLatest">
        <template v-slot:prepend>
          <img src="../assets/export.png">
        </template>
        <span>Обновить продукт</span>
      </v-btn>
      <v-btn @click="showUpdateAlert = false" variant="text" size="40">
        <template v-slot:append>
          <img src="../assets/close.png">
        </template>
      </v-btn>
    </div>
    <div class="at-product-container">
      <ProductViewHeader :class="{ scrolled: actionBarThreshold, opacity: actionBarThreshold }">
      </ProductViewHeader>
      <div class="at-product-view-body" :class="{ scrolled: tabThreshold, opacity: tabThreshold }">
        <div class="fake-body-tab"></div>
        <v-tabs class="at-body-tab at-tabs" v-model="tab" align-tabs="start" height="80">
          <v-tab class="text-average" :value="1">О продукте</v-tab>
          <v-tab class="text-average" :value="2">Новости</v-tab>
          <v-tab class="text-average" :value="3">Инструкции</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="pb-4">
          <v-tabs-window-item :value="1">
            <div class="at-product-info-body">
              <div class="d-flex flex-column">
                <div class="text-medium text-soft-300">
                  {{ productStore.activeProduct.description }}
                </div>
                <div class="at-product-info">
                  <div v-for="sys_info in sys_info" :key="sys_info">{{ sys_info }}</div>
                </div>
                <div class="at-product-links">
                  <v-btn variant="text" size="32">
                    <template v-slot:default>
                      <img src="../assets/vk.png">
                    </template>
                  </v-btn>
                  <v-btn variant="text" size="32">
                    <template v-slot:default>
                      <img src="../assets/telegram.png">
                    </template>
                  </v-btn>
                  <div>@agrotech</div>
                </div>
              </div>
              <div>
                <div class="at-product-specs ">
                  <v-tabs v-model="tab_spec" align-tabs="start">
                    <v-tab :value="1">Системные требования</v-tab>
                    <v-tab :value="2">Что нового в версии {{ productStore.activeVersion.versionStr }}</v-tab>
                  </v-tabs>
                  <v-tabs-window v-model="tab_spec">
                    <v-tabs-window-item :value="1">
                      <div class="at-product-sysreq text-medium">
                        <div>Системные требования (для большинства современных игр):</div>
                        <div class="at-product-sysreq-list text-medium">
                          <div v-for="req in productStore.activeVersion.sys_req">{{ req }}</div>
                        </div>
                      </div>
                    </v-tabs-window-item>
                    <v-tabs-window-item :value="2">
                      <div>
                        {{ productStore.activeVersion.patchNote }}
                      </div>
                    </v-tabs-window-item>
                  </v-tabs-window>
                </div>
              </div>
            </div>
            <div class="at-product-photo-container">
              <div class="text-average text-disabled-300">Фото продукта</div>
              <ProductViewSlider :height="'256px'" :images="productStore.activeProductImagesRaw" />
            </div>
          </v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <div class="at-news-container">
              <NewsCard v-for="entry in newsStore.news" :key="entry.title" :entry="entry" />
            </div>
          </v-tabs-window-item>
          <v-tabs-window-item :value="3">
            <div class="at-manual-block">
              <ManualCard v-for="manual in productStore.activeProduct.manuals" :key="manual.id" :manual="manual" />
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import ManualCard from '@/components/ManualCard.vue';
import NewsCard from '@/components/NewsCard.vue';
import ProductViewHeader from '@/components/ProductViewHeader.vue';
import ProductViewSlider from '@/components/ProductViewSlider.vue';
import { useManagerStore } from '@/stores/managerStore';
import { useNewsStore } from '@/stores/newsStore';
import { useProductStore } from '@/stores/productStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';
const productStore = useProductStore();
const managerStore = useManagerStore();
const newsStore = useNewsStore();
const tab = ref(1);
const tab_spec = ref(1);
const showUpdateAlert = ref(true);


const openedMenu = ref(false);
//computed
const sys_info = computed(() => {
  const product = productStore.activeProduct;
  const version = productStore.activeVersion;
  const license = product.license;

  const outcome: string[] = [
    `Размер приложения: ${version.archiveSize} ГБ.`,
    `Последний запуск: ${license.lastLaunch ? new Date(license.lastLaunch).toLocaleDateString() : 'Никогда'}.`,
  ];

  if (!license.isBroken) {
    if (license.activationDate) {
      outcome.push(`Дата активации лицензии: ${new Date(license.activationDate).toLocaleDateString()}`);
    }

    if (license.validUpToDate && license.validUpToDate !== 0) {
      outcome.push(`Дата окончания лицензии: ${new Date(license.validUpToDate * 1000).toLocaleDateString()}`);
    }

    const typeText = license.licenseType === 1 ? 'Без ограничений' : 'С ограничениями';
    outcome.push(`Тип лицензии: ${typeText}`);
  }

  return outcome;
});

// по идее вот эти поля показывают у нас, лицензия с ограничениями или без. 
// Если все нули, то ограничений нет. 
// Если есть какие то данные (тут даты в unix timestamp вроде бы), 
// то лицензия является ограниченной
// Тут должно быть три поля:
// 1. Тип лицензии - ограниченная или без ограничений.
// 2. Дата активации лицензии
// 3. Дата окончания лицензии, если она с ограничением
const disableImport = computed(() => {
  return !productStore.hasActiveLicense || !managerStore.isManagerIdle
});
const disableExport = computed(() => {
  return !productStore.hasActiveLicense || !(productStore.isInstalled && managerStore.isManagerIdle)
});
const showNewVersion = computed(() => {
  return showUpdateAlert.value && !appBarThreshold.value && productStore.hasActiveLicense && !productStore.isLastVersionInstalled
});
//computed

//scrolling
const appBarThreshold = ref(false);
const actionBarThreshold = ref(false);
const tabThreshold = ref(false);
let scrollHandler: () => void;

const checkOverlap = (offset1: number, offset2: number, offset3: number) => {
  return () => {
    const scrollY = window.scrollY;
    appBarThreshold.value = scrollY > offset1;
    actionBarThreshold.value = scrollY > offset2;
    tabThreshold.value = scrollY > offset3;
  }
};

//scrolling

onMounted(async () => {
  const headerHeight = document.querySelector<HTMLElement>('.at-app-bar').offsetHeight;
  const offsetThreshold = document.querySelector<HTMLElement>('.at-product-header-row').offsetTop * 0.75 - headerHeight;
  const offsetThreshold2 = document.querySelector<HTMLElement>('.at-product-view-body').offsetTop - 3 * headerHeight;
  const offsetThreshold3 = document.querySelector<HTMLElement>('.at-product-view-body').offsetTop - 2 * headerHeight;

  scrollHandler = checkOverlap(offsetThreshold, offsetThreshold2, offsetThreshold3);

  window.addEventListener('scroll', scrollHandler);

  console.log(productStore.versionMeta, managerStore.managerState);


});

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler);
});

const installLatest = async () => {
  await switchVersion(productStore.latestVersion.id);
  await productStore.versionAction();
  showUpdateAlert.value = false;
}

const switchVersion = async (id: number) => {
  await productStore.setActiveVersion(id);
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

<style lang="scss" scoped>
@use '../styles/typography.scss';

.at-product-view-body {
  background: $bg-dark-base;
  flex: 1;

  .at-news-container {
    margin-top: 0px;
  }

  .v-window {
    backdrop-filter: $blur-background;
    padding: 0 $card-padding-big;

  }

  .at-body-tab {
    backdrop-filter: $blur-background;
    border-bottom: $at-border !important;
    padding: 0 $card-padding-big;
    transition: all 0.3s ease-in-out;

    // .v-tab {
    //   padding: 0 $card-padding-max;
    //   opacity: 0.5;
    // }

    // .v-tab.v-tab-item--selected {
    //   opacity: 1;

    // }
  }

  .fake-body-tab {
    height: 0px;
  }

  .at-product-specs {

    .v-tab {
      opacity: 0.5;
    }

    .v-tab.v-tab-item--selected {
      opacity: 1;
    }

    padding: $card-padding-max $card-padding-large;
    background: $bg-dark-20;
    border-radius: $radius-huge;
    min-height: 340px;
    border: $at-border;

    .v-tabs {
      border-bottom: $at-border;
      margin-bottom: $spacing-5;
    }

    .v-window {
      backdrop-filter: unset;
    }

    .at-product-sysreq>.div {
      margin-bottom: $spacing-4 !important;
    }

    .at-product-sysreq-list {
      padding-left: $card-padding-max !important;

      div {
        display: flex;
        align-items: flex-start;
      }

      div::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background-color: white;
        border-radius: 50%;
        margin-right: 8px;
        margin-top: 6px;
      }
    }
  }

  .at-product-info-body {
    margin-top: $spacing-12 !important;
    display: flex;
    gap: 40px;

    .at-product-links {
      display: flex;
      gap: 8px;
      margin-top: auto !important;
      align-items: center;
    }

    .at-product-info {
      margin: $spacing-6 0 !important;
    }
  }

  .at-product-info-body>div {
    flex: 1;
  }



  .at-product-photo-container {
    margin-top: $spacing-12;




    .vueperslides__parallax-wrapper {
      max-width: unset !important;
    }

    .vueperslides__inner {
      display: flex;
      flex-direction: row-reverse;

      .vueperslides__parallax-wrapper {
        width: 100%;
      }
    }

    .vueperslides__track .vueperslide {
      border-radius: $radius-large;
    }

    .vueperslides__fractions {
      align-self: end;
      margin-right: 20px;

    }
  }
}

.at-product-update {
  display: flex;
  padding: 0 $card-padding-large;
  position: fixed;
  width: calc(100% - $at-drawer-width - 2* $card-padding-big);
  margin: 0 $card-padding-big;
  height: 91px;
  top: 80px;
  align-items: center;
  background: $bg-dark-20;
  border: $at-border;
  backdrop-filter: $blur-background;
  border-radius: $radius-huge;

  span {
    margin-right: auto;
  }

  .at-button {
    height: 48px;
    margin-right: $spacing-6;
    padding: $button-padding-small $button-padding-max;


    img {
      margin-right: 8px;
    }
  }
}

.at-app-bar {
  display: flex;
  background: unset;
  backdrop-filter: unset;
  border-bottom: unset;
  transition: all 0.3s ease-in-out;

  .at-button:nth-child(1) {
    margin-right: auto;
  }

  .at-button:not(:last-child):not(:nth-child(1)) {
    margin-right: $spacing-2
  }



  .at-button.at-import {
    padding: $button-padding-small $button-padding-max $button-padding-small $button-padding-medium;
  }

  .at-button.at-export {
    padding: $button-padding-small $button-padding-max $button-padding-small $button-padding-medium;
  }

  .at-vmenu {
    padding: $button-padding-small $button-padding-small $button-padding-small $button-padding-medium;

    .v-btn__append {
      transform: rotate(270deg);
      margin-left: 4px;
    }

    .opened {
      transform: rotate(180deg);
    }
  }
}

.at-button {
  backdrop-filter: $blur-background;
}

.at-vmenu-list {
  background: $bg-light-15 !important;
  border: $at-border;
  border-radius: $radius-medium !important;
  backdrop-filter: $blur-background;
  padding: 0;
  margin-top: 8px;

  .v-list-item {
    height: 40px;
    min-height: unset;
    padding: $button-padding-xsmall $button-padding-medium !important;
  }

}
</style>

<style lang="scss">
@use '../styles/typography.scss' as *;

.at-product-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.at-product-update .at-button .v-btn__content {
  margin-top: 2px;
}

.at-app-bar .v-btn__append {
  transform: rotate(90deg);
}

.at-product-specs .v-tabs button {
  padding: 0;
}

.at-product-specs .v-tabs button:not(:last-child) {
  margin-right: $spacing-4;
}

.at-product-photo-container {

  // .v-slide-group {
  //   margin-bottom: $spacing-6 !important;
  //   width: 100% !important;
  // }
  .at-header-slider {
    margin: $spacing-6 0 !important;
  }

  .vueperslides__parallax-wrapper {
    max-width: 100% !important;
  }

  .vueperslides__inner {
    display: unset !important;
  }

  .vueperslides--fixed-height.vueperslides--bullets-outside {
    margin-bottom: 4em;
  }

  .vueperslides__fractions {
    margin: $spacing-5 !important;
  }
}

.at-vmenu {

  .v-btn__append {
    transform: rotate(90deg);
    margin-left: 4px;
  }
}

.scrolled.opacity .at-product-header-row {
  opacity: 1;
}

.scrolled.opacity .at-body-tab {
  opacity: 1;
}

.scrolled {
  &.at-app-bar {
    background: $bg-dark-base;
    border-bottom: $at-border;
    backdrop-filter: $blur-background;
    top: 0;
    position: fixed;
    padding: 0 $card-padding-big;
  }


  .at-body-tab {
    background: $bg-dark-base;
    border-bottom: $at-border;
    backdrop-filter: $blur-background;
    position: fixed !important;
    top: 160px;
    z-index: 1004;
    width: 100%;
    margin: 0 !important;
    opacity: 0;
    padding: 0 $card-padding-big;
    width: calc(100% - $at-drawer-width);
  }

  .fake-body-tab {
    height: 80px !important;
  }

  .at-product-header-row {


    background: $bg-dark-base;
    border-bottom: $at-border;
    backdrop-filter: $blur-background;
    border-radius: 0px;
    position: fixed !important;
    top: 80px;
    z-index: 1004;
    width: calc(100% - $at-drawer-width);
    margin: 0;
    opacity: 0;
    height: 80px;
    padding: 0 $card-padding-big;
    align-items: center;

    .at-header-slider {
      display: none;
    }

    .at-product-header-info {

      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      .at-product-header__label {
        @extend .text-large;
        margin-right: auto
      }
    }
  }
}
</style>