<script>
  export let group;
  export let value;
  let className = '';
  export { className as class };
</script>

<label class={className}>
  <input
    type="radio"
    bind:group
    value={value}
    on:change
  />
  <slot />
</label>

<style>
  label {
      display: flex;
      flex-direction: row;
      gap: 7px;
      align-items: center;
  }
</style>
