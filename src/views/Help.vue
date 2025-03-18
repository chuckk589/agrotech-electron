<template>
  <div>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Помощь</v-card-title>
          <v-card-text>Здесь вы найдете ответы на часто задаваемые вопросы по использованию приложения</v-card-text>
          <v-card-text>
            <v-col>
              <v-row>
                <p>Наш сайт:</p>
                <p>agrotech.ru</p>
              </v-row>
              <v-row>
                <p>Наш сайт:</p>
                <p>agrotech.ru</p>
              </v-row>
              <v-row>
                <p>Наш сайт:</p>
                <p>agrotech.ru</p>
              </v-row>
            </v-col>
          </v-card-text>
          <v-card-text>
            <v-col>
              <v-row>
                <a href="#">Условия использованию</a>
              </v-row>
              <v-row>
                <a href="#">Лицензионное соглашение</a>
              </v-row>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Заявить о проблеме</v-card-title>
          <v-card-text>
            <v-text-field label="Имя"></v-text-field>
            <v-text-field label="Контакты"></v-text-field>
            <v-textarea label="Опишите проблему"></v-textarea>
            <v-file-input v-model="fileInput" multiple clearable label="Прикрепить файл"
              density="compact"></v-file-input>
            <!-- <a href="#" @click.prevent="triggerFileUpload">Прикрепить файл</a> -->
            <!-- <input multiple type="file" ref="fileInput" @change="handleFileUpload" style="display: none" /> -->
          </v-card-text>
          <v-card-actions>
            <v-btn class="w-100" variant="tonal" @click="openTicket">Отправить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-card class="w-100 p-4">
        <v-card-title>(FAQ)</v-card-title>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>Как связаться с поддержкой?</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>Вы можете связаться с нами по телефону +7 (495) 123-45-67 или написать на почту support@agrotech.ru
                </p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Как обновить версию</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>Для обновления версии приложения перейдите на наш сайт и скачайте последнюю версию</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Как пользоваться оффлайн</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>Для использования приложения в оффлайн режиме необходимо скачать необходимые данные на устройство</p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-row>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const fileInput = ref(null);

const openTicket = async () => {
  // const formData = new FormData();
  // formData.append("files", fileInput.value); 

  // try {
  //   const response = await fetch("https://your-api.com/upload", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (!response.ok) {
  //     throw new Error("Ошибка загрузки файла");
  //   }

  //   const result = await response.json();
  //   console.log("Файл загружен:", result);
  // } catch (error) {
  //   console.error("Ошибка:", error);
  // }
};
// const triggerFileUpload = () => {
//   fileInput.value?.click();
// };

// const handleFileUpload = (event: any) => {
//   const file = event.target.files[0];
//   if (file) {
//     console.log("Выбран файл:", event.target.files);
//   }
// };
</script>

<style></style>