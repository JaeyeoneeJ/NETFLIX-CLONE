# NETFLIX-CLONE

<img width="100%" src="https://user-images.githubusercontent.com/77138259/219952532-e950a5a6-a1f5-424f-9541-5af1c945d064.png" />

<a href="https://netflix-clone-jaeyeoneej.vercel.app/">클릭! 넷플릭스 클론 구경하기</a>

## 설명

- animate에 중점을 두고 넷플릭스를 클론한 프로젝트입니다.
- the movie DB에서 data를 fetching하였습니다.
  <a href="https://www.themoviedb.org/">https://www.themoviedb.org/</a>
- animate를 위해 framer-motion 라이브러리를 사용했습니다.

## 주요 기능

- 사용자의 브라우저 width를 추적하기 위해 Hook(useWindowDimentions)을 따로 만들어 적용하였습니다.
- Hook을 사용하여 메인 페이지에서 보여지는 Slider의 갯수는 기본 6개(1200px 이상)이나 사용자가 브라우저 크기를 변경하였을 때, 3개(1200px 미만)로 변경되며 클릭 시 Slider가 해당 갯수만큼 자동으로 적용하였습니다.
