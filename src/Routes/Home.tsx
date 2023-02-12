import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  console.log(data, isLoading);
  return (
    <div style={{ backgroundColor: "whitesmoke", height: "200vh" }}>Home</div>
  );
}

export default Home;
