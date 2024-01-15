import { Dispatch, SetStateAction } from "react";

export type ListId = 'list-1' | 'list-2' | 'list-3';

export type SongsMap = Map<string, SongType>;

export type Actions = {
  [listId in ListId]: {
    state: Map<string, SongType>;
    action: Dispatch<SetStateAction<SongsMap>>;
  };
};

export interface SongType {
  name: string;
  spotifyLink?: string;
  activeList?: ListId;
}


export const songs: SongType[] = [
  { name: 'Hey ho' },
  { name: 'Foxy Faced' },
  { name: 'Rule the world' }
]