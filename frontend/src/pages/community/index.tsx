import CommunityPosts from "@/components/Post/CommunityPosts";
import styled from "styled-components";
import { useRouter } from "next/router";
import Seo from "@/components/Seo";
import axios from "axios";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "@/recoil";

interface IResult {
  id: number;
  title: string;
  user: {
    nickname: string;
    experience: number;
  };
  viewCount: number;
  likeCount: number;
  createdAt: string;
}

interface IData {
  limit: number;
  page: number;
  results: IResult[];
  totalPages: number;
}

interface IPropsData {
  data: IData | null;
}

export default function community({ data }: IPropsData) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();
  const [isLogin, setIsLogin] = useRecoilState(authState);

  const handlePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
    router.push({
      pathname: "/community",
      query: { page: newPage },
    });
  };

  // 새로 고침 시 page number가 1이 되는 오류 해결
  useEffect(() => {
    const queryString = window.location.search; // "?page=2"
    const searchParams = new URLSearchParams(queryString.slice(1)); // {page: "2"}
    const page = searchParams.get("page"); // "2"
    if (page === null) {
      setCurrentPage(1);
    } else {
      setCurrentPage(parseInt(page));
    }
  }, []);

  const handleWrite = () => {
    if (isLogin) {
      router.push("/community/write");
    } else {
      alert("로그인 후 이용해주세요");
      router.push("/login");
    }
  };

  return (
    <Container>
      <Seo title="Community" />
      <TopBanner>자유게시판</TopBanner>
      <WriteSearchContainer>
        <WriteBtnContainer>
          <WriteBtn onClick={handleWrite}>글쓰기</WriteBtn>
        </WriteBtnContainer>
        <SearchContainer>
          <SearchInput type="text" placeholder="자유게시판 내 게시글 조회" />
          <SearchBtn>검색</SearchBtn>
        </SearchContainer>
      </WriteSearchContainer>
      <PostContainer>
        {data?.results.map((post) => {
          return <CommunityPosts key={post.id} postInfo={post} />;
        })}
      </PostContainer>
      <Pagination
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
        count={data?.totalPages}
        page={currentPage}
        onChange={handlePage}
      />
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const page = !context.query.page ? "1" : context.query.page;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?categoryName=자유게시판&page=${page}&limit=10`
    );
    const data = res.data;
    return {
      props: { data },
    };
  } catch (error) {
    return { props: { data: null } };
  }
}

const Container = styled.div`
  padding: 0px 10px;
`;

const TopBanner = styled.div`
  padding-left: 20px;
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 10px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.btnColor};
`;

const WriteBtnContainer = styled.div``;
const WriteBtn = styled.div`
  cursor: pointer;
  width: 70px;
  height: 40px;
  background-color: ${(props) => props.theme.btnColor};
  border-radius: 10px;
  text-align: center;
  line-height: 40px;
  color: ${(props) => props.theme.textColor};
  &:hover {
    background-color: ${(props) => props.theme.btnFocusColor};
    transition: 0.2s;
  }
`;

const SearchContainer = styled.div``;
const SearchBtn = styled(WriteBtn)`
  display: inline-block;
  margin-left: 20px;
`;

const WriteSearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
`;

const SearchInput = styled.input`
  width: 250px;
  height: 40px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.btnHoverColor};
  color: ${(props) => props.theme.textColor};
  font-family: "Noto Sans KR";
  &:focus {
    outline: none;
    transition: none;
    border-bottom: 1px solid ${(props) => props.theme.textColor};
  }
  ::placeholder {
    font-family: "Noto Sans KR";
    font-size: 1rem;
  }
`;

const PostContainer = styled.div`
  background-color: ${(props) => props.theme.inputColor};
  border-top: 1px solid ${(props) => props.theme.textColor};
`;
