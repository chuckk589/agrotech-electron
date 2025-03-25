<template>
    <v-card variant="flat" class="at-product-card"
        :to="{ name: 'product', query: { product_id: product.id } }">
        <v-card-title>{{ product.label }}</v-card-title>
        <v-card-text>{{ product.description }}</v-card-text>
        <v-card-actions>
            <v-btn variant="tonal">action</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { RetrieveSimulatorDto } from '../../../agrotech-back/shared';

defineProps<{
    product: RetrieveSimulatorDto;
}>();


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
