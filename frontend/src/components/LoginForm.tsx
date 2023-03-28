import Router from "next/router";
import { FormEvent, useState } from "react";
import styled from "styled-components";

interface ILoginData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<ILoginData>({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        Router.push("/");
      } else {
        const { message } = await res.json();
        throw new Error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LoginFormContainer onSubmit={handleSubmit}>
      <LoginLabel>이메일</LoginLabel>
      <Input
        value={formData.email}
        name="email"
        type="email"
        placeholder="user@naver.com"
        onChange={handleChange}
      />
      <LoginLabel>비밀번호</LoginLabel>
      <Input
        value={formData.password}
        name="password"
        type="password"
        placeholder="8자 이상"
        onChange={handleChange}
      />
      <EmailLoginBtn type="submit">로그인</EmailLoginBtn>
    </LoginFormContainer>
  );
}

const LoginFormContainer = styled.form`
  padding: 0px 10px;
  margin-bottom: 40px;
`;
const LoginLabel = styled.label`
  color: ${(props) => props.theme.textColor};
`;
const Input = styled.input`
  color: ${(props) => props.theme.textColor};
  padding-left: 20px;
  font-size: 1.2rem;
  width: 435px;
  height: 40px;
  margin-top: 10px;
  margin-bottom: 20px;
  display: block;
  background-color: ${(props) => props.theme.inputColor};
  border: none;
  border-radius: 10px;
  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.inputFocusColor};
    transition: none;
  }
  ::placeholder {
    font-family: "Noto Sans KR";
    font-size: 1rem;
  }
`;

const EmailLoginBtn = styled.button`
  font-family: "Noto Sans KR";
  font-size: 1rem;
  border: none;
  width: 460px;
  background-color: ${(props) => props.theme.btnColor};
  height: 50px;
  border-radius: 10px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.btnFocusColor};
    transition: 0.2s;
  }
`;
