"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button } from "@mantine/core";
import { Course } from "@/common/src/models/Course";

interface CreateCoursePageProps {
  onSubmit: (values: Course) => void;
}

const CreateCoursePage: React.FC<CreateCoursePageProps> = ({ onSubmit }) => {
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
    },
  });

  const handleSubmit = form.onSubmit((values: Course) => onSubmit(values));

  return (
    <div>
      <h1>Create Course</h1>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Course Title"
          placeholder="Course Title"
          {...form.getInputProps("title")}
          required
        />
        <TextInput
          label="Course Description"
          placeholder="Course Description"
          {...form.getInputProps("description")}
          required
        />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default CreateCoursePage;
