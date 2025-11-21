import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getMyCourses } from "@/feautres/courses/courseService";
import { Link } from "react-router-dom";
import { AdminCourseCard } from "../components/AdminCourseCard";
import type { Course } from "@/types/courseType";

export const CoursePage = () => {
  
  const [courses, setCourses] =useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await getMyCourses();
      console.log(res);
      setCourses(res.data || []); 
    };
    fetchCourses();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} to="/admin/courses/create">
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
        {courses.length === 0 ? (
          <p>No courses found</p>
        ) : (
          courses.map((course) => (
             <AdminCourseCard data={course}/>
          ))
        )}
      </div>
    </>
  );
};
