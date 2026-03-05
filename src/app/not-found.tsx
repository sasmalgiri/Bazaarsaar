import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#22c55e] mb-2">404</h1>
        <h2 className="text-xl font-bold text-[#fafaff] mb-2">Page Not Found</h2>
        <p className="text-sm text-[#6b6b8a] mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors no-underline inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
