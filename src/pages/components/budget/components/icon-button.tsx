import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";


interface IconButtonProps extends ComponentProps<'button'>{
  transparent?: boolean,
}
export function IconButton({transparent, ...props}:IconButtonProps){
  return(
    <button {...props}
      className={twMerge('border-gray-600/10 rounded-md p-1.5 cursor-pointer',
      transparent? 'bg-black/20 text-black' : 'bg-gray-100',
      props.disabled?'opacity-50 text-gray-400': null)}
    />

    
  )
}