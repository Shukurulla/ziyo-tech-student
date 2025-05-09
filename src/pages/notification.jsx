import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Button, Box } from "@mui/material";
import { FaStar, FaChalkboardTeacher } from "react-icons/fa";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notificationsRes, unreadRes] = await Promise.all([
          axios.get("/api/notifications", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
            },
          }),
          axios.get("/api/notifications/unread-count", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
            },
          }),
        ]);
        const fetchedNotifications = notificationsRes.data.data;
        setNotifications(fetchedNotifications);
        setUnreadCount(unreadRes.data.data);
        console.log(fetchedNotifications);

        // Mark all notifications as read on page load
        const unreadIds = fetchedNotifications
          .filter((notif) => !notif.read)
          .map((notif) => notif._id);
        if (unreadIds.length > 0) {
          await Promise.all(
            unreadIds.map((id) =>
              axios.patch(`/api/notifications/read/${id}`, null, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
                },
              })
            )
          );
          setNotifications(
            fetchedNotifications.map((notif) => ({ ...notif, read: true }))
          );
          setUnreadCount(0);
        }
      } catch (err) {
        setError("Xatolik yuz berdi: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) return <p className="text-center mt-10">Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <Typography variant="h5" className="font-bold text-gray-800 mb-6">
          Xabarnomalar {unreadCount > 0 && `(${unreadCount} o‘qilmagan)`}
        </Typography>
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 mb-4 rounded-lg flex justify-between items-center ${
              !notification.read
                ? "bg-green-50 border-l-4 border-green-500"
                : "bg-gray-100"
            }`}
          >
            <div className="flex items-start gap-2">
              {notification.type === "evaluation" && (
                <FaChalkboardTeacher size={20} className="text-gray-600" />
              )}
              <div>
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  {notification.title}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {notification.message}
                </Typography>
                {notification.type === "evaluation" && (
                  <div className="mt-2 flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        size={20}
                        color={
                          index + 1 <= notification.rating
                            ? "#FFD700"
                            : "#E0E0E0"
                        }
                      />
                    ))}
                    {notification.comment && (
                      <Typography
                        variant="body2"
                        className="text-gray-600 ml-2"
                      >
                        Izoh: {notification.comment}
                      </Typography>
                    )}
                  </div>
                )}
                <Typography variant="body2" className="text-gray-500">
                  Vaqt: {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </div>
            </div>
            {!notification.read && (
              <Button
                variant="outlined"
                className="border-green-500 text-green-500 hover:bg-green-50"
                onClick={() => {
                  axios.patch(
                    `/api/notifications/read/${notification._id}`,
                    null,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "ziyo-token"
                        )}`,
                      },
                    }
                  );
                  setNotifications(
                    notifications.map((notif) =>
                      notif._id === notification._id
                        ? { ...notif, read: true }
                        : notif
                    )
                  );
                  setUnreadCount(unreadCount - 1);
                }}
              >
                O‘qilgan
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentNotifications;
