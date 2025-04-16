<template>
  <div>
    <div class="at-app-bar text-large">
      <span>Продукты</span>
    </div>
    <div class="at-products-container">
      <ProductCard v-for="product in productStore.products" :key="product.id" :product_id="product.id"
        :label="product.label" :description="product.description" :displayVersion="product.lastVersion"
        :displayCard="product.mainImage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import { onMounted } from 'vue';
import ProductCard from '../components/ProductCard.vue';

const productStore = useProductStore();

const loadData = async () => {
  await productStore.fetchProducts();
};

onMounted(loadData);

</script>

<style lang="scss" scoped>
.at-products-container {
  display: flex;
  flex-wrap: wrap;
  padding: 100px $spacing-6;
}
</style>
