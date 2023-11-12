import React from 'react';
import Head from 'next/head';
import Favorites from '../app/Components/FavroitGif';
import { withAuth } from '../app/withAuth';

import '../app/globals.css';

const Fav: React.FC = () => {
  return (
    <div>
      

      <main>
        
        <Favorites/>
      </main>

      {/* Additional page content */}
    </div>
  );
};

export default withAuth(Fav);
