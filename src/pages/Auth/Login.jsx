import React,{useState} from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const { login } = useAuth();

  //Handle Login Form submit
  const handleLogin=async(e)=>{
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
    if(!password){
      setError("Please enter the password");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
            <h3 className='text-xl font-semibold' style={{color: '#777C6D'}}>Welcome Back</h3>
            <p className='text-xs mt-[5px] mb-6' style={{color: '#777C6D', opacity: 0.8}}>
                Please enter your details to login
            </p>
            <form onSubmit={handleLogin}>
              <Input
                value={email}
                onChange={({target})=> setEmail(target.value)}
                label="Email Address"
                placeholder="john@example.com"
                type="text"
              />
              <Input
                value={password}
                onChange={({target})=> setPassword(target.value)}
                label="Password"
                placeholder="Min 8 characters"
                type="password"
              />
              {error && <p className="text-red-500 text-xs pb-5">{error}</p>}
              <button type="submit" className='w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50' style={{backgroundColor: '#777C6D', color: '#EEEEEE'}} disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
              <p className='text-[13px] mt-3' style={{color: '#777C6D'}}>
                Don't have an account? 
                <Link to="/signUp" className='font-medium underline' style={{color: '#777C6D'}}>Sign Up 
                </Link>
              </p>
            </form>
        </div>
    </AuthLayout>
  )
}

export default Login