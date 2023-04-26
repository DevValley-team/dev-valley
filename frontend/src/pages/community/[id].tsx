import PostUserProfile from "@/components/Post/PostUserProfile";
import axios from "axios";
import styled from "styled-components";

interface ICategory {
  id: number;
  name: string;
}

interface IUser {
  nickname: string;
  experience: number;
}

interface IPropsData {
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

export default function CommunityPost(data: IPropsData) {
  return (
    <>
      <PostUserProfile
        data={{
          nickname: data.user.nickname,
          experience: data.user.experience,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          viewCount: data.viewCount,
        }}
      />
      <Title>{data.title}</Title>
      <Content>{data.content}</Content>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${context.params.id}`
    );
    const data = res.data;
    return {
      props: data,
    };
  } catch (error) {
    return { props: { data: null } };
  }
}

const Title = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const Content = styled.div`
  color: white;
  font-size: 1.2rem;
  line-height: 2rem;
`;
