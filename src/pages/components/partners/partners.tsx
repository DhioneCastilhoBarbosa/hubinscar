import { motion } from "framer-motion";
import ImgCar from "../../../assets/car.svg";
import ImgCloudSpeak from '../../../assets/cloudspeak.svg';
import ImgGroupUser from '../../../assets/Maskgroup.svg';
import ImgDolar from '../../../assets/dolar.svg';
import { useNavigate } from "react-router-dom";
import Footer from "../footer";
import { useEffect } from "react";

export default function Partners() {
  const navigate = useNavigate();

  function handleClickRegisterPart() {
    navigate("/cadastro-parceiro");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-200 text-black">
      <main className="flex-grow flex flex-col items-center justify-start w-full">
        {/* Seção principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row items-center justify-center bg-gray-800 pt-20 md:pt-36 w-full gap-12 md:gap-40 px-4 md:px-16 pb-8 text-white"
        >
          <img src={ImgCar} alt="Carro elétrico" className="w-72 md:w-auto" />

          <div className="flex flex-col items-center md:items-start justify-center w-full max-w-md text-center md:text-left px-2">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              Como funciona a Hubinstcar?
            </h1>
            <div className="font-normal text-base md:text-lg">
              <p>A HubInstCar conecta instaladores de carregadores</p>
              <p>para carros elétricos a clientes, oferecendo mais</p>
              <p>visibilidade e permitindo receber pedidos sem</p>
              <p>precisar buscar clientes ou investir em divulgação.</p>
            </div>

            <button
              className="bg-sky-600 text-white w-full h-12 rounded-lg hover:bg-sky-500 mt-8"
              onClick={handleClickRegisterPart}
            >
              Cadastrar
            </button>
          </div>
        </motion.div>

        {/* Passos */}
        <div className="flex flex-col items-center justify-center w-full bg-white rounded-b-lg py-16 px-4">
          <h2 className="text-black font-extrabold text-2xl md:text-4xl text-center mb-12">
            Passos para começar a ser um instalador parceiro
          </h2>

          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center justify-center w-full max-w-5xl">
            {[{
              step: "1",
              title: "Cadastro",
              desc: "Faça seu pré cadastro.",
            }, {
              step: "2",
              title: "Validação",
              desc: "Nossa equipe validará seus dados e experiências.",
            }, {
              step: "3",
              title: "Operação",
              desc: "Receba e gerencie suas demandas de serviços diretamente na plataforma.",
            }].map(({ step, title, desc }, idx) => (
              <div className="w-full max-w-[240px]" key={idx}>
                <div className="flex items-center bg-gray-300 py-2 px-3 rounded-lg gap-2 mb-3">
                  <span className="bg-gray-600 text-white px-3 py-1 rounded-full">{step}</span>
                  <span className="font-medium text-lg">{title}</span>
                </div>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vantagens */}
        <div className="flex flex-col items-center justify-center bg-gray-800 w-full py-16 px-4 text-white">
          <div className="flex flex-col items-center justify-center w-full max-w-6xl bg-gray-500 rounded-lg gap-12 py-12 px-4">
            <h3 className="text-2xl md:text-3xl font-semibold text-center">
              Vantagens de ser um instalador parceiro
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-around w-full gap-12">
              {[{
                img: ImgCloudSpeak,
                title: "Divulgação",
                lines: ["Divulgamos o seu", "serviço em nosso site."]
              }, {
                img: ImgGroupUser,
                title: "Novos clientes",
                lines: ["Atraímos clientes da", "sua região, ampliando", "seus contatos."]
              }, {
                img: ImgDolar,
                title: "Segurança",
                lines: ["Facilidade e segurança", "na hora de receber."]
              }].map(({ img, title, lines }, idx) => (
                <div className="flex flex-col items-center text-center max-w-[240px]" key={idx}>
                  <img src={img} alt={title} className="mb-4 w-16 h-16" />
                  <p className="text-xl md:text-2xl font-semibold mb-3">{title}</p>
                  {lines.map((line, i) => (
                    <p className="text-sm font-light" key={i}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-sky-600 text-white w-full max-w-md h-12 rounded-lg hover:bg-sky-500 mt-12"
            onClick={handleClickRegisterPart}
          >
            Cadastrar
          </button>
        </div>
      </main>

      {/* Footer */}
      <div className="flex flex-col items-center md:justify-center">
        <Footer />
      </div>
    </div>
  );
}
