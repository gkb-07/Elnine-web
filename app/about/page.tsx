import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            prefetch={true}
            className="text-purple-600 hover:underline flex items-center gap-2 mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">About Elnine</h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Elnine</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Elnine is a premium audiobook platform dedicated to providing immersive audio experiences. 
              We believe in the transformative power of storytelling through sound.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-700 mb-6">
              To connect people with stories that inspire, educate, and entertain through high-quality audio content.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">What We Offer</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Curated audiobooks across multiple genres</li>
              <li>High-quality narration and production</li>
              <li>Personalized recommendations</li>
              <li>Offline listening capabilities</li>
              <li>Cross-platform synchronization</li>
            </ul>

            <div className="flex gap-4">
              <Link 
                href="/categories" 
                prefetch={true}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Explore Categories
              </Link>
              <Link 
                href="/library" 
                prefetch={true}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                My Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}