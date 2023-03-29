import { useRouter } from "next/router";
import { useState, FormEvent } from "react";
import styled from "styled-components";

interface ISingupData {
  email: string;
  password: string;
  nickname: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<ISingupData>({
    email: "",
    password: "",
    nickname: "",
  });
  const router = useRouter();

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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/login");
      } else {
        const { message } = await res.json();
        throw new Error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RegisterForm onSubmit={handleSubmit}>
      <RegisterLabel>이메일</RegisterLabel>
      <Input
        value={formData.email}
        name="email"
        type="email"
        placeholder="user@naver.com"
        onChange={handleChange}
      />
      <RegisterLabel>비밀번호</RegisterLabel>
      <Input
        value={formData.password}
        name="password"
        type="password"
        placeholder="최소 8자 이상"
        onChange={handleChange}
      />
      <RegisterLabel>닉네임</RegisterLabel>
      <Input
        value={formData.nickname}
        name="nickname"
        type="nickname"
        placeholder="10자 미만으로 입력해주세요"
        onChange={handleChange}
      />
      <EmailSingupBtn type="submit">이메일로 계속하기</EmailSingupBtn>
    </RegisterForm>
  );
}

const RegisterForm = styled.form`
  padding: 0px 10px;
  margin-bottom: 40px;
`;
const RegisterLabel = styled.label`
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

const EmailSingupBtn = styled.button`
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
