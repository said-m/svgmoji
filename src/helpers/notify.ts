
export const notify = ({
  id = '',
  icon,
  title,
  message,
  description,
}: {
  id?: string;
  icon: string;
  title: string;
  message: string;
  description?: string;
}) => {
  // удаляю предыдущее аналогичное оповещение,
  // чтобы chrome (ну или ос) не скрывало его
  chrome.notifications.clear(id);

  chrome.notifications.create(id, {
    type: 'basic',
    silent: true,
    iconUrl: icon,
    title,
    message,
    contextMessage: description,
    isClickable: !!id,
  });
};
