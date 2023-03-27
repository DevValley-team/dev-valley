import Link from "next/link";
import styled from "styled-components";

export default function TopNav() {
  return (
    <Container>
      <Link href="/">
        <Title>DevValley</Title>
      </Link>
    </Container>
  );
}

const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid #a39f9f97;
  height: 60px;
  padding-left: 20px;
`;

const Title = styled.h1`
  color: white;
  font-weight: bold;
  font-size: 1.7rem;
  line-height: 60px;
  cursor: pointer;
`;
