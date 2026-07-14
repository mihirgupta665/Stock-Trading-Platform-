import React from "react";

const SupportAccordion = ({ section, openSection, setOpenSection }) => {

    const isOpen = openSection === section.id;

    const handleToggle = () => {

        if (isOpen) {
            setOpenSection(null);
        }
        else {
            setOpenSection(section.id);
        }

    };

    return (
        <div className={`border rounded mb-3 accordion-card ${isOpen ? "active" : ""}`}>
            <div className={`d-flex justify-content-between align-items-center p-4 accordion-header ${isOpen ? "border-bottom" : ""}`} onClick={handleToggle} style={{ cursor: "pointer" }} >

                <div className="d-flex align-items-center">

                    <i className={`bi bi-${section.icon} me-3 fs-4 text-primary`}></i>

                    <h4 className="mb-0 fw-normal accordion-title">{section.title}</h4>
                </div>

                <i className={`bi bi-chevron-down fs-5 accordion-arrow ${isOpen ? "rotate" : ""}`}></i>

            </div>

            <div className={`accordion-content ${isOpen ? "show" : ""}`}>

                <ul className="mb-0 ps-5 py-3">
                    {section.links.map((link) => (
                        <li key={link.title} className="mb-3">
                            <a href={link.url} className="accordion-link text-decoration-none">{link.title}</a>                        </li>
                    ))}

                </ul>

            </div>

        </div>
    );
};

export default SupportAccordion;