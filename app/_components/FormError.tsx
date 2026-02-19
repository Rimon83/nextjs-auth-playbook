import React from 'react'
import { BsExclamationTriangle } from "react-icons/bs";


type ErrorProps ={
  message: string
}
const FormError = ({message}: ErrorProps) => {
 if (!message) return null
  return (
    <div className="bg-destructive/15 p-4 rounded-md flex items-center gap-x-3 text-sm text-destructive my-8">
      <BsExclamationTriangle className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
}

export default FormError