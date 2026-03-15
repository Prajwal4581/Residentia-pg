import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contact.module.css";
import { toast } from "react-toastify";


const Contact = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();

  toast.success("Message sent successfully! We’ll contact you soon.");

  e.target.reset();
};

  return (
    <div className={styles.contactPage}>

      {/* BACK BUTTON */}
      <button
        className={styles.backBtn}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className={styles.pageTitle}>Contact Us</h1>

      {/* CARD */}
      <div className={`${styles.container} ${styles.card}`}>

        <p className={styles.intro}>
          Have questions, feedback, or need support?  
          We’d love to hear from you.
        </p>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <h3>📍 Address</h3>
            <p>Pune, Maharashtra, India</p>
          </div>

          <div className={styles.infoItem}>
            <h3>📧 Email</h3>
            <p>support@pgfinder.com</p>
          </div>

          <div className={styles.infoItem}>
            <h3>📞 Phone</h3>
            <p>+91 98765 43210</p>
          </div>
        </div>

        <hr className={styles.divider} />

        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>Send us a message</h3>

          <input
            type="text"
            placeholder="Your Name"
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            required
          />

          <textarea
            placeholder="Your Message"
            rows="4"
            required
          />

          <button type="submit" className={styles.submitBtn}>
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
};

export default Contact;
