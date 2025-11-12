import React,{useState} from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

function Input({value,onChange,placeholder, label,type}) {
    const [showPassword,setShowPassword]=useState(false);
    const toggleShowPassword=()=>{          
        setShowPassword(!showPassword);
    }
    return (
        <div>
            <label className='text-[13px] mb-2 block' style={{color: '#777C6D'}}>{label}</label>
            <div className='flex items-center px-3 py-2 border rounded-lg mb-4' style={{backgroundColor: '#CBCBCB', borderColor: '#B7B89F'}}>
                <input
                    type={type==="password" ? showPassword ? "text" : "password" : type}
                    placeholder={placeholder}
                    className='w-full bg-transparent outline-none'
                    style={{color: '#777C6D'}}
                    value={value}
                    onChange={(e)=>onChange(e)}
                />
                {type==="password" && (  
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className='cursor-pointer'
                                style={{color: '#777C6D'}}
                                onClick={()=>toggleShowPassword()}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className='cursor-pointer'
                                style={{color: '#777C6D', opacity: 0.6}}
                                onClick={()=>toggleShowPassword()}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Input