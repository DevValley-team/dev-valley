import { authState } from "@/recoil";
import axios from "axios";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
interface ILoginData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useRecoilState(authState);
  const [loginFailed, setLoginFailed] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginData>();

  const onVaild = async (data: ILoginData) => {
    try {
      const res = await axios.post(
        "/api/auth/login",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setAccessToken(res.data.accessToken);
        router.push("/", undefined, { shallow: true });
      }
    } catch (e) {
      setLoginFailed("아이디, 비밀번호를 확인해주세요.");
    }
  };

  return (
    <LoginFormContainer onSubmit={handleSubmit(onVaild)}>
      <LoginLabel>
        이메일 <ErrMsg>{errors?.email?.message}</ErrMsg>
      </LoginLabel>
      <Input
        {...register("email", {
          required: "* 입력",
        })}
        type="email"
      />
      <LoginLabel>
        비밀번호 <ErrMsg>{errors?.password?.message}</ErrMsg>
      </LoginLabel>
      <Input
        {...register("password", {
          required: "* 입력",
        })}
        type="password"
      />
      <EmailLoginBtn type="submit">로그인</EmailLoginBtn>
      <LoginMsgWrapper>
        <ErrMsg>{loginFailed}</ErrMsg>
      </LoginMsgWrapper>
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

const ErrMsg = styled.span`
  color: red;
`;

const LoginMsgWrapper = styled.div`
  text-align: center;
  padding-top: 20px;
`;
