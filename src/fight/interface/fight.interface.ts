import { Types } from "mongoose";

export interface IFight {
  enemyPokemon: PokemonDetails;
  userPokemon: PokemonDetails;
  isUserTurn: boolean;
  fainted: boolean;
  catchChance: number;
  userPokemonsList: Types.ObjectId[];
}

export interface PokemonDetails {
    _id: Types.ObjectId; 
    currentHP: number;
}