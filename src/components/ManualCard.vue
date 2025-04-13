<template>
    <div variant="flat" class="at-manual-card">
        <img src="../assets/pdf-medium.png">
        <div class="mb-name text-base">{{ manual.manualName }}</div>
        <div class="mb-size text-disabled-300">{{ manual.size }}</div>
        <!-- <div class="mb-link"> <a :href="manual.manualRef">Скачать PDF</a> </div> -->
        <v-btn class="at-button">Скачать
            <template v-slot:append>
                <img src="../assets/download.png">
            </template>
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import { RetrieveManualDto } from '../../../agrotech-back/shared';

const props = defineProps<{
    manual: RetrieveManualDto
}>();
</script>


<style lang="scss" scoped>
.at-manual-card {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 88px;
    border-bottom: $at-border;
    img {
        width: $icon-40;
        height: $icon-40;
        margin-right: $spacing-5;
    }

    .mb-name {
        margin-right: auto;
    }

    .mb-size {
        margin-right: $spacing-4;
    }

    .at-button {
        padding: 12px 24px;
        gap: 8px;
        height: 48px;

        img {
            width: $icon-24;
            height: $icon-24;
            margin-right: 0
        }
    }

}



</style>
