import { useRouter } from "next/router";
import styled from "styled-components";

interface IPropInfo {
  postInfo: IPostInfo;
}

interface IPostInfo {
  id: number;
  title: string;
  likeCount: number;
  createdAt: string;
  viewCount: number;
  user: IUserInfo;
}

interface IUserInfo {
  nickname: string;
  experience: number;
}

interface IPostClickInfo {
  id: number;
}

export default function CommunityPosts({ postInfo }: IPropInfo) {
  const router = useRouter();

  function postOnClick({ id }: IPostClickInfo) {
    router.push(`/community/${id}`);
  }

  return (
    <PostContainer>
      <WriterContainer>
        {postInfo.user.nickname} · LV.{postInfo.user.experience} ·
        {postInfo.createdAt}
      </WriterContainer>
      <Title onClick={() => postOnClick({ id: postInfo.id })}>
        {postInfo.title}
      </Title>
      <SummaryContainer>
        Views: {postInfo.viewCount} · Likes:
        {postInfo.likeCount}
      </SummaryContainer>
    </PostContainer>
  );
}

const PostContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 30px);
  height: 90px;
  color: ${(props) => props.theme.textColor};
  border-bottom: 1px solid ${(props) => props.theme.textColor};
  align-items: center;
  padding: 0px 10px;
  font-size: 1.1rem;
`;

const Title = styled.h1`
  cursor: pointer;
`;

const WriterContainer = styled.div`
  font-size: 0.8rem;
`;
const SummaryContainer = styled.div`
  font-size: 0.8rem;
  text-align: right;
`;
