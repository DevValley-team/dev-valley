import CommunityPosts from "@/components/CommunityPosts";
import styled from "styled-components";
import { useRouter } from "next/router";
import Seo from "@/components/Seo";
import axios from "axios";

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

const dummyData = [
  {
    id: 1,
    title: "html, css가 너무 어렵습니다..",
    nickname: "치킨과콜라",
    level: 3,
    date: "2023-03-29 15:00:00",
    views: 20,
    comments: 2,
    likes: 3,
  },
  {
    id: 2,
    title: "좋아하는것과 잘하고싶은건",
    nickname: "초록 새싹",
    level: 2,
    date: "2023-03-29 14:00:00",
    views: 20,
    comments: 1,
    likes: 4,
  },
];

export default function community({ data }: IPropsData) {
  console.log(data);
  const router = useRouter();
  return (
    <Container>
      <Seo title="Community" />
      <TopBanner>자유게시판</TopBanner>
      <WriteSearchContainer>
        <WriteBtnContainer>
          <WriteBtn onClick={() => router.push("/community/write")}>
            글쓰기
          </WriteBtn>
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
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?categoryId=1&page=1&limit=10`
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
