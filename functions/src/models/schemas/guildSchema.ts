import { Schema, model } from 'mongoose';
import { IGuildWithoutId } from '../../types/guildTypes';

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