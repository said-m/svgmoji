<script setup lang="ts">
import { ISources, SOURCES } from '@/constants/sources';
import PopupSection from '../containers/PopupSection.vue';
import { IStorageSourcePrioritizationItem } from '@/utils/storage-data';
import { ref } from 'vue';

const model = defineModel<IStorageSourcePrioritizationItem>();

const draggedItem = ref<ISources | null>(null);
const draggedOverItem = ref<ISources | null>(null);

const handleDragStart = (item: ISources) => {
  draggedItem.value = item;
};

const handleDragOver = (e: DragEvent, item: ISources) => {
  e.preventDefault();
  draggedOverItem.value = item;
};

const handleDrop = (targetItem: ISources) => {
  if (!draggedItem.value || !model.value) return;

  const newList = [...model.value];
  const fromIndex = newList.indexOf(draggedItem.value);
  const toIndex = newList.indexOf(targetItem);

  newList.splice(fromIndex, 1);
  newList.splice(toIndex, 0, draggedItem.value);

  model.value = newList;
  draggedItem.value = null;
  draggedOverItem.value = null;
};
</script>

<template>
  <PopupSection class="sourcesListComponent" title="Sources" isIndicatable :indicatorValue="model">
    <div class="content">
      <div v-for="(thisItem, thisItemIndex) in model" :key="thisItem" class="item" :class="{
        'isDragging': draggedItem === thisItem,
        'isDragOver': draggedOverItem === thisItem
      }" draggable="true" @dragstart="handleDragStart(thisItem)" @dragover="handleDragOver($event, thisItem)"
        @drop="handleDrop(thisItem)" @dragend="draggedItem = null">
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

  &.isDragging {
    opacity: 0.5;
    cursor: grabbing;
  }

  &.isDragOver {
    border-color: var(--color-element-primary);
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
</style>