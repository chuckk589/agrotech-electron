<template>
    <v-card variant="flat" class="at-news-card" hover @click="switchEntry" :loading="isCardBusy" :disabled="isCardBusy">
        <div class="news-backdrop" v-if="needBackdrop" v-html="bdrop_news"></div>
        <v-img v-else height="204" :src="props.entry.preview" cover></v-img>
        <div class="at-news-body">
            <div class="nb-date text-soft-400 text-small">{{ new Date(entry.date).toLocaleDateString() }}</div>
            <div class="nb-title text-base">{{ entry.title }}</div>
            <div class="at-chip text-badge" :class="{
                'state-success': props.entry.type == 'update',
                'state-feature': props.entry.type == 'event'
            }">{{ badgeType }}</div>
        </div>
    </v-card>
</template>

<script lang="ts" setup>
import {
    bdrop_news,
} from '@/assets/svg/backdrop-news';
import { useNewsStore } from '@/stores/newsStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { RetrieveNewsDto } from '../../../agrotech-back/shared';

const newsStore = useNewsStore();
const router = useRouter();
//props
const props = defineProps<{
    entry: RetrieveNewsDto;
}>();

const needBackdrop = computed(() => {
    return !props.entry.preview
});
const switchEntry = async () => {
    await newsStore.setActiveEntry(props.entry.id);
    router.push({ path: 'news-view' });
};
const badgeType = computed(() => {
    return props.entry.type == 'update' ? 'Обновления' : 'Событие'
});

const isCardBusy = computed(() => {
    return newsStore.loading && newsStore.currentEntry.id == props.entry.id;
});
</script>
<style lang="scss" scoped>
.at-news-card {
    padding: $card-padding-max;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    min-width: 428px;
    height: 396px;

    background: $bg-dark-20;
    border: $at-border;
    border-radius: $radius-huge;
    flex: 1;
    
    .news-backdrop,
    .v-img {
        border-radius: $radius-medium;
        border: $at-border;
        height: 204px;
        overflow: hidden;
        min-height: 204px
    }
    .news-backdrop{
        height: 100%;
    }
    .at-news-body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        div:last-child {
            margin-top: auto;
        }

        div {
            margin-top: $spacing-5;
        }

        .at-chip {
            height: 20px;
        }
    }
}
</style>