import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import {
  Upload as UploadIcon,
  X,
  ArrowLeft,
  Film,
  FileUp,
  Loader2,
  Check,
  Link as LinkIcon,
  Play,
  Music,
  Video,
  Download,
  Sparkles,
} from "lucide-react";

interface VideoConfig {
  url: string;
  format: string;
  quality: string;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [videoConfigs, setVideoConfigs] = useState<VideoConfig[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("url");
  const [selectedUrlIndex, setSelectedUrlIndex] = useState<number>(0);
  // File upload settings
  const [fileOutputFormat, setFileOutputFormat] = useState("mp3");
  const [fileQuality, setFileQuality] = useState("medium");

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // Get thumbnail URL from video ID
  const getThumbnailUrl = (url: string): string => {
    const videoId = extractVideoId(url);
    if (videoId) {
      // Try maxresdefault first, fallback to hqdefault
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return "";
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".avi", ".mov", ".mkv", ".webm"],
      "audio/*": [".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addYoutubeUrl = () => {
    const trimmedUrl = currentUrl.trim();
    if (!trimmedUrl) {
      toast.error("Please enter a YouTube URL");
      return;
    }
    if (
      !trimmedUrl.includes("youtube.com") &&
      !trimmedUrl.includes("youtu.be")
    ) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }
    if (videoConfigs.some((config) => config.url === trimmedUrl)) {
      toast.error("This URL is already added");
      return;
    }
    setVideoConfigs((prev) => [
      ...prev,
      { url: trimmedUrl, format: "mp3", quality: "medium" },
    ]);
    setSelectedUrlIndex(videoConfigs.length); // Select the newly added URL
    setCurrentUrl("");
    toast.success("URL added");
  };

  const removeYoutubeUrl = (index: number) => {
    setVideoConfigs((prev) => prev.filter((_, i) => i !== index));
    // Adjust selected index after removal
    if (selectedUrlIndex === index) {
      setSelectedUrlIndex(Math.max(0, index - 1));
    } else if (selectedUrlIndex > index) {
      setSelectedUrlIndex(selectedUrlIndex - 1);
    }
  };

  // Update format for selected video
  const updateFormat = (format: string) => {
    setVideoConfigs((prev) =>
      prev.map((config, idx) =>
        idx === selectedUrlIndex ? { ...config, format } : config
      )
    );
  };

  // Update quality for selected video
  const updateQuality = (quality: string) => {
    setVideoConfigs((prev) =>
      prev.map((config, idx) =>
        idx === selectedUrlIndex ? { ...config, quality } : config
      )
    );
  };

  const handleUrlUpload = async () => {
    setUploading(true);
    let successCount = 0;

    try {
      for (const config of videoConfigs) {
        try {
          await api.post("/upload/url", {
            url: config.url,
            outputFormat: config.format,
            qualityPreset: config.quality,
          });
          successCount++;
        } catch (error: any) {
          console.error(`Failed to download ${config.url}:`, error);
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Download failed";
          toast.error(`Failed: ${errorMessage}`);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully queued ${successCount} video(s)`);
        navigate("/jobs");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async () => {
    setUploading(true);
    let successCount = 0;

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("outputFormat", fileOutputFormat);
        formData.append("qualityPreset", fileQuality);

        try {
          await api.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          successCount++;
        } catch (error: any) {
          console.error(`Failed to upload ${file.name}:`, error);
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Upload failed";
          toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} file(s)`);
        navigate("/jobs");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                  Upload Files
                </h1>
                <p className="text-sm text-gray-600">
                  Upload and convert your media
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Mode Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setUploadMode("file")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              uploadMode === "file"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
            }`}
          >
            <FileUp className="w-5 h-5 inline-block mr-2" />
            Upload Files
          </button>
          <button
            onClick={() => setUploadMode("url")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              uploadMode === "url"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
            }`}
          >
            <LinkIcon className="w-5 h-5 inline-block mr-2" />
            YouTube URL
          </button>
        </div>

        {uploadMode === "url" ? (
          /* YouTube URL Input - Modern Design */
          <div className="max-w-2xl mx-auto">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 mb-6 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <LinkIcon className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                YOUTUBE DOWNLOADER
              </h1>
              <p className="text-center text-blue-50 text-sm md:text-base">
                Download videos & audio from YouTube effortlessly
              </p>
            </div>

            {/* URL Input Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter YouTube URL
              </label>
              <div className="relative mb-4">
                <input
                  type="url"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addYoutubeUrl()}
                  placeholder="Enter YouTube Link/URL"
                  className="w-full px-4 py-4 pr-32 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                />
                <button
                  onClick={addYoutubeUrl}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Add
                </button>
              </div>

              {/* Added URLs List */}
              {videoConfigs.length > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      Added Videos ({videoConfigs.length})
                    </h3>
                    <button
                      onClick={() => setVideoConfigs([])}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {videoConfigs.map((config, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedUrlIndex(index)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all group cursor-pointer ${
                          selectedUrlIndex === index
                            ? "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-400 shadow-md"
                            : "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            selectedUrlIndex === index
                              ? "bg-blue-500"
                              : "bg-blue-100"
                          }`}
                        >
                          <Play
                            className={`w-4 h-4 ${
                              selectedUrlIndex === index
                                ? "text-white"
                                : "text-blue-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-700 truncate block">
                            {config.url}
                          </span>
                          <span className="text-xs text-gray-500">
                            {config.format.toUpperCase()} • {config.quality}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeYoutubeUrl(index);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Format Selection - Only show if URLs added */}
            {videoConfigs.length > 0 && (
              <>
                {/* Video Preview */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-500" />
                    Video Preview
                  </h3>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                    {videoConfigs.length > 0 && (
                      <img
                        src={getThumbnailUrl(
                          videoConfigs[selectedUrlIndex].url
                        )}
                        alt="Video Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to hqdefault if maxresdefault fails
                          const videoId = extractVideoId(
                            videoConfigs[selectedUrlIndex].url
                          );
                          if (
                            videoId &&
                            e.currentTarget.src.includes("maxresdefault")
                          ) {
                            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                          }
                        }}
                      />
                    )}
                  </div>
                  {videoConfigs.length > 1 && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Showing video {selectedUrlIndex + 1} of{" "}
                      {videoConfigs.length}
                    </p>
                  )}
                </div>

                {/* Format Selection Buttons */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Select Format
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <button
                      onClick={() => updateFormat("mp4")}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        videoConfigs[selectedUrlIndex]?.format === "mp4"
                          ? "bg-blue-50 border-blue-500 shadow-lg"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Video
                        className={`w-6 h-6 mx-auto mb-2 ${
                          videoConfigs[selectedUrlIndex]?.format === "mp4"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-bold ${
                          videoConfigs[selectedUrlIndex]?.format === "mp4"
                            ? "text-blue-700"
                            : "text-gray-600"
                        }`}
                      >
                        .MP4
                      </p>
                    </button>

                    <button
                      onClick={() => updateFormat("mp3")}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        videoConfigs[selectedUrlIndex]?.format === "mp3"
                          ? "bg-purple-50 border-purple-500 shadow-lg"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Music
                        className={`w-6 h-6 mx-auto mb-2 ${
                          videoConfigs[selectedUrlIndex]?.format === "mp3"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-bold ${
                          videoConfigs[selectedUrlIndex]?.format === "mp3"
                            ? "text-purple-700"
                            : "text-gray-600"
                        }`}
                      >
                        .MP3
                      </p>
                    </button>

                    <button
                      onClick={() => updateFormat("webm")}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        videoConfigs[selectedUrlIndex]?.format === "webm"
                          ? "bg-green-50 border-green-500 shadow-lg"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Film
                        className={`w-6 h-6 mx-auto mb-2 ${
                          videoConfigs[selectedUrlIndex]?.format === "webm"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-bold ${
                          videoConfigs[selectedUrlIndex]?.format === "webm"
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        .WebM
                      </p>
                    </button>

                    <button
                      onClick={() => updateFormat("wav")}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        videoConfigs[selectedUrlIndex]?.format === "wav"
                          ? "bg-pink-50 border-pink-500 shadow-lg"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Music
                        className={`w-6 h-6 mx-auto mb-2 ${
                          videoConfigs[selectedUrlIndex]?.format === "wav"
                            ? "text-pink-600"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-bold ${
                          videoConfigs[selectedUrlIndex]?.format === "wav"
                            ? "text-pink-700"
                            : "text-gray-600"
                        }`}
                      >
                        .WAV
                      </p>
                    </button>
                  </div>

                  {/* Other Formats Expandable */}
                  <details className="group">
                    <summary className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer font-medium flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Other formats
                    </summary>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                      {["mkv", "avi", "aac", "flac", "ogg"].map((format) => (
                        <button
                          key={format}
                          onClick={() => updateFormat(format)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                            videoConfigs[selectedUrlIndex]?.format === format
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          .{format.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </details>
                </div>

                {/* Quality Selection */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Quality
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {
                        value: "low",
                        label: "Low",
                        subtitle: "Faster",
                        emoji: "⚡",
                      },
                      {
                        value: "medium",
                        label: "Medium",
                        subtitle: "Balanced",
                        emoji: "⭐",
                      },
                      {
                        value: "high",
                        label: "High",
                        subtitle: "Better",
                        emoji: "💎",
                      },
                      {
                        value: "ultra",
                        label: "Ultra",
                        subtitle: "Best",
                        emoji: "🚀",
                      },
                    ].map(({ value, label, subtitle, emoji }) => (
                      <button
                        key={value}
                        onClick={() => updateQuality(value)}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          videoConfigs[selectedUrlIndex]?.quality === value
                            ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400 shadow-lg"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{emoji}</div>
                        <p
                          className={`text-sm font-bold ${
                            videoConfigs[selectedUrlIndex]?.quality === value
                              ? "text-yellow-700"
                              : "text-gray-700"
                          }`}
                        >
                          {label}
                        </p>
                        <p className="text-xs text-gray-500">{subtitle}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleUrlUpload}
                  disabled={uploading}
                  className="w-full py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      Download {videoConfigs.length} Video(s)
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          /* File Dropzone */
          <>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg scale-105"
                  : "border-gray-300 hover:border-indigo-400 bg-white hover:shadow-lg"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div
                  className={`p-6 rounded-2xl mb-6 transition-all duration-300 ${
                    isDragActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 scale-110"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}
                >
                  <FileUp className="w-16 h-16 text-white" />
                </div>
                {isDragActive ? (
                  <p className="text-xl font-semibold text-indigo-600 mb-2">
                    Drop files here! ✨
                  </p>
                ) : (
                  <>
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                      Drag & drop files here
                    </p>
                    <p className="text-gray-500 mb-4">or click to browse</p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all">
                      <UploadIcon className="w-5 h-5" />
                      Choose Files
                    </div>
                  </>
                )}
                <p className="text-sm text-gray-500 mt-6 flex flex-wrap justify-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded">MP4</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">AVI</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">MOV</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">MP3</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">WAV</span>
                  <span className="text-gray-400">and more...</span>
                </p>
              </div>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Selected Files ({files.length})
                </h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Film className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversion Settings */}
            {files.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Conversion Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Output Format
                    </label>
                    <select
                      value={fileOutputFormat}
                      onChange={(e) => setFileOutputFormat(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    >
                      <optgroup label="🎵 Audio">
                        <option value="mp3">MP3</option>
                        <option value="wav">WAV</option>
                        <option value="aac">AAC</option>
                        <option value="flac">FLAC</option>
                        <option value="ogg">OGG</option>
                      </optgroup>
                      <optgroup label="🎬 Video">
                        <option value="mp4">MP4</option>
                        <option value="webm">WebM</option>
                        <option value="mkv">MKV</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Quality
                    </label>
                    <select
                      value={fileQuality}
                      onChange={(e) => setFileQuality(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    >
                      <option value="low">Low ⚡ (Faster)</option>
                      <option value="medium">Medium ⭐</option>
                      <option value="high">High 💎</option>
                      <option value="ultra">Ultra 🚀 (Slower)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleFileUpload}
                  disabled={uploading}
                  className="mt-6 w-full flex items-center justify-center gap-3 py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all transform hover:scale-105"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-6 h-6" />
                      Upload and Convert {files.length} File(s)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
