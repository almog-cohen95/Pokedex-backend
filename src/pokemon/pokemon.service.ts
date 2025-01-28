import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { Pokemon } from './interface/pokemon.interface';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async getPokemons(query: {
    sortBy: string;
    sortType: string;
    isOwn?: boolean;
    nameSearch?: string;
    page: number;
    pageSize: number;
  }): Promise<{ pokemons: Pokemon[]; totalCount: number; message?: string }> {
    const { sortBy, sortType, isOwn, nameSearch, page, pageSize } = query;
    this.logger.log(`Fetching pokemons with query: ${JSON.stringify(query)}`);

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const sortByConst: Record<string, string> = {
      name: 'name.english',
      hp: 'base.HP',
      attack: 'base.Attack',
    };

    const sortOrderConst: Record<string, number> = {
      asc: 1,
      desc: -1,
    };

    const sortByField = sortByConst[sortBy];
    const sortOrder = sortOrderConst[sortType];

    const sort: Record<string, number> = { [sortByField]: sortOrder };

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
}
