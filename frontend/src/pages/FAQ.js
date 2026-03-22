import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/faq.css"; // make sure to update CSS

const faqs = [
  {
    question: "What is Unimate?",
    answer: "A system to create and manage timetables with clash and ticket management.",
  },
  {
    question: "Who can use Unimate?",
    answer: "Admins, Coordinators, and LICs with role-specific access.",
  },
  {
    question: "How are timetable clashes handled?",
    answer: "The system detects conflicts and suggests solutions automatically.",
  },
  {
    question: "What is ticket management?",
    answer: "Users can report issues, and Admins/Coordinators can resolve them.",
  },
  {
    question: "Can LICs edit timetables?",
    answer: "No, LICs can only view timetables and raise tickets.",
  },
  {
    question: "How are user roles managed?",
    answer: "Admins assign roles with access based on responsibilities.",
  },
  {
    question: "Can timetables be exported?",
    answer: "Yes, as PDF or Excel files.",
  },
  {
    question: "How to report a clash or issue?",
    answer: "Raise a ticket through the system.",
  },
  {
    question: "Is Unimate mobile-friendly?",
    answer: "Yes, it works on desktop, tablet, and mobile.",
  },
  {
    question: "Is data secure in Unimate?",
    answer: "Yes, via secure login and role-based access control.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-wrapper">
      {/* Back button */}
      <div className="back-button" onClick={() => navigate(-1)}>
        &#8592; Back
      </div>

      <h2>Frequently Asked Questions</h2>

      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`faq-card ${openIndex === index ? "open" : ""}`}
          onClick={() => toggleFAQ(index)}
        >
          <div className="faq-question">
            {faq.question}
            <span className="arrow">{openIndex === index ? "▲" : "▼"}</span>
          </div>
          {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
}

export default FAQ;