import React, {useState} from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
function SignUp() {
  const [profilePic,setProfilePic]=useState(null);
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  // const navigate=useNavigate();

  //Handle SignUp Form submit
  const handleSignUp=async(e)=>{
  }
  return (
    <AuthLayout>
    </AuthLayout>
  )
}

export default SignUp