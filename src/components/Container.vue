<template>
  <v-app>
    <v-navigation-drawer permanent width="300" class="drawer">
      <v-list>
        <v-list-item to="/main/products" value="1" color="#1867C0">
          <template v-slot:prepend>
            <v-icon class="mr-5" icon="mdi-security "></v-icon>
          </template>

          <v-list-item-title>Администрация</v-list-item-title>
        </v-list-item>
        <v-list-item to="/main/products" value="2" color="#1867C0">
          <template v-slot:prepend>
            <v-icon class="mr-5" icon="mdi-account"></v-icon>
          </template>

          <v-list-item-title>Пользователи</v-list-item-title>
        </v-list-item>
        <v-list-item to="/main/products" value="3" color="#1867C0">
          <template v-slot:prepend>
            <v-icon class="mr-5" icon="mdi-qrcode-scan"></v-icon>
          </template>

          <v-list-item-title>Коды</v-list-item-title>
        </v-list-item>
        <v-list-item to="/main/products" value="4" color="#1867C0">
          <template v-slot:prepend>
            <v-icon class="mr-5" icon="mdi-chat-question"></v-icon>
          </template>

          <v-list-item-title>Шаблоны</v-list-item-title>
        </v-list-item>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Тестирования">
              <template v-slot:prepend> <v-icon class="mr-5" icon="mdi-clipboard-list"></v-icon>
              </template></v-list-item>
          </template>

          <v-list-item to="/main/products" value="5" color="#1867C0">
            <v-list-item-title>Ручные</v-list-item-title>
          </v-list-item>
          <v-list-item to="/main/products" value="6" color="#1867C0">
            <v-list-item-title>Авто</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-item to="/main/products" value="7" color="#1867C0">
          <template v-slot:prepend>
            <v-icon class="mr-5" icon="mdi-trophy"></v-icon>
          </template>

          <v-list-item-title>Результаты</v-list-item-title>
        </v-list-item>
        <v-list-item to="/main/products" value="8" color="#1867C0">
          <template v-slot:prepend>
            <v-icon class="mr-5" icon="mdi-ip"></v-icon>
          </template>

          <v-list-item-title>Прокси</v-list-item-title>
        </v-list-item>
        <v-list-item to="/main/products" value="9" color="#1867C0">
          <template v-slot:prepend>
            <v-icon class="mr-5" icon="mdi-cog"></v-icon>
          </template>

          <v-list-item-title>Конфиги</v-list-item-title>
        </v-list-item>
        <v-list-item to="/main/products" value="10" color="#1867C0">
          <template v-slot:prepend>
            <v-icon class="mr-5" icon="mdi-account-cancel"></v-icon>
          </template>

          <v-list-item-title>Блокировки</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid style="display: flex; flex-direction: column; height: 100%">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'ContainerView',
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
.drawer {
  width:  $drawer-width;
}


</style>
