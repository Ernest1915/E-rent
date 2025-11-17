// components/SignupForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount, login } from '../appwriteconfig/authservices';


const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount(email, password, name);
      await login(email, password); // Auto login after signup
      navigate('/Dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
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
      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
        Sign Up
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default SignupForm;
