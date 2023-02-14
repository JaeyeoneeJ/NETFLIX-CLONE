import { AnimatePresence, motion, useScroll, Variants } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../api";
import useWindowDimensions from "../Hook/useWindowDimensions";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  position: relative;
  top: -200px;
`;

const Row = styled(motion.div)<{ offset: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.offset}, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  font-size: 66px;
  cursor: pointer;
  aspect-ratio: 16 / 9;
  img {
    display: block;
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
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
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

const Slider = ({ data }: { data: IGetMoviesResult }) => {
  let offset = useWindowDimensions() >= 1200 ? 6 : 3;
  const navigate = useNavigate();

  const rowVariants: Variants = {
    hidden: {
      x: useWindowDimensions() + 5,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -useWindowDimensions() - 5,
    },
  };

  const { scrollY } = useScroll();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const bigMovieMatch = useMatch("/movies/:movieId");
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => navigate("/");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId!);
  console.log(clickedMovie);
  return (
    <>
      <Wrapper>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
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
                  layoutId={movie.id + ""}
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
                    style={{ width: "100%" }}
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
            <BigMovie
              layoutId={bigMovieMatch.params.movieId}
              style={{ top: scrollY.get() + 100 }}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.5), transparent), 
                  url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
      ;
    </>
  );
};

export default Slider;
