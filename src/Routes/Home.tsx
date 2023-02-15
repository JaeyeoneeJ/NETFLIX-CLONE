import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
} from "../api";
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
  background-position: center center;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 400;
  margin-bottom: 20px;
  @media screen and (max-width: 1180px) {
    font-size: 46px;
  }
`;
const Overview = styled.p`
  font-size: 24px;
  width: 50%;
  @media screen and (max-width: 1180px) {
    font-size: 20px;
    width: 80%;
  }
`;
const SliderWrapper = styled.div`
  top: -240px;
  margin: 0 60px;
  position: relative;
  /* height: auto;
  display: grid;
  gap: 40px;
  grid-template-columns: repeat(1, 1fr);
  overflow: hidden; */
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    "getMovies",
    getMovies
  );

  const { data: upComingData } = useQuery<IGetMoviesResult>(
    "getUpcomingMovies",
    getUpcomingMovies
  );
  const { data: topRateData } = useQuery<IGetMoviesResult>(
    "getTopRatedMovies",
    getTopRatedMovies
  );
  const { data: popularData } = useQuery<IGetMoviesResult>(
    "getPopularMovies",
    getPopularMovies
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            <Slider keyword="now_playing" data={data!}>
              {"Now Playing"}
            </Slider>
            <Slider keyword="top_rated" data={topRateData!}>
              {"Top Rated"}
            </Slider>
            <Slider keyword="popular" data={popularData!}>
              {"Popular"}
            </Slider>
            <Slider keyword="upcoming" data={upComingData!}>
              {"Upcoming"}
            </Slider>
          </SliderWrapper>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
