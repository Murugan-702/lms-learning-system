import mongoose, { Schema } from 'mongoose';
const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    thumbnailKey: String,
    videoUrl: String,
    position: { type: Number, required: true },

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
  },
  
  { timestamps: true }
);

LessonSchema.set("toJSON", { virtuals: true });
LessonSchema.set("toObject", { virtuals: true });

export default mongoose.model("Lesson", LessonSchema);
