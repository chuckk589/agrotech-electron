<template>
  <v-app :class="route.meta.bgClass">
    <v-navigation-drawer permanent class="at-drawer text-medium" width="224">
      <div v-html="logo" class="at-logo"></div>
      <v-list>
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
      <div class="at-online-block at-button">
        <div class="at-dot" :class="{ 'at-online-dot': configStore.online, 'at-offline-dot': !configStore.online }"></div>
        <div>{{ configStore.online == true ? "Онлайн" : "Офлайн" }}</div>
      </div>

    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    
  </v-app>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore';
import { useRoute } from 'vue-router';
import { logo } from '../assets/svg/logo';

const configStore = useConfigStore()

const route = useRoute()



</script>
<style lang="scss">
.at-overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: $blur-background;
  background: rgba(0, 0, 0, 0.46) !important;

  .v-progress-circular__overlay {
    color: rgb(var(--v-theme-primary-base));
  }

  .v-overlay__content {
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .v-overlay__scrim{
    opacity: unset !important;
    background: unset !important;
  }
}

.at-drawer {
  background: rgba(0, 0, 0, 0.46) !important;
  backdrop-filter: $blur-background;

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .v-list-item__overlay {
    background: unset !important;
    opacity: unset !important;
  }
}
</style>
<style lang="scss" scoped>
.at-drawer {
  border-right: $at-border;


  .v-list {
    width: 100%
  }

  .v-list-item--active {
    border-right: 3px solid rgb(var(--v-theme-primary-base));
    background: rgba(0, 0, 0, 0.13) !important;

    .v-list-item-title {
      color: $text-white-0 !important;
    }
  }

  .v-list-item-title {
    color: $text-soft-400 ;
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
    padding: 10px 18px;
    gap: 15px;
    height: 44px;
    align-items: baseline;
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
