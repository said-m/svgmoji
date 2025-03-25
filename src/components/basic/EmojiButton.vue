<template>
  <button class="emojiButtonComponent" :style="{ backgroundImage: `url(${imageUrl})` }" tabindex="0" :title />
</template>

<script setup lang="ts">
const {
  color = 'transparent'
} = defineProps<{
  imageUrl: string;
  title?: string;
  color?: string;
}>()
</script>

<style scoped>
.emojiButtonComponent {
  position: relative;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  padding-top: 100%;
  border-radius: var(--border-radius);
  background-color: var(--color-background-secondary);
  background-repeat: no-repeat;
  background-size: 70% auto;
  background-position: center;
  transition-duration: var(--transition-duration-s);
  transition-property: outline;
  outline-style: solid;
  outline-color: var(--color-background-alternative);
  border: 2px solid transparent;
  border-bottom-color: v-bind(color);
  opacity: 0.7;
}

.emojiButtonComponent:nth-last-child(1):not(:nth-child(-n+7)) {
  opacity: 0.15
}

.emojiButtonComponent:nth-last-child(2):not(:nth-child(-n+6)) {
  opacity: 0.33
}

.emojiButtonComponent:nth-last-child(3):not(:nth-child(-n+5)) {
  opacity: 0.5
}

.emojiButtonComponent:hover,
.emojiButtonComponent:active,
.emojiButtonComponent:focus-visible {
  opacity: 1;
}

.emojiButtonComponent:hover {
  box-shadow: 0 0 7px -5px;
  outline-width: 0;
  outline-offset: 5px;
}

.emojiButtonComponent:active,
.emojiButtonComponent:focus-visible {
  box-shadow: 0 0 5px -3px;
  outline-width: 3px;
  outline-offset: 3px;
}

.emojiButtonComponent:hover:active {
  background-color: var(--color-background-alternative);
}
</style>