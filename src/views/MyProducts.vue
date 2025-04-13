<template>
  <div>
    <div class="at-app-bar text-large">
      <span>Продукты</span>
    </div>
    <div class="at-my-products-container">
      <ProductCard v-for="product in ownedProducts" :key="product.id" :product_id="product.id" :label="product.label"
        :description="product.description" :license-exp="product.license.validUpToDate" :displayVersion = "product.lastVersion"  :displayCard="product.mainImage"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import { onMounted, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';

const productStore = useProductStore();
const ownedProducts = ref([]);

onMounted(async () => {
  await productStore.fetchProducts();

  ownedProducts.value = productStore.products.filter(product => {
    return !product.license.isBroken;
  });
});

</script>

<style lang="scss">
.at-my-products-container {
  display: flex;
  flex-wrap: wrap;
  padding: $spacing-3 $spacing-6;
  margin-top: 80px;
}

.at-my-products-container .at-product-card {
  height: 404px;

  .v-img {
    height: 184px;
  }

}
</style>