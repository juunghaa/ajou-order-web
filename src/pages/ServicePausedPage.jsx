import React from 'react';
import { Link } from 'react-router-dom';

const ServicePausedPage = ({ title, message }) => (
  <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-4 text-gray-600 leading-relaxed">{message}</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-ajou-primary px-5 py-3 font-semibold text-white"
      >
        카페 둘러보기
      </Link>
    </div>
  </main>
);

export default ServicePausedPage;
