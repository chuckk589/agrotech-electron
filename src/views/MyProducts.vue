<template>
  <div class="at-myproducts-container">
    <ProductCard v-for="product in ownedProducts" :key="product.name" :product="product" />
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import { ProductDetails } from '@/types';
import { onMounted, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';

const productStore = useProductStore();

const ownedProducts = ref([]);

onMounted(async () => {
  await productStore.fetchProducts();

  const _installedProducts = await window.vmanager.getInstalledProducts();

  ownedProducts.value = productStore.products.filter(product => {
    return _installedProducts.some((ownedProduct: ProductDetails) => ownedProduct.productName == product.label) || !product.license.isBroken;
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