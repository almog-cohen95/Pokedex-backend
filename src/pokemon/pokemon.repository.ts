import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from './interface/pokemon.interface';

@Injectable()
export class PokemonRepository {
  private readonly logger = new Logger(PokemonRepository.name);

  constructor(@InjectModel('Pokemon') private pokemonModel: Model<Pokemon>) {}

  async findAllPokemons() {
    try {
      this.logger.log('Querying all pokemons from database');
      return this.pokemonModel.find().exec();
    } catch (error) {
      this.logger.error('Error querying all pokemons', error.stack);
      throw new Error('Database error while fetching all pokemons');
    }
  }

  async findMyPokemons(isOwn: boolean) {
    try {
      this.logger.log('Querying my pokemons from database');
      return this.pokemonModel.find({ isOwn }).exec();
    } catch (error) {
      this.logger.error('Error querying my pokemons', error.stack);
      throw new Error('Database error while fetching my pokemons');
    }
  }

  async findPokemonById(id: string) {
    try {
      this.logger.log(`Querying pokemon by ID: ${id} from database`);
      return this.pokemonModel.findById(id).exec();
    } catch (error) {
      this.logger.error('Error querying pokemon by ID', error.stack);
      throw new Error('Database error while fetching pokemon by ID');
    }
  }
}
