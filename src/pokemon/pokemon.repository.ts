import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from './interface/pokemon.interface';

@Injectable()
export class PokemonRepository {
  private readonly logger = new Logger(PokemonRepository.name);

  constructor(@InjectModel('Pokemon') private pokemonModel: Model<Pokemon>) {}

  async findPokemons(query: {
    sort: string;
    filter?: Record<string, any>;
    skip: number;
    limit: number;
  }): Promise<{ pokemons: Pokemon[]; totalCount: number }> {
    try {
      this.logger.log('Executing findPokemons query', query);

      const pokemons = await this.pokemonModel
        .find(query.filter || {})
        .sort(query.sort || {})
        .skip(query.skip)
        .limit(query.limit)
        .exec();
      const totalCount = await this.pokemonModel
        .countDocuments(query.filter || {})
        .exec();

      this.logger.log(
        `Found ${pokemons.length} pokemons, total count: ${totalCount}`,
      );
      return { pokemons, totalCount };
      
    } catch (error) {
      this.logger.error('Error while fetching pokemons', error.stack);
      throw new InternalServerErrorException(
        'Error fetching pokemons from the database',
      );
    }
  }
}

//   async findMyPokemons(isOwn: boolean) {
//     try {
//       this.logger.log('Querying my pokemons from database');
//       return this.pokemonModel.find({ isOwn }).exec();
//     } catch (error) {
//       this.logger.error('Error querying my pokemons', error.stack);
//       throw new Error('Database error while fetching my pokemons');
//     }
//   }

//   async findPokemonById(id: string) {
//     try {
//       this.logger.log(`Querying pokemon by ID: ${id} from database`);
//       return this.pokemonModel.findById(id).exec();
//     } catch (error) {
//       this.logger.error('Error querying pokemon by ID', error.stack);
//       throw new Error('Database error while fetching pokemon by ID');
//     }
//   }

//   async sortByAlphabeticalAtoZ() {
//     try {
//       this.logger.log(
//         `Querying to sort pokemon by alphabetical A-Z from database`,
//       );
//       return this.pokemonModel.find().sort({ 'name.english': 1 }).exec();
//     } catch (error) {
//       this.logger.error(
//         'Error querying pokemon sorted by alphabetical A-Z',
//         error.stack,
//       );
//       throw new Error('Database error while sorting pokemon alphabetically');
//     }
//   }

//   async sortByAlphabeticalZtoA() {
//     try {
//       this.logger.log(
//         `Querying to sort pokemon by alphabetical Z-A from database`,
//       );
//       return this.pokemonModel.find().sort({ 'name.english': -1 }).exec();
//     } catch (error) {
//       this.logger.error(
//         'Error querying pokemon sorted by alphabetical A-Z',
//         error.stack,
//       );
//       throw new Error('Database error while sorting pokemon alphabetically');
//     }
//   }

//   async sortByHP_l() {
//     try {
//       this.logger.log(
//         `Querying to sort pokemon by HP low to high from database`,
//       );
//       return this.pokemonModel.find().sort({ 'base.HP': 1 }).exec();
//     } catch (error) {
//       this.logger.error(
//         'Error sorting pokemon by HP (low to high)',
//         error.stack,
//       );
//       throw new Error('Database error while sorting pokemon by HP in ascending order');
//     }
//   }

//    async sortByHP_h() {
//     try {
//       this.logger.log(
//         `Querying to sort pokemon by HP high to low from database`,
//       );
//       return this.pokemonModel.find().sort({ 'base.HP': -1 }).exec();
//     } catch (error) {
//       this.logger.error(
//         'Error sorting pokemon by HP (high to low)',
//         error.stack,
//       );
//       throw new Error('Database error while sorting pokemon by HP in descending order');
//     }
//   }
// }
