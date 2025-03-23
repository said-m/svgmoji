<script lang="ts" setup>
import storageData, { IContextMenuModes, ICopyModes, IStorageHistoryItem, IStorageSourceItem } from '@/utils/storage-data';
import HistoryList from '@/components/HistoryList.vue';
import { ISources, SOURCES } from '@/constants/sources';
import RadioField from '@/components/RadioField.vue';
import SourcesList from '@/components/SourcesList.vue';

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
  <HistoryList v-if="copyHistory" :list="copyHistory" :copyAsImage="copyMode === COPY_MODES.image" />
  <div v-else>history is not available</div>

  <SourcesList v-if="sourcePrioritization" :order="sourcePrioritization" />
  <div v-else>source are not available</div>

  <div>
    <RadioField v-for="(thisItem, thisItemKey) in CONTEXT_MENU_MODES" :key="thisItemKey" :name="contextMenuMode"
      :label="thisItem" :value="thisItemKey" :modelValue="contextMenuMode"
      @change="storageData.contextMenuMode.setValue(thisItemKey)" />
  </div>

  <div>
    <RadioField v-for="(thisItem, thisItemKey) in COPY_MODES" :key="thisItemKey" :name="copyMode" :label="thisItem"
      :value="thisItemKey" :modelValue="copyMode" @change="storageData.copyMode.setValue(thisItemKey)" />
  </div>
</template>

<style scoped></style>