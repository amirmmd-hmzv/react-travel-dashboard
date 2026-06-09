import { createContext, useContext, useState, type ReactNode } from "react";

interface UserContextValue {
  user: Record<string, any> | null;
  setUser: (user: Record<string, any> | null) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

export function UserProvider({
  children,
  user: initialUser,
}: {
  children: ReactNode;
  user: Record<string, any> | null;
}) {
  const [user, setUser] = useState(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
