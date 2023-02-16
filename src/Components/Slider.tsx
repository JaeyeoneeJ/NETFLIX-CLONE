import { AnimatePresence, motion, Variants } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../api";
import useWindowDimensions from "../Hook/useWindowDimensions";
import { makeImagePath } from "../utils";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { useRecoilState } from "recoil";
import { movieCredits, movieDetail } from "../atoms";
import { FaStar } from "react-icons/fa";

const Wrapper = styled.div`
  position: relative;
  height: 200px;
  margin-bottom: 40px;
  @media screen and (max-width: 1600px) {
    height: 170px;
  }
  @media screen and (max-width: 1400px) {
    height: 150px;
  }
  @media screen and (max-width: 1200px) {
    height: 220px;
  }
  @media screen and (max-width: 1000px) {
    height: 180px;
  }
  @media screen and (max-width: 800px) {
    height: 150px;
  }
  @media screen and (max-width: 600px) {
    height: 120px;
  }
`;

const SliderTitle = styled.h2`
  font-size: 30px;
  font-weight: 400;
  margin-bottom: 10px;
`;

const ButtonArea = styled.div`
  position: absolute;
  padding: 0 10px;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 56px;
  /* background-color: rgba(255, 255, 255, 0.5); */
`;

const ButtonIcon = styled.button`
  opacity: 0.5;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    /* background-color: rgba(0, 0, 0, 0.5); */
    opacity: 1;
    scale: 1.3;
  }
  svg {
    color: white;
  }
`;

const Row = styled(motion.div)<{ offset: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.offset}, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  font-size: 66px;
  cursor: pointer;

  border-radius: 5px;
  img {
    display: block;
    width: 100%;
    /* object-fit: cover; */
    aspect-ratio: 16 / 9;
  }
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: #181818;
  opacity: 0;
  width: 100%;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  margin: 0 -60px;
  z-index: 2;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;
const Modal = styled(motion.div)`
  position: fixed;
  z-index: 3;
  width: 1000px;
  height: 80vh;
  background-color: rgb(24, 24, 24);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.75);
  top: 100px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  @media screen and (max-width: 1200px) {
    width: 800px;
  }
  @media screen and (max-width: 1000px) {
    margin: 0;
    width: 80vw;
  }
`;
const BigMovie = styled.div`
  overflow-y: auto;
  height: 100%;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;

  background-size: cover;
  background-position: center center;
`;
const BigWrapper = styled.div`
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  top: -80px;
  height: 100%;
`;
const BigWrapperHeader = styled.div`
  width: 100%;
  display: flex;
  gap: 30px;
  font-size: 20px;
  font-weight: 400;
`;
const VoteAverage = styled.span`
  display: flex;
  gap: 10px;
  color: #ffd954;
  svg {
    color: #ffd954;
  }
`;
const BigHeaderText = styled.span`
  color: white;
`;
const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;
const BigWrapperHeader2 = styled(BigWrapperHeader)`
  gap: 10px;
`;
const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
`;
const Genres = styled.span`
  font-size: 14px;
  font-weight: 300;
  padding: 2px 5px;
  border-radius: 5px;
  background-color: #ab3e48;
`;
const MiddleTitle = styled.h4`
  font-size: 20px;
  font-weight: 400;
`;
const CastMembers = styled.div<{ offset: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.offset}, 1fr);
  gap: 5px;
  width: 100%;
  height: 100%;
`;
const Member = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 30px;
  img {
    display: block;
    width: 100%;
    object-fit: cover;
    aspect-ratio: 3 / 4;
  }
`;
const MemberText = styled.div`
  display: flex;
  flex-direction: column;
`;

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

interface IisBack {
  back: {
    value: boolean;
  };
}

const Slider = ({
  data,
  children,
  keyword,
}: {
  data: IGetMoviesResult;
  children: ReactNode;
  keyword: string;
}) => {
  let offset = useWindowDimensions() >= 1200 ? 6 : 3;
  let resizeWidth = useWindowDimensions();
  const navigate = useNavigate();
  const [movieDetailValue, setMovieDetailValue] = useRecoilState(movieDetail);
  const [movieCreditsValue, setMovieCreditsValue] =
    useRecoilState(movieCredits);

  const [back, setBack] = useState({ value: false });
  const rowVariants: Variants = {
    hidden: ({ back }: IisBack) => ({
      x: !back.value ? resizeWidth : -resizeWidth,
    }),
    visible: {
      x: 0,
    },
    exit: ({ back }: IisBack) => ({
      x: back.value ? resizeWidth : -resizeWidth,
    }),
  };

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    setBack({ value: false });
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    setBack({ value: true });
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${keyword}/${movieId}`);
  };

  const bigMovieMatch = useMatch(`/movies/${keyword}/:movieId`);
  const onOverlayClick = () => navigate("/");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId!);
  // console.log(bigMovieMatch);
  // console.log(movieDetailValue);

  useEffect(() => {
    const detailMovie = async (movieId: string) => {
      let data = await fetch(
        `${process.env.REACT_APP_API_BASE_PATH}/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}`
      );
      let response = await data.json();
      setMovieDetailValue(response);

      let creditsData = await fetch(
        `${process.env.REACT_APP_API_BASE_PATH}/movie/${movieId}/credits?api_key=${process.env.REACT_APP_API_KEY}`
      );
      let creditsResponse = await creditsData.json();
      setMovieCreditsValue(creditsResponse);
    };
    clickedMovie && detailMovie(clickedMovie.id + "");
  }, [clickedMovie]);

  return (
    <>
      <Wrapper>
        <SliderTitle>{children}</SliderTitle>
        <AnimatePresence
          custom={{ back }}
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <ButtonArea>
            <ButtonIcon onClick={decreaseIndex}>
              <RxDoubleArrowLeft size={50} />
            </ButtonIcon>
            <ButtonIcon onClick={increaseIndex}>
              <RxDoubleArrowRight size={50} />
            </ButtonIcon>
          </ButtonArea>
          <Row
            variants={rowVariants}
            custom={{ back }}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
            offset={offset}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={keyword + movie.id}
                  key={movie.id}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <img
                    src={makeImagePath(movie.backdrop_path, "w500")}
                    alt="Box-image"
                  />
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Wrapper>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <Modal
              layoutId={keyword + bigMovieMatch.params.movieId}
              // style={{ top: scrollY.get() + 100 }}
            >
              <BigMovie>
                {clickedMovie && (
                  <>
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24, 1)),                      
                    url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`,
                      }}
                    />
                    <BigTitle>{clickedMovie.title}</BigTitle>
                    {movieDetailValue && (
                      <>
                        <BigWrapper>
                          <BigWrapperHeader>
                            <VoteAverage>
                              <FaStar size={20} />
                              {(
                                Math.round(
                                  movieDetailValue.vote_average * 100
                                ) / 100
                              ).toFixed(2)}
                            </VoteAverage>
                            <BigHeaderText>
                              {movieDetailValue.release_date}
                            </BigHeaderText>
                            <BigHeaderText>
                              {movieDetailValue.runtime}분
                            </BigHeaderText>
                          </BigWrapperHeader>
                          <BigWrapperHeader2>
                            {movieDetailValue.genres.map((genre) => (
                              <Genres>{genre.name}</Genres>
                            ))}
                          </BigWrapperHeader2>
                          <BigOverview>{clickedMovie.overview}</BigOverview>
                          <MiddleTitle>Cast Members</MiddleTitle>
                          {movieCreditsValue && (
                            <CastMembers offset={offset}>
                              {movieCreditsValue.cast
                                .filter(
                                  (person) => person.profile_path !== null
                                )
                                .slice(0, 12)
                                .map((person) => (
                                  <Member key={person.id}>
                                    <img
                                      src={makeImagePath(person.profile_path)}
                                      alt="profile_img"
                                    />
                                    <MemberText>
                                      <BigHeaderText>
                                        {person.name}
                                      </BigHeaderText>
                                      <BigHeaderText>
                                        ({person.character})
                                      </BigHeaderText>
                                    </MemberText>
                                  </Member>
                                ))}
                            </CastMembers>
                          )}
                        </BigWrapper>
                      </>
                    )}
                  </>
                )}
              </BigMovie>
            </Modal>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Slider;
