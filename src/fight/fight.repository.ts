import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
          isUserTurn: true,
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
        existingFight.isUserTurn;
        existingFight.userPokemonsList = userPokemonsList;
        await existingFight.save();
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

  async getCurrentFight() {
    try {
      this.logger.log(
        `Get current fight`,
      );
      const currentFight = await this.fightModel.aggregate([
            {
                $lookup: {
                    from: 'pokemons', // שם האוסף של הפוקימונים
                    localField: 'enemyPokemon._id', // מזהה הפוקימון היריב
                    foreignField: '_id', // מזהה הפוקימון באוסף pokemons
                    as: 'enemyPokemonData'
                }
            },
            {
                $unwind: {
                    path: '$enemyPokemonData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'pokemons', // חיבור גם לפוקימון של המשתמש
                    localField: 'userPokemon._id',
                    foreignField: '_id',
                    as: 'userPokemonData'
                }
            },
            {
                $unwind: {
                    path: '$userPokemonData',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec();
      this.logger.log('Database result for current fight:', currentFight);
      return currentFight;
    } catch (error) {
      this.logger.error('Error get current fight', error.stack);
      throw new Error('Database error while get current fight');
    }
  }

  async updateFight(currentFight: any) {
  try {
    this.logger.log('Updating current fight');
    
    const result = await this.fightModel.updateOne(
      { },
      { 
        $set: {
          'userPokemon.currentHP': currentFight[0].userPokemon.currentHP,
          'enemyPokemon.currentHP': currentFight[0].enemyPokemon.currentHP,
          'isUserTurn': currentFight[0].isUserTurn
        }
      }
    );

    this.logger.log('Fight updated successfully');
    return result;
  } catch (error) {
    this.logger.error('Error updating fight:', error.stack);
    throw new Error('Database error while updating the fight');
  }
}


  // async updatePokemonHP(userPokemonId: string, damageToUser: number) {
  //   const fight = await this.fightModel.findOne({}).exec();
  //   if (!fight) {
  //     throw new HttpException('Fight not found', HttpStatus.NOT_FOUND);
  //   }

  //   const userPokemon = fight.userPokemon;

  //   // עדכון ה-HP של הפוקימון
  //   userPokemon.currentHP -= damageToUser;
  //   if (userPokemon.currentHP < 0) {
  //     userPokemon.currentHP = 0; // לא יכול להיות HP שלילי
  //   }

  //   // שמירה במסד הנתונים
  //   await fight.save();

  //   // החזרת המידע החדש
  //   return { userPokemon };
  // }

  async getCurrentFightWithDetails() {
    try {
      const fightData = await this.fightModel
        .aggregate([
          { $match: {} }, // Gets the current fight
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
            $project: {
              enemyPokemon: {
                _id: '$enemyPokemonData._id',
                name: '$enemyPokemonData.name',
                base: '$enemyPokemonData.base',
                currentHP: '$enemyPokemon.currentHP',
              },
              userPokemon: {
                _id: '$userPokemonData._id',
                name: '$userPokemonData.name',
                base: '$userPokemonData.base',
                currentHP: '$userPokemon.currentHP',
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
      this.logger.error('Error getting current fight', error.stack);
      throw new InternalServerErrorException('Error retrieving fight data');
    }
  }

  async updateFightState(updateData: any) {
    try {
      const updatedFight = await this.fightModel
        .findOneAndUpdate(
          {}, // Updates the current fight
          {
            $set: updateData,
            $inc: { turnNumber: 1 },
          },
          { new: true }, // Returns the updated document
        )
        .exec();

      if (!updatedFight) {
        throw new NotFoundException('No fight found to update');
      }

      return updatedFight;
    } catch (error) {
      this.logger.error('Error updating fight state', error.stack);
      throw new InternalServerErrorException('Error updating fight state');
    }
  }
}
