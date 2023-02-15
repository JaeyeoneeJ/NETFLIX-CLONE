import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getAiringTodayTvs,
  getOnTheAirTvs,
  getPopularTvs,
  getTopRatedTvs,
  IGetTvsResult,
} from "../api";
import SliderTv from "../Components/SliderTv";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
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

function Tv() {
  const { data, isLoading } = useQuery<IGetTvsResult>(
    "getAiringTodayTvs",
    getAiringTodayTvs
  );
  const { data: topRatedData } = useQuery<IGetTvsResult>(
    "getTopRatedTvs",
    getTopRatedTvs
  );
  const { data: popularData } = useQuery<IGetTvsResult>(
    "getPopularTvs",
    getPopularTvs
  );
  const { data: onTheAirData } = useQuery<IGetTvsResult>(
    "getOnTheAirTvs",
    getOnTheAirTvs
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            <SliderTv keyword="airing_today" data={data!}>
              {"Airing Today"}
            </SliderTv>
            <SliderTv keyword="top_rated" data={topRatedData!}>
              {"Top Rated"}
            </SliderTv>
            <SliderTv keyword="popular" data={popularData!}>
              {"Popular"}
            </SliderTv>
            <SliderTv keyword="on_the_air" data={onTheAirData!}>
              {"On The Air"}
            </SliderTv>
          </SliderWrapper>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
