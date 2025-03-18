<template>
  <div class="at-app-bar">
    <v-btn variant="tonal" @click="$router.go(-1)">back</v-btn>
  </div>
</template>

<script setup lang="ts">
import { News } from '@/types';
import { useRoute } from 'vue-router';

const route = useRoute();

const payload: News = JSON.parse((route.query.news || '{}') as string);

</script>

<style>
.at-products-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

}

.at-products-container .at-product-card:first-child {
  flex-basis: 100%;
  max-width: unset;
  height: 380px;
}
</style>