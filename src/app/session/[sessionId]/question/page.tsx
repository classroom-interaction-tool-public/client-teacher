"use client";
import React from "react";

export default function AddQuestionPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div>
      <h1>Add Question</h1>
      <p>Session slug: {params.slug}</p>
    </div>
  );
}
