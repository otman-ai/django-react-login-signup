import './App.css';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import {LoginForm, SignupForm, ForgotPassword} from './components/Sign';
import PasswordReset from './pages/PasswordReset';




import { BrowserRouter, Routes, Route  } from "react-router-dom";

function App() {
  return (
        <div className=''>
        <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound/>} />
          <Route path="/workspace" element={<Dashboard/>} />  
          <Route path="/login" element={<LoginForm/>} />   
          <Route path="/signup" element={<SignupForm/>} />   
          <Route path="/forgot-password" element={<ForgotPassword/>} />   
          <Route path="/password-reset" element={<PasswordReset/>} />  
          <Route path="/" element={<Home/>} />       


        </Routes>

      </BrowserRouter>
   </div>

  )
}

export default App
