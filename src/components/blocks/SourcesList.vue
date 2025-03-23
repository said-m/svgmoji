<script setup lang="ts">
import { ISources, SOURCES } from '@/constants/sources';
import PopupSection from '../containers/PopupSection.vue';

const model = defineModel<Array<ISources>>()
</script>

<template>
  <PopupSection class="sourcesListComponent" title="Sources" isIndicatable :indicatorValue="model">
    <div class="content">
      <div v-for="(thisItem, thisItemIndex) in model" :key="thisItem" class="item">
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
</style>