import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
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

      return { enemyPokemon, userPokemonsList, fight };
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
