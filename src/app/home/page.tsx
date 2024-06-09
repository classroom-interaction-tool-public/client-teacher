"use client";
import React, { use, useEffect, useState } from "react";
import {
  Button,
  Card,
  HoverCard,
  Paper,
  Text,
  Image,
  Grid,
  useMantineTheme,
  Group,
  Space,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import useAuthJwt from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/config";
import { Session } from "@/common/src/models/Session";

const HomePage: React.FC = () => {
  const router = useRouter();
  const jwt = useAuthJwt();
  const theme = useMantineTheme();
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!jwt) {
      console.log("No JWT found");
      return;
    }

    fetch(`${API_BASE_URL}/session?isActive=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setActiveSessions(data))
      .catch((error) => console.error(error));
  }, [jwt]);

  const handleButtonClick = async (type: string) => {
    if (!jwt) {
      console.log("No JWT found");
      return;
    }

    const sessionResponse = await fetch(`${API_BASE_URL}/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      // TODO: Remove allowAnonymous true for production
      body: JSON.stringify({
        allowAnonymous: true,
        startingQuestionType: type,
      }),
    });

    if (sessionResponse.ok) {
      const session = await sessionResponse.json();
      console.log("Session created:", session);
      router.push(`/session/${session._id}/create`);
    } else {
      console.error("Error creating session:", await sessionResponse.text());
    }
  };

  function handleSessionClick(sessionId: string) {
    router.push(`/session/${sessionId}`);
  }

  return (
    <>
      <div>
        <h1>Create Session</h1>
        <Group>
          <Button onClick={() => handleButtonClick("freeText")}>
            Free Text
          </Button>
          <Button onClick={() => handleButtonClick("multipleChoice")}>
            Multiple Choice
          </Button>
        </Group>
      </div>
      <div>
        <Space h="xl" />
        <h1>Ongiong Sessions</h1>
        <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
          {activeSessions.length > 0 ? (
            activeSessions.map((session) => (
              <Grid.Col span={3} key={session.id}>
                <Card
                  bg="black"
                  key={session.id}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.1s, box-shadow 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = theme.shadows.sm;
                  }}
                  onClick={() => handleSessionClick(session.id)}
                >
                  <Text c="white" fw={500}>
                    {session.sessionCode}
                  </Text>
                </Card>
              </Grid.Col>
            ))
          ) : (
            <p>No active sessions found.</p>
          )}
        </Grid>
      </div>
    </>
  );
};

export default HomePage;
