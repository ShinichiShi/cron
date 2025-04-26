import React, { useEffect } from 'react';
import anime from 'animejs';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

function App() {
  useEffect(() => {
    // Page load animation
    anime({
      targets: '.fade-in',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100, { start: 300 }),
      easing: 'easeOutQuad',
      duration: 800
    });
  }, []);

  return (
    <Layout>
      <div className="fade-in">
        <Dashboard />
      </div>
    </Layout>
  );
}

export default App;