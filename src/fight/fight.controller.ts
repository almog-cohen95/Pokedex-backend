import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FightService } from './fight.service';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { Types } from 'mongoose';

@Controller('fight')
export class FightController {
  private readonly logger = new Logger(FightController.name);
  constructor(
    public fightService: FightService,
    private readonly pokemonService: PokemonService,
  ) {}

  // @Post('/turn')
  // async processTurn(
  //   @Body()
  //   turnData: {
  //     attackerId: string;
  //     enemyPokemonId: string;
  //     userPokemonId: string;
  //   },
  // ) {
  //   const result = await this.fightService.fightTurnManager(
  //     new Types.ObjectId(turnData.attackerId),
  //     new Types.ObjectId(turnData.enemyPokemonId),
  //     new Types.ObjectId(turnData.userPokemonId),
  //   );

  //   return result;
  // }

  @Post('user-turn')
  async handleTurn() {
    try {
      const result = await this.fightService.fightTurnManager();
      //  await this.pokemonService.getUserPokemonsList(isOwn);
      return result;
    } catch (error) {
      throw new HttpException(
        'Error processing turn',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('catch-enemy-pokemon')
  async handleCatch() {
    try {
      const currentFight = await this.fightService.getCurrentFight();

      if (!currentFight || !currentFight[0]) {
        throw new HttpException('No current fight found', HttpStatus.NOT_FOUND);
      }

      const currentEnemyPokemon = currentFight[0].enemyPokemon._id;

      if (currentEnemyPokemon) {
        await this.pokemonService.addPokemonToUserPokemonsList(
          currentEnemyPokemon,
        );
      }
      const result = await this.fightService.fightCatchEnemyPokemon();
      return result;
    } catch (error) {
      throw new HttpException(
        'Error processing turn',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('random-new-enemy-pokemon')
  async updateFight() {
    try {
      const { enemyPokemon, userPokemonsList } =
        await this.pokemonService.getPokemonsForFight();

      if (!enemyPokemon) {
        throw new HttpException('No enemy pokemon found', HttpStatus.NOT_FOUND);
      }
      if (!userPokemonsList) {
        throw new HttpException(
          'No user pokemons list found',
          HttpStatus.NOT_FOUND,
        );
      }

      const newPokemons = await this.fightService.randomNewEnemyPokemon(
        { _id: enemyPokemon._id, currentHP: enemyPokemon.base.HP },
        userPokemonsList,
      );
      return { enemyPokemon, userPokemonsList, newPokemons };
    } catch (error) {
      this.logger.error(
        'Error random new enemy pokemon for fight',
        error.stack,
      );
      throw new HttpException(
        'Error random new enemy pokemon for fight',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('switch-pokemon')
  async switchPokemon(
    @Body() switchData: { userPokemonId: Types.ObjectId; selectedPokemonId: Types.ObjectId },
  ) {
    this.logger.log(`Fetching Pokemon with ID: ${switchData.selectedPokemonId}`);
      const selectedPokemon =
        await this.pokemonService.getPokemonById(switchData.selectedPokemonId);
      this.logger.log('Fetched Pokemon:', selectedPokemon);

      if (!selectedPokemon) {
        throw new HttpException(
          `Selected pokemon not found with ID: ${switchData.selectedPokemonId}`,
          HttpStatus.NOT_FOUND,
        );
      }
    return await this.fightService.switchPokemon(
      switchData.userPokemonId,
      selectedPokemon,
    );
  }

  @Get(':selectedPokemonId')
  async startFight(
    @Param('selectedPokemonId') selectedPokemonId: Types.ObjectId,
  ) {
    try {
      this.logger.log('Starting a new fight');

      const { enemyPokemon, userPokemonsList } =
        await this.pokemonService.getPokemonsForFight();

      if (!enemyPokemon) {
        throw new HttpException('No enemy pokemon found', HttpStatus.NOT_FOUND);
      }
      if (!userPokemonsList) {
        throw new HttpException(
          'No user pokemons list found',
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log(`Fetching Pokemon with ID: ${selectedPokemonId}`);
      const selectedPokemon =
        await this.pokemonService.getPokemonById(selectedPokemonId);
      this.logger.log('Fetched Pokemon:', selectedPokemon);

      if (!selectedPokemon) {
        throw new HttpException(
          `Selected pokemon not found with ID: ${selectedPokemonId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const fight = await this.fightService.setPokemonsForFight(
        { _id: enemyPokemon._id, currentHP: enemyPokemon.base.HP },
        { _id: selectedPokemonId, currentHP: selectedPokemon.base.HP },
        userPokemonsList,
      );

      return { fight };
    } catch (error) {
      this.logger.error('Error starting fight', error.stack);
      throw new HttpException(
        'Error starting fight',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Post('update-pokemon-hp')
  // async updatePokemonHP(
  //   @Body() updateData: { userPokemonId: string; damageToUser: number },
  // ) {
  //   const { userPokemonId, damageToUser } = updateData;
  //   try {
  //     const result = await this.fightService.updatePokemonHP({
  //       userPokemonId,
  //       damageToUser
  //     });
  //     this.logger.log(
  //       `Successfully fetched `,
  //     );

  //     return result;
  //   } catch (error) {
  //     this.logger.error('Error updating Pokemon HP', error.stack);
  //     throw new HttpException(
  //       'Error updating Pokemon HP',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
