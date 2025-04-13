<template>
    <div class="at-header-slider">
        <div class="at-slider-controls">
            <v-btn @click="nav(0)" class="at-button at-button-nav-prev"></v-btn>
            <div class="at-slider-pg">{{ currentIdx + 1  }}/{{ images.length }}</div>
            <v-btn @click="nav(1)" class="at-button at-button-nav-next"></v-btn>
        </div>
        <v-slide-group center-active ref="slider" v-model="currentIdx" selected-class="at-slider-selected">
            <v-slide-group-item v-for="photo in images" :key="photo" v-slot="{ selectedClass }">
                <img :src="photo" cover :class="selectedClass">
            </v-slide-group-item>
        </v-slide-group>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
    images: string[],
    shame?: boolean
}>();


const slider = ref(null);
const currentIdx = ref(0);

const nav = (direction: 0 | 1) => {
    if (direction === 0) {
        if (slider.value.hasPrev) {
            currentIdx.value--;
        } else {
            currentIdx.value = props.images.length - 1;
        }
        
    } else {
        if (slider.value.hasNext) {
            currentIdx.value++;
        } else {
            currentIdx.value = 0;
        }
    }
    if (props.shame) {
        const root = document.querySelector('.v-application') as HTMLElement;
        root.style.setProperty(
            'background',
            `url(${props.images[currentIdx.value]}) center / cover no-repeat`,
            'important'
        );
    }
};
</script>
<style lang="scss" scoped>
.at-header-slider {
    display: flex;
    align-items: flex-end;

    .at-slider-controls {
        display: flex;
        align-items: center;
        margin-right: $spacing-4;

        .at-slider-pg {
            white-space: nowrap;
            margin: 0 $spacing-2;
        }
    }

    .v-slide-group {
        width: 656px;

        //FIXME:
        img {
            width: 208px;
            height: 128px;
            border-radius: $radius-large;
            margin-right: 16px;
        }

    }
}
</style>