<template>
  <div class="context-menu-mode">
    <h2>Context menu mode</h2>

    <fieldset>
      <RadioField
        v-model="mode"
        :value="ContextMenuModes.nested"
        @update:modelValue="updateStorage"
      >
        Submenu with a list of sources
      </RadioField>

      <RadioField
        v-model="mode"
        :value="ContextMenuModes.simple"
        @update:modelValue="updateStorage"
      >
        Action button at the root of menu (use source priority settings)
      </RadioField>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ContextMenuModes } from '@/types'
import RadioField from './RadioField.vue'

const mode = ref<ContextMenuModes>(ContextMenuModes.nested)

const updateStorage = (value: ContextMenuModes) => {
  chrome.storage.sync.set({ contextMenuMode: value })
}

onMounted(async () => {
  const { contextMenuMode } = await chrome.storage.sync.get('contextMenuMode')
  if (contextMenuMode) {
    mode.value = contextMenuMode
  }
})
</script>

<style lang="scss" scoped>
fieldset {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
</style>
