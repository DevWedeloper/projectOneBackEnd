import { Document, Model, Schema, model } from 'mongoose';

export interface IGuild {
  name: string;
  leader: Schema.Types.ObjectId;
  members?: Schema.Types.ObjectId[];
  totalMembers: number;
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
  },
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    required: true,
    unique: true,
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
  totalMembers: { type: Number, default: 1, min: 1, max: 50 },
});

guildSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const docToUpdate = (await this.model.findOne(
      this.getQuery()
    )) as IGuildDocument;
    if (docToUpdate.members!.length >= 49) {
      throw new Error('Guild member limit exceeded');
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
