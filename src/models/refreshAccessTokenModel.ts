import { Schema, model, Document, Model } from 'mongoose';

interface IRefreshAccessToken {
  userId: Schema.Types.ObjectId;
  username: string;
  token: string;
  expiresAt: Date;
}

export interface IRefreshAccessTokenDocument extends IRefreshAccessToken, Document {}

interface IRefreshAccessTokenModel extends Model<IRefreshAccessTokenDocument> {}

const RefreshTokenSchema: Schema<IRefreshAccessTokenDocument, IRefreshAccessTokenModel> = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const RefreshToken: IRefreshAccessTokenModel = model<IRefreshAccessTokenDocument, IRefreshAccessTokenModel>('RefreshToken', RefreshTokenSchema);
