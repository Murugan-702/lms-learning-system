
import {z} from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;
export const courseCategories = [
    "Development",
    "Busincess",
    "Finanace",
    "It & Software",
    "Office productivity",
    "Personal Development",
    "Design",
    "Marketing",
    "Health Fitness",
    "Music",
    "Teaching & Academics"
] as const;
export const courseSchema = z.object({
    title: z.string().min(3, { message: "Title must be atleast 3 characters long" }).max(100, { message: "Title must be atmost 100 characters long..." }),
    description: z.string().min(3, { message: "Description must be atleast 3 characters long" }),
    fileKey: z.string().min(1, { message: "File is required" }),
    price: z.coerce.number().min(1, { message: "Price must be a positive number" }),
    duration: z.coerce.number().min(1, { message: "Duration must be atleast one hour" }).max(500, { message: "Duration must be at most 500 hours" }),
    level: z.enum(courseLevels, {
        message: "Level is Required"
    }),
    category: z.enum(courseCategories,{message:"Category is required"}),
    smallDescription: z.string().min(3, {
        message: "Small Description must be at least 3 characters long"
    }).max(200, {
        message: "Small Description must be at most 200 characters long"
    }),
    slug: z.string().min(3, {
        message: "Slug must be atleast 3 characters long"
    }),
    status: z.enum(courseStatus, {
        message: "Status is required"
    })
    
    
});


export const chapterSchema = z.object({
    name: z.string().min(3, { message: "Name must be atleast 3 characters long." }),
    courseId: z.string({ message: "Invalid course Id" })
});

export const lessonSchema = z.object({
    name: z.string().min(3, { message: "Name must be atlease 3 characters long" }),
    courseId: z.string().uuid({ message: "Invalid course Id" }),
    chapterId: z.string().uuid({ message: "Invalid chapter Id" }),
    description: z.string().min(3, { message: "Description must be atleast 3 characters long" }).optional(),
    videoUrl: z.string().optional(),
    thumbnailKey: z.string().optional(),
    
})

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;