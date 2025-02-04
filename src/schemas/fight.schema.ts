import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type FightDocument = Fight & Document;

@Schema()
class PokemonState {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pokemon', required: true })
  _id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  currentHP: number;
}

@Schema({ collection: 'fight' })
export class Fight {
  @Prop({ type: PokemonState, required: true })
  enemyPokemon: PokemonState;

  @Prop({ type: PokemonState, required: true })
  userPokemon: PokemonState;

  @Prop({ required: true })
  fainted: boolean;

  @Prop({ required: true })
  catch: boolean;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Pokemon',
    required: true,
  })
  userPokemonsList: Types.ObjectId[];
}

export const FightSchema = SchemaFactory.createForClass(Fight);
export const FightModelName = 'Fight';
