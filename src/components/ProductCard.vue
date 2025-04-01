<template>
    <v-card variant="flat" class="at-product-card">
        <v-card-title>{{ label }}</v-card-title>
        <v-card-text>{{ description }}</v-card-text>
        <v-card-actions>
            <v-btn @click="switchProduct" variant="tonal">Подробнее</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const productStore = useProductStore();

const props = defineProps<{
    product_id: number;
    label: string;
    description: string;
}>();

const switchProduct = () => {
    productStore.setActiveProduct(props.product_id);
    router.push({ name: 'product' });
};
</script>
<style>
.at-product-card {
    background-color: var(--at-background-color) !important;
    flex: 1;
    max-width: 300px;
    min-width: 300px;
    height: 278px;
    display: flex !important;
    flex-direction: column;

}

.at-product-card .v-card-title {
    margin-top: auto;
}

.at-product-card .v-card-text {
    flex: unset;
}
</style>
