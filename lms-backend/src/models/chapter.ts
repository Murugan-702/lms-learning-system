import mongoose, { Schema } from "mongoose";

const ChapterSchema = new Schema(
  {
    title: { type: String, required: true },
    position: { type: Number, required: true },

    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

/* Virtual relation -> chapter.lessons */
ChapterSchema.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "chapterId",
});

ChapterSchema.set("toJSON", { virtuals: true });
ChapterSchema.set("toObject", { virtuals: true });

export default mongoose.model("Chapter", ChapterSchema);
