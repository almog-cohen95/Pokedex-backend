import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PokemonDetails } from 'src/fight/interface/fight.interface';
import { Pokemon, PokemonDocument } from 'src/schemas/pokemon.schema';

@Injectable()
export class PokemonRepository {
  private readonly logger = new Logger(PokemonRepository.name);

  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>,
  ) {}

  async findPokemons(query: {
    sort: Record<string, 'asc' | 'desc'>;
    filter?: Record<string, any>;
    skip: number;
    limit: number;
  }): Promise<{ data: Pokemon[]; total: number }> {
    try {
      this.logger.log('Executing findPokemons query', query);

      const pokemons = await this.pokemonModel
        .find(query.filter || {})
        .sort(query.sort || {})
        .skip(query.skip)
        .limit(query.limit)
        .lean()
        .exec();

      const totalCount = await this.pokemonModel
        .countDocuments(query.filter || {})
        .exec();

      this.logger.log(
        `Found ${pokemons.length} pokemons, total count: ${totalCount}`,
      );

      return { data: pokemons, total: totalCount };
    } catch (error) {
      this.logger.error('Error while fetching pokemons', error.stack);
      throw new InternalServerErrorException(
        'Error fetching pokemons from the database',
      );
    }
  }

  async findPokemonById(selectedPokemonId: Types.ObjectId) {
    try {
      this.logger.log(
        `Querying pokemon by ID: ${selectedPokemonId} from database`,
      );
      const objectId = new Types.ObjectId(selectedPokemonId);
      const pokemon = await this.pokemonModel.findById(objectId).exec();
      this.logger.log('Database query result:', pokemon);
      return pokemon;
    } catch (error) {
      this.logger.error('Error querying pokemon by ID', error.stack);
      throw new Error('Database error while fetching pokemon by ID');
    }
  }

  async getPokemonsForFight() {
    try {
      this.logger.log(`Fetching enemy and user Pokemons from database`);

      const result = await this.pokemonModel.aggregate([
        {
          $facet: {
            enemyPokemon: [
              
              { $match: { isOwn: false } }, //TODO
                // { $match: { _id: new Types.ObjectId("67979cef3d952a17fe085426") } }, 
              { $sample: { size: 1 } },  //TODO
            ],
            userPokemonsList: [
              { $match: { isOwn: true } },
              { $project: { _id: 1 } },
            ],
            
          },
        },
      ]);

      return {
        enemyPokemon: result[0].enemyPokemon[0],
        userPokemonsList: result[0].userPokemonsList.map((p) => p._id),
      };
    } catch (error) {
      this.logger.error('Error fetching enemy and user Pokemons', error.stack);
      throw new Error('Database error while fetching enemy and user Pokemons');
    }
  }

  async addPokemonToUserPokemonsList(enemyPokemon: PokemonDetails) {
    try {
      this.logger.log(
        `Try to add new pokemon to user pokemons list after catch`,
      );

      const result = await this.pokemonModel.updateOne(
        { _id: enemyPokemon._id },
        { $set: { isOwn: true } },
      );

      return result;
    } catch (error) {
      this.logger.error('Error fetching enemy and user Pokemons', error.stack);
      throw new Error('Database error while fetching enemy and user Pokemons');
    }
  }

  async getUserPokemonsList(isOwn:boolean) {
    try {
      this.logger.log('Get all pokemons belongs to user');
      const result = await this.pokemonModel.find({ isOwn }).lean();

      this.logger.log('Get all pokemons belongs to user successfully', result);
      return result;
    } catch (error) {
      this.logger.error('Error Get all pokemons belongs to user', error.stack);
      throw new InternalServerErrorException(
        'Error Get all pokemons belongs to user',
      );
    }
  }
}
