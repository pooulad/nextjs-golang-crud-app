import { ReactNode, createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import configJson from "@/config.json";

type UserProviderProps = {
  children: ReactNode;
};

type UserItemType = {
  userData: {
    id: number,
    username: string,
    name: string,
    email: string,
    date: string,
    city: string,
    country: string
};
};

type UserContextType = {
  userData: {
      id: number,
      username: string,
      name: string,
      email: string,
      date: string,
      city: string,
      country: string
  };
};

const UserContext = createContext({} as UserContextType);

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }: UserProviderProps) {
  const [userData, setUserData] = useLocalStorage<UserItemType[]>("user", []);

  async function checkUserPermission() {
    if(userData.id)
    const res = await fetch(`${configJson.localApi}/api/user`);
    const users = await res.json();
  }
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
