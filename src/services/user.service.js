import toast from "react-hot-toast";
import {
  getUserFailure,
  getUserStart,
  getUserSuccess,
} from "../slices/user.slices";
import axios from "./api";

const UserService = {
  async signUser(dispatch, user, navigate) {
    dispatch(getUserStart());
    try {
      const { data } = await axios.post("/api/student/sign", user);
      if (data.token) {
        localStorage.setItem("ziyo-jwt", data.token);
      }
      dispatch(getUserSuccess(data.data));
      toast.success("Ro'yhatdan muaffaqiyatli o'tdingiz");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(getUserFailure());
    }
  },
  async loginUser(dispatch, user, navigate) {
    dispatch(getUserStart());
    try {
      const { data } = await axios.post("/api/student/login", user);
      if (data.token) {
        localStorage.setItem("ziyo-jwt", data.token);
      }
      dispatch(getUserSuccess(data.data));
      toast.success("Ro'yhatdan muaffaqiyatli o'tdingiz");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch(getUserFailure());
    }
  },
  async profile(dispatch) {
    dispatch(getUserStart());
    try {
      const { data } = await axios.get("/api/student/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
        },
      });
      dispatch(getUserSuccess(data.data));
      return data.data;
    } catch (error) {
      console.log(error);
      dispatch(getUserFailure());
    }
  },
};

export default UserService;
