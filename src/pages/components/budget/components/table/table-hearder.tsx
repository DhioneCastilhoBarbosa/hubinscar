import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function TableHearder(props: ComponentProps<"th">){
  return(
    <th {...props}className={twMerge('py-3 px-4 text-white text-sm font-semibold text-left bg-indigo-400',props.className)}/>
  )
}