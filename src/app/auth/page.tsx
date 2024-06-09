"use client";
import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import { useToggle } from "@mantine/hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

const Register = () => {
  const [type, toggle] = useToggle(["login", "register"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    return async () => {
      try {
        console.log("Register");

        const url = `${API_BASE_URL}/register`;
        const method = "POST";
        const headers = { "Content-Type": "application/json" };

        const response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          console.log("Registration successful!");
          const res = await response.json();
          console.log("Response:", res);

          localStorage.setItem("jwt", res.accessToken);
          router.push("/home");
        } else {
          console.error("Error registering:", await response.text());
        }
      } catch (error) {
        console.error("Error registering:", error);
      }
    };
  };

  const handleLogin = () => {
    return async () => {
      try {
        console.log("Login");

        const url = `${API_BASE_URL}/login`;
        const method = "POST";
        const headers = { "Content-Type": "application/json" };

        const response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          console.log("Login successful!");
          const res = await response.json();
          console.log("Response:", res);

          localStorage.setItem("jwt", res.data.accessToken);
          router.push("/home");
        } else {
          console.error("Error logging in:", await response.text());
        }
      } catch (error) {
        console.error("Error logging in:", error);
      }
    };
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {type === "register"
          ? "Already have an account? "
          : "Don't have an account? "}
        <Anchor size="sm" component="button" onClick={() => toggle()}>
          {type === "register" ? " Login" : " Register"}
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          onChange={(event) => setEmail(event.currentTarget.value)}
          required
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
          mt="md"
        />

        {type === "register" && (
          <PasswordInput
            label="Repeat password"
            placeholder="Repeat your password"
            onChange={(event) => setRepeatPassword(event.currentTarget.value)}
            required
            mt="md"
          />
        )}

        <Group justify="space-between" mt="lg">
          {type === "login" && (
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          )}
        </Group>

        {type === "register" && (
          <Button fullWidth mt="xl" onClick={handleRegister()}>
            Register
          </Button>
        )}
        {type === "login" && (
          <Button fullWidth mt="xl" onClick={handleLogin()}>
            Login
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default Register;
