<script lang="ts" setup>
import { CONTEXT_MENU_MODE_TITLES, CONTEXT_MENU_MODES, IContextMenuModes } from '@/constants/storage-data';
import PopupSection from '../containers/PopupSection.vue';
import RadioField from '../basic/RadioField.vue';

const model = defineModel<IContextMenuModes | undefined>();
</script>

<template>
  <PopupSection class="contextMenuModeComponent" title="Context menu mode" isIndicatable :indicatorValue="model">

    <fieldset>
      <RadioField v-for="thisItem in CONTEXT_MENU_MODES" :key="thisItem" name="contextMenuMode"
        :label="CONTEXT_MENU_MODE_TITLES[thisItem]" :value="thisItem" v-model="model" />
    </fieldset>
  </PopupSection>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
</style>