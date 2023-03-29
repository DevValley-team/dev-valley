import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import TopNavDrawer from "./Modal/TopNavDrawer";

export default function TopNav() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <Container>
      <Link href="/">
        <Title>DevValley</Title>
      </Link>
      <SvgContainer onClick={() => setModalIsOpen(true)}>
        <svg
          width="40"
          height="40"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke={"#635985"}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          ></path>
        </svg>
      </SvgContainer>

      <TopNavDrawer isOpen={modalIsOpen} isClose={setModalIsOpen} />
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid ${(props) => props.theme.borderBottomColor};
  height: 60px;
  padding-left: 20px;
  padding-right: 20px;
`;

const Title = styled.span`
  color: white;
  font-weight: bold;
  font-size: 1.7rem;
  cursor: pointer;
`;

const SvgContainer = styled.div`
  padding: 3px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.btnHoverColor};
  }
`;
