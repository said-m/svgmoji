import { NOTIFICATION_TYPE_ID_JOINER } from '../constants';
import { createLink } from '../helpers';
import { SourcesEnum } from '../interfaces';

export interface FindAssetCallbackInputInterface {
  type: SourcesEnum;
  link: string;
  notificationId: string;
}

export type FindAssetOnSuccessInterface = (input: FindAssetCallbackInputInterface) => void;
export type FindAssetonRequestFailInterface = (input: FindAssetCallbackInputInterface) => void;
export type FindAssetOnNotFoundInterface = (input: FindAssetCallbackInputInterface & {
  sources: {
    previous: Array<SourcesEnum>;
    next: Array<SourcesEnum>;
  };
}) => void;

export type FindAssetPreviousInterface = Array<{
  type: SourcesEnum;
  notificationId: string;
}>;

export const findAsset = ({
  emoji,
  type,
  typesFallback,
  onSuccess,
  onNotFound,
  onRequestFail,
  previous,
}: {
  emoji: string;
  type: SourcesEnum;
  typesFallback: Array<SourcesEnum>;
  onSuccess: FindAssetOnSuccessInterface;
  onNotFound: FindAssetOnNotFoundInterface;
  onRequestFail: FindAssetonRequestFailInterface;
  previous?: FindAssetPreviousInterface;
}) => {
  const link = createLink({
    emoji,
    type,
  });

  const emojiNotificationId = [type, emoji].join(NOTIFICATION_TYPE_ID_JOINER);
  const statusNotificationId = previous?.[0]?.notificationId || link;

  fetch(link, {
    method: 'HEAD',
  }).then(
    response => {
      if (!response.ok) {
        const nextSource = typesFallback[0];

        onNotFound({
          notificationId: statusNotificationId,
          link,
          type,
          sources: {
            previous: previous?.map(
              thisItem => thisItem.type,
            ) || [],
            next: typesFallback,
          },
        });

        if (nextSource) {
          return findAsset({
            emoji,
            type: nextSource,
            typesFallback: typesFallback.slice(1),
            onSuccess,
            onNotFound,
            onRequestFail,
            previous: [
              {
                type,
                notificationId: statusNotificationId,
              },
              ...(previous || []),
            ],
          });
        }

        return;
      }

      onSuccess({
        type,
        link,
        notificationId: emojiNotificationId,
      });
    },
  ).catch(() => {
    onRequestFail({
      type,
      link,
      notificationId: emojiNotificationId,
    });


    findAsset({
      emoji,
      type: typesFallback[0],
      typesFallback: typesFallback.slice(1),
      onSuccess,
      onNotFound,
      onRequestFail,
      previous: [
        {
          type,
          notificationId: statusNotificationId,
        },
        ...(previous || []),
      ],
    });
  });
};
