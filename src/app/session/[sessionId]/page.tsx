"use client";
import React, { useEffect, useState } from "react";
import useAuthJwt from "@/hooks/useAuth";
import { PieChart, PieChartData } from "@/components/visualizations/PieChart";

import { API_BASE_URL, API_BASE_URL_THIRD_PARTY } from "@/lib/config";
import { QuestionCollection } from "@/common/src/models/QuestionColleciton";
import { Session } from "@/common/src/models/Session";

require("log-timestamp");

export default function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [questionCollection, setQuestionCollection] =
    useState<QuestionCollection | null>(null);
  const [chartData, setChartData] = useState<PieChartData[]>([]);
  const [questionNr, setQuestionNr] = useState<number>(0);
  const [values, setValues] = useState<any>({});
  const { sessionId } = params;
  const jwt = useAuthJwt();

  useEffect(() => {
    if (jwt && sessionId) {
      fetchSessionData(sessionId, jwt);
    } else {
      console.log("Missing JWT or session ID");
    }
  }, [jwt, sessionId]);

  useEffect(() => {
    if (session) {
      const qId = session.questionCollectionIds[questionNr];
      if (jwt) {
        fetchQuestionCollectionData(qId, jwt);
      }
    }
  }, [session, questionNr, jwt]);

  useEffect(() => {
    if (questionCollection) {
      console.log("Question collection:", questionCollection);
    }
  }, [questionCollection]);

  useEffect(() => {
    if (jwt && sessionId && questionCollection) {
      const qid = questionCollection.questionsIds[0];
      const cleanup = initiateSSEConnection(sessionId, qid, jwt);
      return cleanup;
    } else {
      console.log("Missing JWT, session ID, or question ID");
    }
  }, [jwt, sessionId, questionCollection]);

  const fetchSessionData = async (sessionId: string, jwt: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching session: ${response.statusText}`);
      }

      const data: Session = await response.json();
      setSession(data);
    } catch (error) {
      console.error("Failed to fetch session data:", error);
    }
  };

  const fetchQuestionCollectionData = async (
    questionCollectionId: string,
    jwt: string
  ) => {
    try {
      console.log(
        "Fetching question collection data for question:",
        questionNr
      );
      const response = await fetch(
        `${API_BASE_URL}/session/${sessionId}/question-collection/${questionCollectionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching question collection: ${response.statusText}`
        );
      }

      const data = await response.json();
      const questionCollectionData: QuestionCollection = {
        id: data._id,
        sessionId: data.sessionId,
        questionsIds: data.questionsIds,
        title: data.title,
        description: data.description,
      };

      setQuestionCollection(questionCollectionData);
    } catch (error) {
      console.error("Failed to fetch question collection data:", error);
    }
  };

  const initiateSSEConnection = (
    sessionId: string,
    questionId: string,
    jwt: string
  ) => {
    const url = new URL(
      `${API_BASE_URL_THIRD_PARTY}/session/${sessionId}/question/${questionId}/answers/events`
    );
    console.log("Connecting to SSE with URL:", url.toString());

    const eventSource = new EventSource(url.toString());

    eventSource.onmessage = (event) => {
      console.log("Received SSE event:", JSON.parse(event.data));
      const eventData = JSON.parse(event.data);
      updateChartData(eventData);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  };

  const updateChartData = (eventData: any) => {
    console.log("Updating chart data:", eventData);
    if (!eventData.values) {
      console.log("No values in event data");
      return;
    }

    const values = eventData.values;
    console.log("Values:", values);
    const newData = Object.entries(values).map(([label, value]) => ({
      label: `${label} (${value})`,
      value: Number(value),
    }));

    setChartData(newData);
    console.log("New chart data:", newData);
  };

  return (
    <div>
      <h1>Session</h1>
      {session ? (
        <div>
          <h2>Session Code: {session.sessionCode}</h2>
        </div>
      ) : (
        <p>Loading session...</p>
      )}
      {chartData.length > 0 ? (
        <PieChart data={chartData} maxLegendItems={20} />
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}
