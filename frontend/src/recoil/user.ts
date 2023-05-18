import { atom } from "recoil";

interface IUserInfo {
  id: number;
  email: String;
  nickname: String;
  experience: number;
  role: String;
  lastLoginAt: String;
  createdAt: String;
  updatedAt: String;
}

export const accessTokenState = atom({
  key: "accessTokenState",
  default: null,
});

export const userInfoState = atom<IUserInfo>({
  key: "userInfoState",
  default: {
    id: 0,
    email: "",
    nickname: "",
    experience: 0,
    role: "",
    lastLoginAt: "",
    createdAt: "",
    updatedAt: "",
  },
});
