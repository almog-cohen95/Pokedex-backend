import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Fight, FightDocument } from 'src/schemas/fight.schema';
import { IFight } from './interface/fight.interface';
import { Pokemon } from 'src/pokemon/interface/pokemon.interface';

@Injectable()
export class FightRepository {
  private readonly logger = new Logger(FightRepository.name);

  constructor(@InjectModel('Fight') private fightModel: Model<IFight>) {}

  async setPokemonsForFight(
    enemyPokemonDetails: { _id: Types.ObjectId; currentHP: number },
    userPokemonDetails: { _id: Types.ObjectId; currentHP: number },
    userPokemonsList: Types.ObjectId[],
  ) {
    try {
      const existingFight = await this.fightModel.findOne({}).exec();
      if (!existingFight) {
        this.logger.log('Creating a new fight document');

        const fight = new this.fightModel({
          enemyPokemon: {
            _id: enemyPokemonDetails._id,
            currentHP: enemyPokemonDetails.currentHP,
          },
          userPokemon: {
            _id: userPokemonDetails._id,
            currentHP: userPokemonDetails.currentHP,
          },
          fainted: false,
          catch: false,
          userPokemonsList: userPokemonsList,
        });

        return await fight.save();
      } else {
        this.logger.log('Updating existing fight document');
        existingFight.enemyPokemon = {
          _id: enemyPokemonDetails._id,
          currentHP: enemyPokemonDetails.currentHP,
        };
        existingFight.userPokemon = {
          _id: userPokemonDetails._id,
          currentHP: userPokemonDetails.currentHP,
        };
        existingFight.userPokemonsList = userPokemonsList;
        const updated = await existingFight.save();
      }
      this.logger.log('Send thr fight document to front');
      const fightData = await this.fightModel
        .aggregate([
          {
            $lookup: {
              from: 'pokemon',
              localField: 'enemyPokemon._id',
              foreignField: '_id',
              as: 'enemyPokemonData',
            },
          },
          { $unwind: '$enemyPokemonData' },
          {
            $lookup: {
              from: 'pokemon',
              localField: 'userPokemon._id',
              foreignField: '_id',
              as: 'userPokemonData',
            },
          },
          { $unwind: '$userPokemonData' },
          {
            $lookup: {
              from: 'pokemon',
              localField: 'userPokemonsList',
              foreignField: '_id',
              as: 'userPokemonsListData',
            },
          },
          {
            $project: {
              enemyPokemon: {
                name: '$enemyPokemonData.name',
                image: '$enemyPokemonData.image',
                base: '$enemyPokemonData.base',
                currentHP: '$enemyPokemon.currentHP',
              },
              userPokemon: {
                name: '$userPokemonData.name',
                image: '$userPokemonData.image',
                base: '$userPokemonData.base',
                currentHP: '$userPokemon.currentHP',
              },
              userPokemonsList: {
                _id: 1,
                name: 1,
                image: 1,
                base: 1,
              },
              fainted: 1,
              catch: 1,
            },
          },
          { $limit: 1 },
        ])
        .then((results) => results[0]);

      return fightData;
    } catch (error) {
      this.logger.error('Error while saving fight data', error.stack);
      throw new InternalServerErrorException(
        'Error while saving fight data in database',
      );
    }
  }
}
