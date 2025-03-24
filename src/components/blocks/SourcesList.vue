<script setup lang="ts">
import { SOURCES } from '@/constants/sources';
import PopupSection from '../containers/PopupSection.vue';
import { IStorageSourcePrioritizationItem } from '@/utils/storage-data';
import { useSortable } from '@vueuse/integrations/useSortable';
import { ref } from 'vue';
import { until, watchOnce, watchWithFilter } from '@vueuse/core';

const model = defineModel<IStorageSourcePrioritizationItem>();
const list = useTemplateRef('list');
const order = ref<IStorageSourcePrioritizationItem>(model.value || []);
const isDragging = ref(false);

// Sync initial and subsequent model changes to order
watchWithFilter(() => model.value, (newValue) => {
  if (!newValue || JSON.stringify(newValue) === JSON.stringify(order.value)) {
    return;
  }

  order.value = [...newValue];
}, {
  immediate: true,
  eventFilter: async (i) => {
    await until(isDragging).toBe(false)

    return i();
  },
});

// Sync order changes back to model
watchWithFilter(order, (newValue) => {
  if (!newValue || JSON.stringify(newValue) === JSON.stringify(model.value)) {
    return;
  }

  model.value = [...newValue];
}, {
  eventFilter: async (i) => {
    await until(isDragging).toBe(false)

    return i();
  },
});

watchOnce(() => order.value.length, () => {
  useSortable(list, order, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    onStart: () => isDragging.value = true,
    onEnd: () => isDragging.value = false,
  });
})
</script>

<template>
  <PopupSection class="sourcesListComponent" title="Sources" isIndicatable :indicatorValue="model">
    <div ref="list" class="content">
      <div v-for="(thisItem, thisItemIndex) in order" :key="thisItem" class="item">
        <span class="index">{{ thisItemIndex + 1 }}</span>
        {{ SOURCES[thisItem].title }}
      </div>
    </div>
  </PopupSection>
</template>

<style scoped>
.sourcesListComponent {}

.content {
  display: flex;
  flex-direction: raw;
  flex-wrap: wrap;
  gap: 7px;
}

.item {
  display: block;
  position: relative;
  overflow: hidden;
  padding: 3px 7px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--color-background-secondary);
  border-radius: var(--border-radius);
  background-color: var(--color-background-primary);

  &.isNewItem {
    &::after {
      content: '(new)';
      display: inline-block;
      color: var(--color-element-alternative);
      margin-left: 0.25em;
    }
  }

  &:not(.isDisabledItem) {
    cursor: grab;
  }

  &.isDisabledItem {
    opacity: 0.5;
  }
}

.index {
  z-index: 0;
  position: absolute;
  top: 0;
  left: -0.07em;
  font-weight: bold;
  line-height: 0.5em;
  font-size: 3em;
  opacity: 0.1;
  transition-property: opacity;
}

.sortable-ghost {
  opacity: 0.5;
  background-color: var(--color-background-secondary);
}

.sortable-chosen {
  cursor: grabbing;
}

.sortable-drag {
  cursor: grabbing;
  background-color: var(--color-background-primary);
}
</style>