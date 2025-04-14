import {motion} from 'framer-motion'

import ImgManService from '../../../../assets/man-service.svg'
import ImgTool from '../../../../assets/Tool.svg'
import ImgMaintenance from '../../../../assets/Under maintenance.svg'

export default function Service() {
  return(
    <div className='flex flex-col items-center justify-center w-full md:h-screen'>
      <div className='flex md:flex-row flex-col-reverse items-center justify-center w-full bg-gray-300 pb-16 gap-24 md:h-screen'>
      <div className='service hidden md:block md:relative md:left-0 lg:top-[-4rem] xl:top-[-6rem] '>
          <img src={ImgManService} alt="homem fazendo instalação em um quadro eletrico"  
          className=' w-[24rem] max-w-[24rem] h-auto'/>
      </div>
        <div className='flex flex-col items-center justify-center md:mr-16'>
          <span className='font-extrabold md:text-7xl text-3xl text-black md:mt-16 mt-4'>Nossos serviços</span>
          <div className='flex md:flex-row flex-col items-center justify-center md:gap-8'>
            <motion.div
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.95 }} 

            className='flex flex-col md:mt-16 mt-8 bg-gray-100 p-4 rounded-lg md:w-[370px] h-60 mx-6 shadow-2xl shadow-gray-500'
            >
              <img src={ImgTool} alt="ferramentas" className='w-8 mb-4'/>
              <span className='text-black'>Instalação de carregador para 
              veículos elétricos</span>

              <p className='text-gray-400'>Instalação de carregadores para veículos elétricos, oferecendo soluções de recarga lenta, rápida e ultra-rápida, com equipamentos de diversas marcas e modelos.</p>
            </motion.div>
            <motion.div
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.95 }}  
             className='flex flex-col md:mt-16 mt-8 bg-gray-100 p-4 rounded-lg md:w-[370px] md:h-60 mx-6 shadow-2xl shadow-gray-500'
            >
              <img src={ImgMaintenance} alt="ferramentas" className='w-8 mb-4'/>
              <span className='text-black'>Manutenção</span>
              <p className='text-gray-400'>Manutenção preventiva e corretiva para equipamentos de recarga.</p>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-start w-[95%] bg-white md:h-1/2 rounded-b-lg pb-32">
        <div className='mt-16'>
          <span className='text-black font-extrabold text-4xl'>Como funciona?</span>
        </div>
       <div className='flex md:flex-row flex-col gap-4 mt-8 max-w-full'>
          <div className='w-60'>
            <div className='flex flex-row justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-lg gap-2 mb-4'>
              <span className='bg-gray-600 px-3 py-1 rounded-full'>1</span>
              <span className='font-medium text-lg'>Escolha o serviço</span>
            </div>
            <span className='text-gray-500'>Escolha o serviço que você precisa</span>
          </div>

          <div className='w-60'>
            <div className='flex flex-row justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-lg gap-2 mb-4'>
              <span className='bg-gray-600 px-3 py-1 rounded-full'>2</span>
              <span className='font-medium text-lg'>Escolha o instalador</span>
            </div>
            <span className='text-gray-500'>Escolha um istalador da sua região.</span>
          </div>

          <div className='w-60'>
            <div className='flex flex-row justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-lg gap-2 mb-4'>
              <span className='bg-gray-600 px-3 py-1 rounded-full'>3</span>
              <span className='font-medium text-lg'>Fale com Instalador</span>
            </div>
            <span className='text-gray-500'>Combine com o instalador o valor e data do serviço.</span>
          </div>

          <div className='w-60'>
            <div className='flex flex-row justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-lg gap-2 mb-4'>
              <span className='bg-gray-600 px-3 py-1 rounded-full'>4</span>
              <span className='font-medium text-lg'>Pagamento</span>
            </div>
            <span className='text-gray-500'>Realize o pagamento para que o serviço seja confirmado. Fique tranquilo após a realização do pagamento, o valor ficará retido e só será repassado para instalador após a confirmação da realização do serviço ou por até 30 dias.</span>
          </div>

          <div className='w-64'>
            <div className='flex flex-row justify-start items-center w-full bg-gray-300 py-1 px-2 rounded-lg gap-2 mb-4'>
              <span className='bg-gray-600 px-3 py-1 rounded-full'>5</span>
              <span className='font-medium text-lg'>Execução do serviço</span>
            </div>
            <span className='text-gray-500'>Após o pagamento o instalador vai até o local na data combinada para realizar o serviço.</span>
          </div>

       </div>
      </div>
    </div>
  )
}