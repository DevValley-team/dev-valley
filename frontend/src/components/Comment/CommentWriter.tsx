import styled from "styled-components";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { accessTokenState } from "@/recoil/user";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";

interface Props {
  editorRef: React.MutableRefObject<any>;
}

export default function CommentWriter({ editorRef }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["ul", "ol", "task"],
    ["link"],
    ["code"],
  ];

  const handleConfirm = async () => {
    const editorIns = editorRef.current.getInstance();
    const contentText = editorIns.getHTML();

    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
          {
            parentId: 0,
            content: contentText,
            postId: Number(router.query.id),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          queryClient.invalidateQueries(["comments"]);
          editorIns.setMarkdown(" ");
        });
    } catch (e) {
      alert(e);
    }
  };
  return (
    <Container>
      {accessToken ? (
        <>
          <Editor
            ref={editorRef}
            initialValue=" "
            initialEditType="wysiwyg"
            previewStyle="vertical"
            height="140px"
            theme={"dark"}
            toolbarItems={toolbarItems}
          />
          <button onClick={handleConfirm}>댓글 작성</button>
        </>
      ) : (
        <NoLoginContainer>
          댓글을 쓰려면{" "}
          <Link
            style={{
              marginLeft: "10px",
              marginRight: "5px",
              textDecoration: "underline",
            }}
            href="/login"
          >
            로그인
          </Link>{" "}
          이 필요해요.
        </NoLoginContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 180px;
`;

const NoLoginContainer = styled.div`
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.borderBottomColor};
  height: 130px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
`;
