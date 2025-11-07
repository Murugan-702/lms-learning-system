import mongoose, { Schema, Document } from "mongoose";

export enum CourseLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export enum CourseStatus {
  Draft = "Draft",
  Published = "Published",
  Archived = "Archived",
}

export interface ICourse extends Document {
  title: string;
  description: string;
  fileKey: string;
  price: number;
  duration: number;
  level: CourseLevel;
  category: string;
  smallDescription: string;
  slug: string;
  status: CourseStatus;
  userId: string; 
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileKey: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    level: {
      type: String,
      enum: Object.values(CourseLevel),
      default: CourseLevel.Beginner,
    },
    category: { type: String, required: true },
    smallDescription: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.Draft,
    },

    userId: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

// Virtual (reverse relation)
CourseSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "id",
  justOne: true,
});

CourseSchema.set("toJSON", { virtuals: true });
CourseSchema.set("toObject", { virtuals: true });

const Course = mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
