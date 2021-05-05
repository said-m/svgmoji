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
  />
  <slot />
</label>
