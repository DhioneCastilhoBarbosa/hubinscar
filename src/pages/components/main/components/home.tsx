import { motion } from "framer-motion";
import ImgStation from "../../../../assets/station.svg";
import { useNavigate } from "react-router-dom";
import ReactGA from 'react-ga4';

export default function Home() {
  const navigate = useNavigate();
  function handleClickNeedContract(){
    navigate("/budget");
  }

  return (
    <div className="home flex flex-col items-center justify-center w-full md:h-full">
      <div className="flex flex-col-reverse md:flex-row items-center justify-start w-full md:h-screen relative">
        
        {/* Texto e botão */}
        <div className="flex flex-col md:items-start items-center justify-center md:gap-16 gap-8 max-w-full p-8 md:pl-36 md:h-screen z-10 mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col"
          >
            
            <h1 className="font-extrabold text-3xl md:text-6xl md:max-w-[600px] 2xl:text-8xl 2xl:max-w-[1000px]">
              Conecte-se à mobilidade elétrica.
            </h1>
          </motion.div>
          <div>
            <button 
            className="bg-sky-600 text-white w-56 h-12 rounded-lg hover:cursor-pointer hover:bg-sky-500"
            onClick={() => {
              // Rastrear evento no GA4
              ReactGA.event({
                category: 'Botão',
                action: 'Clique em Quero contratar',
                label: 'Quero contratar',
              });
          
              // Chamar a função original
              handleClickNeedContract();
            }}
            >
              Quero contratar
            </button>
          </div>
        </div>
  
        {/* Imagem de fundo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-[35vh] md:h-screen relative md:absolute top-0 left-0 mt-16"
        >
          <img
            src={ImgStation}
            className="md:w-full h-full object-cover"
          />
        </motion.div>
  
      </div>
    </div>
  );
  
  
}
