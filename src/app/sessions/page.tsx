"use client";
import React, { useEffect, useState } from "react";
import { Session } from "../../../../client-common/src/models/Session";
import { Table } from "@mantine/core";
import Link from "next/link";
import useAuthJwt from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/config";

const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const jwt = useAuthJwt();
  useEffect(() => {
    if (!jwt) return;

    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/session`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setSessions(data);
    };

    console.log("Fetching sessions...");
    fetchData();
  }, [jwt]);

  return (
    <div>
      <h1>Sessions</h1>
      {sessions && sessions.length > 0 ? (
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Session Code</Table.Th>
              <Table.Th>Session</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Link</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sessions.map((session, index) => (
              <Table.Tr key={index}>
                <Table.Td>{session.sessionCode}</Table.Td>
                <Table.Td>{session.sessionName}</Table.Td>
                <Table.Td>{session.sessionDescription}</Table.Td>
                <Table.Td>
                  <Link href={`/session/${session.id}`}>Link</Link>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <p>Loading sessions...</p>
      )}
    </div>
  );
};

export default SessionsPage;
