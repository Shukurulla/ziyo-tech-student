import React, { useEffect, useState } from "react";
import { practicTests } from "../constants";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const PracticTests = () => {
  const [practices, setPractices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPractics = async () => {
      try {
        const { data } = await axios.get("/api/practices");
        console.log(data.data);

        setPractices(data.data);
      } catch (error) {}
    };
    fetchPractics();
  }, []);
  return (
    <div>
      <div className="row">
        {practices.map((item) => (
          <div className="col-lg-6 col-md-6 col-m">
            <div
              className={`mb-4 p-3 cursor-pointer select-none ${
                item.completed == true
                  ? "bg-[#2AD92A66] text-[#135213]"
                  : "bg-white"
              } rounded-lg `}
              onClick={() => navigate(`/practicum-test/${item._id}`)}
            >
              <h1 className=" text-3xl font-[500] mb-3">{item.title}</h1>
              <p className="text-lg">{item.description}</p>
              <p className="text-end font-[600] text-lg">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticTests;
