import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { Pokemon } from './interface/pokemon.interface';
import {
  defaultSort,
  POKEMON_NAME_ENGLISH,
  sortByConst,
  sortOrderConst,
} from './constants';
import { GetPokemonsQueryDto } from './dto/pokemon.dto';
import { Types } from 'mongoose';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async getPokemons(
    query: GetPokemonsQueryDto,
  ): Promise<{ data: Pokemon[]; total: number; message?: string }> {
    const { sortBy, sortType, isOwn, nameSearch, page, pageSize } = query;
    this.logger.log(`Fetching pokemons with query: ${JSON.stringify(query)}`);

    const validatedPage = Math.max(1, page);
    const skip = (validatedPage - 1) * pageSize;
    const limit = pageSize;

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

      if (!result.data.length) {
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

  async getPokemonById(id: Types.ObjectId): Promise<Pokemon | null> {
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

  async getPokemonsForFight() {
    try {
      this.logger.log(`Get enemy pokemon and user pokemons list`);
      const pokemonsForFight =
        await this.pokemonRepository.getPokemonsForFight();
      this.logger.log(`Successfully get enemy pokemon and user pokemons list`);
      return pokemonsForFight;
    } catch (error) {
      this.logger.error('Error get pokemon by id', error.stack);
      throw new HttpException(
        'Error get pokemon by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
