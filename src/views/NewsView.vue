<template>
  <div class="at-app-bar">
    <v-btn @click="$router.go(-1)" class="at-button">
      <template v-slot:prepend>
        <img src="../assets/arrow.png">
      </template>
      <span class="text-medium">Назад</span>
    </v-btn>
  </div>
  <article>
    <header>
      <h2>{{ newsStore.currentEntry.title }}</h2>
      <span>{{ new Date(newsStore.currentEntry.date).toLocaleDateString() }}</span>
    </header>
    <vueper-slides v-if="newsStore.currentEntry.sliderMedia?.length" class="no-shadow" fixed-height="496px" :gap="4"
      ref="slider" :bullets="false" fractions :arrows="false">
      <vueper-slide v-for="(slide, i) in newsStore.currentEntry.sliderMedia" :key="i" :image="slide" />
      <template #fraction="{ current, total }">
        <div class="at-slider-controls text-disabled-300 text-medium">
          <v-btn @click="slider.previous()" class="at-button at-button-nav-prev"></v-btn>
          <div class="at-slider-pg">{{ current }}/{{ total }}</div>
          <v-btn @click="slider.next()" class="at-button at-button-nav-next"></v-btn>
        </div>
      </template>
    </vueper-slides>
    <main v-html="newsStore.currentEntry.html"></main>
  </article>
  <div class="at-news-footer">
    <div class="text-average text-soft-300">Похожие новости</div>
    <div class="at-news-footer__related">
      <NewsCard v-for="entry in newsStore.news" :key="entry.title" :entry="entry" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from '@/stores/newsStore';
import { ref } from 'vue';
import { VueperSlide, VueperSlides } from 'vueperslides';
import NewsCard from '../components/NewsCard.vue';

const newsStore = useNewsStore()
const slider = ref(null);

</script>

<style scoped lang="scss">
.at-news-footer {
  margin: 24px;
}

.at-news-footer__related {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(428px, max-content));
  overflow: hidden;
  height: 396px;
  gap: 16px;

  justify-content: start;

  .v-card {
    width: 428px;
  }
}

.at-news-container {
  margin-top: 24px;
}
</style>
<style lang="scss">
@use "@/styles/typography" as *;

article {
  min-width: 880px;
  max-width: 70%;
  margin: calc(48px + 80px) auto 0;

  .vueperslides {
    margin-bottom: 100px;
  }

  header {
    margin-bottom: 18px;

    h2 {
      font-size: $heading-max-font-size;
      font-weight: 500;
    }

    span {
      @extend .text-medium;
      @extend .text-soft-400;
    }
  }

  main {
    margin-bottom: 80px;

    figure {
      margin: 30px 0;
      display: flex;
      justify-content: space-around;
      height: 256px;
      gap: 16px;

      img {
        flex: 1;
        border-radius: $radius-huge;
        border: $at-border;
        object-fit: cover;
      }
    }

    section {
      margin: 40px 0;

      h3 {
        @extend .text-large;
        margin-bottom: 10px;
      }

      h4 {
        margin-bottom: 5px;
      }

      h4,
      li,
      span {
        @extend .text-medium;
        @extend .text-disabled-300;
      }

      ul {
        padding: 20px;
      }

      li {
        padding: 5px 0;
      }
    }
  }

  .vueperslides__track {
    z-index: unset;

    .vueperslide {
      border-radius: $radius-huge;
      border: $at-border;
    }
  }

  .vueperslides__parallax-wrapper,
  .vueperslides__track {
    overflow: visible;
  }

  .vueperslide--active {
    border: 0 !important;
  }

  .vueperslides__fractions {
    all: unset;

    display: flex;
    justify-content: center;

    .at-slider-controls {
      display: flex;
      align-items: center;
      margin: 28px 0;

      .at-slider-pg {
        white-space: nowrap;
        margin: 0 $spacing-2;
      }
    }

  }
}
</style>