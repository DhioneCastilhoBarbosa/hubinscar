import ImgWhatsApp from '../../assets/whatsApp.svg';
import ImgFacebook from '../../assets/facebook.svg';
import ImgInstagram from '../../assets/Instagram.svg';
import { useNavigate } from 'react-router-dom';
import ImgLogo from "../../assets/LOGO BRANCA.png"

export default function Footer() {
  const navigate = useNavigate();

  function handleClicAbout() {
    navigate('/');
  }

  function handleClicPartners() {
    navigate('/parceiros');
  }

  function handleClicBudget() {
    navigate('/budget');
  }

  function handleClicLogin() {
    navigate('/signin');
  }

  function handleClickContact() {
    navigate('/contato');
  }

  function handleClickPrivacy() {
    navigate('/politica-de-privacidade')
  }

  function handleClickTerms() {
    navigate('/termos-de-uso')
  }

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full min-h-44 px-6 md:px-16 py-8 gap-8 bg-stone-900 text-white">
      {/* Logo e redes sociais */}
      <div className="flex flex-col items-center md:items-start justify-center gap-4 text-center md:text-left">
        <img src={ImgLogo} alt="Logo" className="w-25 h-12 mb-4" />
        <div className="flex flex-row items-center justify-center gap-4">
          <img src={ImgFacebook} alt="Facebook" className="w-6 h-6" />
          <img src={ImgInstagram} alt="Instagram" className="w-6 h-6" />
          <img src={ImgWhatsApp} alt="WhatsApp" className="w-6 h-6" />
        </div>
      </div>

      {/* Empresa */}
      <div className="text-sm font-light text-center md:text-left">
        <p className="font-bold mb-2">Empresa</p>
        <p className="cursor-pointer" onClick={handleClicAbout}>
          Sobre nós
        </p>
        <p className="cursor-pointer" onClick={handleClickContact}>
          Contato
        </p>
        <p className="cursor-pointer" onClick={handleClickPrivacy}>Política de privacidade</p>
        <p className="cursor-pointer" onClick={handleClickTerms}>Termos de Uso</p>
      </div>

      {/* Serviços */}
      <div className="text-sm font-light text-center md:text-left">
        <p className="font-bold mb-2">Serviços</p>
        <p className="cursor-pointer" onClick={handleClicBudget}>
          Quero contratar
        </p>
        <p className="cursor-pointer" onClick={handleClicPartners}>
          Quero ser um parceiro
        </p>
      </div>

      {/* Para Você */}
      <div className="text-sm font-light text-center md:text-left">
        <p className="font-bold mb-2">Para Você</p>
        <p className="cursor-pointer" onClick={handleClicLogin}>
          Minha conta
        </p>
        <p className="cursor-pointer">Suporte</p>
      </div>
    </div>
  );
}
