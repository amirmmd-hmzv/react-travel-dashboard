import { createContext, useContext, type ReactNode } from "react";

const UserContext = createContext<Record<string, any> | null>(null);

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: Record<string, any> | null;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
