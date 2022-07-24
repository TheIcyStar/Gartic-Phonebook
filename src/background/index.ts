import { PlayerData } from "../pages/Popup/players.store";

const DEFAULT_PLAYERS: PlayerData[] = [{
  username: "Sample player",
  imageURL: chrome.runtime.getURL('placeholder-avatar.png')
},
{
  username: "Change me!",
  imageURL: chrome.runtime.getURL('placeholder-avatar.png')
}];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("players", (result) => {
    if (!result.players) {
      chrome.storage.local.set({ players: DEFAULT_PLAYERS });
      console.log('Added default list of user configs');
    }
  });
});