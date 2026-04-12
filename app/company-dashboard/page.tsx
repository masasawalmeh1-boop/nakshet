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

const DEMO_DESIGNER_ID = 2;
const STORAGE_KEY = "designer_selected_conversation";
const EMOJIS = ["😀", "😂", "😍", "🔥", "👏", "🎉", "❤️", "👍", "🤝", "😎"];

const demoUploads: UploadItem[] = [
  {
    id: 1,
    title: "Spring Campaign Instagram Post",
    fileUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    fileType: "JPG",
    category: "design",
    status: "Pending Review",
    note: "Client asked to make the CTA text bigger.",
    createdAt: "2026-04-08T10:00:00.000Z",
    project: {
      id: 1,
      name: "Spring Fashion Campaign",
      deadline: "2026-04-15",
    },
  },
  {
    id: 2,
    title: "Product Reel Draft",
    fileUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    fileType: "MP4",
    category: "video",
    status: "Waiting Client Approval",
    note: "Waiting final approval before publishing.",
    createdAt: "2026-04-09T11:30:00.000Z",
    project: {
      id: 1,
      name: "Spring Fashion Campaign",
      deadline: "2026-04-15",
    },
  },
  {
    id: 3,
    title: "Logo Refresh Mockup",
    fileUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
    fileType: "PNG",
    category: "branding",
    status: "Approved",
    note: "Approved by client.",
    createdAt: "2026-04-07T09:15:00.000Z",
    project: {
      id: 2,
      name: "Coffee House Branding",
      deadline: "2026-04-20",
    },
  },
  {
    id: 4,
    title: "Story Ad Version 2",
    fileUrl: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931",
    fileType: "JPG",
    category: "design",
    status: "Approved",
    note: "Ready for publishing.",
    createdAt: "2026-04-09T14:00:00.000Z",
    project: {
      id: 3,
      name: "Restaurant Awareness Ads",
      deadline: "2026-04-18",
    },
  },
  {
    id: 5,
    title: "Menu Launch Teaser",
    fileUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    fileType: "JPG",
    category: "design",
    status: "Pending Review",
    note: "Need darker background behind the text.",
    createdAt: "2026-04-10T09:20:00.000Z",
    project: {
      id: 3,
      name: "Restaurant Awareness Ads",
      deadline: "2026-04-18",
    },
  },
  {
    id: 6,
    title: "Summer Sale Promo Video",
    fileUrl: "https://www.w3schools.com/html/movie.mp4",
    fileType: "MP4",
    category: "video",
    status: "Approved",
    note: "Approved and ready to schedule.",
    createdAt: "2026-04-10T12:00:00.000Z",
    project: {
      id: 4,
      name: "Summer Promo Launch",
      deadline: "2026-04-22",
    },
  },
];

const demoProjects: Project[] = [
  {
    id: 1,
    name: "Spring Fashion Campaign",
    service: "Social Media Management",
    status: "In Progress",
    deadline: "2026-04-15",
    owner: {
      id: 11,
      name: "Lina Fashion",
      email: "lina@fashion.com",
    },
    uploads: demoUploads.filter((item) => item.project?.id === 1),
  },
  {
    id: 2,
    name: "Coffee House Branding",
    service: "Brand Identity Design",
    status: "Waiting Client Approval",
    deadline: "2026-04-20",
    owner: {
      id: 12,
      name: "Coffee House Team",
      email: "hello@coffeehouse.com",
    },
    uploads: demoUploads.filter((item) => item.project?.id === 2),
  },
  {
    id: 3,
    name: "Restaurant Awareness Ads",
    service: "Ad Campaign",
    status: "In Progress",
    deadline: "2026-04-18",
    owner: {
      id: 13,
      name: "Bite Restaurant",
      email: "team@bite.com",
    },
    uploads: demoUploads.filter((item) => item.project?.id === 3),
  },
  {
    id: 4,
    name: "Summer Promo Launch",
    service: "Video Production",
    status: "In Progress",
    deadline: "2026-04-22",
    owner: {
      id: 14,
      name: "Glow Store",
      email: "marketing@glowstore.com",
    },
    uploads: demoUploads.filter((item) => item.project?.id === 4),
  },
];

const demoConversations: Conversation[] = [
  {
    id: 1,
    title: "Spring Campaign Revisions",
    project: {
      id: 1,
      name: "Spring Fashion Campaign",
    },
    members: [
      {
        id: 1,
        user: {
          id: 2,
          name: "Sara Designer",
          email: "designer@nakshet.com",
          role: "designer",
        },
      },
      {
        id: 2,
        user: {
          id: 11,
          name: "Lina Fashion",
          email: "lina@fashion.com",
          role: "client",
        },
      },
    ],
    messages: [
      {
        id: 1,
        text: "Please increase the CTA size in the latest post.",
        createdAt: "2026-04-09T09:30:00.000Z",
        sender: {
          id: 11,
          name: "Lina Fashion",
          role: "client",
        },
      },
      {
        id: 2,
        text: "Done, I will upload the updated version shortly.",
        createdAt: "2026-04-09T09:40:00.000Z",
        sender: {
          id: 2,
          name: "Sara Designer",
          role: "designer",
        },
      },
    ],
  },
  {
    id: 2,
    title: "Coffee Branding Chat",
    project: {
      id: 2,
      name: "Coffee House Branding",
    },
    members: [
      {
        id: 3,
        user: {
          id: 2,
          name: "Sara Designer",
          email: "designer@nakshet.com",
          role: "designer",
        },
      },
      {
        id: 4,
        user: {
          id: 12,
          name: "Coffee House Team",
          email: "hello@coffeehouse.com",
          role: "client",
        },
      },
    ],
    messages: [
      {
        id: 3,
        text: "The logo refresh looks great. We approved it.",
        createdAt: "2026-04-08T12:15:00.000Z",
        sender: {
          id: 12,
          name: "Coffee House Team",
          role: "client",
        },
      },
    ],
  },
  {
    id: 3,
    title: "Summer Promo Planning",
    project: {
      id: 4,
      name: "Summer Promo Launch",
    },
    members: [
      {
        id: 5,
        user: {
          id: 2,
          name: "Sara Designer",
          email: "designer@nakshet.com",
          role: "designer",
        },
      },
      {
        id: 6,
        user: {
          id: 14,
          name: "Glow Store",
          email: "marketing@glowstore.com",
          role: "client",
        },
      },
    ],
    messages: [
      {
        id: 4,
        text: "We want a brighter intro for the promo video.",
        createdAt: "2026-04-10T10:00:00.000Z",
        sender: {
          id: 14,
          name: "Glow Store",
          role: "client",
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
  const [refreshKey] = useState(0);
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

      const projectsData = await projectsRes.json().catch(() => ({ success: false }));
      const uploadsData = await uploadsRes.json().catch(() => ({ success: false }));
      const chatData = await chatRes.json().catch(() => ({ success: false }));

      const loadedProjects =
        projectsData.success && projectsData.projects?.length > 0
          ? projectsData.projects
          : demoProjects;

      const loadedUploads =
        uploadsData.success && uploadsData.uploads?.length > 0
          ? uploadsData.uploads
          : demoUploads;

      const loadedConversations =
        chatData.success && chatData.conversations?.length > 0
          ? chatData.conversations
          : demoConversations;

      setProjects(loadedProjects);
      setUploads(loadedUploads);
      setConversations(loadedConversations);

      const savedConversationId = Number(localStorage.getItem(STORAGE_KEY));

      if (
        savedConversationId &&
        loadedConversations.some((item: Conversation) => item.id === savedConversationId)
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
      setConversations(demoConversations);
      setSelectedConversationId(demoConversations[0]?.id ?? null);
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

        const participants: Participant[] = [
          { id: 11, name: "Lina Fashion", email: "lina@fashion.com", role: "client" },
          { id: 12, name: "Coffee House Team", email: "hello@coffeehouse.com", role: "client" },
          { id: 14, name: "Glow Store", email: "marketing@glowstore.com", role: "client" },
          { id: 21, name: "Omar Content", email: "omar@nakshet.com", role: "content" },
        ];

        const filtered = participants.filter((item) => item.id !== DEMO_DESIGNER_ID);
        setAvailableParticipants(filtered);
        setSelectedParticipantIds(filtered.map((item) => item.id));
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

  function handleSendMessage() {
    if (!messageText.trim() || !selectedConversationId) return;

    const newMessage = {
      id: Date.now(),
      text: messageText,
      createdAt: new Date().toISOString(),
      sender: {
        id: DEMO_DESIGNER_ID,
        name: "Sara Designer",
        role: "designer",
      },
    };

    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === selectedConversationId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setMessageText("");
    setShowEmojiBar(false);
  }

  function handleEditMessage(messageId: number) {
    if (!editingMessageText.trim() || !selectedConversationId) return;

    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === selectedConversationId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId ? { ...msg, text: editingMessageText } : msg
              ),
            }
          : chat
      )
    );

    setEditingMessageId(null);
    setEditingMessageText("");
  }

  function handleDeleteMessage(messageId: number) {
    if (!selectedConversationId) return;

    const confirmed = window.confirm("Delete this message?");
    if (!confirmed) return;

    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === selectedConversationId
          ? {
              ...chat,
              messages: chat.messages.filter((msg) => msg.id !== messageId),
            }
          : chat
      )
    );
  }

  async function handleMediaUpload(file: File) {
    if (!selectedConversationId) return;

    try {
      setSendingMedia(true);

      const fakeMediaMessage = {
        id: Date.now(),
        text: `__CHAT_MEDIA__${JSON.stringify({
          mediaType: file.type.startsWith("video") ? "video" : "image",
          url: URL.createObjectURL(file),
          caption: messageText,
        })}`,
        createdAt: new Date().toISOString(),
        sender: {
          id: DEMO_DESIGNER_ID,
          name: "Sara Designer",
          role: "designer",
        },
      };

      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === selectedConversationId
            ? { ...chat, messages: [...chat.messages, fakeMediaMessage] }
            : chat
        )
      );

      setMessageText("");
      setShowEmojiBar(false);

      if (mediaInputRef.current) {
        mediaInputRef.current.value = "";
      }
    } finally {
      setSendingMedia(false);
    }
  }

  function toggleParticipant(id: number) {
    setSelectedParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleCreateChat() {
    if (!createChatForm.title.trim() || !createChatForm.projectId) {
      alert("Please enter chat title and select a project.");
      return;
    }

    setCreatingChat(true);

    const selectedProject = projects.find(
      (item) => String(item.id) === createChatForm.projectId
    );

    const newConversation: Conversation = {
      id: Date.now(),
      title: createChatForm.title,
      project: selectedProject
        ? { id: selectedProject.id, name: selectedProject.name }
        : null,
      members: [
        {
          id: 1,
          user: {
            id: DEMO_DESIGNER_ID,
            name: "Sara Designer",
            email: "designer@nakshet.com",
            role: "designer",
          },
        },
        ...availableParticipants
          .filter((item) => selectedParticipantIds.includes(item.id))
          .map((item, index) => ({
            id: index + 10,
            user: {
              id: item.id,
              name: item.name,
              email: item.email,
              role: item.role,
            },
          })),
      ],
      messages: [],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setSelectedConversationId(newConversation.id);
    setActiveSection("messages");
    setShowCreateChatModal(false);
    setCreateChatForm({ title: "", projectId: "" });
    setAvailableParticipants([]);
    setSelectedParticipantIds([]);
    setCreatingChat(false);
  }

  function handleDeleteChat() {
    if (!selectedConversationId) return;

    const confirmed = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmed) return;

    setDeletingChat(true);

    const remaining = conversations.filter((item) => item.id !== selectedConversationId);
    setConversations(remaining);

    if (remaining.length > 0) {
      setSelectedConversationId(remaining[0].id);
      localStorage.setItem(STORAGE_KEY, String(remaining[0].id));
    } else {
      setSelectedConversationId(null);
      localStorage.removeItem(STORAGE_KEY);
    }

    setDeletingChat(false);
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

        alert("Upload updated successfully.");
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

  function handleDeleteUpload(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;

    setUploads((prev) => prev.filter((item) => item.id !== id));
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

  const pendingReviewCount = uploads.filter(
    (item) => item.status === "Pending Review"
  ).length;

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
              <button className={styles.alertBtn}>
                <Bell size={18} />
              </button>

              <div className={styles.profileBox}>
                <div className={styles.avatar}>S</div>
                <div>
                  <strong>Sara Designer</strong>
                  <span>designer@nakshat.com</span>
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
                        {upcomingDeadlines.map((item) => (
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
                        ))}
                      </div>
                    </div>

                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Recent Activity</h3>
                      </div>

                      <div className={styles.cardList}>
                        {recentActivities.map((activity) => (
                          <div className={styles.activityCard} key={activity.id}>
                            <div className={styles.activityDot}></div>
                            <div>
                              <h4>{activity.title}</h4>
                              <p>{activity.detail}</p>
                              <span>{activity.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className={styles.doubleGrid}>
                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Content Calendar</h3>
                      </div>

                      <div className={styles.cardList}>
                        {contentCalendarItems.map((item) => (
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
                        ))}
                      </div>
                    </div>

                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Shooting Schedule</h3>
                      </div>

                      <div className={styles.cardList}>
                        {shootingScheduleItems.map((item) => (
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

                            <strong className={styles.statusBadge}>
                              {item.status}
                            </strong>
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
                            <Video size={14} /> Video from uploads
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === "content-calendar" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Content Calendar</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {contentCalendarItems.map((item) => (
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
                    ))}
                  </div>
                </section>
              )}

              {activeSection === "shooting-schedule" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Shooting Schedule</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {shootingScheduleItems.map((item) => (
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
                    ))}
                  </div>
                </section>
              )}

              {activeSection === "ads-management" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Ads Management</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {adsItems.map((ad) => (
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
                    ))}
                  </div>
                </section>
              )}

              {activeSection === "reports" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Reports</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {reportsItems.map((report) => (
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
                    ))}
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
                        placeholder="Search chat, member, or project..."
                        value={conversationSearch}
                        onChange={(e) => setConversationSearch(e.target.value)}
                      />
                    </div>

                    <div className={styles.chatList}>
                      {filteredConversations.map((chat) => {
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
                              {chat.project?.name || "No linked project"}
                            </p>
                            <span className={styles.chatPreviewText}>{lastMessage.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.chatPanel}>
                    {selectedConversation ? (
                      <>
                        <div className={styles.chatHeader}>
                          <div className={styles.chatHeaderTop}>
                            <div>
                              <h3>{selectedConversation.title}</h3>
                              <p>
                                {selectedConversation.project?.name || "No linked project"}
                              </p>
                            </div>

                            <button
                              className={styles.deleteChatBtn}
                              onClick={handleDeleteChat}
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
                              const isMine = message.sender.id === DEMO_DESIGNER_ID;

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
                                        onChange={(e) =>
                                          setEditingMessageText(e.target.value)
                                        }
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
                                          onClick={() => handleEditMessage(message.id)}
                                          className={styles.actionBtn}
                                          type="button"
                                        >
                                          <CheckCircle2 size={15} />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingMessageId(null);
                                            setEditingMessageText("");
                                          }}
                                          className={styles.deleteBtn}
                                          type="button"
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
                                              style={{
                                                width: "100%",
                                                maxWidth: "300px",
                                                borderRadius: "12px",
                                                display: "block",
                                                marginBottom: "8px",
                                              }}
                                            />
                                          ) : (
                                            <video
                                              src={parsed.url}
                                              controls
                                              style={{
                                                width: "100%",
                                                maxWidth: "320px",
                                                borderRadius: "12px",
                                                display: "block",
                                                marginBottom: "8px",
                                              }}
                                            />
                                          )}

                                          {parsed.caption && <p>{parsed.caption}</p>}
                                        </>
                                      ) : (
                                        <p>{parsed.text}</p>
                                      )}

                                      <span>
                                        {new Date(message.createdAt).toLocaleString()}
                                      </span>

                                      {isMine && (
                                        <div
                                          style={{
                                            display: "flex",
                                            gap: "8px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <button
                                            type="button"
                                            className={styles.actionBtn}
                                            onClick={() => {
                                              setEditingMessageId(message.id);
                                              setEditingMessageText(
                                                parsed.kind === "text"
                                                  ? parsed.text || ""
                                                  : parsed.caption || ""
                                              );
                                            }}
                                          >
                                            <Pencil size={15} />
                                          </button>

                                          <button
                                            type="button"
                                            className={styles.deleteBtn}
                                            onClick={() => handleDeleteMessage(message.id)}
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
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSendMessage();
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
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleMediaUpload(file);
                              }
                            }}
                          />

                          <button type="button" onClick={handleSendMessage}>
                            <Send size={16} />
                            Send
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={styles.emptyState}>Select a conversation to start.</div>
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
                    {approvalItems.map((item) => (
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
                    {notifications.map((item) => (
                      <div key={item.id} className={styles.activityCard}>
                        <div className={styles.activityDot}></div>
                        <div>
                          <h4>{item.title}</h4>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    ))}
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
                type="button"
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

              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h3>Participants</h3>
                </div>

                {participantsLoading ? (
                  <div className={styles.loading}>Loading participants...</div>
                ) : availableParticipants.length > 0 ? (
                  <div className={styles.cardList}>
                    {availableParticipants.map((participant) => (
                      <label key={participant.id} className={styles.infoCard}>
                        <div>
                          <h4>{participant.name}</h4>
                          <p>{participant.email}</p>
                          <span>{participant.role}</span>
                        </div>

                        <input
                          type="checkbox"
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

              <div className={styles.formActions}>
                <button type="button" onClick={handleCreateChat} disabled={creatingChat}>
                  {creatingChat ? "Creating..." : "Create Chat"}
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