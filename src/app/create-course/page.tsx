"use client";
import CreateCoursePage from "@/components/CreateCoursePage";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/config";
import { Course } from "@/common/src/models/Course";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const authJwt = useAuth();

  const handleSubmit = async (newCourse: Course) => {
    if (!authJwt) {
      console.error("No JWT token found. Please log in.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authJwt}`,
      },
      body: JSON.stringify(newCourse),
    });
    const createdCourse = await response.json();

    console.log("Created course:", createdCourse);
    if (response.ok) {
      setCourses([...courses, createdCourse]);
    }
  };

  return (
    <div>
      <CreateCoursePage onSubmit={handleSubmit} />
      <h2>Created Courses:</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>{course.title}</li>
        ))}
      </ul>
    </div>
  );
}
