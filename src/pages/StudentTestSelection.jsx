import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from "@mui/material";
import { FiChevronLeft, FiCheckCircle } from "react-icons/fi";
import axios from "../services/api";

const StudentTestSelection = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState({ regular: null, matching: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Get regular test
        const regularRes = await axios.get(`/api/tests/${videoId}`);

        // Get matching test
        try {
          const matchingRes = await axios.get(
            `/api/questions/video/${videoId}`
          );
          if (matchingRes.data && matchingRes.data.length > 0) {
            setTests({
              regular: regularRes.data.data || null,
              matching: matchingRes.data[0] || null, // Take the first matching test for this video
            });
          } else {
            setTests({
              regular: regularRes.data.data || null,
              matching: null,
            });
          }
        } catch (err) {
          // If matching test fetch fails, still set regular test
          console.error("Matching test fetch error:", err);
          setTests({
            regular: regularRes.data.data || null,
            matching: null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch tests:", err);
        setError("Testlarni yuklab olishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button onClick={() => navigate(-1)}>
          <FiChevronLeft size={25} />
        </Button>
        <Typography variant="h5" className="text-center mt-10 text-red-500">
          {error}
        </Typography>
      </div>
    );
  }

  // If no tests are available
  if (!tests.regular && !tests.matching) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button onClick={() => navigate(-1)}>
          <FiChevronLeft size={25} />
        </Button>
        <Typography variant="h5" className="text-center mt-10 text-gray-600">
          Bu video uchun testlar mavjud emas
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button onClick={() => navigate(-1)} className="mb-4">
        <FiChevronLeft size={25} />
      </Button>

      <Typography variant="h4" className="font-bold mb-6 text-center">
        Test turini tanlang
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regular Test Card */}
        {tests.regular && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <Typography variant="h5" className="font-bold mb-4">
                {tests.regular.topic}
              </Typography>
              <Typography className="mb-6 text-gray-600">
                {tests.regular.questions.length} ta savol - Har bir savolda
                to'g'ri javobni tanlang
              </Typography>
              <Box className="flex justify-center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/video/${videoId}/test`)}
                  fullWidth
                >
                  Testni boshlash
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Matching Test Card */}
        {tests.matching && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <Typography variant="h5" className="font-bold mb-4">
                {tests.matching.questionText || "Juftlash Testi"}
              </Typography>
              <Typography className="mb-6 text-gray-600">
                Juftlash testi - So'zlar va ularning juftlarini to'g'ri bog'lang
              </Typography>
              <Box className="flex justify-center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/video/${videoId}/matching-test`)}
                  fullWidth
                >
                  Testni boshlash
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentTestSelection;
