import { Module } from '@nestjs/common';
import { AllPokemonController, MyPokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { PokemonRepository } from './pokemon.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pokemon, PokemonSchema } from './schemas/pokemon.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        dbName: config.get<string>('MONGODB'),
      }),
    }),
  ],
  controllers: [AllPokemonController, MyPokemonController],
  providers: [PokemonService, PokemonRepository],
})
export class PokemonModule {}
