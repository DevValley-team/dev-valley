import formattedDate from "@/utils/formattedDate";
import styled from "styled-components";
import { useRef } from "react";
import dynamic from "next/dynamic";

const CommentWriter = dynamic(() => import("./CommentWriter"), {
  ssr: false,
});

interface IUser {
  nickname: string;
  experience: number;
}

interface IComment {
  id: number;
  content: string;
  user: IUser;
  isBlinded: boolean;
  createdAt: string;
  updatedAt: string;
  children: IComment[];
}

interface IPropsData {
  results: IComment[];
  page: number;
  limit: number;
  totalPages: number;
}

export default function CommentArea({
  commentData,
}: {
  commentData: IPropsData;
}) {
  const ref = useRef<any>(null);
  return (
    <Container>
      <InfoText>총 {commentData.results.length}개의 댓글이 있습니다.</InfoText>
      <CommentWriter editorRef={ref} />
      {commentData.results?.map((comment) => {
        return (
          <Comment key={comment.id}>
            <Nickname>{comment.user.nickname}</Nickname>
            <Info>
              ★{comment.user.experience} · {formattedDate(comment.createdAt)}
              {comment.createdAt === comment.updatedAt
                ? ""
                : `(수정됨, ${formattedDate(comment.updatedAt)})`}
            </Info>
            <CommentContent>{comment.content}</CommentContent>
          </Comment>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  margin-top: 30px;
  border-top: 1px solid ${(props) => props.theme.textColor};
  padding-top: 30px;
`;

const InfoText = styled.h3`
  color: ${(props) => props.theme.textColor};
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const Comment = styled.div`
  margin-bottom: 30px;
`;
const Nickname = styled.h3`
  color: ${(props) => props.theme.textColor};
  font-size: 1.3rem;
  font-weight: bold;
`;

const Info = styled.h4`
  color: ${(props) => props.theme.textColor};
  font-size: 1.3rem;
  margin-bottom: 20px;
`;

const CommentContent = styled.h4`
  color: white;
  font-size: 1.3rem;
`;
