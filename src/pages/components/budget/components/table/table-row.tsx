import { ComponentProps } from "react";

export function TableRow(props: ComponentProps<'tr'>){
  return(
    <tr {...props}className="border-b border-gray-600/10 hover:bg-gray-600/10"/>
  )
}