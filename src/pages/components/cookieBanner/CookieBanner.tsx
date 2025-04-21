import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white p-4 flex flex-col md:flex-row items-center justify-between z-50 shadow-lg">
      <p className="text-sm mb-2 md:mb-0">
        Este site utiliza cookies para melhorar sua experiência. Veja nossa{" "}
        <a href="/politica-de-privacidade" className="underline hover:text-gray-300" target="_blank" rel="noopener noreferrer">
          Política de Privacidade
        </a>.
      </p>
      <button
        onClick={handleAccept}
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition"
      >
        Aceitar
      </button>
    </div>
  );
}
