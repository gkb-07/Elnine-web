import Link from 'next/link';

interface NotFoundPageProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
}

export default function NotFoundPage({
  message = "Book Not Found",
  linkText = "← Back to Home",
  linkHref = "/"
}: NotFoundPageProps) {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          {message}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We couldn't find the content you were looking for. It might have been removed, or the link is incorrect.
        </p>
        <Link href={linkHref} className="text-purple-600 hover:text-purple-800 font-medium text-lg flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {linkText}
        </Link>
      </div>
    </div>
  );
}
