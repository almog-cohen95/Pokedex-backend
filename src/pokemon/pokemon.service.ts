import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { Pokemon } from './interface/pokemon.interface';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async getAllPokemons(): Promise<Pokemon[]> {
    try {
      this.logger.log('Fetching all pokemons');
      const allPokemons = await this.pokemonRepository.findAllPokemons();
      this.logger.log(`Successfully fetched ${allPokemons.length} pokemons`);
      return allPokemons;
    } catch (error) {
      this.logger.error('Error fetching all pokemons', error.stack);
      throw new HttpException(
        'Failed to get all pokemons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMyPokemons(isOwn: boolean): Promise<Pokemon[]> {
    try {
      this.logger.log('Fetching my pokemons');
      const mypokemons = await this.pokemonRepository.findMyPokemons(isOwn);
      this.logger.log(`Successfully fetched ${mypokemons.length} pokemons`);
      return mypokemons;
    } catch (error) {
      this.logger.error('Error fetching my pokemons', error.stack);
      throw new HttpException(
        'Failed to get my pokemons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPokemonById(_id: string): Promise<Pokemon | null> {
    try {
      this.logger.log(`Get pokemon with ID: ${_id}`);
      const pokemonId = await this.pokemonRepository.findPokemonById(_id);
      this.logger.log(`Successfully get pokemon with ID: ${_id}`);
      return pokemonId;
    } catch (error) {
      this.logger.error('Error get pokemon by id', error.stack);
      throw new HttpException(
        'Error get pokemon by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
