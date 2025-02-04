import { Model } from "mongoose";
import { FightDocument } from "src/schemas/fight.schema";

export const getFightAggregation = (fightModel: Model<FightDocument>) => {
  return fightModel.aggregate([
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
  ]);
};
