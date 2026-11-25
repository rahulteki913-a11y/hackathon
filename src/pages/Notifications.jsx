import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaArrowLeft,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaTrash
} from "react-icons/fa";

function Notifications() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const proposals = JSON.parse(
      localStorage.getItem("proposals") || "[]"
    );

    const messages = JSON.parse(
      localStorage.getItem("messages") || "[]"
    );

    const read = JSON.parse(
      localStorage.getItem("readNotifications") || "[]"
    );

    setReadIds(read);

    const proposalNotifications = proposals
      .filter((proposal) => {
        return (
          proposal.clientEmail === currentUser.email ||
          proposal.freelancerEmail === currentUser.email
        );
      })
      .map((proposal) => {
        const isClient = proposal.clientEmail === currentUser.email;

        let title = "New Proposal Received";
        let description = `${proposal.freelancerName} submitted a proposal for ${proposal.projectTitle}.`;
        let icon = "proposal";

        if (!isClient) {
          title = "Proposal Status Updated";
          description = `Your proposal for ${proposal.projectTitle} is ${proposal.status.toLowerCase()}.`;

          if (proposal.status === "Accepted") {
            icon = "accepted";
          } else if (proposal.status === "Rejected") {
            icon = "rejected";
          }
        }

        return {
          id: `proposal-${proposal.id}`,
          title,
          description,
          type: icon,
          createdAt: proposal.createdAt,
          link: isClient ? "/client-proposals" : "/freelancer-dashboard"
        };
      });

    const messageNotifications = messages
      .filter((message) => message.receiverEmail === currentUser.email)
      .map((message) => ({
        id: `message-${message.id}`,
        title: "New Message",
        description: `${message.senderName} sent you a message: ${message.text}`,
        type: "message",
        createdAt: message.createdAt,
        link: "/messages"
      }));

    const allNotifications = [
      ...proposalNotifications,
      ...messageNotifications
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    setNotifications(allNotifications);
  };

  const markAsRead = (id) => {
    const updatedReadIds = [...new Set([...readIds, id])];

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(updatedReadIds)
    );

    setReadIds(updatedReadIds);
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((notification) => notification.id);

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(allIds)
    );

    setReadIds(allIds);
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );

    const updatedReadIds = readIds.filter(
      (readId) => readId !== id
    );

    setNotifications(updatedNotifications);
    setReadIds(updatedReadIds);

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(updatedReadIds)
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !readIds.includes(notification.id)
  ).length;

  const getIcon = (type) => {
    switch (type) {
      case "accepted":
        return <FaCheckCircle />;

      case "rejected":
        return <FaTimesCircle />;

      case "message":
        return <FaEnvelope />;

      default:
        return <FaFileAlt />;
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="notifications-page">

      <header className="notifications-header">
        <button
          className="notification-back"
          onClick={() =>
            navigate(
              currentUser.role === "admin"
                ? "/admin-dashboard"
                : currentUser.role === "client"
                ? "/client-dashboard"
                : "/freelancer-dashboard"
            )
          }
        >
          <FaArrowLeft /> Dashboard
        </button>

        <h2>
          <FaBell /> Notifications
        </h2>

        <button className="notification-logout" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="notifications-container">

        <div className="notifications-title">
          <div>
            <h1>Activity Center</h1>
            <p>Stay updated with your FreelancerHub activities.</p>
          </div>

          <button
            className="mark-all-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </button>
        </div>

        <div className="notification-count">
          <FaBell />
          <span>{unreadCount} Unread Notifications</span>
          <span>{notifications.length} Total</span>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <FaBell />
            <h3>You're all caught up!</h3>
            <p>Your notifications will appear here when there is new activity.</p>
          </div>
        ) : (
          <div className="notification-list">

            {notifications.map((notification) => {
              const isRead = readIds.includes(notification.id);

              return (
                <div
                  key={notification.id}
                  className={`notification-card ${
                    isRead ? "read" : "unread"
                  }`}
                >
                  <div className={`notification-icon ${notification.type}`}>
                    {getIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <h3>{notification.title}</h3>

                    <p>{notification.description}</p>

                    <small>
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>

                    <div className="notification-actions">
                      <button
                        onClick={() => {
                          markAsRead(notification.id);
                          navigate(notification.link);
                        }}
                      >
                        View Activity
                      </button>

                      {!isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    className="delete-notification"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete notification"
                  >
                    <FaTrash />
                  </button>

                  {!isRead && <span className="unread-dot"></span>}
                </div>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}

export default Notifications;