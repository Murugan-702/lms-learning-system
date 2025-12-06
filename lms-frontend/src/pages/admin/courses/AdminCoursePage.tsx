import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "../components/AdminCourseCard";
import { EmptyState } from "@/components/general/EmptyState";
import { getMyCourses } from "@/feautres/courses/courseService";
import type { Course } from "@/types/courseType";
import { wrapPromise } from "@/utils/wrapResource";

function fetchCoursesResource() {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 8000)
  );

  const request = getMyCourses()
    .then((res) => res.data as Course[])
    .catch((err) => {
      console.error("Fetch failed:", err);
      throw err;
    });

  return wrapPromise(Promise.race([request, timeout]));
}

const courseResource = fetchCoursesResource();

export const AdminCoursePage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link className={buttonVariants()} to="/admin/courses/create">
          Create Course
        </Link>
      </div>

      <Suspense fallback={<AdminCourseSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
};

function RenderCourses() {
  const courses = courseResource.read();

  if (!courses || courses?.length === 0) {
    return (
      <EmptyState
        title="No Courses Found"
        description="Create a new course to get started"
        buttonText="Create Course"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {courses.map((course: Course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function AdminCourseSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
