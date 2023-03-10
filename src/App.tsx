import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path={"/"} element={<Home />}></Route>
        <Route path={"/movies/now_playing/:id"} element={<Home />}></Route>
        <Route path={"/movies/upcoming/:id"} element={<Home />}></Route>
        <Route path={"/movies/top_rated/:id"} element={<Home />}></Route>
        <Route path={"/movies/popular/:id"} element={<Home />}></Route>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path={"/tvs/airing_today/:id"} element={<Tv />}></Route>
        <Route path={"/tvs/top_rated/:id"} element={<Tv />}></Route>
        <Route path={"/tvs/popular/:id"} element={<Tv />}></Route>
        <Route path={"/tvs/on_the_air/:id"} element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
