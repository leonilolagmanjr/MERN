// filepath: c:\Users\leonilolagmanjr\Documents\GitHub\MEAN\frontend\src\components\Auth.js
import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await loginUser({ email: formData.email, password: formData.password });
        console.log('Login successful:', data);
      } else {
        const data = await registerUser(formData);
        console.log('Registration successful:', data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default Auth;