import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type FightDocument = Fight & Document;

@Schema({ collection: 'fight' })
export class Fight {
  @Prop({
    type: {
      _id: {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Pokemon',
        required: true,
      },
      currentHP: { type: Number, required: true },
    },
    required: true,
  })
  enemyPokemon: {
    _id: Types.ObjectId;
    currentHP: number;
  };

  @Prop({
    type: {
      _id: {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Pokemon',
        required: true,
      },
      currentHP: { type: Number, required: true },
    },
    required: true,
  })
  userPokemon: {
    _id: Types.ObjectId;
    currentHP: number;
  };

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
