import React from "react";
import styles from "./About.module.css";
import { useNavigate } from "react-router-dom";

const About = () => {

    const navigate = useNavigate();
  return (
    <div className={styles.aboutPage}>
        <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
        >
            ← Back
        </button>
        <h1 className={styles.pageTitle}>About Us</h1>
      <div className={`${styles.container} ${styles.card}`}>

        

        <p className={styles.intro}>
          Welcome to <strong>PG Finder</strong> — a smart platform designed to
          simplify the process of finding, managing, and booking Paying Guest
          accommodations.
        </p>

        <section className={styles.section}>
          <h2>🚀 Our Mission</h2>
          <p>
            Our mission is to bridge the gap between PG owners and users by
            providing a transparent, reliable, and easy-to-use platform where
            everything is managed digitally — from listings to bookings.
          </p>
        </section>

        <section className={styles.section}>
          <h2>🏠 What We Offer</h2>
          <ul>
            <li>Verified PG listings with complete details</li>
            <li>Easy booking and cancellation system</li>
            <li>Owner-friendly PG management dashboard</li>
            <li>Admin-controlled verification and moderation</li>
            <li>Secure and scalable backend architecture</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>👥 Who We Serve</h2>
          <p>
            We serve students, working professionals, and PG owners by creating
            a single platform where trust, convenience, and efficiency come
            together.
          </p>
        </section>

        {/* <section className={styles.section}>
          <h2>🛠 Technology</h2>
          <p>
            This platform is built using modern technologies including
            <strong> React</strong>, <strong>Spring Boot</strong>,
            <strong> REST APIs</strong>, and a secure database architecture to
            ensure performance and reliability.
          </p>
        </section> */}

        <section className={styles.section}>
          <h2>📈 Our Vision</h2>
          <p>
            We aim to evolve this platform into a complete accommodation
            ecosystem with advanced analytics, smarter recommendations, and
            enhanced user experience.
          </p>
        </section>

      </div>
    </div>
  );
};

export default About;
