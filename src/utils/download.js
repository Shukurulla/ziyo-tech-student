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

export { handleDownload };
