import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Help.module.css";

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.helpPage}>

      {/* BACK BUTTON */}
      <button
        className={styles.backBtn}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className={styles.pageTitle}>Help & Support</h1>

      {/* CARD */}
      <div className={`${styles.container} ${styles.card}`}>

        <p className={styles.intro}>
          Need help using the platform?  
          Find answers to common questions below.
        </p>

        <div className={styles.faq}>

          <div className={styles.faqItem}>
            <h3>❓ How do I book a PG?</h3>
            <p>
              Browse available PGs, select one that fits your needs, and click
              the <strong>Book</strong> button. Complete the booking details to
              confirm.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>❓ How can I cancel a booking?</h3>
            <p>
              Go to <strong>My Bookings</strong>, select the booking you want to
              cancel, and click <strong>Cancel</strong>.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>❓ How do PG owners update details?</h3>
            <p>
              Owners can submit a <strong>Change Request</strong> from their
              dashboard. Changes are applied after admin approval.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>❓ Why is my PG not visible?</h3>
            <p>
              PGs must be <strong>verified and approved</strong> by the admin
              before becoming visible to users.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>❓ Who do I contact for support?</h3>
            <p>
              Use the <strong>Contact Us</strong> page to send your query. Our
              support team will get back to you.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Help;
