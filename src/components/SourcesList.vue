<template>
  <div class="sources-list">
    <h2>Sources</h2>

    <draggable
      v-model="enabledSources"
      group="sources"
      item-key="id"
      class="list"
      @change="handleChange"
    >
      <template #item="{ element: source }">
        <div
          class="item"
          :class="{
            'is-new': source.isNew,
            'is-disabled': source.isDisabled
          }"
        >
          <span class="index">{{ source.index + 1 }}</span>
          {{ sourceInfo[source.type].title }}
        </div>
      </template>
    </draggable>

    <p v-if="!enabledSources.length">No sources available</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { Sources, SourceItem } from '@/types'
import { SOURCES } from '@/constants'

const props = defineProps<{
  sources: Record<Sources, SourceItem>
  order: Sources[]
}>()

const emit = defineEmits<{
  (e: 'update:sources', sources: Record<Sources, SourceItem>): void
  (e: 'update:order', order: Sources[]): void
}>()

const enabledSources = computed(() =>
  props.order
    .filter(type => !props.sources[type]?.isDisabled)
    .map((type, index) => ({
      ...props.sources[type],
      type,
      index
    }))
)

const handleChange = (event: any) => {
  // Update sources and order based on drag events
  const newOrder = event.moved
    ? props.order.filter(s => s !== event.moved.element.type)
        .splice(event.moved.newIndex, 0, event.moved.element.type)
    : props.order

  emit('update:order', newOrder)
}
</script>

<style lang="scss" scoped>
// ...Стили из оригинального компонента...
</style>
