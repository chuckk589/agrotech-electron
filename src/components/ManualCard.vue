<template>
    <v-card variant="flat" class="at-manual-card">
        <v-card-text>
            <div>{{ manual.manualName }}</div>
            <div> <a :href="manual.manualRef">Скачать PDF</a> </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { RetrieveManualDto } from '../../../agrotech-back/shared';


//props
// const props = defineProps({
//     manual: RetrieveManualDto
// });

const props = defineProps<{
    manual: RetrieveManualDto
}>();
</script>
<style>
.at-manual-card {
    /* background-color: var(--at-background-color) !important; */
    display: flex !important;
    flex-direction: column;
    margin: 10px;
}

.at-manual-card .v-card-text {
    background-color: var(--at-background-color) !important;
    display: flex;
    justify-content: space-between;
}

.at-manual-card .v-card-text {
    flex: unset;
}
</style>
