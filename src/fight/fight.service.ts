import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FightRepository } from './fight.repository';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { IFight, PokemonDetails } from './interface/fight.interface';
import { Pokemon } from 'src/pokemon/interface/pokemon.interface';
import { Types } from 'mongoose';

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
}
