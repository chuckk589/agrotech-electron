<template>
  <div class="at-myproducts-container">
    <ProductCard v-for="product in products" :key="product.name" :product="product" />
  </div>
</template>

<script setup lang="ts">
import { Product } from '@/types';
import { ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';

const actions = ['Старт', "Установить"];
const names = ['AgroTechSim PRO', 'DroneVerse', 'RoboLab', 'DroneVerse Desktop', 'AgroTechSim Manual'];

const products = ref(names.map((name): Product => {
  const versions = ['1.0', '1.1', '1.2', '1.3'];
  return {
    description: 'Описание продукта',
    name,
    version: versions[Math.floor(Math.random() * versions.length)],
    versions,
    action: actions[Math.floor(Math.random() * actions.length)],
    info: '"Агродрон: Умное сельское хозяйство" — это инновационное приложение, разработанное для современных фермеров и агрономов, которые хотят использовать передовые технологии для повышения эффективности своего хозяйства. С помощью этого приложения вы сможете управлять агродроном, анализировать состояние полей и принимать обоснованные решения для улучшения урожайности.',
    sys_info: [
      "Размер  приложения: 3.5 ГБ.",
      "Последний запуск: 12.10.2023, 15:30.",
      "Дата оканчания лицензии: 31.12.2023, бессрочная.",
      "Тип лицензии: индивидуальная"
    ],
    sys_req: [
      "Операционная система: Windows 10 (64-bit)",
      "Процессор: Intel Core i5-4460 или AMD FX-6300",
      "Оперативная память: 8 ГБ RAM",
      "Видеокарта: NVIDIA GeForce GTX 960 или AMD Radeon R7 260X с 2 ГБ видеопамяти",
      "Место на диске: 50 ГБ (зависит от игры)",
      "DirectX: Версия 11"
    ],
    patch_notes: versions.map((version, i) => ({
      version,
      notes: "Патчноты для версии " + version
    })),
    photos: [...Array(10).keys()].map(n => `https://picsum.photos/200/300?random=${n}`)
  }
}))

</script>

<style>
.at-myproducts-container{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

}

</style>