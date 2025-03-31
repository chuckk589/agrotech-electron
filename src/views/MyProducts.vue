<template>
  <div class="at-myproducts-container">
    <ProductCard v-for="product in ownedProducts" :key="product.name" :product="product" />
  </div>
</template>

<script setup lang="ts">
import { useApiStore } from '@/stores/api';
import { ProductDetails } from '@/types';
import { onMounted, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';

const apiStore = useApiStore();

const ownedProducts = ref([]);

onMounted(async () => {
  await apiStore.fetchProducts();

  const _ownedProducts = await window.vmanager.getInstalledProducts();

  ownedProducts.value = apiStore.products.filter(product => {
    return _ownedProducts.some((ownedProduct: ProductDetails) => {
      return ownedProduct.productName == product.label;
    });
  });
});

</script>

<style>
.at-myproducts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

}
</style>