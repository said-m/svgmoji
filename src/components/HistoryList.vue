<template>
  <div class="history-list">
    <h2>Recently copied emojis</h2>

    <div v-if="items.length" class="grid">
      <EmojiButton
        v-for="item in reversedItems"
        :key="item.link"
        :url="item.link"
        @click="handleClick(item)"
      />
    </div>
    <p v-else>History is empty</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/utils/copy'
import { HistoryItem } from '@/types'
import EmojiButton from './EmojiButton.vue'

const props = defineProps<{
  items: HistoryItem[]
  copyAsImage?: boolean
}>()

const reversedItems = computed(() => [...props.items].reverse())

const handleClick = async (item: HistoryItem) => {
  try {
    await copy({
      value: item.link,
      asImage: props.copyAsImage,
    })
  } catch (error) {
    console.error('Copy failed:', error)
  }
}
</script>

<style lang="scss" scoped>
.history-list {
  .grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 7px;
  }
}
</style>
