import { login } from "../appwriteconfig/authservices";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await login(email, password);
        navigate('/Dashboard'); // Redirect after login
      } catch (err: any) {
        setError(err.message || 'Login failed');
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    );
  };
  
  export default LoginForm;