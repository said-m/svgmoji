<script lang="ts" setup>
import { IStorageHistoryItem } from '@/utils/storage-data';
import EmojiButton from '../basic/EmojiButton.vue';
import PopupSection from '../containers/PopupSection.vue';
import { SOURCES } from '@/constants/sources';
import { BADGE_COLORS } from '@/utils/colors';

const {
  list,
  copyAsImage = false,
} = defineProps<{
  list: Array<IStorageHistoryItem> | undefined;
  copyAsImage?: boolean;
}>();

const duplicateGroups = computed(() => {
  if (!list) return new Map();

  const groups = new Map<string, { occurrences: number[]; color: string }>();
  const occurrenceCount = new Map<string, number>();

  list?.forEach((item, index) => {
    const count = (occurrenceCount.get(item.link) || 0) + 1;
    occurrenceCount.set(item.link, count);

    if (count > 1) {
      if (!groups.has(item.link)) {
        groups.set(item.link, {
          occurrences: [index],
          color: BADGE_COLORS[groups.size % BADGE_COLORS.length],
        });
      }
      groups.get(item.link)!.occurrences.push(index);
    }
  });

  return groups;
});

const getOccurrenceNumber = (item: IStorageHistoryItem, index: number) => {
  const group = duplicateGroups.value.get(item.link);
  if (!group) return 0;

  return group.occurrences.findIndex(occIndex => occIndex === index) + 1;
};

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
      <EmojiButton v-for="(thisItem, index) in list" :key="`${thisItem.link}-${getOccurrenceNumber(thisItem, index)}`"
        :imageUrl="thisItem.link" :color="duplicateGroups.get(thisItem.link)?.color" @click="handleClick(thisItem)"
        :title="`${thisItem.emoji} from ${SOURCES[thisItem.source].title}`" />
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