import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { PokemonRepository } from './pokemon.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from 'src/schemas/pokemon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]),
  ],
  controllers: [PokemonController],
  providers: [PokemonService, PokemonRepository],
  exports: [MongooseModule,PokemonService],
})
export class PokemonModule {}
