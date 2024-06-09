"use client";
import React, { useEffect, useState } from "react";
import { Button, TextInput } from "@mantine/core";
import useAuthJwt from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { Session } from "@/common/src/models/Session";
import { Question } from "@/common/src/models/Question";

export default function SessionPge({
  params,
}: {
  params: { sessionId: string };
}) {
  const [session, setSession] = useState<Session>();
  const [question, setQuestion] = useState<Question>();
  const { sessionId } = params;
  const jwt = useAuthJwt();
  const router = useRouter();

  function startSession() {
    console.log("Starting session...");

    if (!sessionId) {
      console.log("No session ID found");
      return;
    }

    if (!jwt) {
      console.log("No JWT found");
      return;
    }

    if (!session) {
      console.log("No session found");
      return;
    }

    fetch(`${API_BASE_URL}/session/${sessionId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ session, question }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then((data) => router.push(`/session/${sessionId}`))
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    if (!jwt) {
      console.log("No JWT found");
      return;
    }

    if (!sessionId) {
      console.log("No session ID found");
      return;
    }

    console.log("Fetching session...");
    console.log(`Session ID: ${sessionId}`);
    console.log(`JWT: ${jwt}`);

    const fetchData = async () => {
      if (!sessionId) {
        console.log("No session ID found");
        return;
      }

      if (!jwt) {
        console.log("No JWT found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setSession(data);
    };

    console.log("Fetching sessions...");
    fetchData();
  }, [jwt, sessionId]);

  return (
    <div>
      <h1>Session</h1>
      {session ? (
        <div>
          <h2>Session Code: {session.sessionCode}</h2>
          <TextInput
            label="Question Title (Optional)"
            defaultValue=""
            onChange={(event) =>
              setQuestion({ ...question, title: event.currentTarget.value })
            }
          ></TextInput>

          <TextInput
            label="Question Description (Optional)"
            defaultValue=""
            onChange={(event) =>
              setQuestion({
                ...question,
                description: event?.currentTarget.value,
              })
            }
          ></TextInput>

          <Button
            onClick={() => {
              setSession({ ...session, isActive: true });
              startSession();
            }}
          >
            Start Session
          </Button>
        </div>
      ) : (
        <p>Loading session...</p>
      )}
    </div>
  );
}
