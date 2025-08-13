import React, { createContext, useContext, useMemo, useState } from "react";
import { userInfoType } from "../utils/types";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");
type UserContextType = {
  user: userInfoType;
  setUser: (user: userInfoType) => void;
};

const userDefault = {
  avatar: "",
  birthday: "",
  coverBackground: "",
  email: "",
  password: "",
  phone: "",
  pushNotification: true,
  shake: true,
  username: "",
};

const UserContext = createContext<UserContextType>({
  user: userDefault,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<userInfoType>(userDefault);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

export default UserContext;
