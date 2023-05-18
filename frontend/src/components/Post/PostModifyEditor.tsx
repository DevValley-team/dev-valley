import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { accessTokenState } from "@/recoil/user";
import { useRouter } from "next/router";

interface Props {
  title: string;
  content: string;
  editorRef: React.MutableRefObject<any>;
}

const PostModifyEditor = ({ title, content, editorRef }: Props) => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [postTitle, setTitle] = useState(title);
  const router = useRouter();

  useEffect(() => {
    editorRef.current?.getInstance().setHTML(content);
  }, []);

  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["ul", "ol", "task"],
    ["link"],
    ["code"],
  ];

  const handleModify = async () => {
    const editorIns = editorRef.current.getInstance();
    const contentText = editorIns.getHTML();
    try {
      await axios
        .patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${router.query.id}`,
          {
            title: postTitle,
            content: contentText,
            categoryName: "자유게시판",
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            router.back();
          }
        });
    } catch (e) {
      alert(e);
    }
  };

  const titleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTitle(value);
  };

  return (
    <Container>
      <Label>제목</Label>
      <Input value={postTitle} onChange={titleOnChange} type="text" />
      <Label>본문</Label>
      <EditorWrapper>
        {editorRef && (
          <Editor
            ref={editorRef}
            initialValue=" "
            initialEditType="markdown"
            previewStyle="vertical"
            height="300px"
            theme={"dark"}
            toolbarItems={toolbarItems}
          />
        )}
      </EditorWrapper>
      <button onClick={handleModify}>수정</button>
      <button onClick={() => router.back()}>취소</button>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 10px;
  .toastui-editor-defualtUI.ProseMirror {
    color: #fff;
  }
`;

const Label = styled.label`
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
  background-color: #232428;
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

const EditorWrapper = styled.div`
  margin-top: 10px;
`;

export default PostModifyEditor;
