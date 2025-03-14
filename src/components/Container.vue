<template>
  <v-app>
    <v-navigation-drawer permanent class="at-drawer">
      <v-list class="at-menu-text">
        <v-img class="at-logo" :src="logo"></v-img>
        <v-list-item to="/main/products" value="1">
          <v-list-item-title>Продукты</v-list-item-title>
        </v-list-item>

        <v-list-item to="/main/my-products" value="2">
          <v-list-item-title>Мои продукты</v-list-item-title>
        </v-list-item>

        <v-list-item to="/main/prcoducssts" value="3" disabled>
          <v-list-item-title>Новости</v-list-item-title>
        </v-list-item>

        <v-list-item to="/main/producvvts" value="4" disabled>
          <v-list-item-title>Активация кода</v-list-item-title>
        </v-list-item>

        <v-list-item to="/main/productsa" value="5" disabled>
          <v-list-item-title>Помощь</v-list-item-title>
        </v-list-item>
      </v-list>
      <div class="at-online-block">
        <div :class="online ? 'at-online-dot' : 'at-offline-dot'"></div>
        <div>{{ online ? "Онлайн" : "Оффлайн" }}</div>
      </div>

    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import logo from '../assets/logo.svg';

const online = ref(false)

onMounted(() => {
  const http = new XMLHttpRequest();
  http.open('HEAD', 'https://www.google.com', false);
  http.send();
  online.value = http.status < 400;
});

</script>
<style>
.at-drawer {
  /* width: var(--at-drawer-width) !important; */
  background-color: #D9D9D9 !important;
}

.at-drawer .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
}

.at-drawer .v-list {
  margin-bottom: auto;
}

.at-online-block {
  display: flex;
  align-items: center;
  align-self: center;
  margin-bottom: 20px;
  justify-content: center;
  width: 80%;
  background: #FFFFFF;
  height: 44px;
}

.at-online-dot {
  border: 5px solid #44CF8C;
  margin-right: 2px;
  border-radius: 50%;
}
.at-offline-dot {
  border: 5px solid #FF0000;
  margin-right: 2px;
  border-radius: 50%;
}
.at-menu-text {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.011em;
  color: #0000007c !important;
}

.at-menu-text .v-list-item--active {
  color: #000000 !important;
}

.at-logo {
  width: 172px;
  height: 31px;
  margin: 20px;
}
</style>


<!-- <style lang="scss">
.at-drawer {
  // width: $drawer-width !important;
  width: --var(--drawer-width);
  background: rgba(0, 0, 0, 0.46) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.19) !important;
  backdrop-filter: blur(15.65px) !important;
}

.at-app-bar{
  background: rgba(0, 0, 0, 0) !important;
}
.at-app-bar .v-btn {
  margin-right: 2px;
}
.at-app-bar .v-btn:first-child {
 margin-right: auto;
}

.at-logo {
  width: 172px;
  height: 31px;
  margin: 20px;
}

.v-application {
  background: url('../assets/product_back.jpg') center / cover no-repeat !important;

}

.at-menu-text {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: -0.011em;
  color: #FFFFFF;
  opacity: 0.5;
}

.at-menu-text-active {
  opacity: 1;
}

.at-menu-active {
  background: rgba(0, 0, 0, 0.13);
  border-right: 3px solid #44CF8C;
  border-radius: 0px;
}
</style> -->
