<script lang="ts" setup>
import { COPY_MODES, COPY_MODE_TITLES, ICopyModes } from '@/constants/storage-data';
import PopupSection from '../containers/PopupSection.vue';
import RadioField from '../basic/RadioField.vue';

const model = defineModel<ICopyModes | undefined>();
</script>

<template>
  <PopupSection class="copyModeComponent" title="Copy mode" isIndicatable :indicatorValue="model">

    <fieldset>
      <RadioField v-for="thisItem in COPY_MODES" :key="thisItem" name="copyMode" :label="COPY_MODE_TITLES[thisItem]"
        :value="thisItem" v-model="model" />
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