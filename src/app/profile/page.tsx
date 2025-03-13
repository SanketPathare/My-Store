"use client";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { auth } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from '../../components/Loading';

const Profile = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>Please login to view your profile.</div>;
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-8  px-8">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <div className="bg-white p-4 rounded shadow-md">
          <p><strong>Email:</strong> {user.email}</p>
          {/* Add more profile information here if available */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
