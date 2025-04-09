import { ChevronLeft, ChevronRight, Search, Star } from 'lucide-react'
import Img from '../../../assets/profissionais.svg'
import { motion } from 'framer-motion'
import { Table } from './components/table/table'
import { TableRow } from './components/table/table-row'
import { TableCell } from './components/table/table-cell'
import { IconButton } from './components/icon-button'
import { useEffect } from 'react'
import Footer from '../footer'


export default function Budget() {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    
  return (
    <div className="flex flex-col items-center justify-start w-full bg-gray-200 min-h-screen text-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-black pt-16 w-full relative h-96 md:h-full"
      >
        <img src={Img} className="w-full" />

        <div className="w-full flex flex-col items-center justify-center absolute top-1/2 md:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-2 md:gap-4 text-center mt-20 md:mt-44">
          <h1 className="text-white font-bold text-lg sm:text-2xl md:text-4xl">
            Encontre o profissional que você precisa
          </h1>
          <p className="text-white text-sm sm:text-lg md:text-xl mt-2">
            Digite seu CEP que encontraremos o mais próximo de você
          </p>

          <div className="flex sm:flex-row items-center justify-center gap-2 sm:gap-4 w-96">
            <input
              type="text"
              className="rounded-lg p-3 md:w-full sm:w-96 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Digite seu CEP"
            />

            <button className="flex flex-row gap-2 bg-red-500 py-3 px-6 rounded-lg text-white hover:bg-red-700 transition duration-300 border-1 border-red-500 hover:border-red-700">
              <Search size={24} />
              Procurar
            </button>
          </div>
        </div>
      </motion.div>

      <div className="w-full h-full bg-gray-200 px-4 mt-2 mb-4 overflow-x-auto ">
        <Table className="w-full min-w-max bg-white">
          <thead>
            <tr className="border-b border-gray-100">
              <TableCell className="rounded-bl-md" colSpan={1}>
                Mostrando 3 de 3 profissionais encontrados
              </TableCell>
              <TableCell className="text-right rounded-br-md" colSpan={4}>
                <div className="inline-flex items-center gap-8">
                  <span>Página 1 de 1</span>
                  <div className="flex gap-3">
                    <IconButton transparent disabled>
                      <ChevronLeft className="size-4" />
                    </IconButton>
                    <IconButton transparent>
                      <ChevronRight className="size-4" />
                    </IconButton>
                  </div>
                </div>
              </TableCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((_, index) => (
              <TableRow key={index} className="border-b border-gray-100">
                <TableCell className="text-gray-800 flex-1">
                  <div className="flex flex-row items-center gap-2 md:gap-8 w-full justify-center">
                    <img
                      src="https://avatars.githubusercontent.com/u/59747330?v=4&size=64"
                      alt="Imagem do profissional"
                      className="rounded-full w-12 h-12"
                    />
                    <span>João da Silva</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-800 flex-1">
                  Instalação / Manutenção
                </TableCell>
                <TableCell className="text-gray-800 flex-1">
                  Serviços realizados - <span className="bg-black text-white p-1 rounded-sm">47</span>
                </TableCell>
                <TableCell className="text-gray-800 flex-1">
                  <div className="flex flex-row items-center gap-2">
                    <Star className="text-yellow-500" size={18} />
                    <span>4.5</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-800 flex-1">
                  <div className="w-full flex flex-row items-center justify-center gap-2">
                    <button className="bg-sky-600 text-white w-44 h-8 rounded-lg hover:cursor-pointer hover:bg-sky-500">
                      Solicitar orçamento
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="w-full mt-auto">
         <Footer/>
      </div>
      
    </div>
  )
}
