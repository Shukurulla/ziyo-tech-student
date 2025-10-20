const handleDownload = async (url) => {
  try {
    // Convert any old domain URLs to server.ziyo-tech.uz
    let correctedUrl = url;
    if (url.includes("ziyo-tech.uz")) {
      correctedUrl = url.replace(
        /https?:\/\/[^\/]*ziyo-tech\.uz/,
        "https://server.ziyo-tech.uz"
      );
    }

    const response = await fetch(correctedUrl);
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
