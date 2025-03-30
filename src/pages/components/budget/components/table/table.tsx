import { ComponentProps } from "react";


export function Table( props: ComponentProps<'table'>){
  return(
    <div className="border-collapse border border-gray-600/10 rounded-lg overflow-y-auto p-2 bg-white">
      <table className="w-full rounded-lg" {...props}/>
    </div>
  )
}