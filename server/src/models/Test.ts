import mongoose from "mongoose";
const schema = mongoose.Schema;

const testSchema = new schema({
  id: { type: Number, required: true, unique: true },
  friends: { type: [String], required: true },
});

const Test = mongoose.model("test", testSchema);
export default Test;
