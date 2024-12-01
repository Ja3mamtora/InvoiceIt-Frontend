import React from 'react';
import { FileText, DollarSign, BarChart2 } from 'lucide-react';

const styles = {
  hero: {
    position: 'relative',
    height: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    padding: '20px',
    overflow: 'hidden',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: '-1',
  },
  heroContent: {
    zIndex: 1,
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '20px',
  },
  buttonSecondary: {
    backgroundColor: '#f8f9fa',
    color: '#212529',
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    margin: '10px',
  },
  section: {
    padding: '50px 20px',
    textAlign: 'center',
  },
  featureWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '30px',
  },
  feature: {
    textAlign: 'center',
    width: '300px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  featureImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  featureContent: {
    padding: '20px',
  },
  gradientSection: {
    background: 'linear-gradient(to right, #2D3748, #1A202C)',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
  },
};

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1637239990694-ba96d4b80acc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FsY3VsYXRvcnxlbnwwfHwwfHx8Mg%3D%3D"
          alt="Workspace"
          style={styles.heroImage}
        />
        <div style={styles.heroContent}>
          <h1><b>Welcome to QuoteMaker</b></h1>
          <p>Create professional quotations with ease</p>
          <a href='/register'><button style={styles.buttonPrimary}>Get Started</button></a>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.section}>
        <h2>Why Choose QuoteMaker?</h2>
        <div style={styles.featureWrapper}>
          <div style={styles.feature}>
            <img
              src="https://images.unsplash.com/photo-1716782542189-80cb79ff58d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJpbGxzfGVufDB8fDB8fHwy"
              alt="Easy Quotation Creation"
              style={styles.featureImage}
            />
            <div style={styles.featureContent}>
              <FileText size={48} />
              <h3>Easy Quotation Creation</h3>
              <p>Create and manage quotations effortlessly with our intuitive interface.</p>
            </div>
          </div>
          <div style={styles.feature}>
            <img
              src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW5hbHlzaXN8ZW58MHx8MHx8fDI%3D"
              alt="Streamlined Billing"
              style={styles.featureImage}
            />
            <div style={styles.featureContent}>
              <DollarSign size={48} />
              <h3>Streamlined Billing</h3>
              <p>Simplify your billing process and get paid faster.</p>
            </div>
          </div>
          <div style={styles.feature}>
            <img
              src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YW5hbHlzaXN8ZW58MHx8MHx8fDI%3D"
              alt="Detailed Analytics"
              style={styles.featureImage}
            />
            <div style={styles.featureContent}>
              <BarChart2 size={48} />
              <h3>Detailed Analytics</h3>
              <p>Track your business performance with comprehensive analytics.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div style={styles.gradientSection}>
        <h2>Ready to streamline your business?</h2>
        <p>Join thousands of satisfied users and start creating professional quotations today.</p>
        <div>
          <a href="/login">
            <button style={styles.buttonSecondary}>Login</button>
          </a>
          <a href="/register">
            <button style={styles.buttonSecondary}>Sign Up</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
