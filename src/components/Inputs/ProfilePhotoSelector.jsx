import React,{useState,useRef} from 'react';
import {LuUser,LuUpload,LuTrash } from "react-icons/lu";

function ProfilePhotoSelector({image,setImage}) {
    const inputRef=useRef(null)
    const [previewurl,setPreviewUrl]=useState(null);
    
    const handleImageChange=(event)=>{
        const file=event.target.files[0];
        if(file){
            setImage(file)
            const preview=URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    }
    const handleRemoveImage=()=>{
        setImage(null);
        setPreviewUrl(null);
    }
    const onChooseFile=()=>{
        inputRef.current.click();
    }
  return (
    <div className='flex justify-center mb-6'>
        <input
        type="file"
        ref={inputRef} 
        accept="image/*"
        onChange={handleImageChange}
        className='hidden'
        />
        {!image ?(
            <div className='w-20 h-20 flex items-center justify-center rounded-full relative' style={{backgroundColor: '#B7B89F'}}>
                <LuUser className='text-4xl' style={{color: '#777C6D'}}/>
                <button
                type="button"
                className='w-8 h-8 flex items-center justify-center text-white rounded-full absolute -bottom-1 -right-1'
                style={{backgroundColor: '#777C6D'}}
                onClick={onChooseFile}
                >
                    <LuUpload/>
                </button>
            </div>
        ):(
            <div className='relative'>
                <img
                src={previewurl}
                alt="Profile Photo"
                className='w-20 h-20 rounded-full object-cover'
                />
                <button
                type="button"
                className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
                onClick={handleRemoveImage}
                >
                    <LuTrash/>
                </button>
            </div>
        )}
    </div>
  )
}

export default ProfilePhotoSelector