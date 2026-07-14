import React, { useState } from "react";
import { Link } from "react-router-dom";
import supportData from "./supportData";
import SupportAccordion from "./SupportAccordion";

const CreateTicket = () => {

    const [openSection, setOpenSection] = useState(null);

    return (
        <div className="container py-5">

            <h2 className="mb-5 fs-4 fw-normal text-muted">To create a ticket, select a relevant topic</h2>

            <div className="row g-4">
                {/* Left Column: Accordions */}
                <div className="col-lg-8 col-md-12">
                    {
                        supportData.map((section) => (
                            <SupportAccordion
                                key={section.id}
                                section={section}
                                openSection={openSection}
                                setOpenSection={setOpenSection}
                            />
                        ))
                    }
                </div>

                {/* Right Column: Sidebar */}
                <div className="col-lg-4 col-md-12 ps-lg-4">
                    {/* Alert Box with Orange Left Border */}
                    <div className="support-sidebar-alert p-4 mb-4">
                        <ul className="mb-0 ps-3">
                            <li className="mb-3">
                                <Link to="/support" className="lh-base d-inline-block">Latest Intraday leverages and Square-off timings</Link>
                            </li>
                            <li>
                                <Link to="/support" className="lh-base d-inline-block">Current Takeovers and Delisting – July 2026</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links bordered card */}
                    <div className="support-sidebar-links">
                        <div className="support-links-header">
                            Quick links
                        </div>
                        <ul className="list-unstyled mb-0 support-links-list">
                            <li>
                                <Link to="/support">1. Track account opening</Link>
                            </li>
                            <li>
                                <Link to="/support">2. Track segment activation</Link>
                            </li>
                            <li>
                                <Link to="/support">3. Intraday margins</Link>
                            </li>
                            <li>
                                <Link to="/support">4. Kite user manual</Link>
                            </li>
                            <li>
                                <Link to="/support">5. Learn how to create a ticket</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CreateTicket;