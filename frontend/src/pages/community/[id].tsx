import CommentArea from "@/components/Comment/CommentArea";
import PostUserProfile from "@/components/Post/PostUserProfile";
import axios from "axios";
import styled from "styled-components";
import { Content } from "../../components/Post/PostContentStyle";
import { useQuery } from "@tanstack/react-query";
interface ICategory {
  id: number;
  name: string;
}

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

interface ICommentData {
  results: IComment[];
  page: number;
  limit: number;
  totalPages: number;
}

interface IPostData {
  id: number;
  title: string;
  content: string;
  category: ICategory;
  user: IUser;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  isAuthor: boolean;
}

interface IPropsData {
  commentData: ICommentData;
  postData: IPostData;
}

export default function CommunityPost(data: IPropsData) {
  const { data: commentData, isLoading } = useQuery<ICommentData>(
    ["comments", data.postData.id],
    async () => {
      const commentRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments?postId=${data.postData.id}`
      );
      return commentRes.data;
    },
    { initialData: data.commentData }
  );
  return (
    <Container>
      <PostUserProfile
        data={{
          nickname: data.postData.user.nickname,
          experience: data.postData.user.experience,
          createdAt: data.postData.createdAt,
          updatedAt: data.postData.updatedAt,
          viewCount: data.postData.viewCount,
        }}
      />
      <Title>{data.postData.title}</Title>

      <Content
        dangerouslySetInnerHTML={{ __html: data.postData.content }}
      ></Content>
      <CommentArea commentData={commentData} />
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  try {
    // id에 해당하는 게시글의 내용
    const postRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${context.params.id}`
    );
    const postData = postRes.data;

    // id에 해당하는 댓글의 내용
    const commentRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments?postId=${context.params.id}`
    );
    const commentData = commentRes.data;

    return {
      props: { commentData, postData },
    };
  } catch (error) {
    return { props: { data: null } };
  }
}

const Container = styled.div`
  padding: 0px 20px;
`;

const Title = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 30px;
`;
