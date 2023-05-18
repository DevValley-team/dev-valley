import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import styled from "styled-components";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { authState } from "@/recoil";
import { useRouter } from "next/router";
interface Props {
  content: string;
  editorRef: React.MutableRefObject<any>;
}

const PostEditor = ({ content = "", editorRef }: Props) => {
  const [title, setTitle] = useState("");
  const [accessToken, setAccessToken] = useRecoilState(authState);
  const router = useRouter();

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
          {
            title: title,
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
          if (response.status === 201) {
            router.push("/community", undefined, { shallow: true });
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
      <Input value={title} onChange={titleOnChange} type="text" />
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
      <button onClick={handleConfirm}>확인</button>
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

export default PostEditor;
