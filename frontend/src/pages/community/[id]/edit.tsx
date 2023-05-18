import axios from "axios";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import styled from "styled-components";

const PostEditor = dynamic(
  () => import("../../../components/Post/PostModifyEditor"),
  {
    ssr: false,
  }
);

interface ICategory {
  id: number;
  name: string;
}

interface IUser {
  nickname: string;
  experience: number;
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

export default function edit(data: IPostData) {
  const ref = useRef<any>(null);
  return (
    <Container>
      <PostEditor title={data.title} content={data.content} editorRef={ref} />
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const postRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${context.params.id}`
    );
    const postData = postRes.data;
    return {
      props: postData,
    };
  } catch (error) {
    return { props: { data: null } };
  }
}

const Container = styled.div``;
