import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Film,
  FileCheck,
  AlertCircle,
} from "lucide-react";

interface Job {
  id: string;
  status: string;
  progress: number;
  outputFormat: string;
  qualityPreset: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  inputFile: {
    originalFilename: string;
    fileSize: string;
  };
  outputFile?: {
    id: string;
    originalFilename: string;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await api.get(`/download/${fileId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download started");
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const handleRetry = async (jobId: string) => {
    try {
      await api.post(`/jobs/${jobId}/retry`);
      toast.success("Job queued for retry");
      // Refresh jobs list
      fetchJobs();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Retry failed";
      toast.error(errorMessage);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "processing":
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Conversion Jobs
                  </h1>
                  <p className="text-sm text-gray-600">
                    Track your file conversions
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={fetchJobs}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          {/* Auto-refresh indicator */}
          <div className="mt-2 text-xs text-gray-500 text-right">
            Auto-refreshing • Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg">
              <Loader className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">
              Loading jobs...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="p-6 bg-gray-100 rounded-2xl">
                <FileCheck className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No jobs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Upload some files to get started
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Upload Files
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className={`p-3 rounded-xl flex-shrink-0 relative ${
                        job.status === "completed"
                          ? "bg-green-100"
                          : job.status === "failed"
                            ? "bg-red-100"
                            : job.status === "processing"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                      }`}
                    >
                      {getStatusIcon(job.status)}
                      {(job.status === "processing" ||
                        job.status === "pending") && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900 break-all">
                          {job.inputFile.originalFilename}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">
                            Output:
                          </span>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-medium">
                            {job.outputFormat.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">
                            Quality:
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium capitalize">
                            {job.qualityPreset}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-semibold text-gray-700">
                            Size:
                          </span>
                          <span>
                            {(
                              parseInt(job.inputFile.fileSize) /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-semibold text-gray-700">
                            Created:
                          </span>
                          <span>
                            {new Date(job.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar for processing/pending jobs */}
                      {(job.status === "processing" ||
                        job.status === "pending") && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-600">
                              {job.status === "processing"
                                ? "Converting..."
                                : "Queued for processing"}
                            </span>
                            <span className="text-xs font-semibold text-gray-600">
                              {job.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                job.status === "processing"
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500"
                              }`}
                              style={{
                                width: `${job.status === "pending" ? 0 : job.progress}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {job.status === "completed" && job.outputFile && (
                      <button
                        onClick={() =>
                          handleDownload(
                            job.outputFile!.id,
                            job.outputFile!.originalFilename
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold text-sm whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                    {job.status === "failed" && (
                      <button
                        onClick={() => handleRetry(job.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold text-sm whitespace-nowrap"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {job.status === "processing" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">
                        Processing...
                      </span>
                      <span className="font-bold text-indigo-600">
                        {job.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 relative"
                        style={{ width: `${job.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {job.status === "failed" && job.errorMessage && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-800 mb-1">Error</p>
                        <p className="text-sm text-red-700 break-all">
                          {job.errorMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
