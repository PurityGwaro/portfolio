export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-2xl w-full">
        <div className="border-2 border-gray-300 p-16 text-center bg-white">
          <h1 className="text-9xl font-bold text-zinc-900 mb-4">
            404
          </h1>
          <div className="w-16 h-0.5 bg-zinc-900 mx-auto mb-8"></div>
          <h2 className="text-3xl font-bold uppercase tracking-tight text-zinc-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-zinc-600">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <p className="text-center mt-8 text-xs uppercase tracking-wider text-zinc-600">
          Error_Code: 404_Page_Not_Found
        </p>
      </div>
    </div>
  );
}
