import { Schema, Document, model } from 'mongoose'

export interface Group extends Document {
  name: string,
  description: string
}

const groupSchema = new Schema<Group>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
)

groupSchema.set('toJSON', {
  transform: (document, returnedGroup) => {
    returnedGroup.id = returnedGroup._id
    delete returnedGroup._id
    delete returnedGroup.__v
  }
})

const GroupModel = model<Group>('Group', groupSchema)

export default GroupModel
