import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className='col text-center'>
                        <img className="mt-4" src="media/images/PageNotFound.jpg" style={{ width: "45%" }}></img>
                        <Link style={{textDecoration:"None"}} to="/">
                            <button type="button" class="mx-auto mt-3 py-2 px-3 d-block btn btn-outline-info fw-bolder fs-3 error-back-btn">Back To Home</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotFound;