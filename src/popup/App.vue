<template>
  <div class="app">
    <HistoryList :items="state.history" :copy-as-image="state.copyMode === CopyModes.image" />

    <SourcesList v-model:sources="state.sources" v-model:order="state.sourcePrioritization" />

    <ContextMenuMode v-model="state.contextMenuMode" />
    <CopyMode v-model="state.copyMode" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AppState, CopyModes, ContextMenuModes } from '@/types'
import HistoryList from '@/components/HistoryList.vue'
import SourcesList from '@/components/SourcesList.vue'
import ContextMenuMode from '@/components/ContextMenuMode.vue'
import CopyMode from '@/components/CopyMode.vue'

const state = ref<AppState>({
  history: [],
  sources: {},
  sourcePrioritization: [],
  contextMenuMode: ContextMenuModes.nested,
  copyMode: CopyModes.link
})

onMounted(async () => {
  const result = await chrome.storage.sync.get(null)
  state.value = result as AppState

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes) => {
    Object.entries(changes).forEach(([key, { newValue }]) => {
      state.value[key as keyof AppState] = newValue
    })
  })
})
</script>

<style lang="scss">
.app {
  min-width: 400px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
