import "./Sidebar.css";
import { useContext, useEffect,useState } from "react";
import { MyContext } from "./MyContext.jsx"; 
import { v1 as uuidv1 } from "uuid";
function Sidebar() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prompt,
    setPrompt,
    reply,
    setReply,
    prevChats,
    setPrevChats,
  } = useContext(MyContext);
  const getAllThreads = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/thread`);
      const res = await response.json();
      const filterdData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filterdData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllThreads();
  }, []);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };
  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteThread = async (threadId)=>{
    try{
        const response = await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"DELETE"});
        const res = await response.json()
        console.log(res);
        setAllThreads(prev => prev.filter(thread =>thread.threadId !== threadId));
        if(threadId === currThreadId){
            createNewChat()
        }
        
    }catch(err){
        console.log(err)
    }
  }
  return (
    <>
      <div className="hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <i className="fa-solid fa-bars"></i>
      </div>

    <section className={`sidebar ${isSidebarOpen ? "open" : ""}`}>

      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt="NovaLogo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>
      <div className="history">
        <ul>
          {allThreads?.map((thread, idx) => (
            <li key={idx}
             onClick={() => changeThread(thread.threadId)}
             className={thread.threadId === currThreadId ? "highlighted":""}
             >
              {thread.title}
              <i className="fa-solid fa-trash"
               onClick={(e)=>{
                e.stopPropagation();
                deleteThread(thread.threadId)
              }}
              ></i>
            </li>
          ))}
        </ul>
      </div>
    
      <div className="sign">
        <span>
          <i className="fa-solid fa-user"></i>
        </span>
        <span>NovaChat &hearts;</span>
      </div>
    </section>
     {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </>
  );
}

export default Sidebar;
