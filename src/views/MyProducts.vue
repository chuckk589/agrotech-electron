<template>
  <div>
    <div class="at-app-bar text-large">
      <span>Продукты</span>
    </div>
    <div class="at-my-products-container" v-if="ownedProducts.length">
      <ProductCard v-for="product in ownedProducts" :key="product.id" :product_id="product.id" :label="product.label"
        :description="product.description" :license-exp="product.license.validUpToDate"
        :displayVersion="product.lastVersion" :displayCard="product.mainImage" />
    </div>
    <div class="at-code-container" v-else>
      <div class="at-code-card">
        <div class="code-card__icon">
          <img src="../assets/lock.png">
        </div>
        <div class="code_card__body">
          <div class="text-large">Нет активированных продуктов</div>
          <div class="code-card__text text-base text-soft-400">Перейдите во вкладку активации кода чтобы получить доступ
            к продуктам</div>
        </div>
        <v-btn class="at-button text-medium" @click="test">Активировать</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue';
import { useProductStore } from '@/stores/productStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const productStore = useProductStore();
const ownedProducts = ref([]);
const test = () => {
  router.push({ path: '/main/codes' });
};
onMounted(async () => {
  await productStore.fetchProducts();

  ownedProducts.value = productStore.products.filter(product => {
    return !product.license.isBroken;
  });
});

</script>
<style lang="scss" scoped>
.at-code-container {
  padding-top: 160px;
}
</style>
<style lang="scss">
.at-my-products-container {
  display: flex;
  flex-wrap: wrap;
  padding: calc($spacing-3 + 80px) $spacing-6 $spacing-3;
}

.at-my-products-container .at-product-card {
  height: 404px;

  .v-img {
    height: 184px;
  }

}
</style>