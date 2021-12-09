import { Schema, Document, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { Group } from './group.model'

export interface User extends Document {
  firstname: string
  surname: string
  email: string
  password: string
  group: Group['_id']
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    firstname: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

userSchema.pre('save', function (next) {
  const user: User = this

  if (!user.isModified('password')) return next()

  const saltRounds = 10
  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    if (err) return next(err)
    user.password = hash
    next()
  })
})

userSchema.set('toJSON', {
  transform: (document, returnedUser) => {
    returnedUser.id = returnedUser._id
    delete returnedUser._id
    delete returnedUser.__v
  }
})

const UserModel = model<User>('User', userSchema)

export default UserModel
