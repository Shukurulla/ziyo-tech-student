import React, { useEffect, useState } from "react";
import axios from "../services/api"; // API chaqiruvlari uchun
import { FaSave } from "react-icons/fa"; // Ikoncha
import { useDispatch } from "react-redux";
import UserService from "../services/user.service"; // Foydalanuvchi ma'lumotlarini olish
import toast from "react-hot-toast";

export default function EditProfile() {
  const [user, setUser] = useState({}); // Studentning ma'lumotlarini olish
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    level: "",
    school: "",
    login: "",
    password: "",
  });

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Studentni profilini olish
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await UserService.profile(dispatch); // UserService orqali studentni olish
        setForm(data);
        setLoading(false);
        setUser(data);
      } catch (err) {
        console.error("Ma'lumot yuklanmadi", err);
      }
    };
    fetchStudent();
  }, [user._id]);

  // Formni boshqarish
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Formni yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/student/editProfile/${user._id}`, form); // PUT so'rovi studentga
      toast.success("Profil muvaffaqiyatli yangilandi!");
    } catch (err) {
      console.error("Xatolik:", err);
      toast.error("Xatolik yuz berdi");
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Profilni tahrirlash</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["firstname", "lastname", "level", "school", "login"].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaSave /> Saqlash
        </button>
      </form>
    </div>
  );
}
