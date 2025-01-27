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
  }): Promise<{ pokemons: Pokemon[], totalCount: number }> {
    const { sortBy, isOwn, nameSearch, page, pageSize } = query;
    this.logger.log(`Fetching pokemons with query: ${JSON.stringify(query)}`);

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    let sort: any = {};
    if (sortBy === 'alphabeticallyA-Z') {
      sort = { 'name.english': 1, 'id': 1 }; //TODO
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
      const result =  await this.pokemonRepository.findPokemons({
        sort,
        filter,
        skip,
        limit,
      });
          this.logger.log(`Successfully fetched ${result.pokemons.length} pokemons, total count: ${result.totalCount}`);


      return result;
    } catch (error) {
      this.logger.error('Error fetching pokemons', error.stack);
      throw new HttpException(
        'Failed to get pokemons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

//   async getMyPokemons(isOwn: boolean): Promise<Pokemon[]> {
//     try {
//       this.logger.log('Fetching my pokemons');
//       const mypokemons = await this.pokemonRepository.findMyPokemons(isOwn);
//       this.logger.log(`Successfully fetched ${mypokemons.length} pokemons`);
//       return mypokemons;
//     } catch (error) {
//       this.logger.error('Error fetching my pokemons', error.stack);
//       throw new HttpException(
//         'Failed to get my pokemons',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async getPokemonById(_id: string): Promise<Pokemon | null> {
//     try {
//       this.logger.log(`Get pokemon with ID: ${_id}`);
//       const pokemonId = await this.pokemonRepository.findPokemonById(_id);
//       this.logger.log(`Successfully get pokemon with ID: ${_id}`);
//       return pokemonId;
//     } catch (error) {
//       this.logger.error('Error get pokemon by id', error.stack);
//       throw new HttpException(
//         'Error get pokemon by id',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async sortAlphabeticalAtoZ(): Promise<Pokemon[]> {
//     try {
//       this.logger.log('Fetching pokemon sorted alphabetically');
//       const pokemonAtoZ = await this.pokemonRepository.sortByAlphabeticalAtoZ();
//       this.logger.log(
//         `Successfully fetched ${pokemonAtoZ.length} pokemons sorted alphabetically A-Z`,
//       );
//       return pokemonAtoZ;
//     } catch (error) {
//       this.logger.error(
//         'Error fetching pokemons sorted alphabetically A-Z',
//         error.stack,
//       );
//       throw new HttpException(
//         'Error sort pokemon alphabetically A-Z',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async sortAlphabeticalZtoA(): Promise<Pokemon[]> {
//     try {
//       this.logger.log('Fetching pokemon sorted alphabetically');
//       const pokemonAtoZ = await this.pokemonRepository.sortByAlphabeticalZtoA();
//       this.logger.log(
//         `Successfully fetched ${pokemonAtoZ.length} pokemons sorted alphabetically Z-A`,
//       );
//       return pokemonAtoZ;
//     } catch (error) {
//       this.logger.error(
//         'Error fetching pokemons sorted alphabetically Z-A',
//         error.stack,
//       );
//       throw new HttpException(
//         'Error sort pokemon alphabetically Z-A',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   //TODO

//   async sortHP_l(): Promise<Pokemon[]> {
//     try {
//       this.logger.log('Fetching pokemon sorted by HP (high to low)');
//       const pokemonHP_l = await this.pokemonRepository.sortByHP_l();
//       this.logger.log(
//         `Successfully fetched ${pokemonHP_l.length} pokemons sorted by HP (high to low)`,
//       );
//       return pokemonHP_l;
//     } catch (error) {
//       this.logger.error(
//         'Error fetching pokemons sorted by HP (high to low)',
//         error.stack,
//       );
//       throw new HttpException(
//         'Error sort pokemon by HP (high to low)',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async sortHP_h(): Promise<Pokemon[]> {
//     try {
//       this.logger.log('Fetching pokemon sorted by HP (low to high)');
//       const pokemonHP_h = await this.pokemonRepository.sortByHP_l();
//       this.logger.log(
//         `Successfully fetched ${pokemonHP_l.length} pokemons sorted by HP (low to high)`,
//       );
//       return pokemonHP_l;
//     } catch (error) {
//       this.logger.error(
//         'Error fetching pokemons sorted by HP (high to low)',
//         error.stack,
//       );
//       throw new HttpException(
//         'Error sort pokemon by HP (high to low)',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }
