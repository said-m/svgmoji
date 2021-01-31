import { ExtensionStorageSourceItemInterface } from '../../../interfaces';

export enum CreateSourcePrioritizationListsEnum {
  enabled,
  disabled,
}

export type CreateSourcePrioritizationListsInterface = Record<
  CreateSourcePrioritizationListsEnum,
  Array<ExtensionStorageSourceItemInterface>
>;

export enum CreateSourcePrioritizationItemAttrsEnum {
  dataId = 'id',
}
