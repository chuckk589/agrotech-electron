<template>
  <div class="at-products-container">
    <ProductCard 
      v-for="product in productStore.products" 
      :key="product.id" 
      :product_id="product.id"
      :label ="product.label"
      :description="product.description"
    />
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