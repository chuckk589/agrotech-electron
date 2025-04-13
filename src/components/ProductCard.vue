<template>
    <div class="at-product-card">
        <v-img :src="props.displayCard" cover></v-img>
        <div class="at-product-card-body d-flex flex-column">
            <div class="at-product-card__label">{{ props.label }}</div>
            <div>
                <div class="at-product-card-version">
                    <div class="text-small text-soft-400">Версия {{ props.displayVersion }}</div>
                    <!-- <div class="at-chip text-badge">Доступно обновление</div> -->
                </div>
                <div class="at-product-card-desc text-medium">
                    {{ props.description }}
                </div>
            </div>
            <div class="pc-actions">
                <v-btn @click="switchProduct" class="at-button text-medium">Подробнее</v-btn>
            </div>
            <div class="at-license-info" v-if="props.licenseExp">Лицензия до {{ new
                Date(props.licenseExp * 1000).toLocaleDateString() }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/productStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const productStore = useProductStore();

const props = defineProps<{
    product_id: number;
    label: string;
    displayVersion: string;
    displayCard: string;
    description: string;
    licenseExp?: number;
}>();

const switchProduct = () => {
    productStore.setActiveProduct(props.product_id);
    router.push({ path: 'product' });
};
</script>
<style lang="scss" scoped>
@use '../styles/typography.scss';

.at-products-container .at-product-card:first-child {
    //override
    margin-right: 0;
    height: 407px;
    max-width: unset;

    flex-basis: 100%;
    flex-direction: row-reverse;



    .at-product-card-body {
        width: 50%;
        padding: $card-padding-large;

        .at-product-card__label {
            @extend .text-heading;
        }
    }

    .at-product-card-desc {
        display: block;
        overflow: hidden;
        max-height: 168px;
    }

    .at-product-card-version {
        align-items: center;
        margin: $spacing-4 0;
        justify-content: flex-start;

        .at-chip {
            height: 24px;
        }
    }

    .v-img {
        height: unset;
    }

    .at-button {
        width: 180px;
        height: 44px !important;
    }
}

.at-product-card {
    //override
    max-width: 317px;
    min-width: 317px;
    height: 352px;
    margin: 0 $spacing-5 $spacing-6 0;
    overflow: hidden;
    display: flex !important;
    flex-direction: column;
    background: $bg-dark-20 !important;
    border-radius: $radius-huge !important;
    border: $at-border !important;

    .at-product-card-desc {
        display: none
    }

    .at-product-card-version {
        display: flex;
        justify-content: space-between;
        height: 24px;
        margin: $spacing-5 0;

        div:nth-child(1) {
            margin-right: $spacing-4
        }
    }

    .at-product-card-desc {
        margin-bottom: $spacing-6
    }

    .at-product-card-body {
        padding: $card-padding-big;

        .at-product-card__label {
            @extend .text-medium;
        }

        .pc-actions {
            margin-top: auto !important;
        }
    }

    .v-img {
        height: 164px;
    }

    .at-button {
        width: 100%;
        height: 52px !important;
    }

    .at-license-info {
        display: flex;
        justify-content: center;
        margin-top: $spacing-3;
    }

}
</style>