import { Document, Model, Schema, model } from 'mongoose';
import { ICharacter } from './characterModel';

export interface IGuild {
  name: string;
  leader: ICharacter;
  members?: ICharacter[];
  totalMembers: number;
  maxMembers: number;
  totalHealth: number;
  totalStrength: number;
  totalAgility: number;
  totalIntelligence: number;
  totalArmor: number;
  totalCritChance: number;
}

export interface IGuildDocument extends IGuild, Document {}

interface IGuildModel extends Model<IGuildDocument> {}

const guildSchema: Schema<IGuildDocument, IGuildModel> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 20,
    match: /^[A-Za-z0-9_]*$/,
    index: true,
  },
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    required: true,
    unique: true,
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
  totalMembers: { type: Number, default: 1, min: 1, max: 50 },
  maxMembers: { type: Number, default: 50 },
  totalHealth: { type: Number, default: 0 },
  totalStrength: { type: Number, default: 0 },
  totalAgility: { type: Number, default: 0 },
  totalIntelligence: { type: Number, default: 0 },
  totalArmor: { type: Number, default: 0 },
  totalCritChance: { type: Number, default: 0 },
});

export const Guild: IGuildModel = model<IGuildDocument, IGuildModel>(
  'Guild',
  guildSchema
);
