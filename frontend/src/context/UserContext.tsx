import { ReactNode, createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import configJson from "@/config.json";
import { useRouter } from "next/router";

type UserProviderProps = {
  children: ReactNode;
};

type apiDataType = {
  id: number;
  username: string;
  name: string;
  email: string;
  date: string;
  city: string;
  country: string;
};

type UserContextType = {
  data: apiDataType;
  token: string;
};

const UserContext = createContext({} as UserContextType);

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }: UserProviderProps) {
  const [userData, setUserData] = useLocalStorage<UserContextType>("user");
  const router = useRouter();
  async function checkUserPermission() {
    if (userData.data.id && userData.token) {
      const res = await fetch(
        `${configJson.localApi}/api/user/${userData.data.id}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      const user = await res.json();
      if (user.id) {
        setUserData({
          data: user,
          token: userData.token,
        });
      }
      console.log(user);
    } else {
      router.push("/login");
    }
  }
  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}
