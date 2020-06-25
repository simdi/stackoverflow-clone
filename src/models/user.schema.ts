import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as paginate from 'mongoose-paginate';
import { v4 as uuid } from 'uuid';
import { MetaSchema, IMeta } from './common.schema';
import { HelperService } from '../shared/helpers/helper';

const Schema = mongoose.Schema;
const salt = HelperService.SALT;

paginate.paginate.options = {
  limit: 100,
};

export interface IUser extends mongoose.Document {
  uuid: string;
  email: string;
  role: string;
  password: string;
  firstName: string;
  lastName: string;
  meta: IMeta;
};

export const UserSchema = new Schema({
  uuid: { type: String },
  role: { type: String, enum: ['regular', 'admin'] },
  email: { type: String, unique: true, trim: true, required: true, lowercase: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  meta: { type: MetaSchema },
});

const addMeta = async(ctx) => ctx['meta'] = MetaSchema;
const addUUID = async(ctx) => ctx['uuid'] = uuid();
const hashPassword = async(ctx) => {
  const hashed = await bcrypt.hash(ctx['password'], salt);
  ctx['password'] = hashed;
};

UserSchema.pre('save', async function() {
  await hashPassword(this);
  await addMeta(this);
  await addUUID(this);
});

UserSchema.plugin(paginate);
