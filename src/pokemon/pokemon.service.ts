import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { Pokemon } from './interface/pokemon.interface';
import {
  POKEMON_NAME_ENGLISH,
} from './constants';
import { GetPokemonsQueryDto } from './dto/pokemon.dto';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async getPokemons(
    query: GetPokemonsQueryDto,
  ): Promise<{ data: Pokemon[]; total: number; message?: string }> {
    const { sortBy, sortType, isOwn, nameSearch, page, pageSize } = query;
    this.logger.log(`Fetching pokemons with query: ${JSON.stringify(query)}`);

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const sortByConst: Record<string, string> = {
      name: 'name.english',
      hp: 'base.HP',
      power: 'base.Attack',
    };

    const sortOrderConst: Record<string, 'asc' | 'desc'> = {
      asc: 'asc',
      desc: 'desc',
    };

    const defaultSort: Record<string, 'asc' | 'desc'> = {
      id: 'asc',
      'name.english': 'asc',
    };

    const sortByField = sortByConst[sortBy];
    const sortOrder = sortOrderConst[sortType];

    let sort: Record<string, 'asc' | 'desc'> = {};

    if (sortByField) {
      sort[sortByField] = sortOrder;
    } else {
      sort = { ...defaultSort };
    }

    const filter: Record<string, any> = {};

    if (isOwn) {
      filter.isOwn = isOwn;
    }

    if (nameSearch) {
      filter[POKEMON_NAME_ENGLISH] = { $regex: nameSearch, $options: 'i' };
    }
    try {
      const result = await this.pokemonRepository.findPokemons({
        sort,
        filter,
        skip,
        limit,
      });

      if (result.data.length === 0) {
        return {
          data: [],
          total: 0,
          message: 'No Pokemons were found',
        };
      }

      this.logger.log(
        `Successfully fetched ${result.data.length} pokemons, total count: ${result.total}`,
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
