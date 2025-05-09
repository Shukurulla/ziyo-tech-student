import React, { useEffect, useState } from "react";
import axios from "axios";
import { MaterialThumbnail } from "../assets";

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

  const handleMaterialClick = (material) => {
    if (material.content === "file") {
      // Trigger file download
      const link = document.createElement("a");
      link.href = material.fileUrl;
      link.download = material.fileUrl.split("/").pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (material.content === "link") {
      // Redirect to the URL
      window.open(material.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) return <p className="text-center mt-10">Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div>
      <div className="row">
        {materials.map((item) => (
          <a
            key={item._id}
            className="col-lg-4 mb-5 col-md-4 col-sm-6 col-12"
            href={item.fileUrl}
            style={{ cursor: "pointer" }}
          >
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="thumbnail">
                <img src={MaterialThumbnail} alt="" />
              </div>
              <div className="p-3">
                <h1 className="text-2xl mb-2 font-[500]">"{item.title}"</h1>
                <p className="text-[#8C96A1]">{item.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Materials;
