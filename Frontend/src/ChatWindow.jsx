import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    newChat,
    setNewChat,
    setCurrThreadId,
    prevChats,
    setPrevChats,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpgradOpen, setIsUpgradOpen] = useState(false);
  const [isNovaOpen,seIstNovaOpen] = useState(false)
  const getReply = async () => {
    console.log("message :", prompt, "threadId:", currThreadId);
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/chat`, options);
      const res = await response.json();
      setReply(res.reply);
      console.log(res.reply);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt, 
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);
  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleUpgradeClick = () => {
    setIsUpgradOpen(!isUpgradOpen);
  };
  const novaClick = ()=>{
    seIstNovaOpen(!isNovaOpen)
  }
  return (
    <div className="chatWindow">
      <div className="navbar">
        <span onClick={novaClick}>
          NovaChat <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv">
          <span className="userIcon" onClick={handleProfileClick}>
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isNovaOpen && (
        <div className="novadropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Nova Go
            <p>Our smartest model</p>
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> NovaChat
            <p>Great for everyday tools<i className="fa-solid fa-check"></i></p>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem" onClick={handleUpgradeClick}>
            <i className="fa-solid fa-up-right-from-square"></i> Upgrad plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}
      
      {isUpgradOpen && (
        <>
          <div className="overlay"></div>
          <div className="upgrade-dialog">
            <div className="dialog-header">
              <h3>Upgrade Your Plan</h3>
              <span
                className="close-btn"
                onClick={() => setIsUpgradOpen(false)}
              >
                &times;
              </span>
            </div>

            <div className="dialog-body">
              <div className="plan">
                <i className="fa-solid fa-star"></i> <strong>Pro Plan</strong>
                <p>$7/month – Unlock premium AI features & faster replies.</p>
                <button className="upgrade-btn">Upgrade Now</button>
              </div>
            </div>
          </div>
        </>
      )}
      <Chat></Chat>
      <ScaleLoader color="white" className="loader" loading={loading} />
      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            placeholder="Ask anything"
          />
          <div
            id="submitBtn"
            style={{
              cursor: "pointer",
              height: "35px",
              width: "35px",
              position: "absolute",
              fontSize: "20px",
              right: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              tabIndex={0}
              onClick={getReply}
              className="fa-solid fa-paper-plane"
            ></i>
          </div>
        </div>
        <p className="info">
          NovaChat can make mistakes. Check important
          <a href="">See Cookie Preferences.</a>
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
