import { ReactNode, createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type UserProviderProps = {
  children: ReactNode;
};

type UserItemType = {
  token: string;
  data: object;
};

type UserContextType = {
  userData: object;
};

const UserContext = createContext({} as UserContextType);

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }: UserProviderProps) {
  const [userData, setUserData] = useLocalStorage<UserItemType[]>("user", []);

  return (
    <UserContext.Provider
      value={{
        userData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
