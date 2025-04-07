
import ImgWhatsApp from '../../assets/whatsApp.svg'
import ImgFacebook from '../../assets/facebook.svg'
import ImgInstagram from '../../assets/instagram.svg'

export default function Footer() {

  
  return(
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full min-h-44 md:mt-44 mt-4 px-6 md:px-16 py-8 gap-8 bg-stone-900 text-white absolute opacity-40">

  {/* Logo e redes sociais */}
  <div className='flex flex-col items-center md:items-start justify-center gap-4 text-center md:text-left'>
    <h1 className='text-4xl font-extrabold'>LOGO</h1>
    <div className="flex flex-row items-center justify-center gap-4">
      <img src={ImgFacebook} alt="Facebook" className="w-6 h-6" />
      <img src={ImgInstagram} alt="Instagram" className="w-6 h-6" />
      <img src={ImgWhatsApp} alt="WhatsApp" className="w-6 h-6" />
    </div>
  </div>

  {/* Empresa */}
  <div className='text-sm font-light text-center md:text-left'>
    <p className='font-bold mb-2'>Empresa</p>
    <p>Sobre nós</p>
    <p>Contato</p>
    <p>Política de privacidade</p>
  </div>

  {/* Serviços */}
  <div className='text-sm font-light text-center md:text-left'>
    <p className='font-bold mb-2'>Serviços</p>
    <p>Quero contratar</p>
    <p>Quero ser um parceiro</p>
  </div>

  {/* Para Você */}
  <div className='text-sm font-light text-center md:text-left'>
    <p className='font-bold mb-2'>Para Você</p>
    <p>Minha conta</p>
    <p>Ajuda</p>
  </div>
</div>

  )
}