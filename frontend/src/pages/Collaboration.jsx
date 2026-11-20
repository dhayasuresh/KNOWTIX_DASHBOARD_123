import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "../styles/collab.css";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Collaboration = () => {
  const [username, setUsername] = useState("");
  const [usernameSet, setUsernameSet] = useState(false);
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [newGroup, setNewGroup] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [groupLinks, setGroupLinks] = useState({});
  const [pendingGroupId, setPendingGroupId] = useState(null);
  const [userVotes, setUserVotes] = useState({}); // Track user votes
  const canvasRef = useRef(null);
  const chatEndRef = useRef(null);

  // Socket listeners
  useEffect(() => {
    socket.on("message", (msg) => {
      if (msg.group === currentGroup?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("groups", (allGroups) => setGroups(allGroups));
    
    socket.on("polls", (allPolls) => {
      setPolls(allPolls);
    });

    // Listen for vote updates from server
    socket.on("voteUpdate", (data) => {
      const { pollId, optionId, votes } = data;
      setPolls(prevPolls => 
        prevPolls.map(poll => {
          if (poll.id === pollId) {
            const updatedOptions = poll.options.map(option => {
              if (option.id === optionId) {
                return { ...option, votes: votes };
              }
              return option;
            });
            return { ...poll, options: updatedOptions };
          }
          return poll;
        })
      );
    });

    // Listen for poll updates
    socket.on("pollUpdated", (updatedPoll) => {
      setPolls(prev => prev.map(poll => 
        poll.id === updatedPoll.id ? updatedPoll : poll
      ));
    });

    return () => {
      socket.off("message");
      socket.off("groups");
      socket.off("polls");
      socket.off("voteUpdate");
      socket.off("pollUpdated");
    };
  }, [currentGroup]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Username setup
  const handleSetUsername = () => {
    if (username.trim()) setUsernameSet(true);
  };

  // Create group with shareable link
  const handleCreateGroup = () => {
    if (!newGroup.trim()) return;
    const id = Date.now().toString();
    const link = `${window.location.origin}?group=${id}`;
    socket.emit("createGroup", { name: newGroup, id });
    setGroupLinks((prev) => ({ ...prev, [id]: link }));
    setNewGroup("");
  };

  // Join group
  const joinGroup = (group) => {
    setCurrentGroup(group);
    setMessages([]);
    setUserVotes({}); // Reset votes when changing groups
    socket.emit("joinGroup", group.id);
  };

  // Send chat
  const sendMessage = () => {
    if (!chatInput.trim() || !currentGroup || !usernameSet) return;
    const msg = {
      sender: username,
      text: chatInput,
      group: currentGroup.id,
    };
    socket.emit("sendMessage", msg);
    setChatInput("");
  };

  // Share YouTube
  const shareYoutube = () => {
    if (!youtubeLink.trim() || !currentGroup) return;
    socket.emit("sendMessage", {
      sender: "System",
      text: `📺 Shared video: ${youtubeLink}`,
      group: currentGroup.id,
    });
    setYoutubeLink("");
  };

  // Generate Meet link
  const generateMeet = () => {
    if (!currentGroup) return;
    const randomLink =
      "https://meet.google.com/" + Math.random().toString(36).substring(7);
    setMeetLink(randomLink);
    socket.emit("sendMessage", {
      sender: "System",
      text: `📌 Meeting link: ${randomLink}`,
      group: currentGroup.id,
    });
  };

  // Polls - Add option
  const addPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  // Polls - Update option
  const updatePollOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  // Polls - Remove option
  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  // Polls - Create poll
  const createPoll = () => {
    if (!newPoll.trim() || !currentGroup) return;
    
    // Filter out empty options
    const validOptions = pollOptions
      .map((text, index) => ({ id: `opt-${index}`, text, votes: 0 }))
      .filter(option => option.text.trim() !== "");
    
    if (validOptions.length < 2) {
      alert("Please provide at least two options for the poll.");
      return;
    }

    const poll = {
      id: `poll-${Date.now()}`,
      question: newPoll,
      options: validOptions,
      group: currentGroup.id,
      createdBy: username,
      createdAt: new Date().toISOString(),
    };
    
    socket.emit("createPoll", poll);
    setNewPoll("");
    setPollOptions(["", ""]);
  };

  // Polls - Vote (Fixed to properly increment votes)
  const votePoll = (pollId, optionId) => {
    if (!currentGroup) return;
    
    // Check if user already voted in this poll
    if (userVotes[pollId]) {
      alert("You have already voted in this poll.");
      return;
    }
    
    // Find the current poll and option
    const currentPoll = polls.find(p => p.id === pollId);
    if (!currentPoll) return;
    
    const currentOption = currentPoll.options.find(opt => opt.id === optionId);
    if (!currentOption) return;
    
    // Calculate new vote count (current votes + 1)
    const newVoteCount = currentOption.votes + 1;
    
    // Optimistically update UI immediately
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map(option => {
            if (option.id === optionId) {
              return { ...option, votes: newVoteCount };
            }
            return option;
          });
          return { ...poll, options: updatedOptions };
        }
        return poll;
      })
    );
    
    // Track that user voted
    setUserVotes(prev => ({ ...prev, [pollId]: true }));
    
    // Emit vote event to server with the new vote count
    socket.emit("votePoll", { 
      pollId, 
      optionId, 
      votes: newVoteCount,
      group: currentGroup.id,
      username 
    });
    
    // Also emit a general update event to ensure all clients sync
    socket.emit("updatePollVotes", { 
      pollId, 
      optionId, 
      votes: newVoteCount,
      group: currentGroup.id
    });
  };

  // Whiteboard drawing
  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvasRef.current.isDrawing = true;
  };

  const draw = (e) => {
    if (!canvasRef.current.isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();

    socket.emit("whiteboard", {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      group: currentGroup?.id,
    });
  };

  const stopDrawing = () => {
    canvasRef.current.isDrawing = false;
  };

  const clearBoard = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Whiteboard sync
  useEffect(() => {
    socket.on("whiteboard", ({ x, y, group }) => {
      if (group === currentGroup?.id) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });
    return () => socket.off("whiteboard");
  }, [currentGroup]);

  // Auto-join from invite link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const groupId = params.get("group");
    if (groupId) setPendingGroupId(groupId);
  }, []);

  useEffect(() => {
    if (pendingGroupId && groups.length > 0) {
      const groupToJoin = groups.find((g) => g.id === pendingGroupId);
      if (groupToJoin) joinGroup(groupToJoin);
    }
  }, [groups, pendingGroupId]);

  return (
    <div className="page collab-page">
      <h1>🤝 Collaboration Room</h1>

      {!usernameSet ? (
        <div className="username-setup">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={handleSetUsername}>Set Name</button>
        </div>
      ) : (
        <>
          {/* Groups */}
          <section className="collab-section">
            <h2>👥 Groups</h2>
            <input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder="Enter group name"
            />
            <button onClick={handleCreateGroup}>Create</button>
            <ul>
              {groups.map((g) => (
                <li key={g.id}>
                  {g.name}
                  <button onClick={() => joinGroup(g)}>Join</button>
                  {groupLinks[g.id] && (
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(groupLinks[g.id])
                      }
                    >
                      Copy Link
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {currentGroup && (
            <>
              {/* Chat */}
              <section className="collab-section">
                <h2>💬 Group Chat ({currentGroup.name})</h2>
                <div className="chat-box">
                  {messages.map((m, i) => (
                    <p
                      key={i}
                      className={`chat-msg ${
                        m.sender === "System"
                          ? "system-msg"
                          : m.sender === username
                          ? "my-msg"
                          : "other-msg"
                      }`}
                    >
                      <strong>{m.sender}:</strong> {m.text}
                    </p>
                  ))}
                  <div ref={chatEndRef}></div>
                </div>
                <div className="chat-input">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message..."
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </section>

              {/* YouTube */}
              <section className="collab-section">
                <h2>📺 Share YouTube Video</h2>
                <input
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="Paste YouTube link"
                />
                <button onClick={shareYoutube}>Share</button>
              </section>

              {/* Google Meet */}
              <section className="collab-section">
                <h2>📌 Class Link</h2>
                <button onClick={generateMeet}>Generate Meet Link</button>
                {meetLink && (
                  <p>
                    <a href={meetLink} target="_blank" rel="noreferrer">
                      {meetLink}
                    </a>
                  </p>
                )}
              </section>

              {/* Polls */}
              <section className="collab-section">
                <h2>📊 Polls & Surveys</h2>
                <div className="poll-creation">
                  <input
                    value={newPoll}
                    onChange={(e) => setNewPoll(e.target.value)}
                    placeholder="Poll question"
                  />
                  <div className="poll-options">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="poll-option-input">
                        <input
                          value={option}
                          onChange={(e) => updatePollOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        {pollOptions.length > 2 && (
                          <button 
                            type="button" 
                            className="remove-option"
                            onClick={() => removePollOption(index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 5 && (
                      <button 
                        type="button" 
                        className="add-option"
                        onClick={addPollOption}
                      >
                        + Add Option
                      </button>
                    )}
                  </div>
                  <button onClick={createPoll}>Create Poll</button>
                </div>
                
                <div className="polls-list">
                  {polls
                    .filter((p) => p.group === currentGroup.id)
                    .map((poll) => (
                      <div key={poll.id} className="poll-item">
                        <h3>{poll.question}</h3>
                        <p className="poll-meta">
                          Created by {poll.createdBy} • {new Date(poll.createdAt).toLocaleTimeString()}
                        </p>
                        <div className="poll-options-list">
                          {poll.options.map((option) => {
                            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                            
                            return (
                              <div key={option.id} className="poll-option">
                                <div className="poll-option-header">
                                  <span>{option.text}</span>
                                  <span>{option.votes} votes ({percentage}%)</span>
                                </div>
                                <div className="poll-bar-container">
                                  <div 
                                    className="poll-bar" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                {!userVotes[poll.id] && (
                                  <button 
                                    className="vote-btn"
                                    onClick={() => votePoll(poll.id, option.id)}
                                  >
                                    Vote
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <p className="total-votes">
                          Total votes: {poll.options.reduce((sum, opt) => sum + opt.votes, 0)}
                        </p>
                      </div>
                    ))}
                </div>
              </section>

              {/* Whiteboard */}
              <section className="collab-section">
                <h2>📝 Whiteboard</h2>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="whiteboard"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <button onClick={clearBoard}>Clear Board</button>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Collaboration;