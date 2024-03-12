import { Dispatch, SetStateAction } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

export type ListId = 'list-1' | 'list-2' | 'list-3';

export type Actions = {
  [listId in ListId]: {
    state: SongType[];
    action: Dispatch<SetStateAction<SongType[]>>;
  };
};

export interface SongType {
  id: UniqueIdentifier,
  name: string;
  spotifyLink?: string;
  activeList?: ListId;
}


export const songs: SongType[] = [
  { name: 'Hey oh' },
  { name: 'Foxy faced' },
  { name: 'Rule the world' },
  { name: 'Is this love' },
  { name: 'No woman no cry' },
  { name: 'Where streets have no name' },
  { name: 'One' },
  { name: 'Human nature' },
  { name: 'Billie jean' },
  { name: 'Sting' },
  { name: 'Man Eater' },
  { name: 'Joleen' },
  { name: 'Personal jesus' },
  { name: 'No diggity' },
  { name: 'Chasing cars' },
  { name: 'Wicked Game' },
  { name: 'Freight train' },
  { name: 'Sweet thing' },
  { name: 'Crazy' },
  { name: 'On fire' },
  { name: 'Master Blaster' },
  { name: 'Dylan' },
  { name: 'Weekend' },
  { name: 'Come together' },
  { name: 'Dont let me down' },
  { name: '7 Nation army' },
  { name: 'I need your love so bad' },
  { name: 'Walking blues' },
  { name: 'A-team' },
  { name: 'Aint no sunshine' },
  { name: 'Fast car' },
  { name: 'Avici' },
  { name: 'Wonderwall' },
  { name: 'Naive' },
  { name: 'Hideaway' },
  { name: 'Should I stay or should I go' },
  { name: 'INXS' },
  { name: 'Lemon tree' },
  { name: 'Frontin' },
  { name: 'Show me Love' },
  { name: 'Message in the bottle' },
  { name: 'Just the two of us' },
  { name: 'Volcanoes' },
  { name: 'Blinding lights' },
  { name: 'Sex on fire' },
  { name: 'Purple rain' },
  { name: 'Come as you are' },
  { name: 'Walking on the moon' },
  { name: 'That\'s entertainment' },
  { name: 'Cannonball' },
  { name: 'Yellow' },
  { name: 'Enjoy the silence' },
  { name: 'Sledgehammer' },
  { name: 'Little lion man' },
  { name: 'Catch & Release' },
  { name: 'Chain' },
  { name: 'Let it all come down' },
  { name: 'Ema' },
  { name: 'Season change' },
  { name: 'Hold on' },
  { name: 'Move on' },
  { name: 'Changes' },
  { name: 'Criticise' },
  { name: 'Talk About it' },
  { name: 'Let it go' },
  { name: 'Over the edge' },
  { name: 'Displaced' }
].map((obj, index) => ({...obj, id: `${index}`}))


