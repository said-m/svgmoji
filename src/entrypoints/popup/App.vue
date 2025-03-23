<script lang="ts" setup>
import storageData, { IStorageHistoryItem } from '@/utils/storage-data';
import HistoryList from '@/components/blocks/HistoryList.vue';
import { ISources } from '@/constants/sources';
import SourcesList from '@/components/blocks/SourcesList.vue';
import ContextMenuMode from '@/components/blocks/ContextMenuMode.vue';
import CopyMode from '@/components/blocks/CopyMode.vue';
import { COPY_MODES, IContextMenuModes, ICopyModes } from '@/constants/storage-data';

const copyHistory = ref<Array<IStorageHistoryItem> | undefined>();
const sourcePrioritization = ref<Array<ISources> | undefined>();
const contextMenuMode = ref<IContextMenuModes | undefined>();
const copyMode = ref<ICopyModes | undefined>();

const subscribes = [
  storageData.copyHistory.watch((newState) => {
    copyHistory.value = newState;
  }),
  storageData.sourcePrioritization.watch((newState) => {
    sourcePrioritization.value = newState;
  }),
  storageData.contextMenuMode.watch((newState) => {
    contextMenuMode.value = newState;
  }),
  storageData.copyMode.watch((newState) => {
    copyMode.value = newState;
  }),
];

onMounted(async () => {
  const storage = await Promise.allSettled([
    storageData.copyHistory.getValue(),
    storageData.sourcePrioritization.getValue(),
    storageData.contextMenuMode.getValue(),
    storageData.copyMode.getValue(),
  ])
  copyHistory.value = storage[0].status === 'fulfilled' ? storage[0].value : undefined;
  sourcePrioritization.value = storage[1].status === 'fulfilled' ? storage[1].value : undefined;
  contextMenuMode.value = storage[2].status === 'fulfilled' ? storage[2].value : undefined;
  copyMode.value = storage[3].status === 'fulfilled' ? storage[3].value : undefined;
});

onUnmounted(() => subscribes.forEach((unsubscribe) => unsubscribe()));
</script>

<template>
  <div class="main">
    <HistoryList :list="copyHistory" :copyAsImage="copyMode === COPY_MODES.image" />

    <SourcesList v-model="sourcePrioritization" />

    <ContextMenuMode :modelValue="contextMenuMode"
      @update:modelValue="(newValue) => newValue && storageData.contextMenuMode.setValue(newValue)" />

    <CopyMode :modelValue="copyMode"
      @update:modelValue="(newValue) => newValue && storageData.copyMode.setValue(newValue)" />
  </div>
</template>

<style scoped>
.main {
  min-width: 400px;
  padding: 15px;

  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>