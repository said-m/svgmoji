<template>
  <label class="radioFiledComponent"
    :class="{ 'isActiveRadioField': model === value, 'isNotActiveRadioField': model !== value }">
    <input type="radio" :name="name" :value="value" :checked="model === value" v-model="model" />
    <span class="marker">👉</span>
    <slot>{{ label }}</slot>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  name?: string;
  value: string;
  label?: string;
}>()

const model = defineModel();
</script>

<style scoped>
.radioFiledComponent {
  display: flex;
  flex-direction: row;
  gap: 7px;
  align-items: center;
  transition-duration: var(--transition-duration-s);
  transition-property: opacity;
}

.isNotActiveRadioField {
  opacity: 0.7;
}

.isActiveRadioField {
  pointer-events: none;
}

input {
  display: none;
}

.marker {
  transition-duration: var(--transition-duration-s);
  transition-property: opacity, transform;

  .isNotActiveRadioField & {
    opacity: 0;
    transform: translateX(-25%);
  }
}
</style>