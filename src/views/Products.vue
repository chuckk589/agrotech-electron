<template>
  <div style="height: 300vh;">
    <div class="app-bar">
      <v-btn>back</v-btn>
      <v-btn>import</v-btn>
      <v-btn>export</v-btn>
      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">
            1.1.0
          </v-btn>
        </template>

        <v-list>
          <v-list-item>1.1.1</v-list-item>
        </v-list>
      </v-menu>
    </div>
    <CarouselComponent></CarouselComponent>
  </div>
</template>

<script>
import CarouselComponent from '../components/CarouselComponent.vue';
export default {
  name: 'ProductsView',
  components: {
    CarouselComponent
  },
  data() {
    return {};
  },
  computed: {},
  mounted() { },
  methods: {},
};
</script>
<style lang="scss">
.app-bar {
  width: calc(100% - $drawer-width);
  position: fixed;
  top: 0;
  z-index: 1000;
  display: flex ;
}

.app-bar .v-btn:first-child {
  margin-right: auto;
}
</style>