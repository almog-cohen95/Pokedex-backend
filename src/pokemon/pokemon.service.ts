import { Injectable } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './interface/pokemon.interface';


@Injectable()
export class PokemonService {
  constructor(@InjectModel('Pokemon') private pokemonModel: Model<Pokemon>) {}

//   getAllPokemons() {
//     return this.pokemonRepo.getAllPokemons();
//   }

   async getAllPokemons(): Promise<Pokemon[]> {
    return this.pokemonModel.find().exec();
  }
}
