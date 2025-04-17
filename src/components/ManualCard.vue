<template>
    <div variant="flat" class="at-manual-card">
        <img src="../assets/pdf-medium.png">
        <div class="mb-name text-base">{{ manual.manualName }}</div>
        <div class="mb-size text-disabled-300">{{ manual.size }}</div>
        <v-btn class="at-button" @click="openUrl($event, manual.manualRef)" :loading="loading">Открыть
            <!-- <template v-slot:append>
                <img src="../assets/download.png">
            </template> -->
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import { useOpenUrl } from '@/mixins/openUrl';
import { ref } from 'vue';
import { RetrieveManualDto } from '../../../agrotech-back/shared';
const loading = ref(false)
const { openUrl } = useOpenUrl()
defineProps<{
    manual: RetrieveManualDto
}>();
// const download = async () => {
//     loading.value = true
//     try {
//         const link = await configStore.getDownloadLink(props.manual.id)
//         const url = new URL(link);
//         const fileName = url.searchParams.get('filename') || 'manual.pdf';

//         const response = await axios.get(link, {
//             responseType: 'blob',
//         });

//         const blobUrl = URL.createObjectURL(response.data);

//         const a = document.createElement('a');
//         a.href = blobUrl;
//         a.download = fileName;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);

//         URL.revokeObjectURL(blobUrl);

//     } catch (error) {
//         // console.error('Error downloading file:', error)
//     } finally {
//         loading.value = false
//     }
// }
</script>


<style lang="scss" scoped>
.at-manual-card {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 88px;
    border-bottom: $at-border;

    img {
        width: $icon-40;
        height: $icon-40;
        margin-right: $spacing-5;
    }

    .mb-name {
        margin-right: auto;
    }

    .mb-size {
        margin-right: $spacing-4;
    }

    .at-button {
        padding: 12px 24px;
        gap: 8px;
        height: 48px;

        img {
            width: $icon-24;
            height: $icon-24;
            margin-right: 0
        }
    }

}
</style>
