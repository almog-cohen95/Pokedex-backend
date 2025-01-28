import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { Pokemon } from './interface/pokemon.interface';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async getPokemons(query: {
    sortBy: string;
    isOwn?: boolean;
    nameSearch?: string;
    page: number;
    pageSize: number;
  }): Promise<{ pokemons: Pokemon[]; totalCount: number; message?: string }> {
    const { sortBy, isOwn, nameSearch, page, pageSize } = query;
    this.logger.log(`Fetching pokemons with query: ${JSON.stringify(query)}`);

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    let sort: any = {};
    if (sortBy === 'alphabeticallyA-Z') {
      sort = { id: 1 ,'name.english': 1};
    } else if (sortBy === 'alphabeticallyZ-A') {
      sort = { 'name.english': -1 };
    } else if (sortBy === 'HP_l') {
      sort = { 'base.HP': 1 };
    } else if (sortBy === 'HP_h') {
      sort = { 'base.HP': -1 };
    } else if (sortBy === 'Power_l') {
      sort = { 'base.Attack': 1 };
    } else if (sortBy === 'Power_h') {
      sort = { 'base.Attack': -1 };
    }

    const filter: Record<string, any> = {};

    if (isOwn !== undefined) {
      filter.isOwn = isOwn;
    }

    if (nameSearch) {
      filter['name.english'] = { $regex: nameSearch, $options: 'i' };
    }
    try {
      const result = await this.pokemonRepository.findPokemons({
        sort,
        filter,
        skip,
        limit,
      });

      if (result.pokemons.length === 0) {
        return {
          pokemons: [],
          totalCount: 0,
          message: 'No Pokemons were found',
        };
      }

      this.logger.log(
        `Successfully fetched ${result.pokemons.length} pokemons, total count: ${result.totalCount}`,
      );

      return result;
    } catch (error) {
      this.logger.error('Error fetching pokemons', error.stack);
      throw new HttpException(
        'Failed to get pokemons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    async getPokemonById(id: string): Promise<Pokemon | null> {
    try {
      this.logger.log(`Get pokemon with ID: ${id}`);
      const pokemonId = await this.pokemonRepository.findPokemonById(id);
      this.logger.log(`Successfully get pokemon with ID: ${id}`);
      return pokemonId;
    } catch (error) {
      this.logger.error('Error get pokemon by id', error.stack);
      throw new HttpException(
        'Error get pokemon by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 async getAvailablePokemons(exclude: string): Promise<Pokemon[]> {
    return this.pokemonRepository.findAvailablePokemonsSwitch(exclude);
  }
}


