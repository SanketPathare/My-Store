import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '@/components/Hero';

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-8">
       <Hero/>
      </main>
      <Footer />
    </div>
  );
};

export default Home;