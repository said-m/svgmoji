<script lang="ts" setup>
import { IStorageHistoryItem } from '@/utils/storage-data';
import EmojiButton from '../basic/EmojiButton.vue';
import PopupSection from '../containers/PopupSection.vue';
import { SOURCES } from '@/constants/sources';

const {
  list,
  copyAsImage = false,
} = defineProps<{
  list: Array<IStorageHistoryItem> | undefined;
  copyAsImage?: boolean;
}>();

async function handleClick(item: IStorageHistoryItem) {
  try {
    const copyResult = await copy({
      value: item.link,
      asImage: copyAsImage,
    });

    const base64Url =
      copyResult instanceof Blob
        ? await convertPngToBase64(copyResult)
        : undefined;

    notify({
      id: item.link,
      title: `${!copyAsImage ? "Link to emoji" : "Image of emoji"
        } "${item.emoji}" copied to clipboard`,
      message: `Source: ${SOURCES[item.source].title}`,
      icon: base64Url ?? (!copyAsImage ? "/link.png" : "/icon/128.png"),
    });
  } catch (error) {
    notify({
      title: `Failed to copy "${item.emoji}"`,
      message: `Source: ${SOURCES[item.source].title}`,
      icon: "/error.png",
    });
  }
}
</script>

<template>
  <PopupSection class="historyListComponent" title="Recently copied emojis" isIndicatable :indicatorValue="list">
    <div v-if="list?.length" class="content">
      <EmojiButton v-for="thisItem in list" :key="thisItem.link" :imageUrl="thisItem.link"
        @click="handleClick(thisItem)" :title="`${thisItem.emoji} from ${SOURCES[thisItem.source].title}`" />
    </div>
    <p v-else>No emojis copied yet</p>
  </PopupSection>
</template>

<style scoped>
.content {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 7px;
}
</style>