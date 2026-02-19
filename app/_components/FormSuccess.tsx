import React from 'react'
import { GoCheckCircle } from "react-icons/go";


type FormSuccessProps ={
  message: string
}
const FormSuccess = ({message}: FormSuccessProps) => {
 if (!message) return null
  return (
    <div className="bg-emerald-500/15 p-4 rounded-md flex items-center gap-x-3 text-sm text-emerald-500 my-8">
      <GoCheckCircle className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
}

export default FormSuccess