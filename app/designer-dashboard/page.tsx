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
  BarChart3,
  BadgeDollarSign,
  Sun,
  Moon,
} from "lucide-react";

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

type AdItem = {
  id: number;
  campaignName: string;
  platform: string;
  budget: string;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  leads: number;
  costPerResult: string;
};

type ReportItem = {
  id: number;
  projectName: string;
  followers: number;
  growth: string;
  engagement: string;
  bestPost: string;
  adsPerformance: string;
  recommendation: string;
};

type LoggedInUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const STORAGE_KEY = "designer_selected_conversation";
const THEME_KEY = "designerTheme";
const EMOJIS = ["😀", "😂", "😍", "🔥", "👏", "🎉", "❤️", "👍", "🤝", "😎"];

const demoProjects: Project[] = [
  {
    id: 101,
    name: "Spring Fashion Campaign",
    service: "Social Media Design",
    status: "In Progress",
    deadline: "2026-04-25",
    owner: {
      id: 201,
      name: "Lina Fashion",
      email: "client@nakshat.com",
    },
    uploads: [],
  },
  {
    id: 102,
    name: "Restaurant Launch Ads",
    service: "Ads Management",
    status: "Waiting Approval",
    deadline: "2026-04-29",
    owner: {
      id: 202,
      name: "Nakshat Company",
      email: "company@nakshat.com",
    },
    uploads: [],
  },
];

const demoUploads: UploadItem[] = [
  {
    id: 301,
    title: "Spring Instagram Post",
    fileUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    fileType: "JPG",
    category: "design",
    status: "Pending Review",
    note: "Need a bigger title and stronger CTA.",
    createdAt: "2026-04-10T10:00:00.000Z",
    project: {
      id: 101,
      name: "Spring Fashion Campaign",
      deadline: "2026-04-25",
    },
  },
  {
    id: 302,
    title: "Restaurant Promo Reel",
    fileUrl: "https://www.w3schools.com/html/movie.mp4",
    fileType: "MP4",
    category: "video",
    status: "Waiting Client Approval",
    note: "Waiting final approval before publishing.",
    createdAt: "2026-04-12T15:00:00.000Z",
    project: {
      id: 102,
      name: "Restaurant Launch Ads",
      deadline: "2026-04-29",
    },
  },
];

const demoConversations: Conversation[] = [
  {
    id: 401,
    title: "Lina Fashion",
    project: {
      id: 101,
      name: "Spring Fashion Campaign",
    },
    members: [
      {
        id: 1,
        user: {
          id: 2,
          name: "Sara Designer",
          email: "designer@nakshat.com",
          role: "designer",
        },
      },
      {
        id: 2,
        user: {
          id: 201,
          name: "Lina Fashion",
          email: "client@nakshat.com",
          role: "client",
        },
      },
    ],
    messages: [
      {
        id: 501,
        text: "Please increase the title size in the first design.",
        createdAt: "2026-04-10T10:30:00.000Z",
        sender: {
          id: 201,
          name: "Lina Fashion",
          role: "client",
        },
      },
      {
        id: 502,
        text: "Done, I will upload the updated version tonight.",
        createdAt: "2026-04-10T11:00:00.000Z",
        sender: {
          id: 2,
          name: "Sara Designer",
          role: "designer",
        },
      },
    ],
  },
  {
    id: 402,
    title: "Nakshat Company",
    project: {
      id: 102,
      name: "Restaurant Launch Ads",
    },
    members: [
      {
        id: 3,
        user: {
          id: 2,
          name: "Sara Designer",
          email: "designer@nakshat.com",
          role: "designer",
        },
      },
      {
        id: 4,
        user: {
          id: 202,
          name: "Nakshat Company",
          email: "company@nakshat.com",
          role: "company",
        },
      },
    ],
    messages: [
      {
        id: 503,
        text: "The promo reel looks good. Waiting for final approval.",
        createdAt: "2026-04-12T14:10:00.000Z",
        sender: {
          id: 202,
          name: "Nakshat Company",
          role: "company",
        },
      },
      {
        id: 504,
        text: "I also prepared a story ad for the same campaign.",
        createdAt: "2026-04-12T14:40:00.000Z",
        sender: {
          id: 2,
          name: "Sara Designer",
          role: "designer",
        },
      },
    ],
  },
];

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

function getChatDisplayName(chat: Conversation, currentUserId?: number) {
  const otherMembers = chat.members.filter((member) => member.user.id !== currentUserId);

  if (otherMembers.length === 1) {
    return otherMembers[0].user.name;
  }

  if (chat.title && chat.title.trim()) {
    return chat.title;
  }

  return "New Chat";
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

  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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

  async function loadData(userId: number) {
  try {
    setLoading(true);

    const [projectsRes, uploadsRes, chatRes] = await Promise.all([
      fetch(`/api/designer/projects?designerId=${userId}`, { cache: "no-store" }),
      fetch(`/api/uploads?designerId=${userId}`, { cache: "no-store" }),
      fetch(`/api/chat/conversations?userId=${userId}`, { cache: "no-store" }),
    ]);

    const projectsData = await projectsRes.json().catch(() => ({
      success: false,
      projects: [],
    }));

    const uploadsData = await uploadsRes.json().catch(() => ({
      success: false,
      uploads: [],
    }));

    const chatData = await chatRes.json().catch(() => ({
      success: false,
      conversations: [],
    }));

    const loadedProjects: Project[] = projectsData.success ? projectsData.projects || [] : [];
    const loadedUploads: UploadItem[] = uploadsData.success ? uploadsData.uploads || [] : [];
    const loadedConversations: Conversation[] = chatData.success
      ? chatData.conversations || []
      : [];

    setProjects(loadedProjects.length > 0 ? loadedProjects : demoProjects);
    setUploads(loadedUploads.length > 0 ? loadedUploads : demoUploads);

    // مهم جدًا: لا تستخدمي demoConversations
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
  } catch (error) {
    console.error("LOAD DESIGNER DATA ERROR:", error);
    setProjects(demoProjects);
    setUploads(demoUploads);
    setConversations([]);
    setSelectedConversationId(null);
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    const rawUser = localStorage.getItem("loggedInUser");

    if (!rawUser) {
      window.location.href = "/";
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as LoggedInUser;

      if (!parsedUser?.id || parsedUser.role !== "designer") {
        window.location.href = "/";
        return;
      }

      setCurrentUser(parsedUser);
      loadData(parsedUser.id);
    } catch (error) {
      console.error("READ LOGGED IN USER ERROR:", error);
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (selectedConversationId) {
      localStorage.setItem(STORAGE_KEY, String(selectedConversationId));
    }
  }, [selectedConversationId]);

  useEffect(() => {
    if (!currentUser?.id) return;
    
    const interval = setInterval(() => {
      fetch(`/api/chat/conversations?userId=${currentUser.id}`, { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.conversations) {
            setConversations(data.conversations);
          }
        })
        .catch(err => console.error("Polling error", err));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    async function loadParticipants() {
      if (!currentUser?.id || !showCreateChatModal) {
        return;
      }

      try {
        setParticipantsLoading(true);

        const res = await fetch(`/api/chat/participants?userId=${currentUser.id}`, {
          cache: "no-store",
        });

        const data = await res.json().catch(() => ({
          success: false,
          participants: [],
        }));

        if (data.success) {
          setAvailableParticipants(data.participants || []);
        } else {
          setAvailableParticipants([]);
        }
      } catch (error) {
        console.error("LOAD PARTICIPANTS ERROR:", error);
        setAvailableParticipants([]);
      } finally {
        setParticipantsLoading(false);
      }
    }

    loadParticipants();
  }, [showCreateChatModal, currentUser]);

  const filteredConversations = useMemo(() => {
    const search = conversationSearch.trim().toLowerCase();
    if (!search) return conversations;

    return conversations.filter((chat) => {
      const displayName = getChatDisplayName(chat, currentUser?.id).toLowerCase();
      const projectMatch = chat.project?.name?.toLowerCase().includes(search);

      const memberMatch = chat.members.some((member) => {
        const memberName = member.user.name?.toLowerCase() || "";
        const memberEmail = member.user.email?.toLowerCase() || "";
        return memberName.includes(search) || memberEmail.includes(search);
      });

      return displayName.includes(search) || projectMatch || memberMatch;
    });
  }, [conversationSearch, conversations, currentUser]);

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
      if (parsed.caption) preview += ` • ${parsed.caption}`;
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
  }, [activeSection, selectedConversationId, selectedConversation?.messages.length, conversations]);

  async function handleCreateChat() {
    if (!currentUser || selectedParticipantIds.length === 0) {
      alert("Please choose a person first.");
      return;
    }

    const selectedUser = availableParticipants.find(
      (item) => item.id === selectedParticipantIds[0]
    );

    try {
      setCreatingChat(true);

      const payload = {
        title: selectedUser?.name || createChatForm.title || "New Chat",
        projectId: createChatForm.projectId ? Number(createChatForm.projectId) : null,
        creatorId: currentUser.id,
        participantIds: selectedParticipantIds,
      };

      const res = await fetch("/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({ success: false }));

      if (!data.success) {
        alert(data.message || "Failed to create chat.");
        return;
      }

      setShowCreateChatModal(false);
      setCreateChatForm({ title: "", projectId: "" });
      setSelectedParticipantIds([]);
      
      if (data.chat?.id) {
        setSelectedConversationId(data.chat.id);
      }
      
      await loadData(currentUser.id);
    } catch (error) {
      console.error("CREATE CHAT ERROR:", error);
      alert("Failed to create chat.");
    } finally {
      setCreatingChat(false);
    }
  }

  function toggleParticipant(id: number) {
    setSelectedParticipantIds((prev) => (prev.includes(id) ? [] : [id]));
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

  function handleDeleteUpload(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;
    setUploads((prev) => prev.filter((item) => item.id !== id));
  }

  function handleUploadFile(event: React.FormEvent<HTMLFormElement>) {
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
        setUploads((prev) =>
          prev.map((item) =>
            item.id === editingUploadId
              ? {
                  ...item,
                  title: uploadForm.title,
                  category: uploadForm.category,
                  status: uploadForm.status,
                  note: uploadForm.note,
                }
              : item
          )
        );
      } else {
        const linkedProject = projects.find(
          (project) => String(project.id) === uploadForm.projectId
        );

        const newUpload: UploadItem = {
          id: Date.now(),
          title: uploadForm.title,
          category: uploadForm.category,
          status: uploadForm.status,
          note: uploadForm.note,
          fileUrl: file ? URL.createObjectURL(file) : "#",
          fileType: file?.type || "FILE",
          createdAt: new Date().toISOString(),
          project: linkedProject
            ? {
                id: linkedProject.id,
                name: linkedProject.name,
                deadline: linkedProject.deadline,
              }
            : null,
        };

        setUploads((prev) => [newUpload, ...prev]);
      }

      setUploadForm({
        title: "",
        category: "design",
        status: "Pending Review",
        note: "",
        projectId: "",
      });

      setEditingUploadId(null);

      if (fileInput) fileInput.value = "";
    } finally {
      setUploading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  }

  const totalProjects = projects.length;
  const totalUploads = uploads.length;
  const designUploads = uploads.filter((item) => item.category === "design");
  const videoUploads = uploads.filter((item) => item.category === "video");
  const designCount = designUploads.length;
  const videoCount = videoUploads.length;
  const pendingReviewCount = uploads.filter((item) => item.status === "Pending Review").length;
  const waitingApprovalCount = uploads.filter(
    (item) => item.status === "Waiting Client Approval"
  ).length;
  const approvedCount = uploads.filter((item) => item.status === "Approved").length;

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
      ? [{ id: 1, title: `${pendingReviewCount} file(s) pending review`, time: "Now" }]
      : []),
    ...(waitingApprovalCount > 0
      ? [{ id: 2, title: `${waitingApprovalCount} file(s) waiting client approval`, time: "Now" }]
      : []),
    ...(videoCount > 0
      ? [{ id: 3, title: `${videoCount} video file(s) available`, time: "Now" }]
      : []),
    ...(projects.length > 0
      ? [{ id: 4, title: `${projects.length} active assigned project(s)`, time: "Now" }]
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
    title: item.category === "video" ? "Video file updated" : "Design file updated",
    detail: `${item.title} is currently marked as ${item.status}.`,
    time: `${index + 1} hour ago`,
  }));

  const contentCalendarItems = uploads
    .filter((item) => ["design", "video", "branding"].includes(item.category))
    .slice(0, 6)
    .map((item, index) => ({
      id: item.id,
      date: new Date(item.createdAt).toLocaleDateString(),
      platform:
        index % 3 === 0 ? "Instagram" : index % 3 === 1 ? "Facebook" : "TikTok",
      contentType: item.category === "video" ? "Video" : "Post",
      title: item.title,
      relatedDesign: item.project?.name || "No linked project",
      publishStatus:
        item.status === "Approved"
          ? "Ready"
          : item.status === "Waiting Client Approval"
          ? "Pending Approval"
          : "Planned",
    }));

  const shootingScheduleItems = projects.slice(0, 6).map((project, index) => ({
    id: project.id,
    projectName: project.name,
    shootingDate: project.deadline,
    shootingTime: index % 2 === 0 ? "10:00 AM" : "01:30 PM",
    location: index % 2 === 0 ? "Client Office" : "Outdoor Location",
    team: "Designer + Photographer + Content Creator",
    equipment: index % 2 === 0 ? "Camera, Lights, Tripod" : "Camera, Gimbal, Mic",
    status:
      project.status === "Completed"
        ? "Done"
        : project.status === "In Progress"
        ? "Confirmed"
        : "Waiting Client Confirmation",
  }));

  const adsItems: AdItem[] = projects.map((project, index) => ({
    id: project.id,
    campaignName: `${project.name} Ads`,
    platform:
      index % 3 === 0
        ? "Facebook Ads"
        : index % 3 === 1
        ? "Instagram Ads"
        : "Google Ads",
    budget: `$${(index + 1) * 250}`,
    startDate: "2026-04-01",
    endDate: project.deadline,
    impressions: 12000 + index * 3500,
    clicks: 520 + index * 80,
    leads: 35 + index * 6,
    costPerResult: `$${(4.5 + index * 0.7).toFixed(2)}`,
  }));

  const reportsItems: ReportItem[] = projects.map((project, index) => ({
    id: project.id,
    projectName: project.name,
    followers: 1000 + index * 450,
    growth: `${8 + index * 2}%`,
    engagement: `${4.2 + index * 0.6}%`,
    bestPost: uploads[index]?.title || "No post yet",
    adsPerformance: index % 2 === 0 ? "Strong" : "Average",
    recommendation:
      index % 2 === 0
        ? "Increase budget on top-performing visuals."
        : "Test a stronger CTA and shorter captions.",
  }));

  return (
    <>
      <div className={`${styles.page} ${theme === "light" ? styles.lightMode : ""}`}>
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
              className={activeSection === "content-calendar" ? styles.activeNav : ""}
              onClick={() => setActiveSection("content-calendar")}
            >
              <Clock3 size={18} />
              Content Calendar
            </button>

            <button
              className={activeSection === "shooting-schedule" ? styles.activeNav : ""}
              onClick={() => setActiveSection("shooting-schedule")}
            >
              <ImageIcon size={18} />
              Shooting Schedule
            </button>

            <button
              className={activeSection === "ads-management" ? styles.activeNav : ""}
              onClick={() => setActiveSection("ads-management")}
            >
              <BadgeDollarSign size={18} />
              Ads Management
            </button>

            <button
              className={activeSection === "reports" ? styles.activeNav : ""}
              onClick={() => setActiveSection("reports")}
            >
              <BarChart3 size={18} />
              Reports
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
              Track design tasks, video stages, approvals, content planning,
              ad campaign details, and reports from one workspace.
            </p>
          </div>
        </aside>

        <main className={styles.main}>
          <header className={styles.topbar}>
            <div>
              <h1>Designer Dashboard</h1>
              <p>
                Manage projects, upload designs and videos, follow content
                planning, and chat with the team in one place.
              </p>
            </div>

            <div className={styles.topbarRight}>
              <button className={styles.alertBtn} type="button" aria-label="Notifications">
                <Bell size={18} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                className={styles.themeToggleBtn}
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>

              <div className={styles.profileBox}>
                <div className={styles.avatar}>
                  {currentUser?.name?.charAt(0)?.toUpperCase() || "D"}
                </div>
                <div>
                  <strong>{currentUser?.name || "Designer"}</strong>
                  <span>{currentUser?.email || "designer@nakshat.com"}</span>
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
                        {projects.length > 0 ? (
                          projects.map((project) => (
                            <div className={styles.infoCard} key={project.id}>
                              <div>
                                <h4>{project.name}</h4>
                                <p>{project.service}</p>
                                <span>Deadline: {project.deadline}</span>
                              </div>
                              <strong className={styles.statusBadge}>{project.status}</strong>
                            </div>
                          ))
                        ) : (
                          <div className={styles.emptyState}>No projects found.</div>
                        )}
                      </div>
                    </div>

                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Recent Uploads</h3>
                      </div>

                      <div className={styles.cardList}>
                        {uploads.length > 0 ? (
                          uploads.slice(0, 5).map((item) => (
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
                          ))
                        ) : (
                          <div className={styles.emptyState}>No uploads found.</div>
                        )}
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

                  <section className={styles.doubleGrid}>
                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Content Calendar</h3>
                      </div>

                      <div className={styles.cardList}>
                        {contentCalendarItems.length > 0 ? (
                          contentCalendarItems.map((item) => (
                            <div className={styles.infoCard} key={item.id}>
                              <div>
                                <h4>{item.title}</h4>
                                <p>
                                  {item.platform} • {item.contentType}
                                </p>
                                <span>
                                  {item.date} • {item.relatedDesign}
                                </span>
                              </div>

                              <strong className={styles.statusBadge}>
                                {item.publishStatus}
                              </strong>
                            </div>
                          ))
                        ) : (
                          <div className={styles.emptyState}>No content items yet.</div>
                        )}
                      </div>
                    </div>

                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Shooting Schedule</h3>
                      </div>

                      <div className={styles.cardList}>
                        {shootingScheduleItems.length > 0 ? (
                          shootingScheduleItems.map((item) => (
                            <div className={styles.infoCard} key={item.id}>
                              <div>
                                <h4>{item.projectName}</h4>
                                <p>
                                  {item.shootingDate} • {item.shootingTime}
                                </p>
                                <span>
                                  {item.location} • {item.equipment}
                                </span>
                              </div>

                              <strong className={styles.statusBadge}>{item.status}</strong>
                            </div>
                          ))
                        ) : (
                          <div className={styles.emptyState}>No shooting schedule yet.</div>
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
                    {projects.length > 0 ? (
                      projects.map((project) => (
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
                      ))
                    ) : (
                      <div className={styles.emptyState}>No assigned projects.</div>
                    )}
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

              {activeSection === "content-calendar" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Content Calendar</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {contentCalendarItems.length > 0 ? (
                      contentCalendarItems.map((item) => (
                        <div key={item.id} className={styles.projectCard}>
                          <div className={styles.projectTop}>
                            <h4>{item.title}</h4>
                            <span className={styles.statusBadge}>{item.publishStatus}</span>
                          </div>

                          <p>
                            <strong>Date:</strong> {item.date}
                          </p>
                          <p>
                            <strong>Platform:</strong> {item.platform}
                          </p>
                          <p>
                            <strong>Content Type:</strong> {item.contentType}
                          </p>
                          <p>
                            <strong>Related Project:</strong> {item.relatedDesign}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No content items yet.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "shooting-schedule" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Shooting Schedule</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {shootingScheduleItems.length > 0 ? (
                      shootingScheduleItems.map((item) => (
                        <div key={item.id} className={styles.projectCard}>
                          <div className={styles.projectTop}>
                            <h4>{item.projectName}</h4>
                            <span className={styles.statusBadge}>{item.status}</span>
                          </div>

                          <p>
                            <strong>Date:</strong> {item.shootingDate}
                          </p>
                          <p>
                            <strong>Time:</strong> {item.shootingTime}
                          </p>
                          <p>
                            <strong>Location:</strong> {item.location}
                          </p>
                          <p>
                            <strong>Team:</strong> {item.team}
                          </p>
                          <p>
                            <strong>Equipment:</strong> {item.equipment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No shooting schedule yet.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "ads-management" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Ads Management</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {adsItems.length > 0 ? (
                      adsItems.map((ad) => (
                        <div key={ad.id} className={styles.projectCard}>
                          <div className={styles.projectTop}>
                            <h4>{ad.campaignName}</h4>
                            <span className={styles.statusBadge}>{ad.platform}</span>
                          </div>

                          <p>
                            <strong>Budget:</strong> {ad.budget}
                          </p>
                          <p>
                            <strong>Start Date:</strong> {ad.startDate}
                          </p>
                          <p>
                            <strong>End Date:</strong> {ad.endDate}
                          </p>
                          <p>
                            <strong>Impressions:</strong> {ad.impressions}
                          </p>
                          <p>
                            <strong>Clicks:</strong> {ad.clicks}
                          </p>
                          <p>
                            <strong>Leads:</strong> {ad.leads}
                          </p>
                          <p>
                            <strong>Cost Per Result:</strong> {ad.costPerResult}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No ad campaigns yet.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "reports" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Reports</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {reportsItems.length > 0 ? (
                      reportsItems.map((report) => (
                        <div key={report.id} className={styles.projectCard}>
                          <div className={styles.projectTop}>
                            <h4>{report.projectName}</h4>
                            <span className={styles.statusBadge}>{report.adsPerformance}</span>
                          </div>

                          <p>
                            <strong>Followers:</strong> {report.followers}
                          </p>
                          <p>
                            <strong>Growth:</strong> {report.growth}
                          </p>
                          <p>
                            <strong>Engagement:</strong> {report.engagement}
                          </p>
                          <p>
                            <strong>Best Post:</strong> {report.bestPost}
                          </p>
                          <p>
                            <strong>Ads Performance:</strong> {report.adsPerformance}
                          </p>
                          <p>
                            <strong>Recommendation:</strong> {report.recommendation}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No reports yet.</div>
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
                      {uploads.length > 0 ? (
                        uploads.map((item) => (
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
                        ))
                      ) : (
                        <div className={styles.emptyState}>No files uploaded yet.</div>
                      )}
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
                        placeholder="Search by chat, project, or person."
                        value={conversationSearch}
                        onChange={(e) => setConversationSearch(e.target.value)}
                      />
                    </div>

                    <div className={styles.chatList}>
                      {filteredConversations.length > 0 ? (
                        filteredConversations.map((chat) => {
                          const lastMessage = getLastMessage(chat);
                          const displayName = getChatDisplayName(chat, currentUser?.id);

                          return (
                            <button
                              key={chat.id}
                              className={`${styles.chatListItem} ${
                                selectedConversationId === chat.id ? styles.chatActive : ""
                              }`}
                              onClick={() => setSelectedConversationId(chat.id)}
                            >
                              <div className={styles.chatListTop}>
                                <strong>{displayName}</strong>
                                <span className={styles.chatTime}>{lastMessage.time}</span>
                              </div>

                              <p className={styles.chatProjectName}>
                                {chat.project?.name || "Direct chat"}
                              </p>

                              <span className={styles.chatPreviewText}>
                                {lastMessage.text}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className={styles.noSearchResults}>No conversation found.</div>
                      )}
                    </div>
                  </div>

                  <div className={styles.chatPanel}>
                    {selectedConversation ? (
                      <>
                        <div className={styles.chatHeader}>
                          <div className={styles.chatHeaderTop}>
                            <div>
                              <h3>
                                {getChatDisplayName(selectedConversation, currentUser?.id)}
                              </h3>
                              <p>{selectedConversation.project?.name || "Direct chat"}</p>
                            </div>

                            <button
                              className={styles.deleteChatBtn}
                              onClick={async () => {
                                if (!selectedConversationId || !currentUser) return;

                                const confirmed = window.confirm(
                                  "Are you sure you want to delete this chat?"
                                );
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
                                      userId: currentUser.id,
                                    }),
                                  });

                                  const data = await res.json().catch(() => ({
                                    success: false,
                                  }));

                                  if (!data.success) {
                                    alert(data.message || "Failed to delete chat.");
                                    return;
                                  }

                                  await loadData(currentUser.id);
                                } catch (error) {
                                  console.error("DELETE CHAT ERROR:", error);
                                  alert("Failed to delete chat.");
                                } finally {
                                  setDeletingChat(false);
                                }
                              }}
                              disabled={deletingChat}
                            >
                              <Trash2 size={16} />
                              {deletingChat ? "Deleting..." : "Delete"}
                            </button>
                          </div>

                          <div className={styles.membersRow}>
                            <Users size={16} />
                            <div className={styles.membersList}>
                              {selectedConversation.members.map((member) => (
                                <span key={member.id} className={styles.memberBadge}>
                                  {member.user.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className={styles.messageArea} ref={messageAreaRef}>
                          {selectedConversation.messages.length > 0 ? (
                            selectedConversation.messages.map((message) => {
                              const parsed = parseMessageContent(message.text);
                              const isMine = message.sender.id === currentUser?.id;

                              return (
                                <div
                                  key={message.id}
                                  className={`${styles.messageBubble} ${
                                    isMine ? styles.myMessage : styles.theirMessage
                                  }`}
                                >
                                  <strong>{message.sender.name}</strong>

                                  {editingMessageId === message.id ? (
                                    <>
                                      <input
                                        value={editingMessageText}
                                        onChange={(e) => setEditingMessageText(e.target.value)}
                                        style={{
                                          width: "100%",
                                          marginBottom: "10px",
                                          padding: "10px",
                                          borderRadius: "10px",
                                          border: "none",
                                        }}
                                      />

                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "8px",
                                          marginBottom: "8px",
                                        }}
                                      >
                                        <button
                                          type="button"
                                          className={styles.actionBtn}
                                          onClick={async () => {
                                            if (!editingMessageText.trim() || !currentUser) return;

                                            try {
                                              const res = await fetch("/api/chat/messages", {
                                                method: "PATCH",
                                                headers: {
                                                  "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                  messageId: message.id,
                                                  text: editingMessageText,
                                                  userId: currentUser.id,
                                                }),
                                              });

                                              const data = await res.json().catch(() => ({
                                                success: false,
                                              }));

                                              if (!data.success) {
                                                alert(data.message || "Failed to update message.");
                                                return;
                                              }

                                              setEditingMessageId(null);
                                              setEditingMessageText("");
                                              await loadData(currentUser.id);
                                            } catch (error) {
                                              console.error("EDIT MESSAGE ERROR:", error);
                                              alert("Failed to update message.");
                                            }
                                          }}
                                        >
                                          <CheckCircle2 size={15} />
                                        </button>

                                        <button
                                          type="button"
                                          className={styles.deleteBtn}
                                          onClick={() => {
                                            setEditingMessageId(null);
                                            setEditingMessageText("");
                                          }}
                                        >
                                          <X size={15} />
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      {parsed.kind === "media" ? (
                                        <>
                                          {parsed.mediaType === "image" ? (
                                            <img
                                              src={parsed.url}
                                              alt="Chat media"
                                              className={styles.chatMediaImage}
                                            />
                                          ) : (
                                            <video
                                              src={parsed.url}
                                              controls
                                              className={styles.chatMediaVideo}
                                            />
                                          )}

                                          {parsed.caption && <p>{parsed.caption}</p>}
                                        </>
                                      ) : (
                                        <p>{parsed.text}</p>
                                      )}

                                      <span>{new Date(message.createdAt).toLocaleString()}</span>

                                      {isMine && (
                                        <div
                                          style={{
                                            display: "flex",
                                            gap: "8px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          {parsed.kind === "text" && (
                                            <button
                                              type="button"
                                              className={styles.actionBtn}
                                              onClick={() => {
                                                setEditingMessageId(message.id);
                                                setEditingMessageText(parsed.text || "");
                                              }}
                                            >
                                              <Pencil size={15} />
                                            </button>
                                          )}

                                          <button
                                            type="button"
                                            className={styles.deleteBtn}
                                            onClick={async () => {
                                              if (!currentUser) return;

                                              const confirmed = window.confirm(
                                                "Delete this message?"
                                              );
                                              if (!confirmed) return;

                                              try {
                                                const res = await fetch("/api/chat/messages", {
                                                  method: "DELETE",
                                                  headers: {
                                                    "Content-Type": "application/json",
                                                  },
                                                  body: JSON.stringify({
                                                    messageId: message.id,
                                                    userId: currentUser.id,
                                                  }),
                                                });

                                                const data = await res.json().catch(() => ({
                                                  success: false,
                                                }));

                                                if (!data.success) {
                                                  alert(data.message || "Failed to delete message.");
                                                  return;
                                                }

                                                await loadData(currentUser.id);
                                              } catch (error) {
                                                console.error("DELETE MESSAGE ERROR:", error);
                                                alert("Failed to delete message.");
                                              }
                                            }}
                                          >
                                            <Trash2 size={15} />
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className={styles.emptyState}>No messages yet.</div>
                          )}
                        </div>

                        {showEmojiBar && (
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                              marginBottom: "12px",
                            }}
                          >
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => setMessageText((prev) => prev + emoji)}
                                className={styles.actionBtn}
                                style={{ width: "42px", height: "42px" }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className={styles.messageComposer}>
                          <input
                            type="text"
                            placeholder="Type your message."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();

                                if (!messageText.trim() || !selectedConversationId || !currentUser) {
                                  return;
                                }

                                try {
                                  const res = await fetch("/api/chat/messages", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      conversationId: selectedConversationId,
                                      userId: currentUser.id,
                                      text: messageText,
                                    }),
                                  });

                                  const data = await res.json().catch(() => ({
                                    success: false,
                                  }));

                                  if (!data.success) {
                                    alert(data.message || "Failed to send message.");
                                    return;
                                  }

                                  setMessageText("");
                                  setShowEmojiBar(false);
                                  await loadData(currentUser.id);
                                } catch (error) {
                                  console.error("SEND MESSAGE ERROR:", error);
                                  alert("Failed to send message.");
                                }
                              }
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => setShowEmojiBar((prev) => !prev)}
                          >
                            <Smile size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => mediaInputRef.current?.click()}
                            disabled={sendingMedia}
                          >
                            <Paperclip size={16} />
                          </button>

                          <input
                            ref={mediaInputRef}
                            type="file"
                            accept="image/*,video/*"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file || !selectedConversationId || !currentUser) return;

                              try {
                                setSendingMedia(true);

                                const formData = new FormData();
                                formData.append("conversationId", String(selectedConversationId));
                                formData.append("senderId", String(currentUser.id));
                                formData.append("file", file);
                                if (messageText.trim()) {
                                  formData.append("text", messageText);
                                }

                                const res = await fetch("/api/chat/send", {
                                  method: "POST",
                                  body: formData,
                                });

                                const data = await res.json().catch(() => ({
                                  success: false,
                                }));

                                if (!data.success) {
                                  alert(data.message || "Failed to upload chat media.");
                                  return;
                                }

                                setMessageText("");
                                setShowEmojiBar(false);

                                if (mediaInputRef.current) {
                                  mediaInputRef.current.value = "";
                                }

                                await loadData(currentUser.id);
                              } catch (error) {
                                console.error("SEND MEDIA ERROR:", error);
                                alert("Failed to upload chat media.");
                              } finally {
                                setSendingMedia(false);
                              }
                            }}
                          />

                          <button
                            type="button"
                            onClick={async () => {
                              if (!messageText.trim() || !selectedConversationId || !currentUser) {
                                return;
                              }

                              try {
                                const res = await fetch("/api/chat/messages", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    conversationId: selectedConversationId,
                                    userId: currentUser.id,
                                    text: messageText,
                                  }),
                                });

                                const data = await res.json().catch(() => ({
                                  success: false,
                                }));

                                if (!data.success) {
                                  alert(data.message || "Failed to send message.");
                                  return;
                                }

                                setMessageText("");
                                setShowEmojiBar(false);
                                await loadData(currentUser.id);
                              } catch (error) {
                                console.error("SEND MESSAGE ERROR:", error);
                                alert("Failed to send message.");
                              }
                            }}
                          >
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
                    <h3>Approvals Center</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {approvalItems.length > 0 ? (
                      approvalItems.map((item) => (
                        <div key={item.id} className={styles.projectCard}>
                          <div className={styles.projectTop}>
                            <h4>{item.itemName}</h4>
                            <span className={styles.statusBadge}>{item.status}</span>
                          </div>

                          <p>
                            <strong>Type:</strong> {item.type}
                          </p>
                          <p>
                            <strong>Feedback:</strong> {item.feedback}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No approvals yet.</div>
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
                      notifications.map((item) => (
                        <div key={item.id} className={styles.activityCard}>
                          <div className={styles.activityDot}></div>
                          <div>
                            <h4>{item.title}</h4>
                            <span>{item.time}</span>
                          </div>
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
              <h3>Start New Chat</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowCreateChatModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h3>Choose Person</h3>
                </div>

                {participantsLoading ? (
                  <div className={styles.loading}>Loading people...</div>
                ) : availableParticipants.length > 0 ? (
                  <div className={styles.cardList}>
                    {availableParticipants.map((participant) => (
                      <label
                        key={participant.id}
                        className={styles.infoCard}
                        style={{
                          cursor: "pointer",
                          border: selectedParticipantIds.includes(participant.id)
                            ? "1px solid rgba(110, 168, 254, 0.8)"
                            : undefined,
                        }}
                      >
                        <div>
                          <h4>{participant.name}</h4>
                          <p>{participant.email}</p>
                          <span>{participant.role}</span>
                        </div>

                        <input
                          type="radio"
                          name="chat-user"
                          checked={selectedParticipantIds.includes(participant.id)}
                          onChange={() => toggleParticipant(participant.id)}
                        />
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>No participants available.</div>
                )}
              </div>

              <select
                value={createChatForm.projectId}
                onChange={(e) =>
                  setCreateChatForm({ ...createChatForm, projectId: e.target.value })
                }
              >
                <option value="">Without project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <div className={styles.formActions}>
                <button type="button" onClick={handleCreateChat} disabled={creatingChat}>
                  {creatingChat ? "Creating..." : "Start Chat"}
                </button>

                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowCreateChatModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}