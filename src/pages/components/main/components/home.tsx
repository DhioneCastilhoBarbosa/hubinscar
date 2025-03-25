import { motion } from "framer-motion";
import ImgStation from "../../../../assets/station.svg";

export default function Home() {
  return (
    <div className="home flex flex-col items-center justify-center w-full md:h-full ">
      <div className="flex md:flex-row flex-col-reverse items-center justify-start w-full md:h-screen relative">
        {/* Texto e botão */}
        <div className="flex flex-col md:items-start items-center justify-center md:gap-16 gap-8 max-w-full p-8 md:pl-36 md:h-screen z-10 mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 1 }}
            className="flex flex-col"
          >
            <span className="font-medium text-xl md:text-4xl 2xl:text-6xl">
              Hubinstcar
            </span>
            <h1 className="font-extrabold text-3xl md:text-6xl md:max-w-[600px] 2xl:text-8xl 2xl:max-w-[1000px]">
              Instalando o futuro da mobilidade elétrica.
            </h1>
          </motion.div>
          <div>
            <button className="bg-white text-black w-52 h-10 rounded-lg hover:cursor-pointer hover:bg-gray-200">
              Quero contratar
            </button>
          </div>
        </div>

        {/* Imagem de fundo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-full h-full md:h-screen mt-16"
        >
          <img
            src={ImgStation}
            className="w-full object-cover md:block"
          />
        </motion.div>
      </div>
    </div>
  );
}
