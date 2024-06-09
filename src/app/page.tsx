"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router) return;

    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      console.log("Going to home as the user is logged in");
      router.push(`/home`);
    } else {
      console.log("Going to login as the user is not logged in");
      router.push(`/auth`);
    }
  }, [router]);

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center"></div>
  );
};

export default Home;
