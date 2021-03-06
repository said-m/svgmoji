<script>
  import { SourcePrioritizationListTypesEnum } from './constants';
  import { SOURCES } from '../../constants';
  import { TRIGGERS } from 'svelte-dnd-action';
  import List from '../../components/list.svelte';

  export let items;
  export let order;

  const listGroup = 'sources';

  $: lists = order.reduce(
    (previous, thisItemName) => {
      const item = items[thisItemName];

      if (!item) {
        return previous;
      }

      const itemList = item.isDisabled
        ? SourcePrioritizationListTypesEnum.disabled
        : SourcePrioritizationListTypesEnum.enabled;

      previous[itemList].push({
        id: item.type,
        ...item,
      });

      return previous;
    },
    {
      [SourcePrioritizationListTypesEnum.enabled]: [],
      [SourcePrioritizationListTypesEnum.disabled]: [],
    },
  );

  function onChange({
    id,
    name,
    trigger,
    newItems,
  }) {
    Object.keys(items).forEach(
      thisItemName => items[thisItemName].isNew = false,
    );
    items[id].isDisabled = name === SourcePrioritizationListTypesEnum.disabled;

    order = [
      ...(name === SourcePrioritizationListTypesEnum.enabled
        ? newItems
        : lists[SourcePrioritizationListTypesEnum.enabled].filter(
          thisItem => thisItem.id !== id,
        )
      ),
      ...(name === SourcePrioritizationListTypesEnum.disabled
        ? newItems
        : lists[SourcePrioritizationListTypesEnum.disabled].filter(
          thisItem => thisItem.id !== id,
        )
      ),
    ].map(thisItem => thisItem.id);

    if (trigger !== TRIGGERS.DROPPED_INTO_ZONE) {
      return;
    }

    const updates = {
      sourcePrioritization: order,
      sources: items,
    };

    console.log('Обновление приоритетов источников:', updates);
    chrome.storage.sync.set(updates);
  }
</script>

<div class="component">
  <h2>Sources</h2>

  {#if lists[SourcePrioritizationListTypesEnum.enabled].length}
    <List
      class="list"
      name={SourcePrioritizationListTypesEnum.enabled}
      items={lists[SourcePrioritizationListTypesEnum.enabled]}
      group={listGroup}
      onDrop={onChange}
      let:item={thisItem}
      let:index={thisItemIndex}
    >
      <span
        class="item"
        class:itemNew={thisItem.isNew}
        class:itemDisabled={thisItem.isDisabled}
      >
        <span class="index">{thisItemIndex + 1}</span>
        {SOURCES[thisItem.type].title}
      </span>
    </List>
  {:else}
    <p>no sources available</p>
  {/if}
</div>

<style lang="scss">
  .component {
    > :global(.list) {
      display: flex;
      flex-direction: raw;
      flex-wrap: wrap;
      gap: 7px;
    }
  }

  .item {
    display: block;
    position: relative;
    overflow: hidden;
    padding: 3px 7px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--color-background-secondary);
    border-radius: var(--border-radius);
    background-color: var(--color-background-primary);

    &New {
      &::after {
        content: '(new)';
        display: inline-block;
        color: var(--color-element-alternative);
        margin-left: 0.25em;
      }
    }

    &:not(&Disabled) {
      cursor: grab;

      &:global([draggable="true"]) {
        cursor: grabbing;
      }
    }

    &Disabled {
      opacity: 0.5;
    }
  }

  .index {
    z-index: 0;
    position: absolute;
    top: 0;
    left: -0.07em;
    font-weight: bold;
    line-height: 0.5em;
    font-size: 3em;
    opacity: 0.1;
    transition-property: opacity;

    :global([data-is-dnd-shadow-item]) & {
      opacity: 0.3;
    }

    :global(#dnd-action-dragged-el) & {
      opacity: 0;
    }
  }
</style>
