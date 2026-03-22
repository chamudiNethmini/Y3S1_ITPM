import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/privacy.css";

function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Information We Collect",
      content:
        "We may collect personal information such as your name, email, role (Admin, Coordinator, LIC), and account details. Usage data like login times, actions performed, and ticket submissions are also collected for system improvement.",
    },
    {
      title: "How We Use Your Information",
      content:
        "Your information is used to manage accounts, generate timetables, resolve tickets, and improve the platform. We do not sell your personal data to third parties.",
    },
    {
      title: "Data Security",
      content:
        "We implement role-based access control, secure login, and encrypted databases to protect your data from unauthorized access.",
    },
    {
      title: "Cookies and Analytics",
      content:
        "Unimate may use cookies to enhance user experience and track basic analytics for performance improvements.",
    },
    {
      title: "Sharing of Information",
      content:
        "Information is only shared internally among Admins and Coordinators for managing timetables and ticket resolution. We do not share data with external parties.",
    },
    {
      title: "User Rights",
      content:
        "Users can request access to, correction of, or deletion of their personal information by contacting the Admin.",
    },
    {
      title: "Changes to Privacy Policy",
      content:
        "We may update this policy from time to time. All changes will be reflected within the platform and users will be notified accordingly.",
    },
    {
      title: "Contact Us",
      content:
        "For questions or concerns about privacy, please contact the Admin team through the ticket system.",
    },
  ];

  return (
    <div className="privacy-wrapper">
      {/* Back button */}
      <div className="back-button" onClick={() => navigate(-1)}>
        &#8592; Back
      </div>

      <h2>Privacy Policy - Unimate</h2>
      <div className="privacy-scroll">
        <p className="intro">
          At <strong>Unimate</strong>, your privacy is important to us. This Privacy Policy
          explains how we collect, use, and protect your information when using our
          timetable management system.
        </p>

        {sections.map((section, index) => (
          <div key={index} className="privacy-card">
            <h3>{`${index + 1}. ${section.title}`}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrivacyPolicy;