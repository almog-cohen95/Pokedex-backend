import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Fight, FightSchema } from 'src/schemas/fight.schema';
import { FightService } from './fight.service';
import { FightRepository } from './fight.repository';
import { FightController } from './fight.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fight.name, schema: FightSchema }]),
    PokemonModule
  ],
  controllers: [FightController],
  providers: [FightService, FightRepository],
})
export class FightModule {}
