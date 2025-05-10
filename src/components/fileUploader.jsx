import { FiDownload, FiFile, FiPlus } from "react-icons/fi";
import axios from "../services/api";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convertToHttps } from "../utils";

const FileUploader = ({ videoId }) => {
  const [files, setFiles] = useState([]);
  const [work, setWork] = useState(null);
  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };
  const [isLoading, setIsLoading] = useState(false);

  const fetchWork = async () => {
    try {
      const { data } = await axios.get(`/api/videoWork/${videoId}`);

      if (data.status == "success") {
        setWork(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchWork();
  }, [videoId]);

  const handleUpload = async () => {
    setIsLoading(true);
    if (files.length === 0) {
      return alert("Fayl tanlanmagan");
    }

    const formData = new FormData();

    // Fayllarni qo'shish
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Kerakli id-lar // Bu ID-ni dinamik holatda o'zgaruvchan qilish mumkin
    formData.append("videoId", videoId);

    try {
      const { data } = await axios.post("/api/videoWork/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.status == "success") {
        toast.success("Fayllar muvaffaqiyatli yuborildi!");
        console.log("Natija:", data);
      } else {
        console.error("Xatolik:", data.error);
        toast.error("Yuborishda xatolik yuz berdi.");
      }
      fetchWork();
      setIsLoading(false);
    } catch (err) {
      console.error("Tarmoq xatolik:", err.message);
      toast.error("Serverga ulanishda xatolik yuz berdi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        {!work ? "Uyga vazifa yuklash" : "Uyga vazifalarim"}{" "}
      </h2>

      <div className="flex flex-col gap-2 mb-4">
        {!work ? (
          <div>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>{file.name}</span>
                </div>
                <span>{Math.round(file.size / 1024)} kB</span>
              </div>
            ))}
            <label
              htmlFor="file-upload"
              className="cursor-pointer my-3 flex items-center justify-center text-blue-600 hover:text-blue-800 text-center text-2xl"
            >
              <FiPlus />
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              disabled={isLoading}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 w-full text-sm font-semibold"
            >
              {isLoading ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </div>
        ) : (
          work.works.map((work) => (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center justify-between w-100">
                <div className="flex items-center gap-2">
                  <FiFile />
                  <span>{work.title}</span>
                </div>
                <a href={convertToHttps(work.fileUrl)} download={"Work"}>
                  <FiDownload />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileUploader;
