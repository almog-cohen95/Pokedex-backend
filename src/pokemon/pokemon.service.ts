import { Injectable } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';
import { Pokemon } from './interface/pokemon.interface';

@Injectable()
export class PokemonService {
constructor(private readonly pokemonRepository: PokemonRepository) {}

  async getAllPokemons(): Promise<Pokemon[]> {
    return this.pokemonRepository.findAllPokemons();
  }

  async getMyPokemons(isOwn: boolean): Promise<Pokemon[] > {
    return this.pokemonRepository.findMyPokemons(isOwn);
  }

  async getPokemonById(_id: string): Promise<Pokemon | null> {
    return this.pokemonRepository.findPokemonById(_id);
  }

 async getAvailablePokemons(exclude: string): Promise<Pokemon[]> {
    return this.pokemonRepository.findAvailablePokemonsSwitch(exclude);
  }
}
