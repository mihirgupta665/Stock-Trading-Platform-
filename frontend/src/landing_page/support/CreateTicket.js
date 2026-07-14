import React, { useState } from "react";
import supportData from "./supportData";
import SupportAccordion from "./SupportAccordion";

const CreateTicket = () => {

    const [openSection, setOpenSection] = useState(null);

    return (
        <div className="container py-5">

            <h2 className="mb-5">To create a ticket, select a relevant topic</h2>

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
    );
};

export default CreateTicket;