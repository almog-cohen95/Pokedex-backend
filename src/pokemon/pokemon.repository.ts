import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { readFile } from 'fs/promises';
import { Model } from 'mongoose';
import { PokemonSchema } from './schemas/pokemon.schema';
import { Pokemon } from './interface/pokemon.interface';

@Injectable()
export class PokemonRepository {
  constructor(@InjectModel('Pokemon') private pokemonModel: Model<Pokemon>) {}

  async getAllPokemons() {
    return this.pokemonModel.find().exec();
  }
}
