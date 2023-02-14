import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import Slider from "../Components/Slider";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
  height: 200vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  @media screen and (max-width: 800px) {
    height: auto;
  }
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 400;
  margin-bottom: 20px;
  @media screen and (max-width: 800px) {
    font-size: 46px;
  }
`;
const Overview = styled.p`
  font-size: 24px;
  width: 50%;
  @media screen and (max-width: 800px) {
    font-size: 20px;
  }
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            // onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider data={data!} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
