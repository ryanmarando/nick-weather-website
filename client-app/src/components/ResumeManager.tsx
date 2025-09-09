import { fetchAuth } from "../functions/api";

interface Resume {
  id: number;
  url: string;
  adminId: number | null;
  uploadedAt?: string;
}

interface Props {
  resumes: Resume[];
  setResumes: React.Dispatch<React.SetStateAction<Resume[]>>;
  loading: boolean;
  error: string;
}

export default function ResumeManager({
  resumes,
  setResumes,
  loading,
  error,
}: Props) {
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this resume?")) return;
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    try {
      await fetchAuth(`/resume/${id}`, token, { method: "DELETE" });
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Manage Resumes</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="bg-gray-700 p-4 rounded-lg mb-3 flex justify-between items-center"
        >
          <a
            href={resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate"
          >
            {resume.url.split("/").pop()}
          </a>
          <button
            onClick={() => handleDelete(resume.id)}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
