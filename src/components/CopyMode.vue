<template>
  <div class="copy-mode">
    <h2>Copy mode</h2>

    <fieldset>
      <RadioField
        v-model="mode"
        :value="CopyModes.link"
        @update:modelValue="updateStorage"
      >
        Link to an image
      </RadioField>

      <RadioField
        v-model="mode"
        :value="CopyModes.image"
        @update:modelValue="updateStorage"
      >
        Image
      </RadioField>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CopyModes } from '@/types'
import RadioField from './RadioField.vue'

const mode = ref<CopyModes>(CopyModes.link)

const updateStorage = (value: CopyModes) => {
  chrome.storage.sync.set({ copyMode: value })
}

onMounted(async () => {
  const { copyMode } = await chrome.storage.sync.get('copyMode')
  if (copyMode) {
    mode.value = copyMode
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
