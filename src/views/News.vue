<template>
  <div>
    <v-tabs v-model="tab" align-tabs="start">
      <v-tab :value="1">Все</v-tab>
      <v-tab :value="2">Обновления</v-tab>
      <v-tab :value="3">События</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <v-container fluid class="at-news-container">
          <NewsCard v-for="entry in news" :key="entry.title" :news="entry" />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NewsCard from '../components/NewsCard.vue';

const news = [
  { title: "Вышла новая версия", description: "Описание новой версии" },
  { title: "Презентация новой версии на выставке АГРО ЭКСПО", description: "Описание новой версии" },
  { title: "Вышла новая версия", description: "Описание новой версии" },
  { title: "Вышла новая версия", description: "Описание новой версии" },
  { title: "Презентация новой версии на выставке АГРО ЭКСПО", description: "Описание новой версии" },
  { title: "Вышла новая версия", description: "Описание новой версии" }
]

const tab = ref(1);

</script>

<style>
.at-news-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

}
</style>