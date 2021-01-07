import { name } from '../package.json';

chrome.contextMenus.create({
  title: `${name} - Create image link for an emoji in selection`,
  contexts: ['selection'],
  onclick: () => console.log('// TODO: action'),
});
