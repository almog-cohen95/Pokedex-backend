import { Types } from "mongoose";

export interface IFight {
  enemyPokemon: PokemonDetails;
  userPokemon: PokemonDetails;
  fainted: boolean;
  catch: boolean;
  userPokemonsList: Types.ObjectId[];
}

export interface PokemonDetails {
    _id: Types.ObjectId; 
    currentHP: number;
}