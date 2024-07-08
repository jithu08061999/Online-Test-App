import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import TestPage from './components/TestPage';
import Results from './components/Results';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/test/*" element={<TestPageWithLayout />} />
        <Route path="/results/*" element={<ResultsWithLayout />} />
      </Routes>
    </Router>
  );
}

const TestPageWithLayout = () => (
  <>
    <Header />
    <TestPage />
    <Footer />
  </>
);

const ResultsWithLayout = () => (
  <>
    <Header />
    <Results />
    <Footer />
  </>
);

export default App;
