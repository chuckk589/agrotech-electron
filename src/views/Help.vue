<template>
  <div>
    <div class="at-app-bar text-large">
      <span>Помощь</span>
    </div>
    <div class="at-help-container">
      <div class="at-help-block-1">
        <div class="at-help__info-card">
          <span class="text-large text-soft-300">Здесь вы найдете ответы на часто задаваемые вопросы по использованию
            приложения</span>
          <div class="at-help__info-card__links text-medium text-disabled-300">
            <div>
              <div v-html="earth"></div>agrotechsim.ru
            </div>
            <div>
              <div v-html="mail"></div>
              hello@agrotechsim.ru
            </div>
            <div>
              <div v-html="tgline"></div>
              @agrotechsim
            </div>
          </div>
          <div class="at-help__info-card__href text-medium">
            <a href="#" @click="test">Условия использованию</a>
            <a href="#">Лицензионное соглашение</a>
          </div>
        </div>
        <div class="at-help-card">
          <div class="text-large">Заявить о проблеме</div>
          <v-form ref="form" :disabled="loading">
            <v-text-field name="name" class="at-text-input" label="Имя" :rules="[rules.required]"></v-text-field>
            <v-text-field name="contacts" class="at-text-input" label="Контакты"
              :rules="[rules.required]"></v-text-field>
            <v-textarea name="subject" no-resize class="at-text-input" label="Опишите проблему"
              :rules="[rules.required]"></v-textarea>
            <input type="file" name="file" ref="fileInput" @change="handleFileUpload" style="display: none" />
            <div class="at-help-card__file-input text-medium">
              <div class="at-help-card__svg" v-html="file"></div>
              <a v-if="!currentFile" class="text-disabled-300" href="#" @click.prevent="triggerFileUpload">Прикрепить
                файл</a>
              <div v-if="currentFile" class="uploaded-file">
                <div>{{ currentFile.name }}</div>
                <img src="../assets/close.png" alt="Click me" class="cursor-pointer" @click="clearFileInput" />
              </div>
            </div>
            <v-btn :loading="loading" class="at-button text-medium" @click="openTicket">Отправить</v-btn>
          </v-form>
        </div>
      </div>
      <div class="at-help-block-2">
        <span class="text-average">Популярные вопросы</span>
        <div class="at-help__faq-block">
          <v-expansion-panels>
            <v-expansion-panel v-for="(faq, index) in faqs" :key="index">
              <v-expansion-panel-title>
                <span class="text-medium text-disabled-300">{{ faq.subject }}</span>
                <template v-slot:actions="{ expanded }">
                  <!-- <v-icon :color="!expanded ? 'teal' : ''" :icon="expanded ? 'mdi-pencil' : 'mdi-check'"></v-icon> -->
                  <img :src="expanded ? minus : plus" />
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text><span class="text-small">{{ faq.answer }}</span></v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { earth } from "@/assets/svg/earth";
import { file } from "@/assets/svg/file";
import { mail } from "@/assets/svg/mail";
import { tgline } from "@/assets/svg/telegram-line";
import { useErrorStore } from "@/stores/errorStore";
import { useTicketStore } from "@/stores/ticketStore";
import { EventScope } from "@/utils/errorHandler";
import { ref } from "vue";
import minus from '../assets/minus.png';
import plus from '../assets/plus.png';

const fileInput = ref(null);
const loading = ref(false);
const form = ref(null);
const currentFile = ref<File>(null);
const rules = {
  required: (v: string) => !!v || 'Поле обязательно к заполнению',
}
const errorStore = useErrorStore();
const ticketStore = useTicketStore();
const faqs = [
  {
    subject: "Как связаться с поддержкой?",
    answer: "Вы можете связаться с нами по телефону +7 (495) 123-45-67 или написать на почту support@agrotech.ru"
  },
  {
    subject: "Как обновить версию",
    answer: "Для обновления версии приложения перейдите на наш сайт и скачайте последнюю версию"
  },
  {
    subject: "Как пользоваться оффлайн",
    answer: "Для использования приложения в оффлайн режиме необходимо скачать необходимые данные на устройство"
  }
]
const test = () => {
  window.shell.openUrl('https://github.com')
}
const clearFileInput = () => {
  fileInput.value.value = null;
  currentFile.value = null
};
const triggerFileUpload = () => {
  fileInput.value?.click();
};
const openTicket = async () => {
  const { valid, errors } = await form.value.validate()
  if (valid) {
    try {
      loading.value = true;
      const formData = new FormData(form.value.$el);

      await ticketStore.createTicket(formData);

      form.value.reset();
      clearFileInput();
      errorStore.setEvent(EventScope.Misc, 1);
    } catch (error) {
      errorStore.setEvent(EventScope.Misc, 0);
    } finally {
      loading.value = false;
    }
  }
}
const handleFileUpload = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    currentFile.value = file;
  }
};
</script>

<style lang="scss" scoped>
.at-help-container {
  padding: calc(80px + $spacing-3) $spacing-6 $spacing-3;

  .at-help-block-1 {
    display: flex;
    height: 567px;
    margin-bottom: 40px;

    .at-help-card {
      width: 473px;
      display: flex;
      flex-direction: column;
      padding: $card-padding-large;
      background: $bg-dark-20;
      border: $at-border;
      backdrop-filter: blur(24.85px);
      border-radius: $radius-huge;

      form {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin-top: 24px;
      }

      .at-text-input {
        max-height: 56px;
      }

      .v-textarea {
        max-height: 163px;
      }

      .at-button {
        background-color: rgb(var(--v-theme-primary-base-dark)) !important;
        height: 48px;
        padding: 0 $button-padding-big;
      }

      .at-help-card__file-input {
        display: flex;
        align-items: center;
        gap: 8px;

        .uploaded-file {
          margin-left: 8px;
          padding-top: 2px;
          display: flex;
          align-items: center;
          color: rgb(var(--v-theme-primary-base-dark));

          img {
            width: 30px;
            height: 30px;
          }
        }

        .at-help-card__svg {
          width: 18px;
          height: 18px;
        }

      }
    }

    .at-help__info-card {
      display: flex;
      flex-direction: column;
      padding: $card-padding-large;
      flex: 1;
      background: $bg-dark-20;
      border: $at-border;
      backdrop-filter: blur(24.85px);
      border-radius: $radius-huge;
      margin-right: 32px;

      .at-help__info-card__links {
        margin: 24px 0;
        display: flex;
        flex-direction: column;
        gap: 10px;

        div {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        img {
          width: 24px;
          height: 24px;
        }
      }

      .at-help__info-card__href {
        display: flex;
        flex-direction: column;
        gap: 18px;

        a {
          color: rgb(var(--v-theme-primary-base-dark));
        }
      }
    }
  }

  .at-help-block-2 {
    .v-expansion-panels {
      gap: 8px;
    }

    .at-help__faq-block {
      margin-top: 20px;
    }
  }
}
</style>
<style lang="scss">
.at-help-block-2 {
  .v-expansion-panel {
    background: $bg-dark-20;
    border: $at-border;
    border-radius: $radius-large;

    button {
      height: 60px;
      backdrop-filter: $blur-background;
    }
  }
}
</style>