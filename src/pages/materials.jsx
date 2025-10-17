// Improved src/pages/materials.jsx for students
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import {
  FaFileWord,
  FaFilePdf,
  FaImage,
  FaLink,
  FaDownload,
} from "react-icons/fa";
import { convertToHttps } from "../utils";
import { handleDownload } from "../utils/download";

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get("/api/materials", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
          },
        });
        setMaterials(res.data.data);
      } catch (err) {
        setError("Xatolik yuz berdi: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const getFileIcon = (fileType) => {
    if (!fileType) return <FaFileWord size={30} className="text-blue-500" />;

    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FaFilePdf size={30} className="text-red-500" />;
      case "doc":
      case "docx":
        return <FaFileWord size={30} className="text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaImage size={30} className="text-green-500" />;
      case "link":
        return <FaLink size={30} className="text-purple-500" />;
      default:
        return <FaFileWord size={30} className="text-blue-500" />;
    }
  };

  if (loading)
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography className="text-red-500 text-center mt-10">
        {error}
      </Typography>
    );

  return (
    <div className="p-6">
      <Typography variant="h5" className="mb-6 font-bold text-gray-800">
        O'quv materiallari
      </Typography>

      <div className="row">
        {materials.map((item) => (
          <div className="col-lg-4 col-md-6 col-sm-12" key={item._id}>
            <Card
              className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() =>
                window.open(convertToHttps(item.fileUrl), "_blank")
              }
            >
              {/* Display thumbnail if available, otherwise show icon */}
              {item.thumbnailUrl ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={convertToHttps(item.thumbnailUrl)}
                  alt={item.title}
                  className="h-48 object-cover"
                />
              ) : (
                <Box className="h-48 flex items-center justify-center bg-gray-100">
                  <Box className="text-center">
                    {getFileIcon(item.fileType)}
                    <Typography variant="body2" className="mt-2 text-gray-600">
                      {item.fileType?.toUpperCase() || "DOKUMENT"}
                    </Typography>
                  </Box>
                </Box>
              )}

              <CardContent className="flex-1 flex flex-col">
                <Typography variant="h6" className="font-semibold mb-2">
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-600 mb-4 flex-grow line-clamp-3"
                >
                  {item.description}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={
                    item.content === "link" ? <FaLink /> : <FaDownload />
                  }
                  className="mt-auto"
                  color={item.content === "link" ? "secondary" : "primary"}
                  onClick={() => {
                    if (item.content === "link") {
                      // Agar bu link bo‘lsa, yangi oynada ochamiz
                      window.open(item.fileUrl, "_blank");
                    } else {
                      // Aks holda yuklab olamiz
                      handleDownload(item.fileUrl);
                    }
                  }}
                >
                  {item.content === "link" ? "Havolani ochish" : "Yuklab olish"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}

        {materials.length === 0 && (
          <Grid item xs={12}>
            <Typography className="text-center text-gray-500 py-8">
              Hozircha materiallar mavjud emas
            </Typography>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default Materials;
