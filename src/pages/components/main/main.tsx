
import { useEffect } from "react";
import Footer from "../footer";
import { About } from "./components/about";
import Home from "./components/home";
import Installation from "./components/installation";
import Service from "./components/service";


export default function Main() {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className=" h-screen w-full">
      <Home/>
      <About/>
      <Service />
      <Installation/>
      <div className="w-full mt-auto md:mt-44">
       <Footer/>
      </div>
    </div>
  );
}