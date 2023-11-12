// app/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, onAuthStateChanged } from './../firebase'; // Modify the import statement

export const withAuth = (WrappedComponent: React.FC) => {
  const WithAuth: React.FC<any> = (props) => {
    const router = useRouter();

    useEffect(() => {
      // Listen for changes in authentication state
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          // If the user is not logged in, redirect to the login page
          router.push('/login');
        }
      });

      // Cleanup the listener when the component is unmounted
      return () => unsubscribe();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  // Provide a display name for the HOC
  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
};
