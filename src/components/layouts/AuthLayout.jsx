import React from 'react'
import card2 from '../../assets/images/card2.png'
import { LuTrendingUpDown } from "react-icons/lu"
function AuthLayout({children}) {
  return (
    <div className='flex' style={{backgroundColor: '#777C6D'}}>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12' style={{backgroundColor: '#EEEEEE'}}>
            <h2 className='text-lg font-medium flex items-center gap-2' style={{color: '#777C6D'}}><LuTrendingUpDown /> Expense Tracker</h2>
            {children}
        </div>
        <div className='hidden md:block w-[40vw] h-screen bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative' style={{backgroundColor: '#B7B89F'}}>
            <div className='w-48 h-48 rounded-[40px] absolute -top-7 -left-5' style={{backgroundColor: '#777C6D'}}/>
            <div className='w-48 h-56 rounded-[40px] border-[20px] absolute top-[30%] -right-10' style={{borderColor: '#CBCBCB'}}></div>
            <div className='w-48 h-48 rounded-[40px] absolute -bottom-7 -left-5' style={{backgroundColor: '#CBCBCB'}}/>
            <div className='grid grid-cols-1 z-20'>
                <StatsInfoCard
                    icon={<LuTrendingUpDown />}
                    label="Track Your Income & Expenses"
                    value="430,000"
                    color="#777C6D"
                />
            </div>
            <img 
                src={card2}
                className='w-64 lg:w-[90%] absolute bottom-10 shadow-lg'
            />
        </div>
    </div>
  )
}

export default AuthLayout
const StatsInfoCard = ({ icon, label, value, color }) => {
    return <div className='flex gap-6 p-4 rounded-xl shadow-md border z-10' style={{backgroundColor: '#EEEEEE', borderColor: '#CBCBCB'}}>
        <div className='w-12 h-12 flex items-center justify-center text-[26px] text-white rounded-full drop-shadow-xl' style={{backgroundColor: color}}>
            {icon}
        </div>
        <div>
            <h6 className='mb-1' style={{color: '#777C6D', opacity: 0.8}}>{label}</h6>
            <span className='text-[20px]' style={{color: '#777C6D'}}>₹{value}</span>
        </div>
        </div>
;
}