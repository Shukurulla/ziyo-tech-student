import { FaDownload, FaLink } from "react-icons/fa";
import Button from "@mui/material/Button";

const handleDownload = async (url) => {
  try {
    const response = await fetch(
      url.replace("http://teacher.ziyo-tech.uz/api", "https://ziyo-tech.uz/api")
    );
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "file";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Yuklab olishda xato:", error);
  }
};

export default function MaterialButton({ item }) {
  const isLink = item.content === "link";

  const handleClick = () => {
    if (isLink) {
      // Agar link bo‘lsa — havolani ochamiz
      window.open(item.fileUrl, "_blank");
    } else {
      // Aks holda yuklab olamiz
      handleDownload(item.fileUrl);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={isLink ? <FaLink /> : <FaDownload />}
      className="mt-auto"
      color={isLink ? "secondary" : "primary"}
      onClick={handleClick}
    >
      {isLink ? "Havolani ochish" : "Yuklab olish"}
    </Button>
  );
}
