export function About() {
  return (
    <div className="about flex flex-col items-center justify-center w-full md:h-full relative mt-16">
  {/* "Quem somos" fixo no canto esquerdo */}
  <div className="absolute top-0 left-2 bg-gray-500 p-1 rounded-t-lg mt-[-32px]">
    <span>Quem somos</span>
  </div>

  {/* Container centralizado */}
  
  <div className="flex flex-col items-center justify-center w-full bg-gray-500  md:h-full">
    <div className="flex md:flex-row flex-col items-start justify-center ml-3 md:ml-0 gap-12">
      <h1 className="flex flex-row md:flex-col text-2xl mt-2 gap-1 md:w-[400px] md:text-6xl text-center">
        Prazer, somos 
        <p className="font-extrabold italic">
          <span className="font-normal not-italic">a </span> 
          Hubinstcar
        </p>
      </h1>
      <div className="flex flex-col justify-center gap-4 p-4 md:w-[500px]  md:font-medium md:text-2xl">
        <p>Uma plataforma de contratação de serviços de instalação e manutenção de carregadores para veículos elétricos e híbridos.</p>
        <p>Conectando profissionais de todo o Brasil com pessoas e empresas que estejam precisando destes serviços.</p>
        <p>Atendendo com segurança, qualidade, comodidade e rapidez.</p>
      </div>
    </div>
  </div>

</div>

  )
}