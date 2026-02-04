import React from 'react';
import { Link } from 'react-router-dom';

function Team() {
    return ( 
        <div className="container">
            <div className="row text-center border-top ">
                <div className="col mt-5">
                    <h1>About ME</h1>
                </div>
            </div>
            <div className="row px-5  pb-3 text-muted">
                <div className="col-6 p-5 text-center">
                    <img src="media/images/mihir_guitar.jpeg" alt="Mihir's Image" style={{width:"72%", borderRadius:"100%"}}></img>
                    <h3 className="mt-4 lh-base">Mihir Gupta</h3>
                    <h5>Founder, CEO</h5>
                </div>
                <div className="col-6 p-5 lh-lg" style={{ fontSize: "18px" }}>
                    <p>
                        I started building this stock trading platform to understand how real-world
                        financial systems work, inspired by my journey through web development and
                        system-level problem solving. The goal is to learn deeply, not just replicate
                        interfaces.
                    </p>

                    <p>
                        I am currently focused on strengthening my foundations in full-stack
                        development, system design, and clean architecture, while exploring how
                        scalable products are designed and maintained in production environments.
                    </p>

                    <p>
                        Solving complex bugs, structuring projects, and learning things the hard way
                        is what keeps me grounded and motivated.
                    </p>

                    <p>
                        Connect on <Link to="/" style={{ textDecoration: "None" }}>Homepage </Link>/ <a href="https://github.com/mihirgupta665" style={{ textDecoration: "None" }}>GitHub </a>/ <a href="https://www.linkedin.com/in/mihir-gupta-980173299/" style={{ textDecoration: "None" }}>LinkedIn </a>
                    </p>
                </div>

            </div>
        </div>
     );
}

export default Team;