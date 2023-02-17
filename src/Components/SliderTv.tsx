import { AnimatePresence, motion, Variants } from "framer-motion";
import { ReactNode, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetTvsResult } from "../api";
import useWindowDimensions from "../Hook/useWindowDimensions";
import { makeImagePath } from "../utils";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { useRecoilState } from "recoil";
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

const BigTv = styled(motion.div)`
  position: fixed;
  z-index: 3;
  width: 40vw;
  height: 80vh;
  background-color: rgb(24, 24, 24);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.75);
  top: 100px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;

  background-size: cover;
  background-position: center center;
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

interface IisBack {
  back: {
    value: boolean;
  };
}

const SliderTv = ({
  data,
  children,
  keyword,
}: {
  data: IGetTvsResult;
  children: ReactNode;
  keyword: string;
}) => {
  let offset = useWindowDimensions() >= 1200 ? 6 : 3;
  let resizeWidth = useWindowDimensions();
  const navigate = useNavigate();

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
      const totalTvs = data?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    setBack({ value: true });
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = data?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (tvId: number) => {
    navigate(`/tvs/${keyword}/${tvId}`);
  };

  const bigTvMatch = useMatch(`/tvs/${keyword}/:tvId`);
  const onOverlayClick = () => navigate("/tv");

  const clickedTv =
    bigTvMatch?.params.tvId &&
    data?.results.find((tv) => tv.id === +bigTvMatch.params.tvId!);
  console.log(bigTvMatch);
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
              .map((tv) => (
                <Box
                  layoutId={keyword + tv.id}
                  key={tv.id}
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(tv.id)}
                >
                  {tv.backdrop_path === null ? (
                    <img
                      src={makeImagePath(tv.poster_path, "w500")}
                      alt="Box-image"
                    />
                  ) : (
                    <img
                      src={makeImagePath(tv.backdrop_path, "w500")}
                      alt="Box-image"
                    />
                  )}

                  <Info variants={infoVariants}>
                    <h4>{tv.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Wrapper>
      <AnimatePresence>
        {bigTvMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigTv
              layoutId={keyword + bigTvMatch.params.tvId}
              // style={{ top: scrollY.get() + 100 }}
            >
              {clickedTv && (
                <>
                  {clickedTv.backdrop_path === null ? (
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24, 1)),                      
                  url(${makeImagePath(clickedTv.poster_path, "w500")})`,
                      }}
                    />
                  ) : (
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(24, 24, 24, 1)),                      
                url(${makeImagePath(clickedTv.backdrop_path, "w500")})`,
                      }}
                    />
                  )}
                  <BigTitle>{clickedTv.name}</BigTitle>
                  <BigOverview>{clickedTv.overview}</BigOverview>
                </>
              )}
            </BigTv>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default SliderTv;
