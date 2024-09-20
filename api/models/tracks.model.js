import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Tracks = mongoose.model("Tracks", trackSchema);

export default Tracks;