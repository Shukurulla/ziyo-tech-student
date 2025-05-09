import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import { FaCheckCircle } from "react-icons/fa";
import axios from "../services/api";
import { FiChevronLeft } from "react-icons/fi";

const TestPage = () => {
  const { videoId } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [next, setNext] = useState(null);
  // Fetch test data
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await axios.get(`/api/tests/${videoId}`);
        setTest(data.data);
      } catch (err) {
        console.error("Failed to fetch test:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get(`/api/student/videos/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
          },
        });

        if (data.status === "success") {
          const currentIndex = data.data.findIndex((v) => v._id === videoId);
          if (currentIndex !== -1 && currentIndex < data.data.length - 1) {
            setNext(data.data[currentIndex + 1]);
          } else {
            setNext(null);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchVideos();
    fetchTest();
  }, [videoId]);

  // Handle change in answer
  const handleChange = (questionIndex, value) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  // Check if all questions are answered
  const allAnswered = test?.questions?.length === Object.keys(answers).length;

  // Handle submit
  const handleSubmit = async () => {
    let correct = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const totalScore = `${correct} / ${test.questions.length}`;
    setScore(totalScore);
    setSubmitted(true);

    try {
      const res = await axios.post(
        `/api/tests/${videoId}/submit`,
        { answers, score: totalScore },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
          },
        }
      );
      console.log("Submitted:", res.data);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!test)
    return (
      <div>
        <Button onClick={() => navigate(-1)} className="">
          <FiChevronLeft size={25} />
        </Button>
        <div className="text-center mt-10 text-red-500">
          Bu videoga test qoshilmagan
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto  p-4">
      <Button onClick={() => navigate(-1)} className="">
        <FiChevronLeft size={25} />
      </Button>
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        {test.topic} Test
      </h1>

      {test.questions?.map((q, index) => (
        <Card key={index} className="shadow-md">
          <CardContent className="space-y-4">
            <p className="font-semibold text-lg">
              {index + 1}. {q.question}
            </p>
            <RadioGroup
              value={answers[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
            >
              {["a", "b", "c", "d"].map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <Radio value={opt} disabled={submitted} />
                  <span>{q.options[opt]}</span>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <div className="text-center mt-6">
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!allAnswered || submitted}
          className={`px-6 py-2 rounded-xl ${
            !allAnswered || submitted
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Submit
        </Button>
      </div>

      {submitted && (
        <div className="text-center mt-4 text-green-600 font-bold text-xl  justify-center items-center gap-2">
          <div className={"flex items-center justify-center"}>
            <FaCheckCircle className="text-2xl" />
          </div>
          <div>You scored: {score}</div>
          {!next ? (
            <div className="text-center mt-2 text-gray-500">
              Siz oxirgi testni yakunladingiz!
            </div>
          ) : (
            <Button
              variant="contained"
              onClick={() => next && navigate(`/video/${next._id}`)}
            >
              Keyingi Darsga o'tish
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TestPage;
