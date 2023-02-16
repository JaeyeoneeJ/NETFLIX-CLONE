import { atom } from "recoil";

interface ImovieDetail {
  backdrop_path: string;
  genres: [{ id: number; name: string }];
  homepage: string;
  id: number;
  imdb_id: string;
  overview: string;
  poster_path: string;
  production_companies: [
    {
      id: number;
      logo_path: string;
      name: string;
      origin_country: string;
    }
  ];
  release_date: string;
  runtime: number;
  status: string;
  title: string;
  vote_average: number;
}

export const movieDetail = atom<ImovieDetail>({
  key: "movieDetail",
  default: undefined,
});
