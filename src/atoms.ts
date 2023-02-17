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

interface ImovieCredits {
  id: number;
  cast: [
    {
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      profile_path: string;
      character: string;
    }
  ];
}

export const movieCredits = atom<ImovieCredits>({
  key: "movieCredits",
  default: undefined,
});

interface ItvDetail {
  backdrop_path: string;
  first_air_date: string;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  homepage: string;
  id: number;
  last_air_date: string;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
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
  status: string;
  vote_average: number;
}

export const tvDetail = atom<ItvDetail>({
  key: "tvDetail",
  default: undefined,
});

interface ItvCredits {
  cast: [
    {
      id: number;
      known_for_department: string;
      name: string;
      profile_path: string;
      character: string;
    }
  ];
  id: number;
}

export const tvCredits = atom<ItvCredits>({
  key: "tvCredits",
  default: undefined,
});
