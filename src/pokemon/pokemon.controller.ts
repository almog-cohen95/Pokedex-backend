import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('all-pokemons')
export class AllPokemonController {
  private readonly logger = new Logger(AllPokemonController.name);
  constructor(public pokemonService: PokemonService) {}

  @Get()
  async getAllPokemons() {
    try {
      this.logger.log('Get all pokemons');
      const pokemons = await this.pokemonService.getAllPokemons();
      this.logger.log(`Successfully get ${pokemons.length} pokemons`);
      return pokemons;
    } catch (error) {
      this.logger.error('Error get all pokemon', error.stack);
      throw new HttpException(
        'Failed to get all pokemons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('my-pokemons')
export class MyPokemonController {
  private readonly logger = new Logger(MyPokemonController.name);

  constructor(public pokemonService: PokemonService) {}

  @Get()
  async getMyPokemons(@Query('isOwn') isOwn: boolean) {
    try {
      this.logger.log('Get my pokemons');
      const myPokemons = await this.pokemonService.getMyPokemons(isOwn);
      this.logger.log(`Successfully get ${myPokemons.length} pokemons`);
      return myPokemons;
    } catch (error) {
      this.logger.error('Error get my pokemons', error.stack);
      throw new HttpException(
        'Error get my pokemons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getPokemonById(@Param('id') id: string) {
    try {
      this.logger.log(`Get pokemon with ID: ${id}`);
      const pokemonId = await this.pokemonService.getPokemonById(id);
      this.logger.log(`Successfully get pokemon with ID: ${id}`);
      return pokemonId;
    } catch (error) {
      this.logger.error('Error get pokemon by id', error.stack);
      throw new HttpException(
        'Error get pokemon by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
