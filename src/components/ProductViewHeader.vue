<template>
    <div class="at-product-header">
        <div class="at-product-header-row">
            <div class="at-product-header-info">
                <div class="at-product-header__label text-heading">{{ productStore.activeProduct.label }}</div>
                <div class="phi-version text-small">
                    <div>Версия {{ productStore.activeVersion.versionStr }}</div>
                    <v-btn icon="mdi-delete" variant="text" v-if="productStore.isInstalled" @click="productStore.startUninstall()"/>
                </div>
                <ProductActionComponent />
            </div>
            <ProductViewSlider :shame="true" :images="productStore.activeProductImages"></ProductViewSlider>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProductActionComponent from '@/components/ProductActionComponent.vue';
import { useProductStore } from '@/stores/productStore';
import ProductViewSlider from './ProductViewSlider.vue';
const productStore = useProductStore();


</script>

<style lang="scss" scoped>
.at-product-header {
    display: flex;
    height: 630px;
    align-items: flex-end;
}

.at-product-header-row {
    display: flex;
    padding: $card-padding-big;
    width: 100%;
    height: 188px;
    transition: all 0.3s ease-in-out;

    .at-product-header-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .at-product-header__label {
            margin-bottom: $spacing-2;
        }

        div:last-child {
            margin-top: auto;
        }
    }

    .phi-version {
        display: flex;
        align-items: center;
        margin-right: $spacing-6 ;
    }
}
</style>
