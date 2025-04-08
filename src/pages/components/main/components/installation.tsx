import ImgMamInstallation from '../../../../assets/manInstallation.svg'
import ImgCloudSpeak from '../../../../assets/cloudspeak.svg'
import ImgGroupUser from '../../../../assets/Maskgroup.svg'
import ImgDolar from '../../../../assets/dolar.svg'
import { useNavigate } from 'react-router-dom';


export default function Installation() {

  const navigate = useNavigate();
  function handleClickNeedPatner(){
    navigate("/parceiros");
  }
  return (
    <div className="flex flex-col items-center justify-center w-full md:h-full md:mb-8">
      <div className=" flex flex-col md:flex-row justify-center items-center w-full px-10 ">
        <div className=" flex flex-col items-center md:items-start  justify-center md:mr-36 md:mt-36 mt-8">
          <p className="font-extrabold md:text-5xl text-2xl">Que tal garantir uma renda extra?</p>
          <p className="font-extrabold md:text-4xl text-md mt-2 md:mt-6">Faça seu cadastro e comece</p>
          <p className="font-extrabold md:text-4xl text-md">essa parceria com a gente!</p>
          <button 
           className="bg-sky-600 text-white w-56 h-12 rounded-lg hover:cursor-pointer hover:bg-sky-500 md:mt-16 md:ml-8 mt-8"
            onClick={handleClickNeedPatner}
          >
                Quero ser um intalador
          </button>
        </div>
        <div className='installer  flex flex-col items-center justify-center h-full md:mt-36 w-56 md:w-auto'>
          <img 
            src={ImgMamInstallation} 
            alt="homem na frente de uma estacao de recarga com um maleta de ferramenta na mão."
           
          />
        </div>
      </div>
      <div className='flex flex-col items-center justify-center w-full px-2 md:px-16 md:mt-[-3rem] mt-[-1rem]'>
        <div className='flex flex-col items-center justify-center bg-gray-500 w-full mx-16 rounded-lg gap-10 py-8'>
          <div>
            <p className='text-2xl font-semibold text-center'>Vantagens de ser um instalador parceiro</p>
          </div>
          <div className=' flex md:flex-row flex-col items-center md:items-baseline  justify-center md:justify-around  w-full md:px-16 gap-10 md:gap-0'>
            <div className='flex flex-col items-center justify-center'>
              <img src={ImgCloudSpeak}  className="mb-4" alt="" />
              <p className='text-2xl font-semibold mb-4'>Divulgação</p>
              <p className='text-[1rem] font-light'>Divulgamos o seu</p>
              <p className='text-[1rem] font-light'>serviço em nosso site.</p>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <img src={ImgGroupUser}  className="mb-4" alt="" />
              <p className='text-2xl font-semibold mb-4'>Novos clientes</p>
              <p className='text-[1rem] font-light'>Atraímos clientes da</p>
              <p className='text-[1rem] font-light'>sua região, ampliado</p>
              <p className='text-[1rem] font-light'>seus contatos.</p>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <img src={ImgDolar}  className="mb-4" alt="" />
              <p className='text-2xl font-semibold mb-4'>Segurança</p>
              <p className='text-[1rem] font-light'>Facilidade e segurança</p>
              <p className='text-[1rem] font-light'>na hora de receber.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}