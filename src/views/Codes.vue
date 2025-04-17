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

        // await managerStore.refreshInstalledProducts()
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