import { Schema, model } from 'mongoose';
import { ICharacter } from './characterModel';

export interface IGuild {
  _id: string;
  name: string;
  leader: ICharacter;
  members?: ICharacter[];
  totalMembers: number;
  maxMembers: number;
  totalHealth?: number;
  totalStrength?: number;
  totalAgility?: number;
  totalIntelligence?: number;
  totalArmor?: number;
  totalCritChance?: number;
}

export type IGuildWithoutId = Omit<IGuild, '_id'>;

const guildSchema = new Schema<IGuildWithoutId>({
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

export const Guild = model<IGuildWithoutId>('Guild', guildSchema);

export const create = async (
  guild: IGuildWithoutId
): Promise<ICharacter> => {
  return (await Guild.create(guild)).toObject();
};