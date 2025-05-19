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
          <div className="col-lg-6 col-md-6  col-m">
            <div
              className={`mb-4 p-3 relative cursor-pointer h-[150px] select-none ${
                item.completed == true
                  ? "bg-[#2AD92A66] text-[#135213]"
                  : "bg-white"
              } rounded-lg `}
              onClick={() => navigate(`/practicum-test/${item._id}`)}
            >
              <h1 className=" text-3xl font-[500] mb-2">{item.title}</h1>
              <p className="text-md">
                {item.description.slice(0, 100)}
                {item.description.length > 100 ? "..." : ""}
              </p>
              <p className="text-end absolute bottom-3 right-5 font-[600] text-md">
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
