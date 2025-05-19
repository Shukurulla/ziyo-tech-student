// Updated src/pages/MatchingTestPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Grid,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Container,
} from "@mui/material";
import { FiChevronLeft, FiCheck, FiX } from "react-icons/fi";
import axios from "../services/api";
import toast from "react-hot-toast";

const MatchingTestPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [next, setNext] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`/api/questions`);
        const matchingTest = res.data.find((test) => test.videoId === videoId);

        if (matchingTest) {
          setTest(matchingTest);

          // Separate items into left and right columns
          const left = matchingTest.options.filter((opt) => opt.group === 1);
          const right = matchingTest.options.filter((opt) => opt.group === 2);

          // Shuffle the arrays
          const shuffledLeft = [...left].sort(() => Math.random() - 0.5);
          const shuffledRight = [...right].sort(() => Math.random() - 0.5);

          setLeftItems(shuffledLeft);
          setRightItems(shuffledRight);
        } else {
          setError("Bu video uchun matching test mavjud emas");
        }
      } catch (err) {
        console.error("Failed to fetch matching test:", err);
        setError("Test yuklanishida xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    const fetchVideos = async () => {
      try {
        const { data } = await axios.get(`/api/student/videos/all`);
        if (data.status === "success") {
          const currentIndex = data.data.findIndex((v) => v._id === videoId);
          if (currentIndex !== -1 && currentIndex < data.data.length - 1) {
            setNext(data.data[currentIndex + 1]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };

    fetchTest();
    fetchVideos();
  }, [videoId]);

  const handleLeftClick = (item) => {
    if (submitted) return;
    // Toggle selection if clicking the same item
    if (selectedLeft?.text === item.text) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(item);
    }
  };

  const handleRightClick = (item) => {
    if (submitted || !selectedLeft) return;

    // Check if the pair is correct
    const isCorrect = selectedLeft.match === item.text;

    // Add new pair
    const newPair = {
      left: selectedLeft,
      right: item,
      isCorrect: isCorrect,
    };

    // Add visual feedback
    toast(isCorrect ? "To'g'ri juftlik!" : "Noto'g'ri juftlik", {
      icon: isCorrect ? "✅" : "❌",
      style: {
        borderRadius: "10px",
        background: isCorrect ? "#E8F5E9" : "#FFEBEE",
        color: isCorrect ? "#1B5E20" : "#B71C1C",
      },
      duration: 1500,
    });

    // Only accept correct pairs
    if (isCorrect) {
      setPairs([...pairs, newPair]);

      // Remove items from available options
      setLeftItems(leftItems.filter((i) => i.text !== selectedLeft.text));
      setRightItems(rightItems.filter((i) => i.text !== item.text));
    }

    // Reset selection
    setSelectedLeft(null);
  };

  const handleRemovePair = (index) => {
    if (submitted) return;

    const pair = pairs[index];
    setLeftItems([...leftItems, pair.left]);
    setRightItems([...rightItems, pair.right]);

    const newPairs = [...pairs];
    newPairs.splice(index, 1);
    setPairs(newPairs);
  };

  const handleSubmit = async () => {
    // Check if all pairs are created
    if (leftItems.length > 0) {
      return toast.error("Barcha juftliklarni yarating");
    }

    // Calculate score
    let correct = pairs.filter((pair) => pair.isCorrect).length;
    setScore({ correct, total: pairs.length });
    setSubmitted(true);

    // Save score in database
    try {
      await axios.post(`/api/tests/${videoId}/submit`, {
        answers: { matching: pairs },
        score: `${correct}/${pairs.length}`,
      });
    } catch (err) {
      console.error("Failed to submit test:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button onClick={() => navigate(-1)} className="mb-4">
          <FiChevronLeft size={25} />
        </Button>
        <Typography variant="h5" className="text-center mt-10 text-red-500">
          {error}
        </Typography>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button onClick={() => navigate(-1)} className="mb-4">
          <FiChevronLeft size={25} />
        </Button>
        <Typography variant="h5" className="text-center mt-10 text-red-500">
          Test topilmadi
        </Typography>
      </div>
    );
  }

  return (
    <Container maxWidth="lg" className="py-6">
      <Button
        onClick={() => navigate(-1)}
        className="mb-6"
        variant="outlined"
        startIcon={<FiChevronLeft />}
      >
        Orqaga
      </Button>

      <Typography variant="h4" className="font-bold mb-4 text-center">
        {test.questionText || "Juftlash Testi"}
      </Typography>

      <Typography variant="body1" className="mb-8 text-center text-gray-600">
        Chap ustundagi javobni tanlang, keyin unga mos keluvchi o'ng ustundagi
        savolni tanlang
      </Typography>

      {/* Pairs display */}
      {pairs.length > 0 && (
        <Card className="mb-6">
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-3">
              Tanlangan juftliklar
            </Typography>
            <div className="grid gap-2">
              {pairs.map((pair, index) => (
                <Paper
                  key={index}
                  className={`p-3 flex justify-between items-center ${
                    pair.isCorrect
                      ? "bg-green-50 border-green-200 border"
                      : "bg-red-50 border-red-200 border"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Chip
                      label={pair.left.text}
                      color="primary"
                      variant="outlined"
                    />
                    <span className="mx-2">→</span>
                    <Chip
                      label={pair.right.text}
                      color="secondary"
                      variant="outlined"
                    />
                  </div>
                  {!submitted && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemovePair(index)}
                      variant="outlined"
                      startIcon={<FiX />}
                    >
                      O'chirish
                    </Button>
                  )}
                </Paper>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection area */}
      {!submitted && (
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  className="font-semibold mb-3 text-center"
                >
                  Savol va Javoblar
                </Typography>
                <Divider className="mb-4" />
              </Grid>

              {/* Matching area */}
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  className="mb-3 font-semibold text-center"
                >
                  Javoblar
                </Typography>
                <div className="space-y-2">
                  {leftItems.map((item, index) => (
                    <Paper
                      key={index}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedLeft?.text === item.text
                          ? "bg-blue-100 border border-blue-500 shadow-md"
                          : "hover:bg-gray-50 hover:shadow"
                      }`}
                      onClick={() => handleLeftClick(item)}
                    >
                      {item.text}
                    </Paper>
                  ))}
                </div>
              </Grid>

              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  className="mb-3 font-semibold text-center"
                >
                  Savollar
                </Typography>
                <div className="space-y-2">
                  {rightItems.map((item, index) => (
                    <Paper
                      key={index}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedLeft
                          ? "hover:bg-green-50 hover:border-green-500 hover:border hover:shadow"
                          : "hover:bg-gray-50 hover:shadow"
                      }`}
                      onClick={() => handleRightClick(item)}
                    >
                      {item.text}
                    </Paper>
                  ))}
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Box className="mt-6 text-center">
        {submitted ? (
          <div>
            <Typography variant="h5" className="font-bold text-center mb-4">
              Natija: {score.correct} / {score.total}
            </Typography>
            {next && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/video/${next._id}`)}
                size="large"
              >
                Keyingi darsga o'tish
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={leftItems.length > 0 || pairs.length === 0}
            size="large"
            startIcon={<FiCheck />}
          >
            Tekshirish
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default MatchingTestPage;
