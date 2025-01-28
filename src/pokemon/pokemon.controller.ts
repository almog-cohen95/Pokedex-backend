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
import { GetPokemonsQueryDto } from './dto/pokemon.dto';

@Controller('pokemons')
export class AllPokemonController {
  private readonly logger = new Logger(AllPokemonController.name);
  constructor(public pokemonService: PokemonService) {}

  @Get()
  async getPokemons(
    @Query() query: GetPokemonsQueryDto,
  ): Promise<{ data: Pokemon[]; total: number; message?: string }> {
    const { sortBy, sortType, isOwn, nameSearch, page, pageSize } = query;

    this.logger.log(
      `Received request with query: sortBy=${sortBy}, sortType=${sortType}, isOwn=${isOwn}, nameSearch=${nameSearch}, page=${page}, pageSize=${pageSize}`,
    );

    try {
      const result = await this.pokemonService.getPokemons({
        sortBy,
        sortType,
        isOwn,
        nameSearch,
        page,
        pageSize,
      });
      this.logger.log(
        `Successfully fetched ${result.data.length} pokemons, total count: ${result.total}`,
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
