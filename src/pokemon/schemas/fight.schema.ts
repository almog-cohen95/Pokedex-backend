import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema  } from 'mongoose';

export type PokemonDocument = Fight & Document;

@Schema({ collection: 'fight' })
export class Fight {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pokemon', required: true })
  enemyPokemon:  MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pokemon', required: true })
  userPokemon: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  currentHPuserPokemon: number;

  @Prop({ required: true })
  currentHPenemyPokemon: number;

  @Prop({ required: true })
  fainted: boolean;

  @Prop({ required: true })
  catch: boolean;
}

export const PokemonSchema = SchemaFactory.createForClass(Fight);
export const PokemonModelName = 'Fight';
