import { Schema, Document, model } from 'mongoose'
import bcrypt from 'bcrypt'

export interface User extends Document {
  firstname: string
  surname: string
  email: string
  password: string
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
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

    // override the cleartext password with the hashed one
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
