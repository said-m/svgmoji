<script lang="ts" setup>
const { title, indicatorValue, isIndicatable = false, } = defineProps<{
  title: string;
  indicatorValue?: unknown;
  isIndicatable?: boolean;
}>();
</script>

<template>
  <div class="contextMenuModeComponent">
    <h2>{{ title }}</h2>

    <template v-if="isIndicatable">
      <slot v-if="indicatorValue" v-bind="{ data: indicatorValue }" />
      <p v-else-if="indicatorValue === undefined">loading…</p>
      <p v-else>unavailable</p>
    </template>
    <slot v-else />
  </div>
</template>

<style scoped></style>