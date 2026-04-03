"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./designer-dashboard.module.css";
import {
  Bell,
  Briefcase,
  CheckCircle2,
  Clock3,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Send,
  Upload,
  Video,
  Palette,
  CheckCheck,
  Megaphone,
} from "lucide-react";

type Project = {
  id: number;
  name: string;
  service: string;
  status: string;
  deadline: string;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  uploads: UploadItem[];
};

type UploadItem = {
  id: number;
  title: string;
  fileUrl: string;
  fileType: string;
  category: string;
  status: string;
  note?: string | null;
  createdAt: string;
  project?: {
    id: number;
    name: string;
  } | null;
};

type Conversation = {
  id: number;
  title: string;
  project?: {
    id: number;
    name: string;
  } | null;
  members: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }[];
  messages: {
    id: number;
    text: string;
    createdAt: string;
    sender: {
      id: number;
      name: string;
      role: string;
    };
  }[];
};

const DEMO_DESIGNER_ID = 2;

export default function DesignerDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "design",
    status: "Pending Review",
    note: "",
    projectId: "",
  });

  async function loadData() {
    try {
      setLoading(true);

      const [projectsRes, uploadsRes, chatRes] = await Promise.all([
        fetch(`/api/designer/projects?designerId=${DEMO_DESIGNER_ID}`),
        fetch(`/api/uploads?designerId=${DEMO_DESIGNER_ID}`),
        fetch(`/api/chat/conversations?userId=${DEMO_DESIGNER_ID}`),
      ]);

      const projectsData = await projectsRes.json();
      const uploadsData = await uploadsRes.json();
      const chatData = await chatRes.json();

      if (projectsData.success) setProjects(projectsData.projects);
      if (uploadsData.success) setUploads(uploadsData.uploads);
      if (chatData.success) {
        setConversations(chatData.conversations);
        if (chatData.conversations.length > 0) {
          setSelectedConversationId((prev) => prev ?? chatData.conversations[0].id);
        }
      }
    } catch (error) {
      console.error("LOAD DESIGNER DATA ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const selectedConversation = useMemo(() => {
    return conversations.find((item) => item.id === selectedConversationId) || null;
  }, [conversations, selectedConversationId]);

  async function handleSendMessage() {
    if (!messageText.trim() || !selectedConversationId) return;

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          senderId: DEMO_DESIGNER_ID,
          text: messageText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessageText("");
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("SEND MESSAGE ERROR:", error);
      alert("Failed to send message.");
    }
  }

  async function handleUploadFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fileInput = document.getElementById("designerFile") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("category", uploadForm.category);
      formData.append("status", uploadForm.status);
      formData.append("note", uploadForm.note);
      formData.append("uploaderId", String(DEMO_DESIGNER_ID));
      formData.append("file", file);

      if (uploadForm.projectId) {
        formData.append("projectId", uploadForm.projectId);
      }

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setUploadForm({
          title: "",
          category: "design",
          status: "Pending Review",
          note: "",
          projectId: "",
        });

        if (fileInput) {
          fileInput.value = "";
        }

        setRefreshKey((prev) => prev + 1);
        alert("File uploaded successfully.");
      } else {
        alert(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("UPLOAD FILE ERROR:", error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const totalProjects = projects.length;
  const totalUploads = uploads.length;
  const designCount = uploads.filter((item) => item.category === "design").length;
  const videoCount = uploads.filter((item) => item.category === "video").length;

  const designTasks = [
    {
      id: 1,
      title: "Instagram Main Post",
      type: "Post Design",
      project: "Taste House Ramadan Campaign",
      deadline: "2026-04-10",
      status: "In Design",
      clientComment: "Use warmer colors and clearer CTA.",
    },
    {
      id: 2,
      title: "Story Promotion Set",
      type: "Story Design",
      project: "Taste House Ramadan Campaign",
      deadline: "2026-04-12",
      status: "Waiting Review",
      clientComment: "Keep the logo smaller.",
    },
  ];

  const videoTasks = [
    {
      id: 1,
      title: "Ramadan Promo Reel",
      type: "Instagram Reel",
      project: "Taste House Ramadan Campaign",
      stage: "Editing",
      deadline: "2026-04-14",
    },
    {
      id: 2,
      title: "Behind The Scenes Clip",
      type: "Short Video",
      project: "Taste House Ramadan Campaign",
      stage: "Script Ready",
      deadline: "2026-04-16",
    },
  ];

  const approvals = [
    {
      id: 1,
      itemName: "Initial Poster Design",
      type: "Design",
      status: "Revision Needed",
      feedback: "Make text bigger and reduce shadows.",
    },
    {
      id: 2,
      itemName: "Ramadan Promo Reel",
      type: "Video",
      status: "Pending Approval",
      feedback: "Waiting for client review.",
    },
    {
      id: 3,
      itemName: "Story Promotion Set",
      type: "Design",
      status: "Approved",
      feedback: "Approved by company.",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New client feedback received",
      time: "5 min ago",
      type: "feedback",
    },
    {
      id: 2,
      title: "Video upload linked to project successfully",
      time: "20 min ago",
      type: "upload",
    },
    {
      id: 3,
      title: "Project deadline is coming soon",
      time: "1 hour ago",
      type: "deadline",
    },
  ];

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>N</div>
          <div>
            <h2>NAKSHET</h2>
            <p>Designer Workspace</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={activeSection === "dashboard" ? styles.activeNav : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={activeSection === "projects" ? styles.activeNav : ""}
            onClick={() => setActiveSection("projects")}
          >
            <Briefcase size={18} />
            Projects
          </button>

          <button
            className={activeSection === "designs" ? styles.activeNav : ""}
            onClick={() => setActiveSection("designs")}
          >
            <Palette size={18} />
            Designs
          </button>

          <button
            className={activeSection === "videos" ? styles.activeNav : ""}
            onClick={() => setActiveSection("videos")}
          >
            <Video size={18} />
            Videos
          </button>

          <button
            className={activeSection === "uploads" ? styles.activeNav : ""}
            onClick={() => setActiveSection("uploads")}
          >
            <Upload size={18} />
            Upload Center
          </button>

          <button
            className={activeSection === "messages" ? styles.activeNav : ""}
            onClick={() => setActiveSection("messages")}
          >
            <MessageSquare size={18} />
            Messages
          </button>

          <button
            className={activeSection === "approvals" ? styles.activeNav : ""}
            onClick={() => setActiveSection("approvals")}
          >
            <CheckCheck size={18} />
            Approvals
          </button>

          <button
            className={activeSection === "notifications" ? styles.activeNav : ""}
            onClick={() => setActiveSection("notifications")}
          >
            <Megaphone size={18} />
            Notifications
          </button>
        </nav>

        <div className={styles.sidebarCard}>
          <h4>Quick Notes</h4>
          <p>
            Track design tasks, video stages, approvals, and team notifications
            from one workspace.
          </p>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1>Designer Dashboard</h1>
            <p>
              Manage projects, upload designs and videos, and chat with the system team in one
              place.
            </p>
          </div>

          <div className={styles.topbarRight}>
            <button className={styles.alertBtn}>
              <Bell size={18} />
            </button>

            <div className={styles.profileBox}>
              <div className={styles.avatar}>S</div>
              <div>
                <strong>Sara Designer</strong>
                <span>designer@nakshet.com</span>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className={styles.loading}>Loading dashboard...</div>
        ) : (
          <>
            {activeSection === "dashboard" && (
              <>
                <section className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <FolderOpen size={18} />
                    </div>
                    <div>
                      <h3>{totalProjects}</h3>
                      <p>Assigned Projects</p>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <Upload size={18} />
                    </div>
                    <div>
                      <h3>{totalUploads}</h3>
                      <p>Total Uploads</p>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <h3>{designCount}</h3>
                      <p>Design Files</p>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <Video size={18} />
                    </div>
                    <div>
                      <h3>{videoCount}</h3>
                      <p>Video Files</p>
                    </div>
                  </div>
                </section>

                <section className={styles.doubleGrid}>
                  <div className={styles.panel}>
                    <div className={styles.panelHead}>
                      <h3>My Projects</h3>
                    </div>

                    <div className={styles.cardList}>
                      {projects.map((project) => (
                        <div className={styles.infoCard} key={project.id}>
                          <div>
                            <h4>{project.name}</h4>
                            <p>{project.service}</p>
                            <span>Deadline: {project.deadline}</span>
                          </div>
                          <strong className={styles.statusBadge}>{project.status}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.panel}>
                    <div className={styles.panelHead}>
                      <h3>Recent Uploads</h3>
                    </div>

                    <div className={styles.cardList}>
                      {uploads.slice(0, 5).map((item) => (
                        <div className={styles.infoCard} key={item.id}>
                          <div>
                            <h4>{item.title}</h4>
                            <p>{item.category}</p>
                            <span>{new Date(item.createdAt).toLocaleString()}</span>
                          </div>
                          <a
                            className={styles.fileLink}
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeSection === "projects" && (
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <h3>Assigned Projects</h3>
                </div>

                <div className={styles.projectGrid}>
                  {projects.map((project) => (
                    <div key={project.id} className={styles.projectCard}>
                      <div className={styles.projectTop}>
                        <h4>{project.name}</h4>
                        <span className={styles.statusBadge}>{project.status}</span>
                      </div>

                      <p>
                        <strong>Service:</strong> {project.service}
                      </p>
                      <p>
                        <strong>Owner:</strong> {project.owner.name}
                      </p>
                      <p>
                        <strong>Deadline:</strong> {project.deadline}
                      </p>

                      <div className={styles.projectMeta}>
                        <span>
                          <Clock3 size={14} /> Ongoing work
                        </span>
                        <span>
                          <CheckCircle2 size={14} /> {project.uploads.length} files
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "designs" && (
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <h3>Design Tasks</h3>
                </div>

                <div className={styles.projectGrid}>
                  {designTasks.map((task) => (
                    <div key={task.id} className={styles.projectCard}>
                      <div className={styles.projectTop}>
                        <h4>{task.title}</h4>
                        <span className={styles.statusBadge}>{task.status}</span>
                      </div>

                      <p>
                        <strong>Type:</strong> {task.type}
                      </p>
                      <p>
                        <strong>Project:</strong> {task.project}
                      </p>
                      <p>
                        <strong>Deadline:</strong> {task.deadline}
                      </p>
                      <p>
                        <strong>Client Note:</strong> {task.clientComment}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "videos" && (
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <h3>Video Production</h3>
                </div>

                <div className={styles.projectGrid}>
                  {videoTasks.map((video) => (
                    <div key={video.id} className={styles.projectCard}>
                      <div className={styles.projectTop}>
                        <h4>{video.title}</h4>
                        <span className={styles.statusBadge}>{video.stage}</span>
                      </div>

                      <p>
                        <strong>Type:</strong> {video.type}
                      </p>
                      <p>
                        <strong>Project:</strong> {video.project}
                      </p>
                      <p>
                        <strong>Deadline:</strong> {video.deadline}
                      </p>

                      <div className={styles.projectMeta}>
                        <span>
                          <Video size={14} /> Production stage tracked
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "uploads" && (
              <section className={styles.uploadLayout}>
                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Upload New Design / Video</h3>
                  </div>

                  <form className={styles.uploadForm} onSubmit={handleUploadFile}>
                    <input
                      type="text"
                      placeholder="File title"
                      value={uploadForm.title}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, title: e.target.value })
                      }
                      required
                    />

                    <select
                      value={uploadForm.category}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, category: e.target.value })
                      }
                    >
                      <option value="design">Design</option>
                      <option value="video">Video</option>
                      <option value="branding">Branding</option>
                    </select>

                    <select
                      value={uploadForm.status}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, status: e.target.value })
                      }
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="Waiting Client Approval">Waiting Client Approval</option>
                      <option value="Approved">Approved</option>
                    </select>

                    <select
                      value={uploadForm.projectId}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, projectId: e.target.value })
                      }
                    >
                      <option value="">Select project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>

                    <textarea
                      placeholder="Note or revision details"
                      value={uploadForm.note}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, note: e.target.value })
                      }
                      rows={4}
                    />

                    <input id="designerFile" type="file" required />

                    <button type="submit" disabled={uploading}>
                      {uploading ? "Uploading..." : "Upload File"}
                    </button>
                  </form>
                </div>

                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Uploaded Files</h3>
                  </div>

                  <div className={styles.cardList}>
                    {uploads.map((item) => (
                      <div className={styles.uploadCard} key={item.id}>
                        <div>
                          <h4>{item.title}</h4>
                          <p>
                            {item.category} • {item.status}
                          </p>
                          <span>{item.project?.name || "No project linked"}</span>
                        </div>

                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.fileLink}
                        >
                          View File
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeSection === "messages" && (
              <section className={styles.messagesLayout}>
                <div className={styles.chatSidebar}>
                  <div className={styles.panelHead}>
                    <h3>Conversations</h3>
                  </div>

                  <div className={styles.chatList}>
                    {conversations.map((chat) => (
                      <button
                        key={chat.id}
                        className={`${styles.chatListItem} ${
                          selectedConversationId === chat.id ? styles.chatActive : ""
                        }`}
                        onClick={() => setSelectedConversationId(chat.id)}
                      >
                        <div>
                          <strong>{chat.title}</strong>
                          <p>{chat.project?.name || "General conversation"}</p>
                        </div>
                        <span>{chat.messages.length}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.chatPanel}>
                  {selectedConversation ? (
                    <>
                      <div className={styles.chatHeader}>
                        <div>
                          <h3>{selectedConversation.title}</h3>
                          <p>{selectedConversation.project?.name || "No project selected"}</p>
                        </div>
                      </div>

                      <div className={styles.messageArea}>
                        {selectedConversation.messages.map((msg) => {
                          const mine = msg.sender.id === DEMO_DESIGNER_ID;

                          return (
                            <div
                              key={msg.id}
                              className={`${styles.messageBubble} ${
                                mine ? styles.myMessage : styles.theirMessage
                              }`}
                            >
                              <strong>{mine ? "You" : msg.sender.name}</strong>
                              <p>{msg.text}</p>
                              <span>{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className={styles.messageComposer}>
                        <input
                          type="text"
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSendMessage();
                            }
                          }}
                        />
                        <button onClick={handleSendMessage}>
                          <Send size={16} />
                          Send
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={styles.emptyState}>No conversation selected.</div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "approvals" && (
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <h3>Approvals & Reviews</h3>
                </div>

                <div className={styles.cardList}>
                  {approvals.map((item) => (
                    <div className={styles.infoCard} key={item.id}>
                      <div>
                        <h4>{item.itemName}</h4>
                        <p>{item.type}</p>
                        <span>{item.feedback}</span>
                      </div>
                      <strong className={styles.statusBadge}>{item.status}</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "notifications" && (
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <h3>Notifications</h3>
                </div>

                <div className={styles.cardList}>
                  {notifications.map((note) => (
                    <div className={styles.infoCard} key={note.id}>
                      <div>
                        <h4>{note.title}</h4>
                        <p>{note.type}</p>
                        <span>{note.time}</span>
                      </div>
                      <strong className={styles.statusBadge}>New</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}