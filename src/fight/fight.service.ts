import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FightRepository } from './fight.repository';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { IFight, PokemonDetails } from './interface/fight.interface';
import { Pokemon } from 'src/pokemon/interface/pokemon.interface';
import { Types } from 'mongoose';
import { calculateCatchChance } from './utils/fight.utils';

@Injectable()
export class FightService {
  private readonly logger = new Logger(PokemonService.name);

  constructor(
    private readonly fightRepository: FightRepository,
    private readonly pokemonService: PokemonService,
  ) {}

  async setPokemonsForFight(
    enemyPokemonDetails: { _id: Types.ObjectId; currentHP: number },
    userPokemonDetails: { _id: Types.ObjectId; currentHP: number },
    userPokemonsList: Types.ObjectId[],
  ) {
    try {
      this.logger.log(
        `Set enemy pokemon, user pokemon and user pokemons list for fight`,
      );

      const pokemonsForFight = await this.fightRepository.setPokemonsForFight(
        enemyPokemonDetails,
        userPokemonDetails,
        userPokemonsList,
      );
      this.logger.log(
        `Successfully set enemy pokemon, user pokemon and user pokemons list for fight`,
      );

      return pokemonsForFight;
    } catch (error) {
      this.logger.error('Error get pokemon by id', error.stack);
      throw new HttpException(
        'Error get pokemon by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fightTurnManager() {
    try {
      const currentFight =
        await this.fightRepository.getCurrentFightWithDetails();
      if (!currentFight.userPokemon || !currentFight.enemyPokemon) {
        throw new Error('userPokemonData or enemyPokemonData is missing!');
      }

      let damage;
      //חישוב הנזק שהמשתמש עושה ליריב
      if (currentFight.isUserTurn) {
        const attack = currentFight.userPokemon.base.Attack;
        const defense = currentFight.enemyPokemon.base.Defense;
        // damage =55; 
        damage = Math.max(attack - defense, 5); 
        currentFight.enemyPokemon.currentHP = Math.max(
          currentFight.enemyPokemon.currentHP - damage,
          0,
        );
        currentFight.isUserTurn = false;
      } else {
        //חישוב הנזק שהיריב עושה למשתמש
        const attack = currentFight.enemyPokemon.base.Attack;
        const defense = currentFight.userPokemon.base.Defense;
        damage = Math.max(attack - defense, 5);
        // damage = 1;
        currentFight.userPokemon.currentHP = Math.max(
          currentFight.userPokemon.currentHP - damage,
          0,
        );
        currentFight.isUserTurn = true;
      }
      const catchChance = calculateCatchChance(
        currentFight.enemyPokemon.currentHP,
        currentFight.enemyPokemon.base.HP,
      );
      currentFight.catchChance = catchChance;
      await this.fightRepository.updateFight(currentFight);

      return {
        currentFight,
        isUserTurn: currentFight.isUserTurn,
        enemyPokemonHP: currentFight.enemyPokemon.currentHP,
        userPokemonHP: currentFight.userPokemon.currentHP,
        damage,
        catchChance: catchChance,
      };
    } catch (error) {
      console.error('Error in fightTurnManager:', error);
    }
  }

  async fightCatchEnemyPokemon() {
    try {
      const currentFight =
        await this.fightRepository.getCurrentFightWithDetails();
      if (!currentFight.userPokemon || !currentFight.enemyPokemon) {
        throw new Error('userPokemonData or enemyPokemonData is missing!');
      }
    } catch (error) {
      console.error('Error in fightTurnManager:', error);
    }
  }

  async randomNewEnemyPokemon(
    enemyPokemon: PokemonDetails,
    userPokemonsList: Types.ObjectId[],
  ) {
    try {
      const currentFight =
        await this.fightRepository.getCurrentFightWithDetails();
      if (!currentFight.userPokemon || !currentFight.enemyPokemon) {
        throw new Error('userPokemonData or enemyPokemonData is missing!');
      }
      await this.fightRepository.setNewEnemyPokemonForFight(
        enemyPokemon,
        userPokemonsList,
      );
    } catch (error) {
      console.error('Error random new enemy pokemon:', error);
    }
  }

  async getCurrentFight() {
    try {
      const currentFight = await this.fightRepository.getCurrentFight();

      if (!currentFight) {
        throw new Error('Current fight not found');
      }
      return currentFight;
    } catch (error) {
      console.error('Error fetching current fight', error);
    }
  }

  async switchPokemon(userPokemonId: Types.ObjectId, selectedPokemon: Pokemon) {
    try {
      const switchPokemon = await this.fightRepository.switchPokemon(
        userPokemonId,
        selectedPokemon,
      );

      console.log('!@!@#!#@!#!@#!#!#!!# userPokemonId:', userPokemonId, '!@!@#!#@!#!@#!#!#!!# selectedPokemon:',selectedPokemon)

      if (!switchPokemon) {
        throw new Error("Can't switch pokemon");
      }

      return switchPokemon;
    } catch (error) {
      console.error("Can't switch pokemon", error);
      throw new InternalServerErrorException('Error switching pokemon');
    }
  }
}

//   async fightTurnManager(
//     attackerId: Types.ObjectId,
//     enemyPokemonId: Types.ObjectId,
//     userPokemonId: Types.ObjectId,
//   ) {
//     // try {
//     //   const attacker = attackerId.equals(userPokemonId)
//     //     ? userPokemonId
//     //     : enemyPokemonId;

//     //   const defender =
//     //     attacker === userPokemonId ? enemyPokemonId : userPokemonId;

//     //   const damageToUser = calculateDamage(attacker, defender);
//     try {
//       const currentFight =
//         await this.fightRepository.getCurrentFightWithDetails();
//       if (!currentFight) {
//         throw new NotFoundException('No active fight found');
//       }

//       // Determine attacker and defender
//       const isUserAttacking = attackerId.equals(userPokemonId);
//       const attacker = isUserAttacking
//         ? currentFight.userPokemon
//         : currentFight.enemyPokemon;
//       const defender = isUserAttacking
//         ? currentFight.enemyPokemon
//         : currentFight.userPokemon;

//  function calculateDamage(pokemonAttack: number, pokemonDefense: number) {
//   return Math.max(pokemonAttack - pokemonDefense, 0);
// }
//       // Calculate damage
//       const damage = calculateDamage(
//         attacker.base.Attack,
//         defender.base.Defense,
//       );

//       // Apply damage and check for fainted state
//       const newDefenderHP = Math.max(0, defender.currentHP - damage);

//       // Prepare update data
//       const updateData = {
//         [`${isUserAttacking ? 'enemyPokemon' : 'userPokemon'}.currentHP`]:
//           newDefenderHP,
//       };

//       // Update fight state in repository
//       const updatedFight =
//         await this.fightRepository.updateFightState(updateData);

//       // Prepare turn result
//       const turnResult = {
//         attacker: {
//           id: attacker._id,
//           name: attacker.name.english,
//           currentHP: attacker.currentHP,
//         },
//         defender: {
//           id: defender._id,
//           name: defender.name.english,
//           currentHP: newDefenderHP,
//           damageTaken: damage,
//         },
//       };

//       return {
//         turnResult,
//         fightState: updatedFight,
//       };
//     } catch (error) {
//       this.logger.error('Error in fight turn manager', error.stack);
//       throw new HttpException(
//         'Error processing fight turn',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }

// async updatePokemonHP(userPokemonId: string, damageToUser: number) {
//   try {

//     const userPokemon = await this.fightRepository.getUserPokemon(); // ב-repository תעשה את החיפוש
//     let newHP = userPokemon.currentHP - damageToUser;
//     if (newHP < 0) {
//       newHP = 0; // לא יכול להיות HP שלילי
//     }

//     const updatedPokemon = await this.fightRepository.updatePokemonHP(userPokemonId, newHP);

//     this.logger.log(`Successfully updated Pokemon HP`);

//     return updatedPokemon;
//   } catch (error) {
//     this.logger.error('Error updating pokemon HP', error.stack);
//     throw new HttpException(
//       'Error updating pokemon HP',
//       HttpStatus.INTERNAL_SERVER_ERROR,
//     );
//   }
// }
