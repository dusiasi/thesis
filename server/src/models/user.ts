import { InferSchemaType, Schema, model } from "mongoose";

export type userType = InferSchemaType<typeof User>;

// defining data structure
const User = new Schema({
  userName: String,
  email: String,
  password: String,
  profilePic: File, // to check this
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "groups",
      required: false,
    },
  ],
  mixTapes: [
    {
      type: Schema.Types.ObjectId,
      ref: "mixTapes",
    },
  ],
});

const UserModel = model("items", User);

export default UserModel;

//65ef050866b63835a2cc903d
