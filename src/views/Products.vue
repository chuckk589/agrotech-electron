<template>
  <div class="at-products-container">
    <ProductCard v-for="product in apiStore.products" :key="product.id" :product="product" />
  </div>
</template>

<script setup lang="ts">
import { useApiStore } from '@/stores/api';
import { onMounted } from 'vue';
import ProductCard from '../components/ProductCard.vue';

const apiStore = useApiStore();

const loadData = async () => {
  await apiStore.fetchProducts();
};



onMounted(loadData);

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