"use client";

<<<<<<< HEAD
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
=======
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./company-dashboard.module.css";

type ClientProfile = {
  companyName: string;
  businessType: string;
  contactPerson: string;
  phone: string;
  location: string;
  packageName: string;
  contractStart: string;
  contractStatus: string;
  website: string;
  socialMedia: string;
};

type ClientUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
  clientProfile?: ClientProfile | null;
};

type DesignerUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
};
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68

type Project = {
  id: number;
  name: string;
  service: string;
  status: string;
  deadline: string;
  userId: number;
  user?: ClientUser;
};

type Approval = {
  id: number;
  status: string;
  notes?: string | null;
};

type BackendDesign = {
  id: number;
  name: string;
  type: string;
  deliveryDate: string;
  status: string;
  designerNotes?: string | null;
  clientComments?: string | null;
  approvals?: Approval[];
  project?: {
    id: number;
    name: string;
    user?: {
      clientProfile?: ClientProfile | null;
      name: string;
    };
  };
  designer?: {
    id: number;
    name: string;
    email: string;
  } | null;
};

type BackendVideo = {
  id: number;
  title: string;
  type: string;
  stage: string;
  fileName?: string | null;
  uploadDate: string;
  project?: {
    id: number;
    name: string;
    user?: {
      clientProfile?: ClientProfile | null;
      name: string;
    };
  };
};

type BackendFile = {
  id: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
  project?: {
    id: number;
    name: string;
    user?: {
      clientProfile?: ClientProfile | null;
      name: string;
    };
  };
};

type BackendContentItem = {
  id: number;
  title: string;
  platform: string;
  date: string;
  status: string;
  project?: {
    id: number;
    name: string;
    user?: {
      name: string;
      clientProfile?: ClientProfile | null;
    };
  };
};

type BackendReportItem = {
  id: number;
  month: string;
  followers: string;
  engagement: string;
  bestPost: string;
  project?: {
    id: number;
    name: string;
    user?: {
      name: string;
      clientProfile?: ClientProfile | null;
    };
  };
};

type ChatMessage = {
  id: number;
  text: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
  receiver?: {
    id: number;
    name: string;
<<<<<<< HEAD
    deadline?: string;
  } | null;
=======
    email: string;
  };
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
};

export default function CompanyDashboardPage() {
  const router = useRouter();

<<<<<<< HEAD
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
=======
  const [activeSection, setActiveSection] = useState("dashboard");
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68

  const [clients, setClients] = useState<ClientUser[]>([]);
  const [designers, setDesigners] = useState<DesignerUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [designs, setDesigns] = useState<BackendDesign[]>([]);
  const [videos, setVideos] = useState<BackendVideo[]>([]);
  const [files, setFiles] = useState<BackendFile[]>([]);
  const [contents, setContents] = useState<BackendContentItem[]>([]);
  const [reports, setReports] = useState<BackendReportItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [selectedChat, setSelectedChat] = useState<"client" | "designer">(
    "client"
  );
  const [selectedUserId, setSelectedUserId] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingChatMessage, setSendingChatMessage] = useState(false);

  const [form, setForm] = useState({
    name: "",
    service: "",
    status: "Pending",
    deadline: "",
    clientUserId: "",
  });

  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editProjectForm, setEditProjectForm] = useState({
    name: "",
    service: "",
    status: "Pending",
    deadline: "",
    clientUserId: "",
  });

  const [designForm, setDesignForm] = useState({
    name: "",
    type: "Post",
    deliveryDate: "",
    status: "In Design",
    projectId: "",
    designerId: "",
    designerNotes: "",
    clientComments: "",
  });

  const [editingDesignId, setEditingDesignId] = useState<number | null>(null);
  const [editDesignForm, setEditDesignForm] = useState({
    name: "",
    type: "Post",
    deliveryDate: "",
    status: "In Design",
    projectId: "",
    designerId: "",
    designerNotes: "",
    clientComments: "",
  });

  const [videoForm, setVideoForm] = useState({
    title: "",
    type: "Promo Video",
    stage: "Idea",
    projectId: "",
    fileName: "",
  });

  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [editVideoForm, setEditVideoForm] = useState({
    title: "",
    type: "Promo Video",
    stage: "Idea",
    projectId: "",
    fileName: "",
    uploadDate: "",
  });

  const [fileForm, setFileForm] = useState({
    fileType: "Image",
    projectId: "",
    fileName: "",
  });

  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const [editFileForm, setEditFileForm] = useState({
    fileType: "Image",
    projectId: "",
    fileName: "",
    uploadDate: "",
  });

  const [contentForm, setContentForm] = useState({
    title: "",
    platform: "Instagram",
    date: "",
    status: "Scheduled",
    projectId: "",
  });

  const [editingContentId, setEditingContentId] = useState<number | null>(null);
  const [editContentForm, setEditContentForm] = useState({
    title: "",
    platform: "Instagram",
    date: "",
    status: "Scheduled",
    projectId: "",
  });

  const [reportForm, setReportForm] = useState({
    month: "",
    followers: "",
    engagement: "",
    bestPost: "",
    projectId: "",
  });

  const [editingReportId, setEditingReportId] = useState<number | null>(null);
  const [editReportForm, setEditReportForm] = useState({
    month: "",
    followers: "",
    engagement: "",
    bestPost: "",
    projectId: "",
  });

  const loadDashboardData = async () => {
    const res = await fetch("/api/company-dashboard", {
      cache: "no-store",
    });
    const data = await res.json();

    if (data.success) {
      setClients(data.clients || []);
      setProjects(data.projects || []);
      setDesigners(data.designers || []);
    } else {
      setMessage(data.message || "Failed to load dashboard data.");
    }
  };

  const loadDesignsData = async () => {
    const res = await fetch("/api/company-designs", {
      cache: "no-store",
    });
    const data = await res.json();

    if (data.success) {
      setDesigns(data.designs || []);
    } else {
      setMessage(data.message || "Failed to load designs.");
    }
  };

  const loadVideosData = async () => {
    const res = await fetch("/api/company-videos", {
      cache: "no-store",
    });
    const data = await res.json();

    if (data.success) {
      setVideos(data.videos || []);
    } else {
      setMessage(data.message || "Failed to load videos.");
    }
  };

  const loadFilesData = async () => {
    const res = await fetch("/api/company-files", {
      cache: "no-store",
    });
    const data = await res.json();

    if (data.success) {
      setFiles(data.files || []);
    } else {
      setMessage(data.message || "Failed to load files.");
    }
  };

  const loadContentsData = async () => {
    const res = await fetch("/api/company-contents", {
      cache: "no-store",
    });
    const data = await res.json();

    if (data.success) {
      setContents(data.contents || []);
    } else {
      setMessage(data.message || "Failed to load content calendar.");
    }
  };

  const loadReportsData = async () => {
    const res = await fetch("/api/company-reports", {
      cache: "no-store",
    });
    const data = await res.json();

    if (data.success) {
      setReports(data.reports || []);
    } else {
      setMessage(data.message || "Failed to load reports.");
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadDashboardData(),
        loadDesignsData(),
        loadVideosData(),
        loadFilesData(),
        loadContentsData(),
        loadReportsData(),
      ]);
<<<<<<< HEAD

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
=======
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while loading company data.");
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

<<<<<<< HEAD
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
=======
  const availableChatUsers = useMemo(() => {
    return selectedChat === "client" ? clients : designers;
  }, [selectedChat, clients, designers]);

  useEffect(() => {
    if (availableChatUsers.length > 0) {
      setSelectedUserId(String(availableChatUsers[0].id));
    } else {
      setSelectedUserId("");
      setChatMessages([]);
    }
  }, [selectedChat, availableChatUsers]);

  const loadMessages = async (otherUserId: string) => {
    if (!otherUserId) {
      setChatMessages([]);
      return;
    }

    try {
      setMessagesLoading(true);
      setMessage("");

      const res = await fetch(`/api/messages?otherUserId=${otherUserId}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setChatMessages(data.messages || []);
      } else {
        setMessage(data.message || "Failed to load messages.");
        setChatMessages([]);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while loading messages.");
      setChatMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "messages" && selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [activeSection, selectedUserId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditProjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditProjectForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDesignChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDesignForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditDesignChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditDesignForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDesignTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDesignForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditDesignTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditDesignForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setVideoForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditVideoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditVideoForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditFileFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditFileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setContentForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditContentForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReportChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setReportForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditReportChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEditReportForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setVideoForm((prev) => ({
      ...prev,
      fileName: file ? file.name : "",
    }));
  };

  const handleEditVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setEditVideoForm((prev) => ({
      ...prev,
      fileName: file ? file.name : "",
    }));
  };

  const handleGeneralFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setFileForm((prev) => ({
      ...prev,
      fileName: file ? file.name : "",
    }));
  };

  const handleEditGeneralFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    setEditFileForm((prev) => ({
      ...prev,
      fileName: file ? file.name : "",
    }));
  };

  const openEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setEditProjectForm({
      name: project.name,
      service: project.service,
      status: project.status,
      deadline: project.deadline,
      clientUserId: String(project.userId),
    });
    setActiveSection("editProject");
  };

  const openEditDesign = (design: BackendDesign) => {
    setEditingDesignId(design.id);
    setEditDesignForm({
      name: design.name,
      type: design.type,
      deliveryDate: design.deliveryDate,
      status: design.status,
      projectId: String(design.project?.id || ""),
      designerId: String(design.designer?.id || ""),
      designerNotes: design.designerNotes || "",
      clientComments: design.clientComments || "",
    });
    setActiveSection("editDesign");
  };

  const openEditVideo = (video: BackendVideo) => {
    setEditingVideoId(video.id);
    setEditVideoForm({
      title: video.title,
      type: video.type,
      stage: video.stage,
      projectId: String(video.project?.id || ""),
      fileName: video.fileName || "",
      uploadDate: video.uploadDate,
    });
    setActiveSection("editVideo");
  };

  const openEditFile = (file: BackendFile) => {
    setEditingFileId(file.id);
    setEditFileForm({
      fileType: file.fileType,
      projectId: String(file.project?.id || ""),
      fileName: file.fileName,
      uploadDate: file.uploadDate,
    });
    setActiveSection("editFile");
  };

  const openEditContent = (content: BackendContentItem) => {
    setEditingContentId(content.id);
    setEditContentForm({
      title: content.title,
      platform: content.platform,
      date: content.date,
      status: content.status,
      projectId: String(content.project?.id || ""),
    });
    setActiveSection("editContent");
  };

  const openEditReport = (report: BackendReportItem) => {
    setEditingReportId(report.id);
    setEditReportForm({
      month: report.month,
      followers: report.followers,
      engagement: report.engagement,
      bestPost: report.bestPost,
      projectId: String(report.project?.id || ""),
    });
    setActiveSection("editReport");
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/company-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          clientUserId: Number(form.clientUserId),
        }),
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
      });

      return titleMatch || projectMatch || memberMatch;
    });
  }, [conversationSearch, conversations]);

<<<<<<< HEAD
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
=======
      if (data.success) {
        setMessage("Project added successfully.");
        setForm({
          name: "",
          service: "",
          status: "Pending",
          deadline: "",
          clientUserId: "",
        });
        await loadDashboardData();
        setActiveSection("projects");
      } else {
        setMessage(data.message || "Failed to create project.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while creating the project.");
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
    }
  };

<<<<<<< HEAD
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
=======
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProjectId) return;
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68

    try {
      setMessage("");

<<<<<<< HEAD
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
=======
      const res = await fetch("/api/company-projects", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: editingProjectId,
          ...editProjectForm,
          clientUserId: Number(editProjectForm.clientUserId),
        }),
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
      });

      setEditingUploadId(null);

<<<<<<< HEAD
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("UPLOAD/UPDATE FILE ERROR:", error);
      alert("Operation failed.");
    } finally {
      setUploading(false);
=======
      if (data.success) {
        setMessage("Project updated successfully.");
        setEditingProjectId(null);
        await loadDashboardData();
        setActiveSection("projects");
      } else {
        setMessage(data.message || "Failed to update project.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating the project.");
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
    }
  };

<<<<<<< HEAD
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
=======
  const handleCreateDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/company-designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...designForm,
          projectId: Number(designForm.projectId),
          designerId: designForm.designerId
            ? Number(designForm.designerId)
            : null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Design created successfully.");
        setDesignForm({
          name: "",
          type: "Post",
          deliveryDate: "",
          status: "In Design",
          projectId: "",
          designerId: "",
          designerNotes: "",
          clientComments: "",
        });
        await loadDesignsData();
        setActiveSection("designs");
      } else {
        setMessage(data.message || "Failed to create design.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while creating the design.");
    }
  };

  const handleUpdateDesign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingDesignId) return;

    try {
      setMessage("");

      const res = await fetch("/api/company-designs", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          designId: editingDesignId,
          ...editDesignForm,
          projectId: Number(editDesignForm.projectId),
          designerId: editDesignForm.designerId
            ? Number(editDesignForm.designerId)
            : null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Design updated successfully.");
        setEditingDesignId(null);
        await loadDesignsData();
        setActiveSection("designs");
      } else {
        setMessage(data.message || "Failed to update design.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating the design.");
    }
  };

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/company-videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: videoForm.title,
          type: videoForm.type,
          stage: videoForm.stage,
          fileName: videoForm.fileName || "",
          uploadDate: new Date().toISOString().split("T")[0],
          projectId: Number(videoForm.projectId),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Video uploaded successfully.");
        setVideoForm({
          title: "",
          type: "Promo Video",
          stage: "Idea",
          projectId: "",
          fileName: "",
        });
        await loadVideosData();
        setActiveSection("videos");
      } else {
        setMessage(data.message || "Failed to upload video.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while uploading the video.");
    }
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingVideoId) return;

    try {
      setMessage("");

      const res = await fetch("/api/company-videos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: editingVideoId,
          ...editVideoForm,
          projectId: Number(editVideoForm.projectId),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Video updated successfully.");
        setEditingVideoId(null);
        await loadVideosData();
        setActiveSection("videos");
      } else {
        setMessage(data.message || "Failed to update video.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating the video.");
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/company-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileForm.fileName,
          fileType: fileForm.fileType,
          uploadDate: new Date().toISOString().split("T")[0],
          projectId: Number(fileForm.projectId),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("File uploaded successfully.");
        setFileForm({
          fileType: "Image",
          projectId: "",
          fileName: "",
        });
        await loadFilesData();
        setActiveSection("files");
      } else {
        setMessage(data.message || "Failed to upload file.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while uploading the file.");
    }
  };

  const handleUpdateFile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingFileId) return;

    try {
      setMessage("");

      const res = await fetch("/api/company-files", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: editingFileId,
          ...editFileForm,
          projectId: Number(editFileForm.projectId),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("File updated successfully.");
        setEditingFileId(null);
        await loadFilesData();
        setActiveSection("files");
      } else {
        setMessage(data.message || "Failed to update file.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating the file.");
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/company-contents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contentForm,
          projectId: Number(contentForm.projectId),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Content item created successfully.");
        setContentForm({
          title: "",
          platform: "Instagram",
          date: "",
          status: "Scheduled",
          projectId: "",
        });
        await loadContentsData();
        setActiveSection("calendar");
      } else {
        setMessage(data.message || "Failed to create content item.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while creating the content item.");
    }
  };

  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingContentId) return;

    try {
      setMessage("");

      const res = await fetch("/api/company-contents", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId: editingContentId,
          ...editContentForm,
          projectId: Number(editContentForm.projectId),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Content item updated successfully.");
        setEditingContentId(null);
        await loadContentsData();
        setActiveSection("calendar");
      } else {
        setMessage(data.message || "Failed to update content item.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating the content item.");
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/company-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reportForm,
          projectId: Number(reportForm.projectId),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Report created successfully.");
        setReportForm({
          month: "",
          followers: "",
          engagement: "",
          bestPost: "",
          projectId: "",
        });
        await loadReportsData();
        setActiveSection("reports");
      } else {
        setMessage(data.message || "Failed to create report.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while creating the report.");
    }
  };

  const handleUpdateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingReportId) return;

    try {
      setMessage("");

      const res = await fetch("/api/company-reports", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: editingReportId,
          ...editReportForm,
          projectId: Number(editReportForm.projectId),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Report updated successfully.");
        setEditingReportId(null);
        await loadReportsData();
        setActiveSection("reports");
      } else {
        setMessage(data.message || "Failed to update report.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating the report.");
    }
  };

  const handleDeleteProject = async (projectId: number, projectName: string) => {
    try {
      setMessage("");

      const res = await fetch(`/api/company-projects?projectId=${projectId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`${projectName} deleted successfully.`);
        await loadAllData();
      } else {
        setMessage(data.message || "Failed to delete project.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting the project.");
    }
  };

  const handleDeleteDesign = async (designId: number, designName: string) => {
    try {
      setMessage("");

      const res = await fetch(`/api/company-designs?designId=${designId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`${designName} deleted successfully.`);
        await loadDesignsData();
        await loadDashboardData();
      } else {
        setMessage(data.message || "Failed to delete design.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting the design.");
    }
  };

  const handleDeleteVideo = async (videoId: number, videoTitle: string) => {
    try {
      setMessage("");

      const res = await fetch(`/api/company-videos?videoId=${videoId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`${videoTitle} deleted successfully.`);
        await loadVideosData();
      } else {
        setMessage(data.message || "Failed to delete video.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting the video.");
    }
  };

  const handleDeleteFile = async (fileId: number, fileName: string) => {
    try {
      setMessage("");

      const res = await fetch(`/api/company-files?fileId=${fileId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`${fileName} deleted successfully.`);
        await loadFilesData();
      } else {
        setMessage(data.message || "Failed to delete file.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting the file.");
    }
  };

  const handleDeleteContent = async (contentId: number, title: string) => {
    try {
      setMessage("");

      const res = await fetch(`/api/company-contents?contentId=${contentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`${title} deleted successfully.`);
        await loadContentsData();
      } else {
        setMessage(data.message || "Failed to delete content item.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting the content item.");
    }
  };

  const handleDeleteReport = async (reportId: number, month: string) => {
    try {
      setMessage("");

      const res = await fetch(`/api/company-reports?reportId=${reportId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`${month} report deleted successfully.`);
        await loadReportsData();
      } else {
        setMessage(data.message || "Failed to delete report.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting the report.");
    }
  };

  const handleApproveDesign = async (designId: number, designName: string) => {
    try {
      setMessage("");

      const res = await fetch("/api/company-designs", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          designId,
          status: "Approved",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`${designName} approved successfully.`);
        await loadDesignsData();
      } else {
        setMessage(data.message || "Failed to approve design.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while approving the design.");
    }
  };

  const handleRejectDesign = async (designId: number, designName: string) => {
    try {
      setMessage("");

      const res = await fetch("/api/company-designs", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          designId,
          status: "Rejected",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`${designName} rejected successfully.`);
        await loadDesignsData();
      } else {
        setMessage(data.message || "Failed to reject design.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while rejecting the design.");
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newChatMessage.trim() || !selectedUserId) return;

    try {
      setSendingChatMessage(true);
      setMessage("");

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: Number(selectedUserId),
          text: newChatMessage.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setNewChatMessage("");
        await loadMessages(selectedUserId);
      } else {
        setMessage(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while sending the message.");
    } finally {
      setSendingChatMessage(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
        router.refresh();
      } else {
        setMessage(data.message || "Failed to logout.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while logging out.");
    }
  };

  const totalClients = clients.length;
  const totalDesigners = designers.length;
  const totalProjects = projects.length;
  const totalDesigns = designs.length;
  const totalVideos = videos.length;
  const totalFiles = files.length;

  const scheduledContent = contents.filter(
    (item) => item.status.toLowerCase() === "scheduled"
  ).length;

  const pendingApprovals = designs.filter((design) => {
    const status = design.status.toLowerCase();
    return (
      status.includes("waiting client approval") ||
      status.includes("under review")
    );
  }).length;

  const videosInProgress = videos.filter(
    (video) =>
      video.stage.toLowerCase() !== "ready to publish" &&
      video.stage.toLowerCase() !== "published"
  ).length;

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    )
    .slice(0, 4);

  const recentActivities = [
    totalProjects > 0 ? `${totalProjects} total projects currently tracked.` : "",
    totalDesigns > 0 ? `${totalDesigns} designs are available in the workspace.` : "",
    totalVideos > 0 ? `${totalVideos} videos uploaded by the company team.` : "",
    pendingApprovals > 0
      ? `${pendingApprovals} items are waiting for approval.`
      : "No pending approvals right now.",
    scheduledContent > 0
      ? `${scheduledContent} scheduled content items are planned.`
      : "",
  ].filter(Boolean);

  const approvalDesigns = designs.filter((design) => {
    const status = design.status.toLowerCase();
    return (
      status.includes("waiting client approval") ||
      status.includes("under review")
    );
  });

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>N</div>
          <div>
            <h2>NAKSHET</h2>
            <p>Company Workspace</p>
          </div>
        </div>

        <button
          className={activeSection === "dashboard" ? styles.activeNav : ""}
          onClick={() => setActiveSection("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={activeSection === "clients" ? styles.activeNav : ""}
          onClick={() => setActiveSection("clients")}
        >
          Clients
        </button>

        <button
          className={activeSection === "projects" ? styles.activeNav : ""}
          onClick={() => setActiveSection("projects")}
        >
          Projects
        </button>

        <button
          className={activeSection === "designs" ? styles.activeNav : ""}
          onClick={() => setActiveSection("designs")}
        >
          Designs
        </button>

        <button
          className={activeSection === "approvals" ? styles.activeNav : ""}
          onClick={() => setActiveSection("approvals")}
        >
          Approvals
        </button>

        <button
          className={activeSection === "videos" ? styles.activeNav : ""}
          onClick={() => setActiveSection("videos")}
        >
          Videos
        </button>

        <button
          className={activeSection === "calendar" ? styles.activeNav : ""}
          onClick={() => setActiveSection("calendar")}
        >
          Content Calendar
        </button>

        <button
          className={activeSection === "reports" ? styles.activeNav : ""}
          onClick={() => setActiveSection("reports")}
        >
          Reports
        </button>

        <button
          className={activeSection === "files" ? styles.activeNav : ""}
          onClick={() => setActiveSection("files")}
        >
          Files
        </button>

        <button
          className={activeSection === "messages" ? styles.activeNav : ""}
          onClick={() => setActiveSection("messages")}
        >
          Messages
        </button>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {message && <p className={styles.message}>{message}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeSection === "dashboard" && (
              <>
                <section className={styles.heroSection}>
                  <div className={styles.heroText}>
                    <span className={styles.heroBadge}>Company Overview</span>
                    <h1>Welcome back to your company dashboard</h1>
                    <p>
                      Track clients, projects, files, designs, videos, and daily
                      progress from one organized workspace.
                    </p>
                  </div>

                  <div className={styles.heroActions}>
                    <button onClick={() => setActiveSection("addProject")}>
                      + Add Project
                    </button>
                    <button onClick={() => setActiveSection("addDesign")}>
                      + Add Design
                    </button>
                    <button onClick={() => setActiveSection("uploadFile")}>
                      + Upload File
                    </button>
                    <button onClick={() => setActiveSection("uploadVideo")}>
                      + Upload Video
                    </button>
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
                  </div>
                </section>
              )}

<<<<<<< HEAD
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
=======
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <span>Total Clients</span>
                    <h3>{totalClients}</h3>
                    <p>Registered business accounts in the workspace.</p>
                  </div>

                  <div className={styles.statCard}>
                    <span>Total Projects</span>
                    <h3>{totalProjects}</h3>
                    <p>All company projects currently being tracked.</p>
                  </div>

                  <div className={styles.statCard}>
                    <span>Pending Approvals</span>
                    <h3>{pendingApprovals}</h3>
                    <p>Design items that still need review or approval.</p>
                  </div>

                  <div className={styles.statCard}>
                    <span>Videos In Progress</span>
                    <h3>{videosInProgress}</h3>
                    <p>Video tasks still moving through production stages.</p>
                  </div>

                  <div className={styles.statCard}>
                    <span>Total Designers</span>
                    <h3>{totalDesigners}</h3>
                    <p>Design team members available for assignments.</p>
                  </div>

                  <div className={styles.statCard}>
                    <span>Total Designs</span>
                    <h3>{totalDesigns}</h3>
                    <p>Design assets created across all projects.</p>
                  </div>

                  <div className={styles.statCard}>
                    <span>Total Files</span>
                    <h3>{totalFiles}</h3>
                    <p>Uploaded files saved inside project records.</p>
                  </div>

                  <div className={styles.statCard}>
                    <span>Scheduled Content</span>
                    <h3>{scheduledContent}</h3>
                    <p>Content calendar items already scheduled.</p>
                  </div>
                </div>

                <div className={styles.dashboardBottomGrid}>
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <h2>Recent Activity</h2>
                      <p>Quick summary of what is happening now.</p>
                    </div>

                    <div className={styles.activityList}>
                      {recentActivities.length === 0 ? (
                        <div className={styles.activityItem}>
                          <strong>No activity yet</strong>
                          <span>
                            Start by adding projects, designs, files, videos, or
                            calendar items.
                          </span>
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
                        </div>
                      ) : (
                        recentActivities.map((item, index) => (
                          <div key={index} className={styles.activityItem}>
                            <strong>Update {index + 1}</strong>
                            <span>{item}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <h2>Upcoming Deadlines</h2>
                      <p>Projects that may need attention soon.</p>
                    </div>

                    <div className={styles.deadlineList}>
                      {recentProjects.length === 0 ? (
                        <div className={styles.deadlineItem}>
                          <div>
                            <strong>No projects yet</strong>
                            <p>Add your first project to see deadlines here.</p>
                          </div>
                        </div>
                      ) : (
                        recentProjects.map((project) => (
                          <div key={project.id} className={styles.deadlineItem}>
                            <div>
                              <strong>{project.name}</strong>
                              <p>
                                {project.user?.clientProfile?.companyName ||
                                  project.user?.name ||
                                  "Unknown Client"}
                              </p>
                            </div>
                            <div className={styles.deadlineMeta}>
                              <span>{project.status}</span>
                              <small>{project.deadline}</small>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </div>

                <section className={styles.quickSection}>
                  <div className={styles.panelHeader}>
                    <h2>Quick Access</h2>
                    <p>Move fast between the most important company sections.</p>
                  </div>

                  <div className={styles.quickGrid}>
                    <button onClick={() => setActiveSection("projects")}>
                      View Projects
                    </button>
                    <button onClick={() => setActiveSection("designs")}>
                      View Designs
                    </button>
                    <button onClick={() => setActiveSection("calendar")}>
                      Open Calendar
                    </button>
                    <button onClick={() => setActiveSection("reports")}>
                      Open Reports
                    </button>
                  </div>
                </section>
              )}

<<<<<<< HEAD
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
=======
            {activeSection === "clients" && (
              <>
                <h1>Clients</h1>
                {clients.length === 0 ? (
                  <p>No clients found.</p>
                ) : (
                  <div className={styles.grid}>
                    {clients.map((client) => (
                      <div key={client.id} className={styles.card}>
                        <h3>{client.clientProfile?.companyName || client.name}</h3>
                        <p>
                          <strong>Owner:</strong>{" "}
                          {client.clientProfile?.contactPerson || client.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {client.email}
                        </p>
                        <p>
                          <strong>Business Type:</strong>{" "}
                          {client.clientProfile?.businessType || "Not set"}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {client.clientProfile?.contractStatus || "Not set"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "projects" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Projects</h1>
                    <p>Manage company projects, deadlines, services, and client assignments.</p>
                  </div>

                  <button
                    className={styles.sectionActionButton}
                    onClick={() => setActiveSection("addProject")}
                  >
                    + Add Project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className={styles.grid}>
                    <div className={styles.card}>
                      <h3>No Projects Yet</h3>
                      <p>Create your first project to start organizing work for clients.</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.grid}>
                    {projects.map((project) => (
                      <div key={project.id} className={styles.card}>
                        <h3>{project.name}</h3>
                        <p>
                          <strong>Client:</strong>{" "}
                          {project.user?.clientProfile?.companyName ||
                            project.user?.name}
                        </p>
                        <p>
                          <strong>Service:</strong> {project.service}
                        </p>
                        <p>
                          <strong>Status:</strong> {project.status}
                        </p>
                        <p>
                          <strong>Deadline:</strong> {project.deadline}
                        </p>

                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => openEditProject(project)}
                          >
                            Edit Project
                          </button>

                          <button
                            type="button"
                            className={styles.rejectButton}
                            onClick={() =>
                              handleDeleteProject(project.id, project.name)
                            }
                          >
                            Delete Project
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "addProject" && (
              <>
                <h1>Add New Project</h1>
                <form onSubmit={handleCreateProject} className={styles.form}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Project name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="service"
                    placeholder="Service"
                    value={form.service}
                    onChange={handleChange}
                  />
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <input
                    type="text"
                    name="deadline"
                    placeholder="Deadline"
                    value={form.deadline}
                    onChange={handleChange}
                  />
                  <select
                    name="clientUserId"
                    value={form.clientUserId}
                    onChange={handleChange}
                  >
                    <option value="">Select client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.clientProfile?.companyName || client.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Create Project</button>
                </form>
              </>
            )}

            {activeSection === "editProject" && (
              <>
                <h1>Edit Project</h1>
                <form onSubmit={handleUpdateProject} className={styles.form}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Project name"
                    value={editProjectForm.name}
                    onChange={handleEditProjectChange}
                  />
                  <input
                    type="text"
                    name="service"
                    placeholder="Service"
                    value={editProjectForm.service}
                    onChange={handleEditProjectChange}
                  />
                  <select
                    name="status"
                    value={editProjectForm.status}
                    onChange={handleEditProjectChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <input
                    type="text"
                    name="deadline"
                    placeholder="Deadline"
                    value={editProjectForm.deadline}
                    onChange={handleEditProjectChange}
                  />
                  <select
                    name="clientUserId"
                    value={editProjectForm.clientUserId}
                    onChange={handleEditProjectChange}
                  >
                    <option value="">Select client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.clientProfile?.companyName || client.name}
                      </option>
                    ))}
                  </select>

                  <div className={styles.actionButtons}>
                    <button type="submit">Save Project</button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        setEditingProjectId(null);
                        setActiveSection("projects");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeSection === "designs" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Designs</h1>
                    <p>Review all design work, delivery dates, project links, and assigned designers.</p>
                  </div>

                  <button
                    className={styles.sectionActionButton}
                    onClick={() => setActiveSection("addDesign")}
                  >
                    + Add Design
                  </button>
                </div>

                {designs.length === 0 ? (
                  <div className={styles.grid}>
                    <div className={styles.card}>
                      <h3>No Designs Yet</h3>
                      <p>Add your first design to connect creative work with client projects.</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.grid}>
                    {designs.map((design) => (
                      <div key={design.id} className={styles.card}>
                        <h3>{design.name}</h3>
                        <p>
                          <strong>Type:</strong> {design.type}
                        </p>
                        <p>
                          <strong>Project:</strong> {design.project?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Client:</strong>{" "}
                          {design.project?.user?.clientProfile?.companyName ||
                            design.project?.user?.name ||
                            "N/A"}
                        </p>
                        <p>
                          <strong>Status:</strong> {design.status}
                        </p>
                        <p>
                          <strong>Delivery Date:</strong> {design.deliveryDate}
                        </p>
                        <p>
                          <strong>Designer:</strong>{" "}
                          {design.designer?.name || "Not assigned"}
                        </p>

                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => openEditDesign(design)}
                          >
                            Edit Design
                          </button>

                          <button
                            type="button"
                            className={styles.rejectButton}
                            onClick={() =>
                              handleDeleteDesign(design.id, design.name)
                            }
                          >
                            Delete Design
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "addDesign" && (
              <>
                <h1>Add New Design</h1>
                <form onSubmit={handleCreateDesign} className={styles.form}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Design name"
                    value={designForm.name}
                    onChange={handleDesignChange}
                  />
                  <select
                    name="type"
                    value={designForm.type}
                    onChange={handleDesignChange}
                  >
                    <option value="Post">Post</option>
                    <option value="Story">Story</option>
                    <option value="Poster">Poster</option>
                    <option value="Ad">Ad</option>
                    <option value="Banner">Banner</option>
                  </select>
                  <input
                    type="text"
                    name="deliveryDate"
                    placeholder="Delivery date"
                    value={designForm.deliveryDate}
                    onChange={handleDesignChange}
                  />
                  <select
                    name="status"
                    value={designForm.status}
                    onChange={handleDesignChange}
                  >
                    <option value="In Design">In Design</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Waiting Client Approval">
                      Waiting Client Approval
                    </option>
                    <option value="Published">Published</option>
                  </select>
                  <select
                    name="projectId"
                    value={designForm.projectId}
                    onChange={handleDesignChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="designerId"
                    value={designForm.designerId}
                    onChange={handleDesignChange}
                  >
                    <option value="">Assign designer (optional)</option>
                    {designers.map((designer) => (
                      <option key={designer.id} value={designer.id}>
                        {designer.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="designerNotes"
                    placeholder="Designer notes"
                    value={designForm.designerNotes}
                    onChange={handleDesignTextChange}
                    rows={4}
                  />
                  <textarea
                    name="clientComments"
                    placeholder="Client comments"
                    value={designForm.clientComments}
                    onChange={handleDesignTextChange}
                    rows={4}
                  />
                  <button type="submit">Create Design</button>
                </form>
              </>
            )}

            {activeSection === "editDesign" && (
              <>
                <h1>Edit Design</h1>
                <form onSubmit={handleUpdateDesign} className={styles.form}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Design name"
                    value={editDesignForm.name}
                    onChange={handleEditDesignChange}
                  />
                  <select
                    name="type"
                    value={editDesignForm.type}
                    onChange={handleEditDesignChange}
                  >
                    <option value="Post">Post</option>
                    <option value="Story">Story</option>
                    <option value="Poster">Poster</option>
                    <option value="Ad">Ad</option>
                    <option value="Banner">Banner</option>
                  </select>
                  <input
                    type="text"
                    name="deliveryDate"
                    placeholder="Delivery date"
                    value={editDesignForm.deliveryDate}
                    onChange={handleEditDesignChange}
                  />
                  <select
                    name="status"
                    value={editDesignForm.status}
                    onChange={handleEditDesignChange}
                  >
                    <option value="In Design">In Design</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Waiting Client Approval">
                      Waiting Client Approval
                    </option>
                    <option value="Published">Published</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <select
                    name="projectId"
                    value={editDesignForm.projectId}
                    onChange={handleEditDesignChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="designerId"
                    value={editDesignForm.designerId}
                    onChange={handleEditDesignChange}
                  >
                    <option value="">Assign designer (optional)</option>
                    {designers.map((designer) => (
                      <option key={designer.id} value={designer.id}>
                        {designer.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="designerNotes"
                    placeholder="Designer notes"
                    value={editDesignForm.designerNotes}
                    onChange={handleEditDesignTextChange}
                    rows={4}
                  />
                  <textarea
                    name="clientComments"
                    placeholder="Client comments"
                    value={editDesignForm.clientComments}
                    onChange={handleEditDesignTextChange}
                    rows={4}
                  />

                  <div className={styles.actionButtons}>
                    <button type="submit">Save Design</button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        setEditingDesignId(null);
                        setActiveSection("designs");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeSection === "approvals" && (
              <>
                <h1>Approvals</h1>
                <p>Review designs that are waiting for client approval or still under review.</p>

                {approvalDesigns.length === 0 ? (
                  <div className={styles.grid}>
                    <div className={styles.card}>
                      <h3>No approvals right now</h3>
                      <p>All reviewed designs are already handled or no items need approval yet.</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.grid}>
                    {approvalDesigns.map((design) => (
                      <div key={design.id} className={styles.card}>
                        <h3>{design.name}</h3>

                        <p>
                          <strong>Project:</strong> {design.project?.name || "N/A"}
                        </p>

                        <p>
                          <strong>Client:</strong>{" "}
                          {design.project?.user?.clientProfile?.companyName ||
                            design.project?.user?.name ||
                            "N/A"}
                        </p>

                        <p>
                          <strong>Status:</strong> {design.status}
                        </p>

                        <p>
                          <strong>Type:</strong> {design.type}
                        </p>

                        <p>
                          <strong>Delivery Date:</strong> {design.deliveryDate}
                        </p>

                        <p>
                          <strong>Designer:</strong>{" "}
                          {design.designer?.name || "Not assigned"}
                        </p>

                        <p>
                          <strong>Designer Notes:</strong>{" "}
                          {design.designerNotes?.trim() || "No designer notes."}
                        </p>

                        <p>
                          <strong>Client Comments:</strong>{" "}
                          {design.clientComments?.trim() || "No client comments."}
                        </p>

                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            className={styles.approveButton}
                            onClick={() =>
                              handleApproveDesign(design.id, design.name)
                            }
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            className={styles.rejectButton}
                            onClick={() =>
                              handleRejectDesign(design.id, design.name)
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "videos" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Videos</h1>
                    <p>Track uploaded video work, production stages, linked projects, and client content.</p>
                  </div>

                  <button
                    className={styles.sectionActionButton}
                    onClick={() => setActiveSection("uploadVideo")}
                  >
                    + Upload Video
                  </button>
                </div>

                {videos.length === 0 ? (
                  <div className={styles.grid}>
                    <div className={styles.card}>
                      <h3>No Videos Yet</h3>
                      <p>Upload your first video and connect it with a project.</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.grid}>
                    {videos.map((video) => (
                      <div key={video.id} className={styles.card}>
                        <h3>{video.title}</h3>
                        <p>
                          <strong>Type:</strong> {video.type}
                        </p>
                        <p>
                          <strong>Project:</strong> {video.project?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Client:</strong>{" "}
                          {video.project?.user?.clientProfile?.companyName ||
                            video.project?.user?.name ||
                            "N/A"}
                        </p>
                        <p>
                          <strong>Stage:</strong> {video.stage}
                        </p>
                        <p>
                          <strong>Upload Date:</strong> {video.uploadDate}
                        </p>
                        <p>
                          <strong>File:</strong> {video.fileName || "No file"}
                        </p>

                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => openEditVideo(video)}
                          >
                            Edit Video
                          </button>

                          <button
                            type="button"
                            className={styles.rejectButton}
                            onClick={() =>
                              handleDeleteVideo(video.id, video.title)
                            }
                          >
                            Delete Video
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "uploadVideo" && (
              <>
                <h1>Upload Video</h1>
                <form onSubmit={handleUploadVideo} className={styles.form}>
                  <input
                    type="text"
                    name="title"
                    placeholder="Video title"
                    value={videoForm.title}
                    onChange={handleVideoChange}
                  />
                  <select
                    name="type"
                    value={videoForm.type}
                    onChange={handleVideoChange}
                  >
                    <option value="Promo Video">Promo Video</option>
                    <option value="Reel">Reel</option>
                    <option value="Ad Video">Ad Video</option>
                    <option value="Interview">Interview</option>
                  </select>
                  <select
                    name="stage"
                    value={videoForm.stage}
                    onChange={handleVideoChange}
                  >
                    <option value="Idea">Idea</option>
                    <option value="Script">Script</option>
                    <option value="Shooting">Shooting</option>
                    <option value="Editing">Editing</option>
                    <option value="Review">Review</option>
                    <option value="Ready to Publish">Ready to Publish</option>
                  </select>
                  <select
                    name="projectId"
                    value={videoForm.projectId}
                    onChange={handleVideoChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                  />
                  {videoForm.fileName && (
                    <p>
                      <strong>Selected File:</strong> {videoForm.fileName}
                    </p>
                  )}
                  <button type="submit">Upload Video</button>
                </form>
              </>
            )}

            {activeSection === "editVideo" && (
              <>
                <h1>Edit Video</h1>
                <form onSubmit={handleUpdateVideo} className={styles.form}>
                  <input
                    type="text"
                    name="title"
                    placeholder="Video title"
                    value={editVideoForm.title}
                    onChange={handleEditVideoChange}
                  />
                  <select
                    name="type"
                    value={editVideoForm.type}
                    onChange={handleEditVideoChange}
                  >
                    <option value="Promo Video">Promo Video</option>
                    <option value="Reel">Reel</option>
                    <option value="Ad Video">Ad Video</option>
                    <option value="Interview">Interview</option>
                  </select>
                  <select
                    name="stage"
                    value={editVideoForm.stage}
                    onChange={handleEditVideoChange}
                  >
                    <option value="Idea">Idea</option>
                    <option value="Script">Script</option>
                    <option value="Shooting">Shooting</option>
                    <option value="Editing">Editing</option>
                    <option value="Review">Review</option>
                    <option value="Ready to Publish">Ready to Publish</option>
                    <option value="Published">Published</option>
                  </select>
                  <input
                    type="text"
                    name="uploadDate"
                    placeholder="Upload date"
                    value={editVideoForm.uploadDate}
                    onChange={handleEditVideoChange}
                  />
                  <select
                    name="projectId"
                    value={editVideoForm.projectId}
                    onChange={handleEditVideoChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleEditVideoFileChange}
                  />
                  {editVideoForm.fileName && (
                    <p>
                      <strong>Selected File:</strong> {editVideoForm.fileName}
                    </p>
                  )}

                  <div className={styles.actionButtons}>
                    <button type="submit">Save Video</button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        setEditingVideoId(null);
                        setActiveSection("videos");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeSection === "calendar" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Content Calendar</h1>
                    <p>Manage upcoming content items, platforms, dates, and linked client projects.</p>
                  </div>

                  <button
                    className={styles.sectionActionButton}
                    onClick={() => setActiveSection("addContent")}
                  >
                    + Add Content
                  </button>
                </div>

                {contents.length === 0 ? (
                  <div className={styles.grid}>
                    <div className={styles.card}>
                      <h3>No Content Yet</h3>
                      <p>Add your first content item to start organizing the content calendar.</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.grid}>
                    {contents.map((item) => (
                      <div key={item.id} className={styles.card}>
                        <h3>{item.title}</h3>
                        <p>
                          <strong>Platform:</strong> {item.platform}
                        </p>
                        <p>
                          <strong>Project:</strong> {item.project?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Client:</strong>{" "}
                          {item.project?.user?.clientProfile?.companyName ||
                            item.project?.user?.name ||
                            "N/A"}
                        </p>
                        <p>
                          <strong>Date:</strong> {item.date}
                        </p>
                        <p>
                          <strong>Status:</strong> {item.status}
                        </p>

                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => openEditContent(item)}
                          >
                            Edit Content
                          </button>

                          <button
                            type="button"
                            className={styles.rejectButton}
                            onClick={() =>
                              handleDeleteContent(item.id, item.title)
                            }
                          >
                            Delete Content
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "addContent" && (
              <>
                <h1>Add Content Item</h1>
                <form onSubmit={handleCreateContent} className={styles.form}>
                  <input
                    type="text"
                    name="title"
                    placeholder="Content title"
                    value={contentForm.title}
                    onChange={handleContentChange}
                  />
                  <select
                    name="platform"
                    value={contentForm.platform}
                    onChange={handleContentChange}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                  <input
                    type="text"
                    name="date"
                    placeholder="Date"
                    value={contentForm.date}
                    onChange={handleContentChange}
                  />
                  <select
                    name="status"
                    value={contentForm.status}
                    onChange={handleContentChange}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Ready">Ready</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <select
                    name="projectId"
                    value={contentForm.projectId}
                    onChange={handleContentChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Create Content</button>
                </form>
              </>
            )}

            {activeSection === "editContent" && (
              <>
                <h1>Edit Content Item</h1>
                <form onSubmit={handleUpdateContent} className={styles.form}>
                  <input
                    type="text"
                    name="title"
                    placeholder="Content title"
                    value={editContentForm.title}
                    onChange={handleEditContentChange}
                  />
                  <select
                    name="platform"
                    value={editContentForm.platform}
                    onChange={handleEditContentChange}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                  <input
                    type="text"
                    name="date"
                    placeholder="Date"
                    value={editContentForm.date}
                    onChange={handleEditContentChange}
                  />
                  <select
                    name="status"
                    value={editContentForm.status}
                    onChange={handleEditContentChange}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Ready">Ready</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <select
                    name="projectId"
                    value={editContentForm.projectId}
                    onChange={handleEditContentChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>

                  <div className={styles.actionButtons}>
                    <button type="submit">Save Content</button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        setEditingContentId(null);
                        setActiveSection("calendar");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeSection === "reports" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Reports</h1>
                    <p>Manage monthly reports, performance stats, and linked project reporting details.</p>
                  </div>

                  <button
                    className={styles.sectionActionButton}
                    onClick={() => setActiveSection("addReport")}
                  >
                    + Add Report
                  </button>
                </div>

                {reports.length === 0 ? (
                  <div className={styles.grid}>
                    <div className={styles.card}>
                      <h3>No Reports Yet</h3>
                      <p>Create your first monthly report to track results for projects and clients.</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.grid}>
                    {reports.map((report) => (
                      <div key={report.id} className={styles.card}>
                        <h3>{report.month}</h3>
                        <p>
                          <strong>Project:</strong> {report.project?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Client:</strong>{" "}
                          {report.project?.user?.clientProfile?.companyName ||
                            report.project?.user?.name ||
                            "N/A"}
                        </p>
                        <p>
                          <strong>Followers:</strong> {report.followers}
                        </p>
                        <p>
                          <strong>Engagement:</strong> {report.engagement}
                        </p>
                        <p>
                          <strong>Best Post:</strong> {report.bestPost}
                        </p>

                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => openEditReport(report)}
                          >
                            Edit Report
                          </button>

                          <button
                            type="button"
                            className={styles.rejectButton}
                            onClick={() =>
                              handleDeleteReport(report.id, report.month)
                            }
                          >
                            Delete Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "addReport" && (
              <>
                <h1>Add Report</h1>
                <form onSubmit={handleCreateReport} className={styles.form}>
                  <input
                    type="text"
                    name="month"
                    placeholder="Month"
                    value={reportForm.month}
                    onChange={handleReportChange}
                  />
                  <input
                    type="text"
                    name="followers"
                    placeholder="Followers"
                    value={reportForm.followers}
                    onChange={handleReportChange}
                  />
                  <input
                    type="text"
                    name="engagement"
                    placeholder="Engagement"
                    value={reportForm.engagement}
                    onChange={handleReportChange}
                  />
                  <input
                    type="text"
                    name="bestPost"
                    placeholder="Best post"
                    value={reportForm.bestPost}
                    onChange={handleReportChange}
                  />
                  <select
                    name="projectId"
                    value={reportForm.projectId}
                    onChange={handleReportChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Create Report</button>
                </form>
              </>
            )}

            {activeSection === "editReport" && (
              <>
                <h1>Edit Report</h1>
                <form onSubmit={handleUpdateReport} className={styles.form}>
                  <input
                    type="text"
                    name="month"
                    placeholder="Month"
                    value={editReportForm.month}
                    onChange={handleEditReportChange}
                  />
                  <input
                    type="text"
                    name="followers"
                    placeholder="Followers"
                    value={editReportForm.followers}
                    onChange={handleEditReportChange}
                  />
                  <input
                    type="text"
                    name="engagement"
                    placeholder="Engagement"
                    value={editReportForm.engagement}
                    onChange={handleEditReportChange}
                  />
                  <input
                    type="text"
                    name="bestPost"
                    placeholder="Best post"
                    value={editReportForm.bestPost}
                    onChange={handleEditReportChange}
                  />
                  <select
                    name="projectId"
                    value={editReportForm.projectId}
                    onChange={handleEditReportChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>

                  <div className={styles.actionButtons}>
                    <button type="submit">Save Report</button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        setEditingReportId(null);
                        setActiveSection("reports");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeSection === "files" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Files</h1>
                    <p>Manage uploaded project files, file types, delivery assets, and client materials.</p>
                  </div>

                  <button
                    className={styles.sectionActionButton}
                    onClick={() => setActiveSection("uploadFile")}
                  >
                    + Upload File
                  </button>
                </div>

                {files.length === 0 ? (
                  <div className={styles.grid}>
                    <div className={styles.card}>
                      <h3>No Files Yet</h3>
                      <p>Upload your first file and attach it to a project.</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.grid}>
                    {files.map((file) => (
                      <div key={file.id} className={styles.card}>
                        <h3>{file.fileName}</h3>
                        <p>
                          <strong>Type:</strong> {file.fileType}
                        </p>
                        <p>
                          <strong>Project:</strong> {file.project?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Client:</strong>{" "}
                          {file.project?.user?.clientProfile?.companyName ||
                            file.project?.user?.name ||
                            "N/A"}
                        </p>
                        <p>
                          <strong>Upload Date:</strong> {file.uploadDate}
                        </p>

                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => openEditFile(file)}
                          >
                            Edit File
                          </button>

                          <button
                            type="button"
                            className={styles.rejectButton}
                            onClick={() =>
                              handleDeleteFile(file.id, file.fileName)
                            }
                          >
                            Delete File
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "uploadFile" && (
              <>
                <h1>Upload File</h1>
                <form onSubmit={handleUploadFile} className={styles.form}>
                  <select
                    name="fileType"
                    value={fileForm.fileType}
                    onChange={handleFileFormChange}
                  >
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                    <option value="Logo">Logo</option>
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="Contract">Contract</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Other">Other</option>
                  </select>
                  <select
                    name="projectId"
                    value={fileForm.projectId}
                    onChange={handleFileFormChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <input type="file" onChange={handleGeneralFileChange} />
                  {fileForm.fileName && (
                    <p>
                      <strong>Selected File:</strong> {fileForm.fileName}
                    </p>
                  )}
                  <button type="submit">Upload File</button>
                </form>
              </>
            )}

            {activeSection === "editFile" && (
              <>
                <h1>Edit File</h1>
                <form onSubmit={handleUpdateFile} className={styles.form}>
                  <select
                    name="fileType"
                    value={editFileForm.fileType}
                    onChange={handleEditFileFormChange}
                  >
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                    <option value="Logo">Logo</option>
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="Contract">Contract</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="uploadDate"
                    placeholder="Upload date"
                    value={editFileForm.uploadDate}
                    onChange={handleEditFileFormChange}
                  />
                  <select
                    name="projectId"
                    value={editFileForm.projectId}
                    onChange={handleEditFileFormChange}
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <input type="file" onChange={handleEditGeneralFileChange} />
                  {editFileForm.fileName && (
                    <p>
                      <strong>Selected File:</strong> {editFileForm.fileName}
                    </p>
                  )}

                  <div className={styles.actionButtons}>
                    <button type="submit">Save File</button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        setEditingFileId(null);
                        setActiveSection("files");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeSection === "messages" && (
              <>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Messages</h1>
                    <p>Communicate with clients and designers from one organized conversation area.</p>
                  </div>
                </div>

                <div className={styles.messagesLayout}>
                  <div className={styles.messagesSidebar}>
                    <div className={styles.messagesSidebarTop}>
                      <label className={styles.messagesLabel}>Chat Type</label>
                      <select
                        value={selectedChat}
                        onChange={(e) =>
                          setSelectedChat(e.target.value as "client" | "designer")
                        }
                      >
                        <option value="client">Talk to Client</option>
                        <option value="designer">Talk to Designer</option>
                      </select>
                    </div>

                    <div className={styles.messagesUsersList}>
                      {availableChatUsers.length === 0 ? (
                        <p className={styles.emptyText}>No users available.</p>
                      ) : (
                        availableChatUsers.map((user) => {
                          const displayName =
                            selectedChat === "client"
                              ? (user as ClientUser).clientProfile?.companyName ||
                                user.name
                              : user.name;

                          return (
                            <button
                              key={user.id}
                              type="button"
                              className={`${styles.userListButton} ${
                                selectedUserId === String(user.id)
                                  ? styles.userListButtonActive
                                  : ""
                              }`}
                              onClick={() => setSelectedUserId(String(user.id))}
                            >
                              <strong>{displayName}</strong>
                              <span>{user.email}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className={styles.messagesMain}>
                    <div className={styles.messagesHeader}>
                      <h3>
                        {selectedUserId
                          ? availableChatUsers.find(
                              (user) => String(user.id) === selectedUserId
                            )
                              ? selectedChat === "client"
                                ? (
                                    availableChatUsers.find(
                                      (user) => String(user.id) === selectedUserId
                                    ) as ClientUser
                                  ).clientProfile?.companyName ||
                                  availableChatUsers.find(
                                    (user) => String(user.id) === selectedUserId
                                  )?.name
                                : availableChatUsers.find(
                                    (user) => String(user.id) === selectedUserId
                                  )?.name
                              : "Conversation"
                          : "Select a conversation"}
                      </h3>
                      <p>
                        {selectedChat === "client"
                          ? "Client conversation"
                          : "Designer conversation"}
                      </p>
                    </div>

                    <div className={styles.messagesBoxLarge}>
                      {messagesLoading ? (
                        <p className={styles.emptyText}>Loading messages...</p>
                      ) : !selectedUserId ? (
                        <p className={styles.emptyText}>
                          Please select a user first.
                        </p>
                      ) : chatMessages.length === 0 ? (
                        <p className={styles.emptyText}>No messages yet.</p>
                      ) : (
                        chatMessages.map((chat) => {
                          const isMine = chat.senderId !== Number(selectedUserId);

                          return (
                            <div
                              key={chat.id}
                              className={`${styles.chatBubble} ${
                                isMine ? styles.myBubble : styles.otherBubble
                              }`}
                            >
                              <p className={styles.chatSender}>
                                {isMine ? "Company" : chat.sender?.name || "User"}
                              </p>
                              <p className={styles.chatText}>{chat.text}</p>
                              <p className={styles.chatTime}>
                                {new Date(chat.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <form
                      onSubmit={handleSendChatMessage}
                      className={styles.messageComposer}
                    >
                      <input
                        type="text"
                        placeholder="Write a message..."
                        value={newChatMessage}
                        onChange={(e) => setNewChatMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={sendingChatMessage || !selectedUserId}
                      >
                        {sendingChatMessage ? "Sending..." : "Send"}
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
  );
}