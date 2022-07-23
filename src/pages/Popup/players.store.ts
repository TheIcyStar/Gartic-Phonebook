import { makeAutoObservable, reaction } from 'mobx';
import React from 'react';

export const STORAGE_PLAYERS = 'players';

export type PlayerData = {
  username: string,
  imageURL: string,
  note?: string
}

export class PlayersStore {
  players: PlayerData[] = [];

  constructor(players: PlayerData[] = []) {
    this.players = players;
    makeAutoObservable(this);
  }

  loadFromStorage() {
    chrome.storage.local.get(STORAGE_PLAYERS, (result) => {
      console.log('Loaded', result);
      if (result[STORAGE_PLAYERS]) {
        this.players = result[STORAGE_PLAYERS];
      }
    });
  }
}

const playerStore = new PlayersStore();
playerStore.loadFromStorage();

export const PlayerStoreContext = React.createContext(playerStore);
export const usePlayerStoreContext = () =>
  React.useContext(PlayerStoreContext);

// Save to Chrome storage
reaction(
  () => playerStore.players,
  (players) => {
    console.log('Saving', players.slice());
    chrome.storage.local.set({ [STORAGE_PLAYERS]: players.slice() });
  }
);