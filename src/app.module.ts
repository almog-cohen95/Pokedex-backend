import { Module } from '@nestjs/common';
import { FightModule } from './fight/fight.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        
        uri: config.get<string>('MONGODB_URI'),
        dbName: config.get<string>('MONGODB'),
      }),
    }),
    FightModule,
    PokemonModule,
  ],
})
export class AppModule {}