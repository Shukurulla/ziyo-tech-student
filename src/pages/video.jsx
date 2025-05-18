import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { FaDownload } from "react-icons/fa";
import { FiCheck, FiChevronLeft, FiClock, FiLock } from "react-icons/fi";
import FileUploader from "../components/fileUploader";
import { convertToHttps } from "../utils";

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tests, setTests] = useState([]);
  const [testLoading, setTestLoading] = useState(false);
  const navigate = useNavigate();
  const [allVideos, setAllVideos] = useState([]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/video/${id}`);
        if (res.data.status === "success") {
          setVideo(res.data.data);
        } else {
          setError("Video topilmadi");
        }
      } catch (err) {
        setError("Xatolik yuz berdi: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/api/student/videos/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
          },
        });

        if (res.data.status === "success") {
          console.log(res.data.data);

          setAllVideos(res.data.data);
        } else {
          setError("Video topilmadi");
        }
      } catch (err) {
        setError("Xatolik yuz berdi: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTests = async () => {
      try {
        setTestLoading(true);
        const res = await axios.get(`/api/tests/${id}`);
        setTests(res.data);
      } catch (err) {
        console.error("Testlarni olishda xatolik:", err.message);
      } finally {
        setTestLoading(false);
      }
    };
    fetchVideos();
    fetchVideo();
    fetchTests();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!video) return null;
  const statusVideo = (video) => {
    if (video.complete) return <FiCheck size={16} />;
    if (video._id === id) return <FiClock size={16} />;
    return <FiLock size={16} />;
  };

  return (
    <div className="row">
      <div className="col-lg-9 col-md-8">
        <div className="md:px-8  mx-auto">
          <Button onClick={() => navigate("/")} className="mb-3">
            <FiChevronLeft size={25} />
          </Button>

          {/* Video player */}
          <div className="relative w-full h-[60vh] mb-6 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={video.video?.player}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              title={video.title}
              className="w-full h-full"
            ></iframe>
          </div>

          {/* Video info */}
          <Card className="mb-6">
            <CardContent>
              <Typography variant="h5" className="font-bold mb-2">
                {video.title}
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                {video.description}
              </Typography>
              <Typography variant="body2" className="text-gray-400 mt-2">
                Qo‘shilgan sana:{" "}
                {new Date(video.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>

          {/* Presentations */}
          {video.presentations &&
            Object.keys(video.presentations).length > 0 && (
              <div className="mb-6">
                <Typography variant="h6" className="mb-2 font-semibold">
                  Prezentatsiyalar
                </Typography>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(video.presentations).map(([name, url]) => (
                    <Button
                      key={name}
                      href={convertToHttps(url)}
                      onClick={() => convertToHttps(url)}
                      variant="outlined"
                      download
                      startIcon={<FaDownload />}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

          {/* Audios */}
          {video.audios && Object.keys(video.audios).length > 0 && (
            <div className="mb-6">
              <Typography variant="h6" className="mb-2 font-semibold">
                Audios
              </Typography>
              <div className="flex flex-wrap gap-4">
                {Object.entries(video.audios).map(([name, url]) => (
                  <div
                    key={name}
                    className="flex flex-col items-start gap-1 border  rounded-full shadow w-full "
                  >
                    <audio controls className="w-full">
                      <source src={convertToHttps(url)} type="audio/mpeg" />
                      Brauzeringiz audio pleerni qo‘llab-quvvatlamaydi.
                    </audio>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => navigate(`/video/${id}/test-selection`)}
                variant="contained"
                className="w-100 mt-3"
              >
                Testni yechish
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="col-lg-3 col-md-4">
        <div className="bg-white shadow rounded-xl mb-3 p-6 w-full max-w-md mx-auto">
          {allVideos.map((video, idx) => (
            <div
              key={video._id}
              className={`flex items-center justify-between p-2 mb-2 rounded-xl cursor-pointer ${
                video._id === id
                  ? "border-[1px] border-blue-500"
                  : video.complete == true || idx === 0
                  ? "bg-gray-50"
                  : "bg-gray-50 opacity-50 cursor-not-allowed"
              }`}
              onClick={() => {
                if (video.complete || video._id === 0) {
                  window.location.href = `/video/${video._id}`;
                }
              }}
            >
              <div>
                <p className="text-md text-gray-900">{video.title}</p>
              </div>
              <div className="w-8">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 text-blue-500">
                  {statusVideo(video)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <FileUploader videoId={id} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
