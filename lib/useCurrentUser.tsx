import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getUser } from "lib/appwrite/auth";

const UserContext = createContext<Record<string, any> | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    let active = true;
    getUser()
      .then((result) => { if (active && result && typeof result === "object" && "name" in result) setUser(result); })
      .catch(() => { if (active) setUser(null); });
    return () => { active = false; };
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
