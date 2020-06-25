import * as mongoose from 'mongoose';
import { MetaSchema, IMeta } from './common.schema';
import * as paginate from 'mongoose-paginate';
import { v4 as uuid } from 'uuid';

paginate.paginate.options = {
  limit: 100,
};

const Schema = mongoose.Schema;

export interface IQuestion extends mongoose.Document {
  title: string;
  uuid: string;
  body: string;
  tags: string[];
  views: number;
  comments: string[];
  answers: string[];
  meta: IMeta;
}

export const QuestionSchema = new Schema({
  title: { type: String, required: true, lowercase: true, trim: true },
  uuid: { type: String },
  body: { type: String, required: true, trim: true },
  tags: { type: [String] },
  views: { type: Number, default: 0 },
  comments: { type: [String] },
  answers: { type: Schema.Types.ObjectId, ref: 'Answer' },
  meta: { type: MetaSchema, select: false }
});

const addMeta = async(ctx) => ctx['meta'] = MetaSchema;
const addUUID = async(ctx) => ctx['uuid'] = uuid();

QuestionSchema.pre('save', async function() {
  await addMeta(this);
  await addUUID(this);
});

QuestionSchema.plugin(paginate);
