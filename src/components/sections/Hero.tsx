import React from "react";
import Header from "../Header";
import Slider from "../Slider";

const Hero = () => {
  return (
    <div className="h-[80dvh] flex flex-col relative">
      <Header type="transparent" />
      <Slider />
    </div>
  );
};

export default Hero;
