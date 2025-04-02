import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer} aria-label="Footer">
      <h1 className={styles.title}>Enterprise Architecture Playbook Assistant</h1>
      <p className={styles.text}>
        © 2025 <a href="https://www.americanexpress.com/" target="_blank" rel="noopener noreferrer" className={styles.link}>American Express</a>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;