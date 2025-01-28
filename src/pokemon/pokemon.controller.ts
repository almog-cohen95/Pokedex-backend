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
import { Pokemon } from './interface/pokemon.interface';

@Controller('all-pokemons')
export class AllPokemonController {
  private readonly logger = new Logger(AllPokemonController.name);
  constructor(public pokemonService: PokemonService) {}

  @Get()
  async getPokemons(
    @Query('sortBy') sortBy: string = 'alphabeticallyA-Z',
    @Query('isOwn') isOwn?: string,
    @Query('nameSearch') nameSearch?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ pokemons: Pokemon[]; totalCount: number; message?: string }> {
    this.logger.log(
      `Received request with query: sortBy=${sortBy}, isOwn=${isOwn}, nameSearch=${nameSearch}, page=${page}, pageSize=${pageSize}`,
    );

    const isOwnBoolean =
      isOwn === 'true' ? true : isOwn === 'false' ? false : undefined;

    try {
      const result = await this.pokemonService.getPokemons({
        sortBy,
        isOwn: isOwnBoolean,
        nameSearch,
        page,
        pageSize,
      });
      this.logger.log(
        `Successfully fetched ${result.pokemons.length} pokemons, total count: ${result.totalCount}`,
      );

      return result;
    } catch (error) {
      this.logger.error('Error fetching pokemons', error.stack);
      throw new HttpException(
        'Failed to get pokemons',
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

@Controller('my-pokemons')
export class MyPokemonController {
  private readonly logger = new Logger(AllPokemonController.name);
  constructor(public pokemonService: PokemonService) {}

  @Get()
  async getPokemons(
    @Query('sortBy') sortBy: string = 'alphabeticallyA-Z',
    @Query('isOwn') isOwn?: string,
    @Query('nameSearch') nameSearch?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ pokemons: Pokemon[]; totalCount: number; message?: string }> {
    this.logger.log(
      `Received request with query: sortBy=${sortBy}, isOwn=${isOwn}, nameSearch=${nameSearch}, page=${page}, pageSize=${pageSize}`,
    );

    const isOwnBoolean =
      isOwn === 'true' ? true : isOwn === 'false' ? false : undefined;

    try {
      const result = await this.pokemonService.getPokemons({
        sortBy,
        isOwn: isOwnBoolean,
        nameSearch,
        page,
        pageSize,
      });
      this.logger.log(
        `Successfully fetched ${result.pokemons.length} pokemons, total count: ${result.totalCount}`,
      );

      return result;
    } catch (error) {
      this.logger.error('Error fetching pokemons', error.stack);
      throw new HttpException(
        'Failed to get pokemons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
