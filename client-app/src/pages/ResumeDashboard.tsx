import { useEffect, useState } from "react";
import { fetchAPI } from "../functions/api";
import CreateResume from "../components/CreateResume";
import ResumeManager from "../components/ResumeManager";

interface Resume {
  id: number;
  url: string;
  adminId: number | null;
  uploadedAt?: string;
}

export default function ResumeDashboard() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI<Resume[]>("/resume");
      setResumes(data);
    } catch (err: any) {
      setError(err.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white w-full px-4 py-4">
      <CreateResume onResumeUploaded={loadResumes} />
      <ResumeManager
        resumes={resumes}
        setResumes={setResumes}
        loading={loading}
        error={error}
      />
    </div>
  );
}
