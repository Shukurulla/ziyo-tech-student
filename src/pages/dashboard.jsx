import React, { useEffect, useState } from "react";
import { FiClock, FiLock, FiPlay, FiPlus, FiVideo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("/api/student/videos/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
          },
        });
        if (res.data.status === "success") {
          console.log(res.data.data);

          setVideos(res.data.data);
        }
      } catch (err) {
        console.error("Video olishda xatolik:", err);
      }
    };

    fetchVideos();
  }, []);

  const videoStatus = (video, idx) => {
    if (video.complete == true || idx == 0) return <FiPlay />;
    if (video.complete == false) return <FiLock />;
    if (video.complete == "watching") return <FiClock />;
  };

  return (
    <div>
      <div className="flex mb-3 items-center justify-between">
        <h1 className="text-2xl font-[600]">Video darslar</h1>
      </div>

      <div className="row">
        {videos.map((item, idx) => (
          <div
            key={item._id}
            className="col-lg-4 col-md-4 col-sm-6 col-12"
            onClick={() =>
              item.complete == true || idx == 0 || item.complete == "watching"
                ? navigate(`/video/${item._id}`)
                : ""
            }
          >
            <div
              className={`${
                item.complete == true || idx == 0 || item.complete == "watching"
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              } mb-4`}
            >
              <div className="relative video-image rounded-lg overflow-hidden h-[180px] bg-gray-100">
                <img
                  src={item.video?.thumbnail}
                  loading="eager"
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                {/* Play Icon Centered */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#1111] bg-opacity-40 hover:bg-opacity-50 transition">
                  <div className="w-14 flex items-center justify-center bg-white rounded-full h-14">
                    {videoStatus(item, idx)}
                  </div>
                </div>
              </div>
              <h1 className="text-md font-[600] mt-2">{item.title}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
