<script>
  export let group;
  export let value;
  let className = '';
  export { className as class };
</script>

<label
  class={className}
  class:isActive={group === value}
  class:isNotActive={group !== value}
>
  <input
    type="radio"
    bind:group
    value={value}
    on:change
  />

  <span class="marker">👉</span>

  <slot />
</label>

<style lang="scss">
  label,
  .marker {
    transition-duration: var(--transition-duration-s);
    transition-property: opacity, transform;
  }

  label {
      display: flex;
      flex-direction: row;
      gap: 7px;
      align-items: center;

      &.isNotActive {
        opacity: 0.7;
      }
  }

  .isActive {
    pointer-events: none;
  }

  input {
    display: none;
  }

  .marker {
    .isNotActive & {
      opacity: 0;
      transform: translateX(-25%);
    }
  }
</style>
