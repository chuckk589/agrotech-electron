<template>
  <div>
    <div class="at-app-bar text-large">
      <span>Новости</span>
    </div>
    <v-tabs v-model="tab" class="at-tabs at-news-tab" height="80">
      <v-tab class="text-average" :value="1">Все</v-tab>
      <v-tab class="text-average" :value="2">Обновления</v-tab>
      <v-tab class="text-average" :value="3">События</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab" class="at-news-tab__container">
      <v-tabs-window-item :value="1">
        <v-container fluid class="at-news-container">
          <NewsCard v-for="entry in newsStore.news" :key="entry.id" :entry="entry" />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <v-container fluid class="at-news-container">
          <NewsCard v-for="entry in newsStore.updateNews" :key="entry.id" :entry="entry" />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item :value="3">
        <v-container fluid class="at-news-container">
          <NewsCard v-for="entry in newsStore.eventNews" :key="entry.id" :entry="entry" />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from '@/stores/newsStore';
import { onMounted, ref } from 'vue';
import NewsCard from '../components/NewsCard.vue';
const tab = ref(1);

const newsStore = useNewsStore()

onMounted(async () => {
  await newsStore.fetchNews()
});
</script>

<style lang="scss" scoped>
.at-news-tab {
  position: fixed;
  top: 80px;
  z-index: 1;
  width: calc(100% - $at-drawer-width);
  // background: $bg-dark-base-solid
  background: rgba(0, 0, 0, 0.46) !important;
  backdrop-filter: blur(15.65px);
}
.at-news-tab__container{
  padding-top: 160px;
}
</style>

<style lang="scss">
.at-news-tab {
  .v-slide-group__container {
    border-bottom: $at-border;
    margin: 0 $spacing-6 !important;
  }
}


</style>