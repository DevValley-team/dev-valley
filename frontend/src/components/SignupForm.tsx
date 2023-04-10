import styled from "styled-components";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import WarningAlert from "./Alert/InformTimerAlert";

interface ISingupData {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

export default function SignupForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<ISingupData>();
  const router = useRouter();

  const onVaild = async (data: ISingupData) => {
    if (data.password !== data.passwordConfirm) {
      setError(
        "passwordConfirm",
        { message: "* 비밀번호가 일치하지 않음" },
        {
          shouldFocus: true,
        }
      );
    } else {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          email: data.email,
          password: data.password,
          nickname: data.nickname,
        }
      );
      if (res.status === 201) {
        WarningAlert("로그인 화면으로 이동합니다.", 2000);
        setInterval(() => {
          router.push("/login");
        }, 2000);
      }
    }
  };

  return (
    <RegisterForm onSubmit={handleSubmit(onVaild)}>
      <RegisterLabel>
        이메일 <ErrMsg>{errors?.email?.message}</ErrMsg>
      </RegisterLabel>
      <Input
        {...register("email", {
          required: "* 필수 입력",
        })}
        type="email"
        placeholder="user@email.com"
      />
      <RegisterLabel>
        비밀번호 <ErrMsg>{errors?.password?.message}</ErrMsg>
      </RegisterLabel>
      <Input
        {...register("password", {
          required: "* 필수 입력",
          minLength: {
            value: 8,
            message: "* 8자 이상",
          },
          maxLength: {
            value: 32,
            message: "* 32자 이하",
          },
        })}
        type="password"
        placeholder="최소 8자 이상 최대 32자 이하"
      />
      <RegisterLabel>
        비밀번호 확인 <ErrMsg>{errors?.passwordConfirm?.message}</ErrMsg>
      </RegisterLabel>
      <Input
        {...register("passwordConfirm", {
          required: "* 필수 입력",
          minLength: {
            value: 8,
            message: "* 8자 이상",
          },
          maxLength: {
            value: 32,
            message: "* 32자 이하",
          },
        })}
        type="password"
        placeholder="비밀번호를 한번 더 입력해주세요"
      />
      <RegisterLabel>
        닉네임<ErrMsg>{errors?.nickname?.message}</ErrMsg>
      </RegisterLabel>
      <Input
        {...register("nickname", {
          required: "* 필수 입력",
          minLength: {
            value: 3,
            message: "* 3자 이상",
          },
          maxLength: {
            value: 8,
            message: "* 8자 이하",
          },
        })}
        type="text"
        placeholder="최소 3자 이상 최대 8자 이하"
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

const ErrMsg = styled.span`
  color: red;
`;
