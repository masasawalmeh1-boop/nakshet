"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  Plus,
  Search,
  Send,
  Upload,
  Video,
  Palette,
  CheckCheck,
  Megaphone,
  Pencil,
  Trash2,
  X,
  Users,
  Smile,
  Paperclip,
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
    deadline?: string;
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

type Participant = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ParsedMediaMessage = {
  kind: "text" | "media";
  text?: string;
  mediaType?: "image" | "video";
  url?: string;
  caption?: string;
};

const DEMO_DESIGNER_ID = 2;
const STORAGE_KEY = "designer_selected_conversation";
const EMOJIS = ["😀", "😂", "😍", "🔥", "👏", "🎉", "❤️", "👍", "🤝", "😎"];

function parseMessageContent(text: string): ParsedMediaMessage {
  if (text.startsWith("__CHAT_MEDIA__")) {
    try {
      const raw = text.replace("__CHAT_MEDIA__", "");
      const parsed = JSON.parse(raw);

      return {
        kind: "media",
        mediaType: parsed.mediaType,
        url: parsed.url,
        caption: parsed.caption || "",
      };
    } catch {
      return {
        kind: "text",
        text,
      };
    }
  }

  return {
    kind: "text",
    text,
  };
}

export default function DesignerDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [conversationSearch, setConversationSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingUploadId, setEditingUploadId] = useState<number | null>(null);

  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<number[]>([]);
  const [deletingChat, setDeletingChat] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [sendingMedia, setSendingMedia] = useState(false);

  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);

  const [createChatForm, setCreateChatForm] = useState({
    title: "",
    projectId: "",
  });

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
        const loadedConversations = chatData.conversations as Conversation[];
        setConversations(loadedConversations);

        const savedConversationId = Number(localStorage.getItem(STORAGE_KEY));

        if (
          savedConversationId &&
          loadedConversations.some((item) => item.id === savedConversationId)
        ) {
          setSelectedConversationId(savedConversationId);
        } else if (loadedConversations.length > 0) {
          setSelectedConversationId(loadedConversations[0].id);
        } else {
          setSelectedConversationId(null);
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

  useEffect(() => {
    if (selectedConversationId) {
      localStorage.setItem(STORAGE_KEY, String(selectedConversationId));
    }
  }, [selectedConversationId]);

  useEffect(() => {
    async function loadParticipants() {
      if (!createChatForm.projectId) {
        setAvailableParticipants([]);
        setSelectedParticipantIds([]);
        return;
      }

      try {
        setParticipantsLoading(true);

        const res = await fetch(
          `/api/chat/participants?projectId=${createChatForm.projectId}`
        );
        const data = await res.json();

        if (data.success) {
          const participants = (data.participants as Participant[]).filter(
            (item) => item.id !== DEMO_DESIGNER_ID
          );

          setAvailableParticipants(participants);
          setSelectedParticipantIds(participants.map((item) => item.id));
        }
      } catch (error) {
        console.error("LOAD PARTICIPANTS ERROR:", error);
      } finally {
        setParticipantsLoading(false);
      }
    }

    if (showCreateChatModal) {
      loadParticipants();
    }
  }, [createChatForm.projectId, showCreateChatModal]);

  const filteredConversations = useMemo(() => {
    const search = conversationSearch.trim().toLowerCase();

    if (!search) return conversations;

    return conversations.filter((chat) => {
      const titleMatch = chat.title.toLowerCase().includes(search);
      const projectMatch = chat.project?.name?.toLowerCase().includes(search);

      const memberMatch = chat.members.some((member) => {
        const memberName = member.user.name?.toLowerCase() || "";
        const memberEmail = member.user.email?.toLowerCase() || "";
        return memberName.includes(search) || memberEmail.includes(search);
      });

      return titleMatch || projectMatch || memberMatch;
    });
  }, [conversationSearch, conversations]);

  const selectedConversation = useMemo(() => {
    return conversations.find((item) => item.id === selectedConversationId) || null;
  }, [conversations, selectedConversationId]);

  const getLastMessage = (chat: Conversation) => {
    if (!chat.messages || chat.messages.length === 0) {
      return {
        text: "No messages yet.",
        time: "",
      };
    }

    const last = chat.messages[chat.messages.length - 1];
    const parsed = parseMessageContent(last.text);

    let preview = "No messages yet.";

    if (parsed.kind === "media") {
      preview = parsed.mediaType === "video" ? "🎬 Video" : "🖼️ Image";
      if (parsed.caption) {
        preview += ` • ${parsed.caption}`;
      }
    } else {
      preview = parsed.text || "No messages yet.";
    }

    return {
      text: preview,
      time: new Date(last.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  useLayoutEffect(() => {
    const el = messageAreaRef.current;
    if (!el || activeSection !== "messages") return;

    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight;
    };

    scrollToBottom();
    const timeout = setTimeout(scrollToBottom, 80);

    return () => clearTimeout(timeout);
  }, [
    activeSection,
    selectedConversationId,
    selectedConversation?.messages.length,
    conversations,
  ]);

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
        setShowEmojiBar(false);
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("SEND MESSAGE ERROR:", error);
      alert("Failed to send message.");
    }
  }

  async function handleEditMessage(messageId: number) {
    if (!editingMessageText.trim()) return;

    try {
      const res = await fetch(`/api/chat/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: editingMessageText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEditingMessageId(null);
        setEditingMessageText("");
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Failed to update message.");
      }
    } catch (error) {
      console.error("EDIT MESSAGE ERROR:", error);
      alert("Failed to update message.");
    }
  }

  async function handleDeleteMessage(messageId: number) {
    const confirmed = window.confirm("Delete this message?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/chat/messages/${messageId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Failed to delete message.");
      }
    } catch (error) {
      console.error("DELETE MESSAGE ERROR:", error);
      alert("Failed to delete message.");
    }
  }

  async function handleMediaUpload(file: File) {
    if (!selectedConversationId) return;

    try {
      setSendingMedia(true);

      const formData = new FormData();
      formData.append("conversationId", String(selectedConversationId));
      formData.append("senderId", String(DEMO_DESIGNER_ID));
      formData.append("caption", messageText);
      formData.append("file", file);

      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessageText("");
        setShowEmojiBar(false);
        if (mediaInputRef.current) {
          mediaInputRef.current.value = "";
        }
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Failed to upload media.");
      }
    } catch (error) {
      console.error("UPLOAD MEDIA ERROR:", error);
      alert("Failed to upload media.");
    } finally {
      setSendingMedia(false);
    }
  }

  function toggleParticipant(id: number) {
    setSelectedParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleCreateChat() {
    if (!createChatForm.title.trim() || !createChatForm.projectId) {
      alert("Please enter chat title and select a project.");
      return;
    }

    try {
      setCreatingChat(true);

      const res = await fetch("/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: createChatForm.title,
          projectId: Number(createChatForm.projectId),
          creatorId: DEMO_DESIGNER_ID,
          memberIds: selectedParticipantIds,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const newConversation = data.conversation as Conversation;

        setConversations((prev) => [newConversation, ...prev]);
        setSelectedConversationId(newConversation.id);
        setActiveSection("messages");
        setShowCreateChatModal(false);
        setAvailableParticipants([]);
        setSelectedParticipantIds([]);
        setCreateChatForm({
          title: "",
          projectId: "",
        });
        localStorage.setItem(STORAGE_KEY, String(newConversation.id));
      } else {
        alert(data.message || "Failed to create chat.");
      }
    } catch (error) {
      console.error("CREATE CHAT ERROR:", error);
      alert("Failed to create chat.");
    } finally {
      setCreatingChat(false);
    }
  }

  async function handleDeleteChat() {
    if (!selectedConversationId) return;

    const confirmed = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmed) return;

    try {
      setDeletingChat(true);

      const res = await fetch("/api/chat/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const remaining = conversations.filter(
          (item) => item.id !== selectedConversationId
        );

        setConversations(remaining);

        if (remaining.length > 0) {
          setSelectedConversationId(remaining[0].id);
          localStorage.setItem(STORAGE_KEY, String(remaining[0].id));
        } else {
          setSelectedConversationId(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        alert(data.message || "Failed to delete chat.");
      }
    } catch (error) {
      console.error("DELETE CHAT ERROR:", error);
      alert("Failed to delete chat.");
    } finally {
      setDeletingChat(false);
    }
  }

  async function handleUploadFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fileInput = document.getElementById("designerFile") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!editingUploadId && !file) {
      alert("Please choose a file first.");
      return;
    }

    try {
      setUploading(true);

      if (editingUploadId) {
        const res = await fetch(`/api/uploads/${editingUploadId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: uploadForm.title,
            category: uploadForm.category,
            status: uploadForm.status,
            note: uploadForm.note,
            projectId: uploadForm.projectId ? Number(uploadForm.projectId) : null,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.message || "Update failed.");
          return;
        }

        alert("Upload updated successfully.");
      } else {
        const formData = new FormData();
        formData.append("title", uploadForm.title);
        formData.append("category", uploadForm.category);
        formData.append("status", uploadForm.status);
        formData.append("note", uploadForm.note);
        formData.append("uploaderId", String(DEMO_DESIGNER_ID));
        formData.append("file", file as File);

        if (uploadForm.projectId) {
          formData.append("projectId", uploadForm.projectId);
        }

        const res = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.message || "Upload failed.");
          return;
        }

        alert("File uploaded successfully.");
      }

      setUploadForm({
        title: "",
        category: "design",
        status: "Pending Review",
        note: "",
        projectId: "",
      });

      setEditingUploadId(null);

      if (fileInput) {
        fileInput.value = "";
      }

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("UPLOAD/UPDATE FILE ERROR:", error);
      alert("Operation failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleEditUpload(item: UploadItem) {
    setActiveSection("uploads");
    setEditingUploadId(item.id);
    setUploadForm({
      title: item.title,
      category: item.category,
      status: item.status,
      note: item.note || "",
      projectId: item.project?.id ? String(item.project.id) : "",
    });
  }

  async function handleDeleteUpload(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/uploads/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch (error) {
      console.error("DELETE UPLOAD ERROR:", error);
      alert("Delete failed.");
    }
  }

  async function handleLogout() {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/";
      } else {
        alert("Logout failed.");
      }
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      alert("Logout failed.");
    }
  }

  const totalProjects = projects.length;
  const totalUploads = uploads.length;

  const designUploads = uploads.filter((item) => item.category === "design");
  const videoUploads = uploads.filter((item) => item.category === "video");

  const designCount = designUploads.length;
  const videoCount = videoUploads.length;

  const pendingReviewCount = uploads.filter(
    (item) => item.status === "Pending Review"
  ).length;

  const waitingApprovalCount = uploads.filter(
    (item) => item.status === "Waiting Client Approval"
  ).length;

  const approvedCount = uploads.filter(
    (item) => item.status === "Approved"
  ).length;

  const designTasks = designUploads.map((item) => ({
    id: item.id,
    title: item.title,
    type: "Design File",
    project: item.project?.name || "No project linked",
    deadline: item.project?.deadline || "No deadline",
    status: item.status,
    clientComment: item.note || "No client note yet.",
  }));

  const videoTasks = videoUploads.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.fileType || "Video File",
    project: item.project?.name || "No project linked",
    stage: item.status,
    deadline: item.project?.deadline || "No deadline",
  }));

  const approvalItems = uploads
    .filter((item) =>
      ["Pending Review", "Waiting Client Approval", "Approved"].includes(item.status)
    )
    .map((item) => ({
      id: item.id,
      itemName: item.title,
      type: item.category,
      status: item.status,
      feedback: item.note || "No additional feedback.",
    }));

  const notifications = [
    ...(pendingReviewCount > 0
      ? [
          {
            id: 1,
            title: `${pendingReviewCount} file(s) pending review`,
            time: "Now",
            type: "review",
          },
        ]
      : []),
    ...(waitingApprovalCount > 0
      ? [
          {
            id: 2,
            title: `${waitingApprovalCount} file(s) waiting client approval`,
            time: "Now",
            type: "approval",
          },
        ]
      : []),
    ...(videoCount > 0
      ? [
          {
            id: 3,
            title: `${videoCount} video file(s) available`,
            time: "Now",
            type: "video",
          },
        ]
      : []),
    ...(projects.length > 0
      ? [
          {
            id: 4,
            title: `${projects.length} active assigned project(s)`,
            time: "Now",
            type: "project",
          },
        ]
      : []),
  ];

  const upcomingDeadlines = projects.map((project, index) => ({
    id: project.id,
    title: project.name,
    project: project.service,
    dueDate: project.deadline,
    daysLeft: index + 2,
  }));

  const recentActivities = uploads.slice(0, 4).map((item, index) => ({
    id: item.id,
    title:
      item.category === "video"
        ? "Video file updated"
        : "Design file updated",
    detail: `${item.title} is currently marked as ${item.status}.`,
    time: `${index + 1} hour ago`,
  }));

  return (
    <>
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

              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
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

                  <section className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Palette size={18} />
                      </div>
                      <div>
                        <h3>{pendingReviewCount}</h3>
                        <p>Pending Review</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <CheckCheck size={18} />
                      </div>
                      <div>
                        <h3>{waitingApprovalCount}</h3>
                        <p>Waiting Approval</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <h3>{approvedCount}</h3>
                        <p>Approved Files</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Megaphone size={18} />
                      </div>
                      <div>
                        <h3>{notifications.length}</h3>
                        <p>Notifications</p>
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

                  <section className={styles.doubleGrid}>
                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Upcoming Deadlines</h3>
                      </div>

                      <div className={styles.cardList}>
                        {upcomingDeadlines.length > 0 ? (
                          upcomingDeadlines.map((item) => (
                            <div className={styles.infoCard} key={item.id}>
                              <div>
                                <h4>{item.title}</h4>
                                <p>{item.project}</p>
                                <span>Due: {item.dueDate}</span>
                              </div>

                              <strong className={styles.deadlineBadge}>
                                {item.daysLeft} days left
                              </strong>
                            </div>
                          ))
                        ) : (
                          <div className={styles.emptyState}>No project deadlines yet.</div>
                        )}
                      </div>
                    </div>

                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Recent Activity</h3>
                      </div>

                      <div className={styles.cardList}>
                        {recentActivities.length > 0 ? (
                          recentActivities.map((activity) => (
                            <div className={styles.activityCard} key={activity.id}>
                              <div className={styles.activityDot}></div>
                              <div>
                                <h4>{activity.title}</h4>
                                <p>{activity.detail}</p>
                                <span>{activity.time}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={styles.emptyState}>No activity yet.</div>
                        )}
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
                      <a
                        key={project.id}
                        href={`/designer-dashboard/projects/${project.id}`}
                        className={styles.projectCard}
                      >
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
                      </a>
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
                    {designTasks.length > 0 ? (
                      designTasks.map((task) => (
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
                      ))
                    ) : (
                      <div className={styles.emptyState}>No design files yet.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "videos" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Video Production</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {videoTasks.length > 0 ? (
                      videoTasks.map((video) => (
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
                              <Video size={14} /> Video from uploads
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No video files uploaded yet.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "uploads" && (
                <section className={styles.uploadLayout}>
                  <div className={styles.panel}>
                    <div className={styles.panelHead}>
                      <h3>{editingUploadId ? "Edit File" : "Upload New Design / Video"}</h3>
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

                      {!editingUploadId && <input id="designerFile" type="file" required />}

                      <div className={styles.formActions}>
                        <button type="submit" disabled={uploading}>
                          {uploading
                            ? "Saving..."
                            : editingUploadId
                            ? "Save Changes"
                            : "Upload File"}
                        </button>

                        {editingUploadId && (
                          <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => {
                              setEditingUploadId(null);
                              setUploadForm({
                                title: "",
                                category: "design",
                                status: "Pending Review",
                                note: "",
                                projectId: "",
                              });
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className={styles.panel}>
                    <div className={styles.panelHead}>
                      <h3>Uploaded Files</h3>
                    </div>

                    <div className={styles.cardList}>
                      {uploads.map((item) => (
                        <div className={styles.uploadCard} key={item.id}>
                          <div className={styles.uploadInfo}>
                            <h4>{item.title}</h4>
                            <p>
                              {item.category} • {item.status}
                            </p>
                            <span>{item.project?.name || "No project linked"}</span>
                          </div>

                          <div className={styles.uploadActions}>
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.fileLink}
                            >
                              View
                            </a>

                            <button
                              type="button"
                              className={styles.actionBtn}
                              onClick={() => handleEditUpload(item)}
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteUpload(item.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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
                      <button
                        className={styles.newChatBtn}
                        onClick={() => setShowCreateChatModal(true)}
                      >
                        <Plus size={16} />
                        New Chat
                      </button>
                    </div>

                    <div className={styles.searchBox}>
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search by chat, project, or person..."
                        value={conversationSearch}
                        onChange={(e) => setConversationSearch(e.target.value)}
                      />
                    </div>

                    <div className={styles.chatList}>
                      {filteredConversations.length > 0 ? (
                        filteredConversations.map((chat) => {
                          const lastMessage = getLastMessage(chat);

                          return (
                            <button
                              key={chat.id}
                              className={`${styles.chatListItem} ${
                                selectedConversationId === chat.id ? styles.chatActive : ""
                              }`}
                              onClick={() => setSelectedConversationId(chat.id)}
                            >
                              <div className={styles.chatListTop}>
                                <strong>{chat.title}</strong>
                                <span className={styles.chatTime}>{lastMessage.time}</span>
                              </div>

                              <p className={styles.chatProjectName}>
                                {chat.project?.name || "General conversation"}
                              </p>

                              <span className={styles.chatPreviewText}>
                                {lastMessage.text}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className={styles.noSearchResults}>
                          No conversation found.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.chatPanel}>
                    {selectedConversation ? (
                      <>
                        <div className={styles.chatHeader}>
                          <div className={styles.chatHeaderTop}>
                            <div>
                              <h3>{selectedConversation.title}</h3>
                              <p>{selectedConversation.project?.name || "No project selected"}</p>
                            </div>

                            <button
                              className={styles.deleteChatBtn}
                              onClick={handleDeleteChat}
                              disabled={deletingChat}
                            >
                              <Trash2 size={16} />
                              {deletingChat ? "Deleting..." : "Delete Chat"}
                            </button>
                          </div>

                          <div className={styles.membersRow}>
                            <Users size={15} />
                            <div className={styles.membersList}>
                              {selectedConversation.members.map((member) => {
                                const isYou = member.user.id === DEMO_DESIGNER_ID;

                                return (
                                  <span key={member.id} className={styles.memberBadge}>
                                    {isYou ? "You" : member.user.name} • {member.user.role}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className={styles.messageArea} ref={messageAreaRef}>
                          {selectedConversation.messages.map((msg) => {
                            const mine = msg.sender.id === DEMO_DESIGNER_ID;
                            const parsed = parseMessageContent(msg.text);

                            return (
                              <div
                                key={msg.id}
                                className={`${styles.messageBubble} ${
                                  mine ? styles.myMessage : styles.theirMessage
                                }`}
                              >
                                <strong>{mine ? "You" : msg.sender.name}</strong>

                                {editingMessageId === msg.id ? (
                                  <div className={styles.editMessageBox}>
                                    <input
                                      type="text"
                                      value={editingMessageText}
                                      onChange={(e) => setEditingMessageText(e.target.value)}
                                    />
                                    <div className={styles.editMessageActions}>
                                      <button onClick={() => handleEditMessage(msg.id)}>
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingMessageId(null);
                                          setEditingMessageText("");
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : parsed.kind === "media" ? (
                                  <div className={styles.mediaMessageBox}>
                                    {parsed.mediaType === "image" ? (
                                      <img
                                        src={parsed.url}
                                        alt="chat media"
                                        className={styles.chatMediaImage}
                                      />
                                    ) : (
                                      <video
                                        src={parsed.url}
                                        controls
                                        className={styles.chatMediaVideo}
                                      />
                                    )}

                                    {parsed.caption ? (
                                      <p className={styles.mediaCaption}>{parsed.caption}</p>
                                    ) : null}
                                  </div>
                                ) : (
                                  <p>{parsed.text}</p>
                                )}

                                <span>{new Date(msg.createdAt).toLocaleString()}</span>

                                {mine && editingMessageId !== msg.id ? (
                                  <div className={styles.messageActions}>
                                    {parsed.kind === "text" ? (
                                      <button
                                        onClick={() => {
                                          setEditingMessageId(msg.id);
                                          setEditingMessageText(parsed.text || "");
                                        }}
                                      >
                                        Edit
                                      </button>
                                    ) : null}
                                    <button onClick={() => handleDeleteMessage(msg.id)}>
                                      Delete
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>

                        <div className={styles.chatToolsRow}>
                          <button
                            className={styles.toolBtn}
                            type="button"
                            onClick={() => setShowEmojiBar((prev) => !prev)}
                          >
                            <Smile size={16} />
                            Emoji
                          </button>

                          <button
                            className={styles.toolBtn}
                            type="button"
                            onClick={() => mediaInputRef.current?.click()}
                          >
                            <Paperclip size={16} />
                            Media
                          </button>

                          <input
                            ref={mediaInputRef}
                            type="file"
                            accept="image/*,video/*"
                            className={styles.hiddenInput}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleMediaUpload(file);
                              }
                            }}
                          />
                        </div>

                        {showEmojiBar ? (
                          <div className={styles.emojiBar}>
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => setMessageText((prev) => prev + emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        ) : null}

                        <div className={styles.messageComposer}>
                          <input
                            type="text"
                            placeholder="Type your message or add caption..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSendMessage();
                              }
                            }}
                          />
                          <button onClick={handleSendMessage} disabled={sendingMedia}>
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
                    {approvalItems.length > 0 ? (
                      approvalItems.map((item) => (
                        <div className={styles.infoCard} key={item.id}>
                          <div>
                            <h4>{item.itemName}</h4>
                            <p>{item.type}</p>
                            <span>{item.feedback}</span>
                          </div>
                          <strong className={styles.statusBadge}>{item.status}</strong>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No approval items yet.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "notifications" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Notifications</h3>
                  </div>

                  <div className={styles.cardList}>
                    {notifications.length > 0 ? (
                      notifications.map((note) => (
                        <div className={styles.infoCard} key={note.id}>
                          <div>
                            <h4>{note.title}</h4>
                            <p>{note.type}</p>
                            <span>{note.time}</span>
                          </div>
                          <strong className={styles.statusBadge}>New</strong>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No notifications yet.</div>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {showCreateChatModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHead}>
              <h3>Create New Chat</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowCreateChatModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <input
                type="text"
                placeholder="Chat title"
                value={createChatForm.title}
                onChange={(e) =>
                  setCreateChatForm({ ...createChatForm, title: e.target.value })
                }
              />

              <select
                value={createChatForm.projectId}
                onChange={(e) =>
                  setCreateChatForm({ ...createChatForm, projectId: e.target.value })
                }
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <div className={styles.participantsBox}>
                <h4>Select Participants</h4>

                {participantsLoading ? (
                  <div className={styles.participantsLoading}>Loading participants...</div>
                ) : availableParticipants.length > 0 ? (
                  <div className={styles.participantsList}>
                    {availableParticipants.map((participant) => (
                      <label key={participant.id} className={styles.participantItem}>
                        <input
                          type="checkbox"
                          checked={selectedParticipantIds.includes(participant.id)}
                          onChange={() => toggleParticipant(participant.id)}
                        />
                        <div>
                          <strong>{participant.name}</strong>
                          <span>
                            {participant.email} • {participant.role}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className={styles.participantsLoading}>
                    Select a project first.
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setShowCreateChatModal(false)}
              >
                Cancel
              </button>

              <button
                className={styles.modalCreateBtn}
                onClick={handleCreateChat}
                disabled={creatingChat}
              >
                {creatingChat ? "Creating..." : "Create Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}