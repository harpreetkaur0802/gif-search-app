import React from 'react';
import Head from 'next/head';
import GifSearch from '../app/Components/GifSearch';
import '../app/globals.css';
import Login from './login';
const Home: React.FC = () => {
  return (
    <div>
      

      <main>
        <h1>Welcome to My Next.js App</h1>
        <Login />
      </main>

      {/* Additional page content */}
    </div>
  );
};

export default Home;
