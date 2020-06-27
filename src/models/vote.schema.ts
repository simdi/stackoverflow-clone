import * as mongoose from 'mongoose';
import { MetaSchema, IMeta } from './common.schema';

const Schema = mongoose.Schema;

export interface IVote extends mongoose.Document {
  questionId: string;
  userObj: object;
  votes: number;
  meta: IMeta;
}

export const VoteSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, required: true, unique: true },
  users: { type: [{ userId: Schema.Types.ObjectId, vote: Number, _id: false }] },
  votes: { type: Number, default: 0 },
  meta: { type: MetaSchema, select: false }
});

const addMeta = async(ctx) => ctx['meta'] = MetaSchema;

VoteSchema.pre('save', async function() {
  await addMeta(this);
});
