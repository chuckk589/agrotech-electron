<template>
  <div class="at-myproducts-container">
    <ProductCard v-for="product in ownedProducts" :key="product.id" :product_id="product.id" :label="product.label"
      :description="product.description" />
  </div>
</template>

<script setup lang="ts">
import { useManagerStore } from '@/stores/managerStore';
import { useProductStore } from '@/stores/productStore';
import { ProductDetails } from '@/types';
import { onMounted, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';

const productStore = useProductStore();
const managerStore = useManagerStore();
const ownedProducts = ref([]);

onMounted(async () => {
  await productStore.fetchProducts();

  ownedProducts.value = productStore.products.filter(product => {
    return managerStore.installedProducts.some((ownedProduct: ProductDetails) => ownedProduct.productName == product.label) || !product.license.isBroken;
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