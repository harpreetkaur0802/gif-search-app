import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSideProps, GetServerSidePropsResult, GetServerSidePropsContext  } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { User } from 'firebase/auth'
import {  onAuthStateChanged,auth, collection, getDocs, where, query, db, deleteDoc, doc } from '../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Favorite {
  id: string; // Adding 'id' to uniquely identify each favorite
  gifId: string;
  gifTitle: string;
  gifUrl: string;
  gifUsername: string;
  // Add other properties as needed
}

const Favorites: React.FC = () => {
  const [userFavorites, setUserFavorites] = useState<Favorite[]>([]);

  const fetchUserFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const favorites = await getUserFavorites(user.uid);
        setUserFavorites(favorites);
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };

  const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
    try {
      const favoritesCollection = collection(db, 'favorites');
      const userFavoritesQuery = query(favoritesCollection, where('userId', '==', userId));
      const userFavoritesSnapshot = await getDocs(userFavoritesQuery);
      const favorites: Favorite[] = userFavoritesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Favorite));
      return favorites;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
      // After deleting from Firebase, update the state to reflect the change
      setUserFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId));
      toast.success('Removed From Favourite!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  // Fetch user favorites when the component mounts
  useEffect(() => {
    fetchUserFavorites();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold  text-black">Favorites ❤️</h1>
        <Link href="/search" className='p-4 rounded-full shadow-lg bg-black'>Home</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userFavorites.map((favorite) => (
          <div key={favorite.id} className="rounded overflow-hidden shadow-lg relative">
            <img
              src={favorite.gifUrl}
              alt={`Favorite ${favorite.gifId}`}
              className="w-full h-35 object-cover"
            />
            <button
              onClick={() => handleRemoveFavorite(favorite.id)}
              className="absolute top-2 right-2 px-2 py-1 text-black rounded-full bg-white"
            >
              ❌Remove
            </button>
            <p className="text-black p-2">{favorite.gifTitle}</p>
            <p className="text-black p-2">@{favorite.gifUsername}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<ParsedUrlQuery>) => {
  return new Promise<GetServerSidePropsResult<{ [key: string]: any }>>(async (resolve) => {
    try {
      //onst auth = getAuth();
      const user: User | null = await new Promise((res) => {
        onAuthStateChanged(auth, (user) => {
          res(user);
        });
      });

      if (!user || !user.uid) {
        resolve({
          redirect: {
            destination: '/',
            permanent: false,
          },
        });
        return;
      }

      const favoritesCollection = collection(db, 'favorites');
      const userFavoritesQuery = query(favoritesCollection, where('userId', '==', user.uid));
      const userFavoritesSnapshot = await getDocs(userFavoritesQuery);
      const userFavorites = userFavoritesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Favorite));

      resolve({
        props: {
          userFavorites,
        },
      });
    } catch (error) {
      console.error('Error fetching user favorites:', error);

      resolve({
        props: {
          userFavorites: [],
        },
      });
    }
  });
};

export default Favorites;
