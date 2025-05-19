// Improved src/pages/notification.jsx for students
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  Divider,
} from "@mui/material";
import { FaStar, FaChalkboardTeacher, FaBell, FaCheck } from "react-icons/fa";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0); // 0 = all, 1 = unread, 2 = read

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

        // Sort notifications - unread first, then by date
        const fetchedNotifications = notificationsRes.data.data;
        const sortedNotifications = [...fetchedNotifications].sort((a, b) => {
          // First sort by read status (unread first)
          if (a.read !== b.read) {
            return a.read ? 1 : -1;
          }
          // Then sort by date (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setNotifications(sortedNotifications);
        setUnreadCount(unreadRes.data.data);
      } catch (err) {
        setError("Xatolik yuz berdi: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/read/${notificationId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ziyo-token")}`,
        },
      });

      // Update local state
      setNotifications(
        notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((notification) => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return !notification.read; // Unread
    if (tabValue === 2) return notification.read; // Read
    return true;
  });

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography className="text-red-500 text-center mt-10">
        {error}
      </Typography>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <CardContent>
          <Box className="flex items-center justify-between mb-4">
            <Typography
              variant="h5"
              className="font-bold text-gray-800 flex items-center gap-2"
            >
              <FaBell className="text-blue-500" />
              Xabarlar
              {unreadCount > 0 && (
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  className="ml-2"
                >
                  <span className="w-5 h-5"></span>
                </Badge>
              )}
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            className="mb-4"
          >
            <Tab
              label="Hammasi"
              icon={<Chip label={notifications.length} size="small" />}
              iconPosition="end"
            />
            <Tab
              label="O'qilmagan"
              icon={<Chip label={unreadCount} size="small" color="error" />}
              iconPosition="end"
              disabled={unreadCount === 0}
            />
            <Tab
              label="O'qilgan"
              icon={
                <Chip label={notifications.length - unreadCount} size="small" />
              }
              iconPosition="end"
              disabled={notifications.length - unreadCount === 0}
            />
          </Tabs>

          <Divider className="mb-4" />

          {filteredNotifications.length === 0 ? (
            <Box className="text-center p-6">
              <Typography variant="h6" color="textSecondary">
                Xabarlar mavjud emas
              </Typography>
            </Box>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 mb-4 rounded-lg flex justify-between items-start ${
                  !notification.read
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3 w-full">
                  {notification.type === "evaluation" ? (
                    <FaStar size={24} className="text-yellow-500 mt-1" />
                  ) : (
                    <FaChalkboardTeacher
                      size={24}
                      className="text-blue-500 mt-1"
                    />
                  )}

                  <div className="flex-1">
                    <Box className="flex justify-between items-start">
                      <Typography
                        variant="h6"
                        className="font-semibold text-gray-800"
                      >
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Box>

                    <Typography variant="body2" className="text-gray-600 mt-1">
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
                  </div>
                </div>

                {!notification.read && (
                  <Button
                    variant="outlined"
                    size="small"
                    className="border-green-500 text-green-500 hover:bg-green-50 ml-2"
                    startIcon={<FaCheck />}
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    O'qilgan
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentNotifications;
