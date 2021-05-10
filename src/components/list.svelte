<script>
  import { dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';

  export let name;
  export let items = [];
  export let group;
  export let onDrop;
  let className = '';
  export { className as class };

  const flipDurationMs = 200;
  const dropTargetStyle = {
    'outline-width': '1px',
    'outline-style': 'dashed',
    'outline-color': 'var(--color-background-alternative)',
  };

  function handleConsider(event) {
    items = event.detail.items;
  }

  function handleFinalize(event) {
    const newItems = event.detail.items;

    onDrop({
      newItems,
      name,
      id: event.detail.info.id,
      trigger: event.detail.info.trigger,
    });
  }
</script>

<ol
  class={className}
  use:dndzone={{
    items,
    type: group,
    flipDurationMs,
    dropTargetStyle,
  }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}
>
  {#each items as item, index (item.id)}
    <li
      class="item"
      animate:flip={{duration: flipDurationMs}}
    >
      <slot {item} {index}>id: {item.id}</slot>
    </li>
  {/each}
</ol>
