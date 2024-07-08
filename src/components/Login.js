import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../static/Login.css';
import logo from '../images/CinicalScholar.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const defaultUser = {
    email: 'testuser@gmail.com',
    password: 'testuser@2021'
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const storedUserData = localStorage.getItem('userData');

    if (email === defaultUser.email && password === defaultUser.password) {
      // Always allow login for default user credentials
      console.log('Login successful');
      localStorage.setItem('userData', JSON.stringify({ ...defaultUser, category }));
      navigate("/test");
      console.log('Logged in user details:', { ...defaultUser, category });
    } else if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      if (email === userData.email && password === userData.password) {
        console.log('Login successful');
        userData.category = category;
        localStorage.setItem('userData', JSON.stringify(userData));
        navigate("/test");
        console.log('Logged in user details:', userData);
      } else {
        setError('Invalid credentials');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <div className="logo-overlay">
          <img src={logo} alt="Logo" className="logo" />
          <div className="logo-text">
            <p className="logo-top-text">Online</p>
            <p className="logo-bottom-text">TestApp</p>
          </div>
        </div>
      </div>
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>User Sign in</h2>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your Email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Exam Category</label>
            <select
              className="form-control select-dropdown"
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            >
              <option value="">--Select your exam category--</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="history">History</option>
              <option value="physics">Physics</option>
            </select>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block">SIGN IN</button>
          <p className="sign-up-link">Don't have an Account? <a href="/signup">Sign up</a></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
