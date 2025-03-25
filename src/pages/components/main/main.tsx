
import { About } from "./components/about";
import Home from "./components/home";
import Service from "./components/service";

export default function Main() {
  return (
    <div className=" h-screen w-full">
      <Home/>
      <About/>
      <Service />
    </div>
  );
}