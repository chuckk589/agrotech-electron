<template>
    <v-card variant="flat" class="at-product-card">
        <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-img>
        <div class="at-product-card-body">
            <v-card-title>{{ product.label }}</v-card-title>
            <v-card-text>
                <div class="at-product-card-version">
                    <div>Версия 1.12</div>
                    <div>Доступно обновление</div>
                </div>
                <div class="at-product-card-desc">
                    <!-- {{ product.description }} -->
                    "Агродрон: Умное сельское хозяйство" — это инновационное приложение, разработанное для современных фермеров и агрономов, которые хотят использовать передовые технологии для повышения эффективности своего хозяйства. С помощью этого приложения вы сможете управлять агродроном, анализировать состояние полей и принимать обоснованные решения для улучшения урожайности.
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn class="at-button" variant="tonal">Подробнее</v-btn>
            </v-card-actions>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { RetrieveSimulatorDto } from '../../../agrotech-back/shared';

defineProps<{
    product: RetrieveSimulatorDto;
}>();
//  :to="{ name: 'product', query: { product_id: product.id } }"

</script>
<style lang="scss">
.at-product-card:first-child {
    flex-basis: 100%;
    max-width: unset;
    height: 407px;
    flex-direction: row-reverse;

    .at-product-card-body {
        width: 50%
    }
    .at-product-card-desc {
        display: block;
    }
}

.at-product-card {
    flex: 1;
    max-width: 300px;
    min-width: 300px;
    height: 278px;
    display: flex !important;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.2) !important;

    .at-product-card-desc {
        display: none
    }
    .at-product-card-version {
       display: flex;
    }
}

// .at-product-card .v-card-title {
//     margin-top: auto;
// }

// .at-product-card .v-card-text {
//     flex: unset;
// }
</style>
