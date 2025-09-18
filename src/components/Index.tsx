import Navigation from './Navigation';
import Hero from './Hero';
import GSAPFeatures from './GSAPFeatures';
import Dashboard from './Dashboard';
import Footer from './Footer';

const Index = () => {
  return (
    <main className='min-h-screen'>
      <Navigation />
      <Hero />
      <GSAPFeatures />
      <Dashboard />
      <Footer />
    </main>
  );
};

export default Index;
