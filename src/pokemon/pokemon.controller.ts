import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('all-pokemons')
export class AllPokemonController {
  constructor(public pokemonService: PokemonService) {}

  @Get()
  getAllPokemons() {
    return this.pokemonService.getAllPokemons();
  }
}


@Controller('my-pokemons')
export class MyPokemonController {
  constructor(public pokemonService: PokemonService) {}

  @Get()
  getMyPokemons(@Query('isOwn') isOwn: boolean) {
    return this.pokemonService.getMyPokemons(isOwn);
  }

  @Get(':id')
  getPokemonById(@Param('id') id: string) {
    return this.pokemonService.getPokemonById(id);
  }
}
