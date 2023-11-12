import Image from 'next/image';
import { FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import '../app/globals.css';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
//import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth,signInWithEmailAndPassword } from '../firebase';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);

    // Perform form validation
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    

    try {
      // Call the signInWithEmailAndPassword function
      await signInWithEmailAndPassword(auth, email, password);

      // If successful, redirect to the search route
      router.push('/search');
    } catch (error) {
      // Handle error, you can show an error message to the user
      setError('Invalid email or password. Please try again.');
      console.error('Error during login:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <Head>
        <title>Login page</title>
        <link rel="stylesheet" href="/favicon.ico" />
      </Head>

      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full md:w-2/3 max-w-4xl">
        <div className="w-full md:w-3/5 p-4 md:p-5">
          <div className="py-6 md:py-10">
            <div className="flex flex-col items-center">
              <h2 className="text-xl md:text-3xl font-bold text-green-500 mb-2">Log In to Account</h2>
              <div className="border-2 w-6 md:w-10 border-green-500 inline-block mb-2"></div>
            </div>

            <div className="flex flex-col items-center mt-4 md:mt-6">
              <p className="text-grey-400 my-2 md:my-3 items-center">Use your Email</p>
              <div className="bg-gray-100 w-full md:w-64 p-2 flex items-center">
                <FaRegEnvelope className="bg-gray-100 m-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="bg-gray-100 outline-none text-black w-full"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="bg-gray-100 w-full md:w-64 p-2 flex items-center mt-3">
                <MdLockOutline className="bg-gray-100 m-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="bg-gray-100 outline-none text-black w-full"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div
                className="border-2 text-black border-green-500 rounded-full px-6 md:px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-black mt-3 cursor-pointer"
                onClick={handleLogin}
              >
                Log In
              </div>

              {error && (
                <div className="text-red-500 mt-2">{error}</div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl md:py-10 px-4 md:px-12">
          <h2 className="text-xl md:text-3xl font-bold mb-2">Hello Friend!</h2>
          <div className="border-2 w-6 md:w-10 border-white inline-block mb-2 md:ml-16"></div>
          <p className="mb-6 md:mb-10">Fill up the personal info and start up your journey.</p>
          <Link href="/signup">
            <div className="border-2 rounded-full px-6 md:px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500 cursor-pointer">Sign Up</div>
          </Link>
        </div>
      </div>
    </main>
  );
}
