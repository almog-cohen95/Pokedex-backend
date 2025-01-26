import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from './interface/pokemon.interface';

@Injectable()
export class PokemonRepository {
  constructor(@InjectModel('Pokemon') private pokemonModel: Model<Pokemon>) {}

  async findAllPokemons() {
    return this.pokemonModel.find().exec();
  }

  async findMyPokemons(isOwn: boolean) {
    return this.pokemonModel.find({ isOwn }).exec();
  }

  async findPokemonById(id: string) {
    return this.pokemonModel.findById(id).exec();
  }

  async findAvailablePokemonsSwitch(exclude: string) {
    const filter = exclude ? { _id: { $ne: exclude }, isOwn: true } : {}; 
    return this.pokemonModel.find(filter).exec();
  }
}
