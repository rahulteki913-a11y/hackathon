import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane, FaArrowLeft, FaUserCircle } from "react-icons/fa";

function Messages() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!currentUser || !["client", "freelancer"].includes(currentUser.role)) {
      navigate("/login");
      return;
    }

    loadContacts();
  }, []);

  const loadContacts = () => {
    const allProposals = JSON.parse(
      localStorage.getItem("proposals") || "[]"
    );

    const contactEmails = new Set();

    allProposals.forEach((proposal) => {
      if (proposal.clientEmail === currentUser.email) {
        contactEmails.add(proposal.freelancerEmail);
      }

      if (proposal.freelancerEmail === currentUser.email) {
        contactEmails.add(proposal.clientEmail);
      }
    });

    const allUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const myContacts = allUsers.filter(
      (user) =>
        contactEmails.has(user.email) &&
        user.email !== currentUser.email
    );

    setContacts(myContacts);

    if (myContacts.length > 0) {
      setSelectedContact(myContacts[0]);
    }
  };

  const loadMessages = (contact) => {
    const allMessages = JSON.parse(
      localStorage.getItem("messages") || "[]"
    );

    const conversation = allMessages.filter(
      (message) =>
        (message.senderEmail === currentUser.email &&
          message.receiverEmail === contact.email) ||
        (message.senderEmail === contact.email &&
          message.receiverEmail === currentUser.email)
    );

    setMessages(conversation);
  };

  useEffect(() => {
    if (selectedContact) {
      loadMessages(selectedContact);
    } else {
      setMessages([]);
    }
  }, [selectedContact]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedContact) {
      return;
    }

    const allMessages = JSON.parse(
      localStorage.getItem("messages") || "[]"
    );

    const message = {
      id: Date.now(),
      senderEmail: currentUser.email,
      senderName: currentUser.name,
      receiverEmail: selectedContact.email,
      receiverName: selectedContact.name,
      text: newMessage.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedMessages = [...allMessages, message];

    localStorage.setItem(
      "messages",
      JSON.stringify(updatedMessages)
    );

    setMessages((previous) => [...previous, message]);
    setNewMessage("");
  };

  if (!currentUser || !["client", "freelancer"].includes(currentUser.role)) {
    return null;
  }

  return (
    <div className="messages-page">

      <header className="messages-header">
        <button
          className="message-back"
          onClick={() =>
            navigate(
              currentUser.role === "client"
                ? "/client-dashboard"
                : "/freelancer-dashboard"
            )
          }
        >
          <FaArrowLeft /> Dashboard
        </button>

        <h2>FreelancerHub Messages</h2>

        <span>{currentUser.name}</span>
      </header>

      <div className="messages-container">

        {/* Contacts */}
        <aside className="contacts-panel">
          <h3>Conversations</h3>

          {contacts.length === 0 ? (
            <p className="no-contacts">
              No conversations yet. Conversations become available when you
              have a project proposal connection.
            </p>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.email}
                className={`contact-item ${
                  selectedContact?.email === contact.email ? "selected" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <FaUserCircle className="contact-avatar" />

                <div>
                  <strong>{contact.name}</strong>
                  <small>{contact.role}</small>
                </div>
              </button>
            ))
          )}
        </aside>

        {/* Chat */}
        <section className="chat-panel">

          {selectedContact ? (
            <>
              <div className="chat-header">
                <FaUserCircle />
                <div>
                  <strong>{selectedContact.name}</strong>
                  <small>{selectedContact.role}</small>
                </div>
              </div>

              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="empty-chat">
                    <h3>Start a conversation!</h3>
                    <p>Send your first message below.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-bubble ${
                        message.senderEmail === currentUser.email
                          ? "sent"
                          : "received"
                      }`}
                    >
                      <p>{message.text}</p>
                      <small>
                        {new Date(message.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>

              <form className="message-input-area" onSubmit={sendMessage}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />

                <button type="submit" disabled={!newMessage.trim()}>
                  <FaPaperPlane />
                </button>
              </form>
            </>
          ) : (
            <div className="empty-chat">
              <h3>Welcome to Messages</h3>
              <p>Select a contact to start chatting.</p>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}

export default Messages;