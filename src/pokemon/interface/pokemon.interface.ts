export interface Pokemon {
  id: number;
  name: Name;
  type: string[];
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    SpAttack: number;
    SpDefense: number;
    Speed: number;
  };
  species: string;
  description: string;
  evolution?: Evolution;
  profile: Profile;
  image: Image;
}

export interface Profile {
  height: string
  weight: string
  egg?: string[]
  ability: string[][];
  gender: string
}

export interface Evolution {
  prev?: string[]
  next?: string[][]
}

export interface Name {
  english: string
  japanese: string
  chinese: string
  french: string
}

export interface Image {
  sprite: string
  thumbnail: string
  hires?: string
}