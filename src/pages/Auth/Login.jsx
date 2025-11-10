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
            <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
            <p className='text-xs text-slate-700 mt-[5px] mb-6'>
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
              <button type="submit" className='btn-primary' disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
              <p className='text-[13px] text-slate-800 mt-3'>
                Don't have an account? 
                <Link to="/signUp" className='font-medium text-primary underline'>Sign Up 
                </Link>
              </p>
            </form>
        </div>
    </AuthLayout>
  )
}

export default Login