<template>
  <div>
    <v-app-bar height="80" :elevation="0" class="at-product-bar">
      <v-toolbar-title>Продукты</v-toolbar-title>
    </v-app-bar>
    <div class="at-products-container">
      <ProductCard v-for="product in productStore.products" :key="product.id" :product_id="product.id"
        :label="product.label" :description="product.description" />
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

<style lang="scss">
.at-products-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;


}

.at-product-bar {
  display: flex;
  align-items: center;
  background: rgba($bg-soft-600, 0.87) !important;
  border-bottom: $border-1 solid $stroke-white-15 !important;

  color: $text-white-0 !important;

  .v-toolbar-title {
    margin-left: $spacing-6;
  }
}
</style>
