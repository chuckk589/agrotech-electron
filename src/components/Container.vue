<template>
  <v-app>
    <v-navigation-drawer permanent class="at-drawer" width="224">
      <v-img class="at-logo" inline :src="logo"></v-img>
      <v-list class="at-menu-text">
        <v-list-item to="/main/products" value="1">
          <v-list-item-title>Продукты</v-list-item-title>
        </v-list-item>

        <v-list-item to="/main/my-products" value="2">
          <v-list-item-title>Мои продукты</v-list-item-title>
        </v-list-item>

        <v-list-item to="/main/news" value="3">
          <v-list-item-title>Новости</v-list-item-title>
        </v-list-item>

        <v-list-item to="/main/codes" value="4">
          <v-list-item-title>Активация кода</v-list-item-title>
        </v-list-item>

        <v-list-item to="/main/help" value="5">
          <v-list-item-title>Помощь</v-list-item-title>
        </v-list-item>
      </v-list>
      <div class="at-online-block">
        <div :class="'at-dot ' + (online ? 'at-online-dot' : 'at-offline-dot')"></div>
        <div>{{ online ? "Онлайн" : "Оффлайн" }}</div>
      </div>

    </v-navigation-drawer>

    <v-main>
      <v-snackbar location="top" v-model="errorStore.active" :text="errorStore.error" color="error">
        <template v-slot:actions>
          <v-btn color="blue" variant="text" @click="errorStore.clearError"> Close </v-btn>
        </template>
      </v-snackbar>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/stores/error';
import { onMounted, ref } from 'vue';
import logo from '../assets/logo.svg';

const online = ref(false)
const errorStore = useErrorStore();

const checkOnline = async () => {
  try {
    await fetch('https://www.ya.ru', { mode: 'no-cors', method: 'head' });
    online.value = true;
  } catch (error) {
    online.value = false;
  }
};
onMounted(async () => {
  await checkOnline();
  setInterval(async () => {
    await checkOnline();
  }, 10000);
});

</script>
<style lang="scss">
.at-drawer {
  background: rgba(0, 0, 0, 0.46) !important;
  border-right: $border-1 solid $stroke-white-15 !important;
  color: $text-white-0 !important;

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .v-list {
    width: 100%
  }

  .v-list-item--active {
    border-right: 3px solid $primary-green-base;
    background: rgba(0, 0, 0, 0.13) !important;

    .v-list-item-title {
      color: $text-white-0 !important;
    }
  }

  .v-list-item-title {
    color: $text-soft-400 !important;
  }

  .v-list-item__overlay {
    background: unset !important;
    opacity: unset !important;
  }

  .v-list-item {
    padding: 0 $spacing-6 !important;
  }

  .at-logo {
    height: 30px;
    width: 172px;
    margin: $spacing-6 0 $spacing-12 0;
  }

  .at-online-block {
    margin-top: auto;
    display: flex;
    padding: 10px 18px;
    width: 128px;
    gap: 15px;
    height: 44px;
    background: rgba(0, 0, 0, 0.15);
    border: $border-1 solid $stroke-white-15;
    align-items: baseline;
    border-radius: $radius-mega;
    margin-bottom: $spacing-5;

    .at-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .at-online-dot {
      background: $state-success;
    }

    .at-offline-dot {
      background: $state-error;
    }
  }
}
</style>
