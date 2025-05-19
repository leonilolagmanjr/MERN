import React from 'react';

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroHeadline}>Hire Top Talent for Any Job — Fast</h1>
          <p style={styles.heroSubheadline}>
            Connect with skilled freelancers and businesses in minutes.
          </p>
        </div>
      </section>

      {/* Featured Section */}
      <section style={styles.featured}>
        <h2 style={styles.sectionHeading}>Featured Jobs</h2>
        <div style={styles.featuredGrid}>
          {['Job 1', 'Job 2', 'Job 3', 'Job 4'].map((job, index) => (
            <div key={index} style={styles.featuredCard}>
              <h3>{job}</h3>
              <p>Details about {job}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section style={styles.categories}>
        <h2 style={styles.sectionHeading}>Categories</h2>
        <div style={styles.categoryGrid}>
          {['Web Development', 'Graphic Design', 'Writing & Translation', 'Marketing'].map((category, index) => (
            <div key={index} style={styles.categoryCard}>
              <h3>{category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 PBuild. All rights reserved.</p>
        <p>About | Privacy Policy | Terms of Service</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    minHeight: '100vh',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#171a21',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logo: {
    fontSize: '24px',
    color: '#66c0f4',
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
  },
  navLink: {
    color: '#c7d5e0',
    textDecoration: 'none',
    fontSize: '16px',
  },
  navRight: {
    display: 'flex',
    gap: '15px',
  },
  hero: {
    backgroundColor: '#2a475e',
    padding: '50px 20px',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroHeadline: {
    fontSize: '36px',
    color: '#ffffff',
    marginBottom: '10px',
  },
  heroSubheadline: {
    fontSize: '18px',
    color: '#c7d5e0',
  },
  featured: {
    padding: '20px',
  },
  sectionHeading: {
    fontSize: '24px',
    color: '#ffffff',
    marginBottom: '20px',
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  featuredCard: {
    backgroundColor: '#2a475e',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  categories: {
    padding: '20px',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '20px',
  },
  categoryCard: {
    backgroundColor: '#2a475e',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#171a21',
    color: '#c7d5e0',
  },
};

export default Home;