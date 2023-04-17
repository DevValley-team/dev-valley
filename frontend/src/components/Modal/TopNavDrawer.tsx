import { useEffect, useState } from "react";
import Modal from "react-modal";
import { darkTheme } from "@/styles/theme";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

interface IModalProp {
  isOpen: boolean;
  isClose: (value: boolean) => void;
}

export default function TopNavDrawer({ isOpen, isClose }: IModalProp) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen === true) {
      setModalIsOpen(true);
    }
  }, [isOpen]);

  function closeModal() {
    setModalIsOpen(false);
    isClose(false);
  }

  function loginOnClick() {
    setModalIsOpen(false);
    isClose(false);
    router.push("/login");
  }

  function registerOnClick() {
    setModalIsOpen(false);
    isClose(false);
    router.push("/register");
  }

  function communityOnClick() {
    setModalIsOpen(false);
    isClose(false);
    router.push("/community");
  }

  function homeOnClick() {
    setModalIsOpen(false);
    isClose(false);
    router.push("/");
  }

  return (
    <Modal
      ariaHideApp={false}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={{
        overlay: {
          backgroundColor: darkTheme.modalBackgroundColor,
        },
        content: {
          backgroundColor: darkTheme.backgroundColor,
          border: "none",
          borderRadius: "20px",
          top: "10px",
          right: "10px",
          height: "500px",
        },
      }}
    >
      <ModalContainer>
        <TitleContainer>
          <Title onClick={homeOnClick}>DevValley</Title>
          <CloseBtn onClick={closeModal}>✕</CloseBtn>
        </TitleContainer>
        <ContentContainer>
          <ContentItem>프로필</ContentItem>
          <ContentItem>공지사항</ContentItem>
          <ContentItem onClick={communityOnClick}>자유게시판</ContentItem>
          <ContentItem>질문게시판</ContentItem>
        </ContentContainer>
        <UserContainer>
          <UserItem onClick={loginOnClick}>로그인</UserItem>
          <UserItem onClick={registerOnClick}>회원가입</UserItem>
        </UserContainer>
      </ModalContainer>
    </Modal>
  );
}

export const ModalContainer = styled.div``;

const Title = styled.span`
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  font-size: 1.8rem;
  cursor: pointer;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const CloseBtn = styled.div`
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
  font-size: 1.7rem;
  padding: 3px 5px;
  border-radius: 5px;
  &:hover {
    background-color: ${(props) => props.theme.btnHoverColor};
  }
`;
const ContentContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(4, 50px);
  line-height: 50px;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${(props) => props.theme.borderBottomColor};
  margin-bottom: 30px;
`;

const ContentItem = styled.div`
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  font-size: 1.3rem;
  border-radius: 15px;
  padding-left: 10px;
  cursor: pointer;
  &:hover {
    transition: 0.4s;
    background-color: ${(props) => props.theme.btnHoverColor};
  }
`;

const UserContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 50px);
  line-height: 50px;
  gap: 20px;
`;

const UserItem = styled.div`
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  font-size: 1.3rem;
  border-radius: 15px;
  padding-left: 10px;
  cursor: pointer;
  &:hover {
    transition: 0.4s;
    background-color: ${(props) => props.theme.btnHoverColor};
  }
`;
