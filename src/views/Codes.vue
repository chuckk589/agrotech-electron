<template>
  <div>
    <v-alert v-if="errorMessage" type="error" class="mb-4">{{ errorMessage }}</v-alert>
    <v-card flat class="at-code-card">
      <v-card-title class="mb-4">Активация кода</v-card-title>
      <v-card-text class="d-flex align-center flex-column">
        <v-row class="text-center mb-4">Найдите письмо от разработчика или сервиса, в котором указан ваш лицензионный
          ключ.
          Обычно он выглядит
          как последовательность символов, например: XXXXX-XXXXX-XXXXX-XXXXX.
        </v-row>
        <v-row class="w-100 mb-4">
          <v-form ref="form" class="w-100 ">
            <v-text-field :disabled="loading" label="Введите свой код-ключ" variant="solo-filled"
              :rules="[rules.required, rules.link]" class="at-code-input"></v-text-field>
          </v-form>
        </v-row>
        <v-row>
          <v-btn :loading="loading" variant="tonal" @click="activateCode">Активировать</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
    <div class="at-code-history">
      <div>История активаций</div>
      <v-data-table class="at-code-table" :items="history"></v-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const form = ref(null);
const loading = ref(false);
const errorMessage = ref('');

const rules = {
  required: (v: string) => !!v || 'Поле обязательно к заполнению',
  link: (v: string) => v.length == 3 || 'Код должен состоять из 3 символов'
}
const history = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  date: new Date().toLocaleDateString(),
  type: "3 продукта",
  duration: "3 месяца"
}));

const activateCode = async () => {
  const { valid, errors } = await form.value.validate()
  if (valid) {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      errorMessage.value = "Код не найден";
      setTimeout(() => {
        errorMessage.value = "";
      }, 10000);
    }, 2000);
  }
}
</script>

<style>
.at-code-card {
  display: flex !important;
  flex-direction: column;
  align-items: center;
}

.at-code-input input {
  text-align: center;
}

.at-code-input .v-field__field {
  justify-content: center;
}

.at-code-history {
  margin-top: 100px;
}

.at-code-table {
  padding: 20px;
}
</style>