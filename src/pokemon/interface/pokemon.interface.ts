import { Types } from 'mongoose';

export interface Pokemon {
  _id: Types.ObjectId;
  id: number;
  name: Name;
  type: string[];
  base: Base;
  species: string;
  description: string;
  evolution?: Evolution;
  profile: Profile;
  image: Image;
  isOwn: boolean;
}

export interface Base {
  HP: number;
  Attack: number;
  Defense: number;
  SpAttack: number;
  SpDefense: number;
  Speed: number;
}

export interface Profile {
  height: string;
  weight: string;
  egg?: string[];
  ability: string[][];
  gender: string;
}

export interface Evolution {
  prev?: string[];
  next?: string[][];
}

export interface Name {
  english: string;
  japanese: string;
  chinese: string;
  french: string;
}

export interface Image {
  sprite: string;
  thumbnail: string;
  hires?: string;
}
