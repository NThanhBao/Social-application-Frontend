import React from 'react';
import { Link } from 'react-router-dom';

function Error404() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl font-bold mb-6">404</h1>
            <p className="text-lg mb-8">Oops! Something went wrong.</p>
            <img src="/images/7c1885f6be1cbeac9906d8ac700f185c.jpg" alt="404" className="mb-8" />
            <Link to="/home" className="text-blue-500 hover:underline">Go back to home page</Link>
        </div>
    );
}

export default Error404;
