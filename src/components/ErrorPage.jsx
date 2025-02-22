const ErrorPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="max-w-md text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Oops! Terjadi Kesalahan
        </h1>
        <p className="text-gray-700 mb-4">
          Sepertinya ada masalah saat memuat aplikasi. Kemungkinan penyebab:
        </p>
        <ul className="text-left text-gray-700 mb-4 list-disc list-inside">
          <li>Versi browser Anda terlalu lama</li>
          <li>Koneksi internet terputus</li>
        </ul>
        <p className="text-gray-700 mb-4">Silakan coba langkah berikut:</p>
        <ul className="text-left text-gray-700 mb-4 list-disc list-inside">
          <li>Gunakan browser terbaru</li>
          <li>Gunakan Device lain</li>
        </ul>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
