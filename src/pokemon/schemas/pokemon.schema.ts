import mongoose from 'mongoose';

export const PokemonSchema = new mongoose.Schema({
  id: Number,
  name: {
    english: String,
    japanese: String,
    chinese: String,
    french: String,
  },
  type: [String],
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    SpAttack: Number,
    SpDefense: Number,
    Speed: Number,
  },
  species: String,
  description: String,
  evolution: {
    prev: [String],
    next: [[String]],
  },
  profile: {
    height: String,
    weight: String,
    egg: [String],
    ability: [[String]],
    gender: String,
  },
  image: {
    sprite: String,
    thumbnail: String,
    hires: String,
  },
});

export const PokemonModelName = 'Pokemon';