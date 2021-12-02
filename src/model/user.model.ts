import mongoose from 'mongoose'
import config from 'config'
import bcrypt from 'bcrypt'

export interface UserDocument extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    comparePassword(comparePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: "string", required: true, unique: true },
    name: { type: "string", required: true },
    password: { type: "string", required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', function(next) {
    let user:UserDocument = this;

    if (!user.isModified("password")) return next();
    
    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        user.password = hash;
    });

    return next();
})

UserSchema.methods.comparePassword = async function(candidatePassword: string){
    const user:UserDocument = this;
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
}

const User = mongoose.model<UserDocument>("User", UserSchema)

export default User;