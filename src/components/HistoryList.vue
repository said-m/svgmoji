<script lang="ts" setup>
import { IStorageHistoryItem } from '@/utils/storage-data';
import EmojiButton from './EmojiButton.vue';

const {
  list,
  copyAsImage = false,
} = defineProps<{
  list: Array<IStorageHistoryItem>;
  copyAsImage?: boolean;
}>();

async function handleClick(item: IStorageHistoryItem) {
  try {
    await copy({
      value: item.link,
      asImage: copyAsImage,
    })
  } catch (error) {
    console.error('Copy failed:', error)
  }
}
</script>

<template>
  <div class="historyListComponent" v-if="list.length">
    <EmojiButton v-for="thisItem in list" :key="thisItem.link" :imageUrl="thisItem.link"
      @click="handleClick(thisItem)" />
  </div>
  <div v-else>history is empty</div>
</template>

<style scoped>
.historyListComponent {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 7px;
}
</style>