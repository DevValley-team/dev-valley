import LoginForm from "@/components/Form/LoginForm";
import Seo from "@/components/Seo";
import Link from "next/link";
import styled from "styled-components";

export default function Login() {
  return (
    <Container>
      <Seo title="Login" />
      <Title>로그인</Title>
      <SubTitle>개발자들의 놀이터인 DevValley에 오신것을 환영합니다.</SubTitle>
      <LoginForm />
      <SubTitle>
        회원이 아니신가요?　
        <Link href="/register">
          <SignupText>가입하기</SignupText>
        </Link>
      </SubTitle>
    </Container>
  );
}

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: ${(props) => props.theme.textColor};
  font-size: 2rem;
  padding-top: 30px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const SubTitle = styled.h1`
  color: ${(props) => props.theme.textColor};
  text-align: center;
  margin-bottom: 50px;
`;

const SignupText = styled.span`
  text-decoration: underline;
  color: ${(props) => props.theme.textColor};
`;
