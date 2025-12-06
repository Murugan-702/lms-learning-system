import { getAllCourses } from "@/feautres/courses/courseService";
import { Suspense, useState } from "react";
import { PublicCourseCard, PublicCourseCardSkeleton } from "./components/PublicCourseCard";
import { wrapPromise } from "@/utils/wrapResource";




export default function PublicCoursesRoute() {
  const [courseResource] = useState(() => wrapPromise(getAllCourses()));


  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals.
        </p>
      </div>

  
      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses resource={courseResource} />
      </Suspense>
    </div>
  );
}


function RenderCourses({ resource }: { resource: { read: () => any } }) {
  const courses = resource.read().data;
  

  if (!courses || courses.length === 0) {
    return <p className="text-center text-muted-foreground">No courses found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: any) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}


function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
