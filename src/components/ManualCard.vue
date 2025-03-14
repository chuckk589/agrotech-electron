<template>
    <v-card variant="flat" class="at-manual-card">
        <v-card-text>
            <div>{{ manual }}</div>
            <div> <a href="#">Скачать PDF</a> </div>
        </v-card-text>
    </v-card>
</template>

<script setup>

//props
const props = defineProps({
    manual: String
});


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
