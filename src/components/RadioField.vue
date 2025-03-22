<template>
  <label
    class="radio-field"
    :class="{ 'is-active': modelValue === value, 'is-not-active': modelValue !== value }"
  >
    <input
      type="radio"
      :value="value"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
    />
    <span class="marker">👉</span>
    <slot />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  value: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style lang="scss" scoped>
.radio-field {
  display: flex;
  flex-direction: row;
  gap: 7px;
  align-items: center;
  transition-duration: var(--transition-duration-s);
  transition-property: opacity;

  &.is-not-active {
    opacity: 0.7;
  }

  &.is-active {
    pointer-events: none;
  }

  input {
    display: none;
  }

  .marker {
    transition-duration: var(--transition-duration-s);
    transition-property: opacity, transform;

    .is-not-active & {
      opacity: 0;
      transform: translateX(-25%);
    }
  }
}
</style>
