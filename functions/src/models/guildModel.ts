import { Document, Model, Schema, model } from 'mongoose';

export interface IGuild {
  name: string;
  leader: Schema.Types.ObjectId;
  members?: Schema.Types.ObjectId[];
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
  totalHealth: { type: Number },
  totalStrength: { type: Number },
  totalAgility: { type: Number },
  totalIntelligence: { type: Number },
  totalArmor: { type: Number },
  totalCritChance: { type: Number },
});

guildSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const guild = (await this.model.findOne(this.getQuery())) as IGuildDocument;
    if (guild.totalMembers >= guild.maxMembers) {
      throw new Error('Guild is full. Cannot add more members.');
    }
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

export const Guild: IGuildModel = model<IGuildDocument, IGuildModel>(
  'Guild',
  guildSchema
);
