<!-- TODO: sortable -->

<script>
  import { SourcePrioritizationListTypesEnum } from './constants';
  import { SOURCES } from '../../constants';

  export let items;
  export let order;

  const lists = {
    [SourcePrioritizationListTypesEnum.enabled]: [],
    [SourcePrioritizationListTypesEnum.disabled]: [],
  };

  $: if (order) {
    order.forEach(
      thisItemName => {
        const item = items[thisItemName];

        if (!item) {
          return;
        }

        const itemList = item.isDisabled
          ? SourcePrioritizationListTypesEnum.disabled
          : SourcePrioritizationListTypesEnum.enabled;

        lists[itemList] = [
          ...lists[itemList],
          item,
        ];
      },
    );
  }

  // TODO:
  function onChange() {
    const updates = {
      sourcePrioritization: updatedOrder,
      sources: popupStore.sources,
    };

    popupStore.sourcePrioritization = updatedOrder;

    console.log('Обновление приоритетов источников:', updatedOrder);
    chrome.storage.sync.set(updates);
  }
</script>

<template>
  <h2>Sources</h2>

  {#if lists[SourcePrioritizationListTypesEnum.enabled].length}
    <ol class="list">
      {#each lists[SourcePrioritizationListTypesEnum.enabled] as thisItem (thisItem.type)}
        <li
          class="item"
          class:itemNew={thisItem.isNew}
          class:itemDisabled={thisItem.isDisabled}
        >
          {SOURCES[thisItem.type].title}
        </li>
      {/each}
    </ol>
  {:else}
    <p>no sources available</p>
  {/if}
</template>

<style lang="scss">
  .list {
    counter-reset: sources;

    display: flex;
    flex-direction: raw;
    flex-wrap: wrap;
    gap: 7px;
  }

  .item {
    position: relative;
    overflow: hidden;
    padding: 3px 7px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--color-background-secondary);
    border-radius: var(--border-radius);
    background-color: var(--color-background-primary);

    &::before {
      content: counter(sources);
      counter-increment: sources;

      position: absolute;
      top: 0;
      left: -0.07em;
      font-weight: bold;
      line-height: 0.5em;
      font-size: 3em;
      opacity: 0.1;
      z-index: 0;
    }

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
</style>
