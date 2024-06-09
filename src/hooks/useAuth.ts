import { useState, useEffect } from "react";

function useAuthJwt() {
  const [authJwt, setAuthJwt] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setAuthJwt(token);
    } else {
      console.info("No Auth JWT found in local storage");
    }
  }, []);

  return authJwt;
}

export default useAuthJwt;
