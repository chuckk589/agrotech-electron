<template>
    <div class="at-header-slider">
        <vueper-slides class="no-shadow" ref="slider" :gap="2" :touchable="false" :fixed-height="height" :bullets="false"
            fractions :arrows="false" :visible-slides="3" :breakpoints="{ 1600: { visibleSlides: 2 } }">
            <vueper-slide v-for="(slide, i) in images" :key="i" :image="slide" />
            <template #fraction="{ current, total }">
                <div class="at-slider-controls text-disabled-300 text-medium">
                    <v-btn @click="prev" class="at-button at-button-nav-prev"></v-btn>
                    <div class="at-slider-pg">{{ current }}/{{ total }}</div>
                    <v-btn @click="next" class="at-button at-button-nav-next"></v-btn>
                </div>
            </template>
        </vueper-slides>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { VueperSlide, VueperSlides } from 'vueperslides';


const props = defineProps<{
    images: string[],
    height: string,
    shame?: boolean
}>();

//at-product-header__image
const slider = ref(null);

const changeBg = () => {
    if (props.shame) {
        const root = document.querySelector('.at-product-header__image') as HTMLElement;
        root.style.setProperty(
            'background',
            `url(${slider.value.currentSlide.image}) center / cover no-repeat`,
            
        );
    }
}
const next = () => {
    slider.value.next()
    changeBg()
}
const prev = () => {
    slider.value.previous()
    changeBg()
}
onMounted(() => {
    changeBg()
})
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.at-header-slider {
    flex: 1;

    .vueperslides__parallax-wrapper {
        max-width: 670px;
    }

    .vueperslides__inner {
        display: flex;
        flex-direction: row-reverse;

        .vueperslides__parallax-wrapper {
            width: 100%;
        }
    }

    .vueperslides__track .vueperslide {
        border-radius: $radius-large;
    }

    .vueperslides__fractions {
        align-self: end;
        margin-right: 20px;
    }
}
</style>