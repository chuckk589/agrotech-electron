<template>
    <v-card variant="flat" class="at-news-card" >
        <v-card-text></v-card-text>
        <v-card-actions>{{ news.title }}</v-card-actions>
    </v-card>
</template>

<script setup>

//props
const props = defineProps({
    news: Object
});


</script>
<style>
.at-news-card {
    /* background-color: var(--at-background-color) !important; */
    max-width: 300px;
    min-width: 300px;
    display: flex !important;
    flex-direction: column;

}
.at-news-card .v-card-text {
    background-color: var(--at-background-color) !important;
    height: 263px;
}

.at-news-card .v-card-text {
    flex: unset;
}
</style>
