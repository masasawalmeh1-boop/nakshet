"use client";

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

type ContentItem = {
  id: number;
  title: string;
  platform: string;
  date: string;
  status: string;
  clientName: string;
};

type ReportItem = {
  id: number;
  clientName: string;
  month: string;
  followers: string;
  engagement: string;
  bestPost: string;
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
    email: string;
  };
};

export default function CompanyDashboardPage() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("dashboard");

  const [clients, setClients] = useState<ClientUser[]>([]);
  const [designers, setDesigners] = useState<DesignerUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [designs, setDesigns] = useState<BackendDesign[]>([]);
  const [videos, setVideos] = useState<BackendVideo[]>([]);
  const [files, setFiles] = useState<BackendFile[]>([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [contentCalendar] = useState<ContentItem[]>([
    {
      id: 1,
      title: "Spring Offer Post",
      platform: "Instagram",
      date: "2026-04-05",
      status: "Scheduled",
      clientName: "Taste House",
    },
    {
      id: 2,
      title: "Coffee Reel Campaign",
      platform: "TikTok",
      date: "2026-04-07",
      status: "Ready",
      clientName: "Bean Spot",
    },
    {
      id: 3,
      title: "Summer Collection Ad",
      platform: "Facebook",
      date: "2026-04-09",
      status: "Published",
      clientName: "Glow Fashion",
    },
  ]);

  const [reports] = useState<ReportItem[]>([
    {
      id: 1,
      clientName: "Taste House",
      month: "March 2026",
      followers: "+420",
      engagement: "8.4%",
      bestPost: "Restaurant Launch Post",
    },
    {
      id: 2,
      clientName: "Bean Spot",
      month: "March 2026",
      followers: "+290",
      engagement: "6.9%",
      bestPost: "Coffee Promo Story",
    },
  ]);

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

  const [videoForm, setVideoForm] = useState({
    title: "",
    type: "Promo Video",
    stage: "Idea",
    projectId: "",
    fileName: "",
  });

  const [fileForm, setFileForm] = useState({
    fileType: "Image",
    projectId: "",
    fileName: "",
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

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadDashboardData(),
        loadDesignsData(),
        loadVideosData(),
        loadFilesData(),
      ]);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while loading company data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

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

  const handleDesignChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDesignForm((prev) => ({
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

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setVideoForm((prev) => ({
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

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setVideoForm((prev) => ({
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
      });

      const data = await res.json();

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
    }
  };

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

  const handleDeleteVideo = (id: number) => {
    setVideos((prev) => prev.filter((video) => video.id !== id));
    setMessage("Video removed from view.");
  };

  const handleDeleteFile = (id: number) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    setMessage("File removed from view.");
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
  const totalMessages = chatMessages.length;

  const scheduledContent = contentCalendar.filter(
    (item) => item.status.toLowerCase() === "scheduled"
  ).length;

  const monthlyReports = reports.length;

  const activeProjects = projects.filter(
    (project) =>
      project.status.toLowerCase() === "in progress" ||
      project.status.toLowerCase() === "active"
  ).length;

  const pendingProjects = projects.filter(
    (project) => project.status.toLowerCase() === "pending"
  ).length;

  const pendingApprovals = 0;

  const videosInProgress = videos.filter(
    (video) =>
      video.stage.toLowerCase() !== "ready to publish" &&
      video.stage.toLowerCase() !== "published"
  ).length;

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

        <button onClick={() => setActiveSection("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveSection("clients")}>Clients</button>
        <button onClick={() => setActiveSection("projects")}>Projects</button>
        <button onClick={() => setActiveSection("designs")}>Designs</button>
        <button onClick={() => setActiveSection("addDesign")}>Add Design</button>
        <button onClick={() => setActiveSection("approvals")}>Approvals</button>
        <button onClick={() => setActiveSection("videos")}>Videos</button>
        <button onClick={() => setActiveSection("uploadVideo")}>
          Upload Video
        </button>
        <button onClick={() => setActiveSection("calendar")}>
          Content Calendar
        </button>
        <button onClick={() => setActiveSection("reports")}>Reports</button>
        <button onClick={() => setActiveSection("files")}>Files</button>
        <button onClick={() => setActiveSection("uploadFile")}>
          Upload File
        </button>
        <button onClick={() => setActiveSection("messages")}>Messages</button>
        <button onClick={() => setActiveSection("addProject")}>
          Add Project
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
                <h1>Company Dashboard</h1>
                <p>Manage clients and projects from one place.</p>

                <div className={styles.statsGrid}>
                  <div className={styles.card}>
                    <h3>Total Clients</h3>
                    <p>{totalClients}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Total Designers</h3>
                    <p>{totalDesigners}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Total Projects</h3>
                    <p>{totalProjects}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Active Projects</h3>
                    <p>{activeProjects}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Pending Projects</h3>
                    <p>{pendingProjects}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Total Designs</h3>
                    <p>{totalDesigns}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Pending Approvals</h3>
                    <p>{pendingApprovals}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Total Videos</h3>
                    <p>{totalVideos}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Videos In Progress</h3>
                    <p>{videosInProgress}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Scheduled Content</h3>
                    <p>{scheduledContent}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Monthly Reports</h3>
                    <p>{monthlyReports}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Total Files</h3>
                    <p>{totalFiles}</p>
                  </div>
                  <div className={styles.card}>
                    <h3>Current Open Chat Messages</h3>
                    <p>{totalMessages}</p>
                  </div>
                </div>
              </>
            )}

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
                <h1>Projects</h1>
                {projects.length === 0 ? (
                  <p>No projects found.</p>
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
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "designs" && (
              <>
                <h1>Designs</h1>
                {designs.length === 0 ? (
                  <p>No designs found.</p>
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
                    style={{
                      padding: "14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      fontSize: "15px",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                  <textarea
                    name="clientComments"
                    placeholder="Client comments"
                    value={designForm.clientComments}
                    onChange={handleDesignTextChange}
                    rows={4}
                    style={{
                      padding: "14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      fontSize: "15px",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                  <button type="submit">Create Design</button>
                </form>
              </>
            )}

            {activeSection === "approvals" && (
              <>
                <h1>Approvals</h1>
                <p>No approvals at the moment.</p>
              </>
            )}

            {activeSection === "videos" && (
              <>
                <h1>Videos</h1>
                {videos.length === 0 ? (
                  <div className={styles.grid}>
                    <div className={styles.card}>
                      <h3>No Videos Yet</h3>
                      <p>Upload your first video from the Upload Video section.</p>
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
                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(video.id)}
                          style={{
                            marginTop: "12px",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          Remove From View
                        </button>
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

            {activeSection === "calendar" && (
              <>
                <h1>Content Calendar</h1>
                <div className={styles.grid}>
                  {contentCalendar.map((item) => (
                    <div key={item.id} className={styles.card}>
                      <h3>{item.title}</h3>
                      <p>
                        <strong>Platform:</strong> {item.platform}
                      </p>
                      <p>
                        <strong>Client:</strong> {item.clientName}
                      </p>
                      <p>
                        <strong>Date:</strong> {item.date}
                      </p>
                      <p>
                        <strong>Status:</strong> {item.status}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeSection === "reports" && (
              <>
                <h1>Reports</h1>
                <div className={styles.grid}>
                  {reports.map((report) => (
                    <div key={report.id} className={styles.card}>
                      <h3>{report.clientName}</h3>
                      <p>
                        <strong>Month:</strong> {report.month}
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
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeSection === "files" && (
              <>
                <h1>Files</h1>
                {files.length === 0 ? (
                  <div className={styles.grid}>
                    <div className={styles.card}>
                      <h3>No Files Yet</h3>
                      <p>Upload your first file from the Upload File section.</p>
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
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id)}
                          style={{
                            marginTop: "12px",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          Remove From View
                        </button>
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

            {activeSection === "messages" && (
              <>
                <h1>Messages</h1>
                <div className={styles.form} style={{ maxWidth: "900px" }}>
                  <select
                    value={selectedChat}
                    onChange={(e) =>
                      setSelectedChat(e.target.value as "client" | "designer")
                    }
                  >
                    <option value="client">Talk to Client</option>
                    <option value="designer">Talk to Designer</option>
                  </select>

                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value="">Select user</option>
                    {availableChatUsers.map((user) => {
                      const displayName =
                        selectedChat === "client"
                          ? (user as ClientUser).clientProfile?.companyName ||
                            user.name
                          : user.name;

                      return (
                        <option key={user.id} value={user.id}>
                          {displayName}
                        </option>
                      );
                    })}
                  </select>

                  <div
                    style={{
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "16px",
                      minHeight: "300px",
                      background: "#f8fafc",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      overflowY: "auto",
                    }}
                  >
                    {messagesLoading ? (
                      <p>Loading messages...</p>
                    ) : !selectedUserId ? (
                      <p>Please select a user first.</p>
                    ) : chatMessages.length === 0 ? (
                      <p>No messages yet.</p>
                    ) : (
                      chatMessages.map((chat) => {
                        const isMine = chat.senderId !== Number(selectedUserId);

                        return (
                          <div
                            key={chat.id}
                            style={{
                              alignSelf: isMine ? "flex-end" : "flex-start",
                              maxWidth: "70%",
                              background: isMine ? "#dbeafe" : "#e2e8f0",
                              padding: "12px",
                              borderRadius: "12px",
                            }}
                          >
                            <p style={{ margin: 0, fontWeight: 700 }}>
                              {isMine ? "Company" : chat.sender?.name || "User"}
                            </p>
                            <p style={{ margin: "6px 0" }}>{chat.text}</p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "12px",
                                color: "#475569",
                              }}
                            >
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

                  <form onSubmit={handleSendChatMessage} className={styles.form}>
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
                      {sendingChatMessage ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
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
          </>
        )}
      </main>
    </div>
  );
}