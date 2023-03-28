import Seo from "@/components/Seo";
import SignupForm from "@/components/SignupForm";
import TopNav from "@/components/TopNav";
import Link from "next/link";
import styled from "styled-components";

export default function register() {
  return (
    <Container>
      <Seo title="Register" />
      <Title>회원 가입</Title>
      <SubTitle>개발자들의 놀이터인 DevValley에 오신것을 환영합니다.</SubTitle>
      <SignupForm />
      <SubTitle>
        이미 회원이신가요?　
        <Link href="/login">
          <LoginText>로그인</LoginText>
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

const LoginText = styled.span`
  text-decoration: underline;
  color: ${(props) => props.theme.textColor};
`;
