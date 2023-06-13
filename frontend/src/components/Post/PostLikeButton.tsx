import { accessTokenState } from "@/recoil/user";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

interface IProps {
  isLiked: boolean;
}

export default function PostLikeButton({ isLiked }: IProps) {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [like, setLike] = useState(isLiked);
  const router = useRouter();
  const likeCancleOnClick = async () => {
    try {
      await axios
        .delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${router.query.id}/like`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            alert("좋아요 취소!");
            setLike(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const likeOnClick = async () => {
    if (accessToken) {
      try {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${router.query.id}/like`,
            {
              id: router.query.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status === 201) {
              alert("좋아요!");
              setLike(true);
            }
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("로그인 후 이용 가능합니다!");
    }
  };

  return (
    <Container>
      {like ? (
        <LikedBtn onClick={likeCancleOnClick}>좋아요!</LikedBtn>
      ) : (
        <LikeBtn onClick={likeOnClick}>좋아요!</LikeBtn>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LikedBtn = styled.button`
  background-color: black;
  color: white;
`;

const LikeBtn = styled(LikedBtn)`
  background-color: white;
  color: black;
`;
