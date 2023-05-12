import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import styled from "styled-components";

const PostEditor = dynamic(() => import("../../components/Post/PostEditor"), {
  ssr: false,
});

export default function write() {
  const [content, setContent] = useState("");
  const ref = useRef<any>(null);
  return (
    <Container>
      <PostEditor content={content} editorRef={ref} />
    </Container>
  );
}

const Container = styled.div``;
