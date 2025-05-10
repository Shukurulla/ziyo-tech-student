import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Typography, Box, Divider, Chip } from "@mui/material";
import { FiDownload, FiUpload, FiChevronLeft } from "react-icons/fi";
import { saveAs } from "file-saver";

const PracticeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [work, setWork] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPractice = async () => {
      try {
        const res = await axios.get(`/api/practices/${testId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
          },
        });

        if (res.data.data) {
          setPractice(res.data.data);
          setCompleted(res.data.data.completed || false);
          setWork(res.data.data.work || null);
        } else {
          setError("Topshiriq topilmadi");
        }
      } catch (err) {
        setError("Xatolik yuz berdi: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPractice();
  }, [testId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("practiceId", testId);

      const res = await axios.post("/api/practiceWork/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
        },
      });

      if (res.data.status === "success") {
        setWork(res.data.data);
        setCompleted(true);
        setFile(null);
      }
    } catch (err) {
      setError("Yuklashda xatolik: " + err.message);
    }
    setIsLoading(false);
  };

  const handleDownloadTemplate = () => {
    if (!practice?.fileUrl) return;
    saveAs(practice.fileUrl, `${practice.title}.docx`);
  };

  if (loading) return <p className="text-center mt-10">Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!practice) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex mb-4 items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          startIcon={<FiChevronLeft />}
          className=""
        ></Button>

        <Box className=" flex justify-end">
          <Chip
            label={new Date(practice.createdAt).toLocaleDateString()}
            variant="outlined"
          />
        </Box>
      </div>

      <Card className="mb-6">
        <Box className="p-6">
          <Typography variant="h4" className="font-bold mb-2">
            {practice.title}
          </Typography>
          <Typography variant="body1" className="mb-4">
            {practice.description}
          </Typography>

          <Divider className="my-4" />

          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold">
              Topshiriq texnik vazifa:
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FiDownload />}
              onClick={handleDownloadTemplate}
            >
              Shaklni yuklab olish
            </Button>
          </div>

          <Typography variant="body1" className="text-gray-500">
            Topshiriq shaklini yuklab oling va talablarga muvofiq bajaring
          </Typography>
        </Box>
      </Card>

      <Card>
        <Box className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            {completed ? "Yuklangan topshiriq" : "Topshiriqni yuklash"}
          </Typography>

          {completed ? (
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded">
              <Typography variant="body1">
                {work?.fileUrl?.split("/").pop() || "Yuklangan fayl"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.open(work.fileUrl, "_blank")}
              >
                Ko'rish
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="file"
                id="practice-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".doc,.docx"
              />
              <label htmlFor="practice-upload" className="block">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<FiUpload />}
                  fullWidth
                >
                  Fayl tanlash
                </Button>
              </label>

              {file && (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded">
                  <Typography variant="body1">{file.name}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Yuklanmoqda..." : "Yuklash"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Box>
      </Card>
    </div>
  );
};

export default PracticeTest;
