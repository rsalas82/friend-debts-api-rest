import { Schema, model } from 'mongoose'
import { User } from './user.model'

export interface Debt extends Document {
  user: User['_id']
  amount: number
  description: string
  debtDate: Date
}

const debtSchema = new Schema<Debt>(
  {
    amount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    debtDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
)

debtSchema.set('toJSON', {
  transform: (document, returnedDebt) => {
    returnedDebt.id = returnedDebt._id
    delete returnedDebt._id
    delete returnedDebt.__v
  }
})

const DebtModel = model<Debt>('Debt', debtSchema)

export default DebtModel
