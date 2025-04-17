<template>
  <div class="at-code-container">
    <div class="at-code-card">
      <div class="code-card__icon">
        <img src="../assets/lock.png">
      </div>
      <div class="code_card__body">
        <div class="text-heading">Активация кода</div>
        <div class="code-card__text text-base text-soft-400">Найдите письмо от разработчика или сервиса, в котором
          указан ваш лицензионный
          ключ.Обычно он выглядит как последовательность символов, например: XXXXX-XXXXX-XXXXX-XXXXX.</div>
      </div>
      <div class="code-card__input">
        <div class="text-base text-soft-400">Введите свой код-ключ</div>
        <v-form ref="form">
          <v-text-field v-model="code" :disabled="loading" placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
            class="at-text-input"></v-text-field>
        </v-form>
      </div>
      <v-btn :loading="loading" class="at-button text-medium" @click="activateCode">Активировать</v-btn>
    </div>
    <div class="at-code-history ">
      <div class="text-average">История активаций</div>
      <v-data-table no-data-text="История активация пуста" :headers="headers" hide-default-header hide-default-footer
        class="at-code-table text-medium text-soft-300" :items="history">
        <template v-slot:item.licenseId="{ item }">
          <span>id{{ item.licenseId }}</span>
        </template>
        <template v-slot:item.activationDate="{ item }">
          <span>{{ new Date(item.activationDate).toLocaleString() }}</span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { STORE_VERSION } from '@/db/constants';
import { GuardantStatus } from '@/guardant.types';
import { useCacheStore } from '@/stores/cacheStore';
import { useErrorStore } from '@/stores/errorStore';
import { ProductCachedMetadata } from '@/types';
import { EventScope } from '@/utils/errorHandler';
import { onMounted, ref } from 'vue';

const form = ref(null);
const loading = ref(false);
const code = ref('');
const history = ref([]);
const errorStore = useErrorStore();
const cacheStore = useCacheStore();
const headers = [{ value: 'licenseId' }, { value: 'code' }, { value: 'activationDate' }];

const checkCode = async (code: string) => {
  return await window.guardant.method('checkSerialNumberFormat', code);
}

const activateCode = async () => {
  const { valid, errors } = await form.value.validate()
  if (valid) {
    loading.value = true;
    const codeRes = await checkCode(code.value);

    if (codeRes.status != GuardantStatus.OK) {
      errorStore.setEvent(EventScope.Guardant, codeRes.status)
    } else {
      const response = await window.guardant.method('activateLicense', code.value);

      errorStore.setEvent(EventScope.Guardant, response.status)

      if (response.status == GuardantStatus.OK) {

        await cacheStore.updateProductMetaData({ licenseId: response.licenseId, code: code.value, activationDate: Date.now() })

        loadHistory()
      }
      code.value = ''
    }
    loading.value = false;

  }
}

const loadHistory = async () => {
  history.value = await cacheStore.getCachedData<ProductCachedMetadata[]>(STORE_VERSION, 'products');
}
onMounted(() => {
  loadHistory()
})
</script>

<style lang="scss" scoped>
.at-code-container {
  padding-top: 80px;

  .at-code-card,
  .at-code-history {
    margin: auto;
    max-width: 880px;
  }

  .at-code-history>div {
    margin-bottom: $spacing-4;
  }

  .at-code-card {
    margin: 0 auto 80px;
    padding: $card-padding-large;
    display: flex;
    flex-direction: column;
    align-items: center;

    background: $bg-dark-20;
    border: $at-border;
    backdrop-filter: blur(89.35px);
    border-radius: $radius-huge;

    .at-button {
      background-color: rgb(var(--v-theme-primary-base-dark)) !important;
      height: 48px;
      padding: 0 $button-padding-big;
    }

    .code_card__body {
      text-align: center;
      margin: $spacing-6 0;
      max-width: 670px;

      div:nth-child(1) {
        margin-bottom: $spacing-4;
      }
    }

    .code-card__input {
      margin-bottom: $spacing-6;

      div:nth-child(1) {
        text-align: center;
        margin-bottom: $spacing-4;
      }

      .at-text-input {
        width: 430px;
        height: 56px;

        background: rgba(0, 0, 0, 0.5);
        border: $at-border;
        border-radius: $radius-large;
      }
    }
  }

  .code-card__icon {

    width: 64px;
    height: 64px;

    background: rgb(var(--v-theme-primary-base-dark));
    border-radius: $radius-mega;

    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: $icon-24;
      height: $icon-24;
    }
  }
}
</style>
<style lang="scss">
.code-card__input {


  input {
    text-align: center;
  }


}

.at-code-history {
  .v-table {

    tr {
      transition: all 0.1s ease-in-out;

    }
  }

  .v-table td {
    border-top: $at-border !important;
    border-bottom: unset !important;
    text-align: center;
  }

  tr:hover {
    background: rgba(0, 0, 0, 0.1);
  }

}
</style>