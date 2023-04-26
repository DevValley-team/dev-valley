import formattedDate from "@/utils/formattedDate";
import styled from "styled-components";

interface IPropsUserProfile {
  data: {
    nickname: string;
    experience: number;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
  };
}

export default function PostUserProfile(props: IPropsUserProfile) {
  const { data } = props;

  return (
    <Container>
      <Nickname>{data.nickname}</Nickname>
      <Info>
        ★{data.experience} · {formattedDate(data.createdAt)} · 조회수{" "}
        {data.viewCount}회{" "}
        {data.updatedAt == data.createdAt
          ? ""
          : `(수정됨, ${formattedDate(data.updatedAt)})`}
      </Info>
    </Container>
  );
}

const Container = styled.div``;
const Nickname = styled.h3`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;
const Info = styled.h4`
  color: white;
  font-size: 1.3rem;
`;
