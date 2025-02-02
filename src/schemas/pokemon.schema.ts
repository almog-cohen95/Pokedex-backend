import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PokemonDocument = Pokemon & Document;

@Schema({ collection: 'pokemon' })
export class Pokemon {
  @Prop({ required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  id: number;

  @Prop({
    type: {
      english: { type: String, required: true },
      japanese: { type: String, required: true },
      chinese: { type: String, required: true },
      french: { type: String, required: true },
    },
  })
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };

  @Prop({ type: [String], required: true })
  type: string[];

  @Prop({
    type: {
      HP: { type: Number, required: true },
      Attack: { type: Number, required: true },
      Defense: { type: Number, required: true },
      SpAttack: { type: Number, required: true },
      SpDefense: { type: Number, required: true },
      Speed: { type: Number, required: true },
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

  @Prop({ required: true })
  species: string;

  @Prop({ required: true })
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
      height: { type: String, required: true },
      weight: { type: String, required: true },
      egg: [String],
      ability: { type: [[String]], required: true },
      gender: { type: String, required: true },
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
      sprite: { type: String, required: true },
      thumbnail: { type: String, required: true },
      hires: String,
    },
  })
  image: {
    sprite: string;
    thumbnail: string;
    hires: string;
  };

  @Prop({ required: true })
  isOwn: boolean;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
export const PokemonModelName = 'Pokemon';
