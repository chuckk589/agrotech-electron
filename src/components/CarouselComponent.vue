<template>
  <div>
    <v-carousel :show-arrows="false" 
    >
      <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover></v-carousel-item>

      <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg" cover></v-carousel-item>

      <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-carousel-item>
      
    </v-carousel>
    <!-- <v-item-group selected-class="bg-primary">
        <v-container>
          <v-row>
            <v-col v-for="n in 3" :key="n" cols="12" md="4">
              <v-item v-slot="{ isSelected, selectedClass, toggle }">
                <v-card :class="['d-flex align-center', selectedClass]" height="200" dark @click="toggle">
                  <div class="text-h3 flex-grow-1 text-center">
                    {{ isSelected ? 'Selected' : 'Click Me!' }}
                  </div>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group> -->
  </div>
</template>

<script>

export default {
  name: 'CarouselComponent',
  components: {
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


</style>
