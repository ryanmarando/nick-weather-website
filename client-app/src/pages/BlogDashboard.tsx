import CreateBlog from "../components/CreateBlog";
import BlogManager from "../components/BlogManager";

export default function BlogDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <CreateBlog />
      <BlogManager />
    </div>
  );
}
