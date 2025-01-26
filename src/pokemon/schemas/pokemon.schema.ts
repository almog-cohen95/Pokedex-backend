// import mongoose from 'mongoose';

// export const PokemonSchema = new mongoose.Schema({
//   id: Number,
//   name: {
//     english: String,
//     japanese: String,
//     chinese: String,
//     french: String,
//   },
//   type: [String],
//   base: {
//     HP: Number,
//     Attack: Number,
//     Defense: Number,
//     SpAttack: Number,
//     SpDefense: Number,
//     Speed: Number,
//   },
//   species: String,
//   description: String,
//   evolution: {
//     prev: [String],
//     next: [[String]],
//   },
//   profile: {
//     height: String,
//     weight: String,
//     egg: [String],
//     ability: [[String]],
//     gender: String,
//   },
//   image: {
//     sprite: String,
//     thumbnail: String,
//     hires: String,
//   },
// });

// export const PokemonModelName = 'Pokemon';


import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PokemonDocument = Pokemon & Document;

@Schema()
export class Pokemon {
  @Prop({ required: true })
  id: number;

  @Prop({
    type: {
      english: String,
      japanese: String,
      chinese: String,
      french: String,
    },
  })
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };

  @Prop([String])
  type: string[];

  @Prop({
    type: {
      HP: Number,
      Attack: Number,
      Defense: Number,
      SpAttack: Number,
      SpDefense: Number,
      Speed: Number,
    },
  })
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    SpAttack: number;
    SpDefense: number;
    Speed: number;
  };

  @Prop()
  species: string;

  @Prop()
  description: string;

  @Prop({
    type: {
      prev: [String],
      next: [[String]],
    },
  })
  evolution: {
    prev: string[];
    next: string[][];
  };

  @Prop({
    type: {
      height: String,
      weight: String,
      egg: [String],
      ability: [[String]],
      gender: String,
    },
  })
  profile: {
    height: string;
    weight: string;
    egg: string[];
    ability: string[][];
    gender: string;
  };

  @Prop({
    type: {
      sprite: String,
      thumbnail: String,
      hires: String,
    },
  })
  image: {
    sprite: string;
    thumbnail: string;
    hires: string;
  };
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
export const PokemonModelName = 'Pokemon';
