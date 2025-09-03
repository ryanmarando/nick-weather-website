import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/dashboard/youtube"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-md text-center"
        >
          Manage YouTube Videos
        </Link>

        <Link
          to="blog"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-md text-center"
        >
          Manage Blog Posts
        </Link>

        <Link
          to="/dashboard/resume"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-md text-center"
        >
          Update Resume
        </Link>

        <Link
          to="/dashboard/facebook"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-md text-center"
        >
          Facebook Embed / Posts
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
