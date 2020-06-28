import * as mongoose from 'mongoose';
import { MetaSchema, IMeta } from './common.schema';
import * as paginate from 'mongoose-paginate-v2';
import { v4 as uuid } from 'uuid';

paginate.paginate.options = {
  limit: 100,
};

const Schema = mongoose.Schema;

export interface IQuestion extends mongoose.Document {
  title: string;
  uuid: string;
  body: string;
  userId: string;
  vote: number;
  answers: [any];
  user?: {};
  meta?: IMeta;
}

export const QuestionSchema = new Schema({
  title: { type: String, required: true, trim: true },
  uuid: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true, trim: true },
  vote: { type: Number, default: 0 },
  answers: {
    type: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      body: { type: String, required: true }
    }]
  },
  meta: { type: MetaSchema, select: false }
}, { toJSON: { virtuals: true } });

const addMeta = async(ctx) => ctx['meta'] = MetaSchema;
const addUUID = async(ctx) => ctx['uuid'] = uuid();

QuestionSchema.pre('save', async function() {
  await addMeta(this);
  await addUUID(this);
});

QuestionSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

QuestionSchema.virtual('answers.user', {
  ref: 'User',
  localField: 'answers.userId',
  foreignField: '_id',
  justOne: true,
});

QuestionSchema.plugin(paginate);
