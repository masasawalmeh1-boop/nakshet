"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./project-details.module.css";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileImage,
  Film,
  FolderOpen,
  UserCircle2,
  Megaphone,
  MessageSquare,
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
};

type ProjectDetails = {
  id: number;
  name: string;
  service: string;
  status: string;
  deadline: string;
  description?: string | null;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  uploads: UploadItem[];
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const demoProjects: ProjectDetails[] = [
  {
    id: 1,
    name: "Spring Fashion Campaign",
    service: "Social Media Management",
    status: "In Progress",
    deadline: "2026-04-15",
    description:
      "A seasonal campaign focused on promoting the new spring collection across social media platforms with engaging visuals and short-form video content.",
    owner: {
      id: 11,
      name: "Lina Fashion",
      email: "lina@fashion.com",
    },
    uploads: [
      {
        id: 1,
        title: "Spring Campaign Instagram Post",
        fileUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        fileType: "JPG",
        category: "design",
        status: "Pending Review",
        note: "Client asked to make the CTA text bigger.",
        createdAt: "2026-04-08T10:00:00.000Z",
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
      },
    ],
  },
  {
    id: 2,
    name: "Coffee House Branding",
    service: "Brand Identity Design",
    status: "Waiting Client Approval",
    deadline: "2026-04-20",
    description:
      "A branding refresh project including logo development, visual identity updates, and brand presentation materials.",
    owner: {
      id: 12,
      name: "Coffee House Team",
      email: "hello@coffeehouse.com",
    },
    uploads: [
      {
        id: 3,
        title: "Logo Refresh Mockup",
        fileUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        fileType: "PNG",
        category: "branding",
        status: "Approved",
        note: "Approved by client.",
        createdAt: "2026-04-07T09:15:00.000Z",
      },
    ],
  },
  {
    id: 3,
    name: "Restaurant Awareness Ads",
    service: "Ad Campaign",
    status: "In Progress",
    deadline: "2026-04-18",
    description:
      "Awareness campaign for a restaurant launch including social media ads, stories, reels, and visual promotional assets.",
    owner: {
      id: 13,
      name: "Bite Restaurant",
      email: "team@bite.com",
    },
    uploads: [
      {
        id: 4,
        title: "Story Ad Version 2",
        fileUrl: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931",
        fileType: "JPG",
        category: "design",
        status: "Approved",
        note: "Ready for publishing.",
        createdAt: "2026-04-09T14:00:00.000Z",
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
      },
    ],
  },
  {
    id: 4,
    name: "Summer Promo Launch",
    service: "Video Production",
    status: "In Progress",
    deadline: "2026-04-22",
    description:
      "Promo launch campaign centered around short videos, teaser assets, and paid social support for a summer sale.",
    owner: {
      id: 14,
      name: "Glow Store",
      email: "marketing@glowstore.com",
    },
    uploads: [
      {
        id: 6,
        title: "Summer Sale Promo Video",
        fileUrl: "https://www.w3schools.com/html/movie.mp4",
        fileType: "MP4",
        category: "video",
        status: "Approved",
        note: "Approved and ready to schedule.",
        createdAt: "2026-04-10T12:00:00.000Z",
      },
    ],
  },
];

export default function DesignerProjectDetailsPage({ params }: PageProps) {
  const [projectId, setProjectId] = useState<string>("");
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setProjectId(resolved.id);
    }

    resolveParams();
  }, [params]);

  useEffect(() => {
    async function loadProject() {
      if (!projectId) return;

      try {
        setLoading(true);

        const res = await fetch(`/api/designer/projects?designerId=2`);
        const data = await res.json().catch(() => ({ success: false }));

        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          const foundProject =
            data.projects.find((item: ProjectDetails) => String(item.id) === projectId) || null;
          setProject(foundProject);
        } else {
          const foundProject =
            demoProjects.find((item) => String(item.id) === projectId) || null;
          setProject(foundProject);
        }
      } catch (error) {
        console.error("LOAD PROJECT DETAILS ERROR:", error);
        const foundProject =
          demoProjects.find((item) => String(item.id) === projectId) || null;
        setProject(foundProject);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  const designUploads = useMemo(() => {
    return project?.uploads?.filter((item) => item.category === "design") || [];
  }, [project]);

  const videoUploads = useMemo(() => {
    return project?.uploads?.filter((item) => item.category === "video") || [];
  }, [project]);

  const brandingUploads = useMemo(() => {
    return project?.uploads?.filter((item) => item.category === "branding") || [];
  }, [project]);

  const approvedCount = useMemo(() => {
    return project?.uploads?.filter((item) => item.status === "Approved").length || 0;
  }, [project]);

  const pendingCount = useMemo(() => {
    return (
      project?.uploads?.filter((item) =>
        ["Pending Review", "Waiting Client Approval"].includes(item.status)
      ).length || 0
    );
  }, [project]);

  const totalFiles = project?.uploads?.length || 0;

  if (loading) {
    return <div className={styles.loading}>Loading project details...</div>;
  }

  if (!project) {
    return <div className={styles.emptyState}>Project not found.</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <Link href="/designer-dashboard" className={styles.backBtn}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>

      <header className={styles.hero}>
        <div>
          <h1>{project.name}</h1>
          <p>
            Track project details, client info, uploads, approvals, and designer
            workflow from one place.
          </p>
        </div>

        <div className={styles.heroBadge}>{project.status}</div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FolderOpen size={18} />
          </div>
          <div>
            <h3>{totalFiles}</h3>
            <p>Total Files</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileImage size={18} />
          </div>
          <div>
            <h3>{designUploads.length}</h3>
            <p>Design Files</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Film size={18} />
          </div>
          <div>
            <h3>{videoUploads.length}</h3>
            <p>Video Files</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h3>{approvedCount}</h3>
            <p>Approved Items</p>
          </div>
        </div>
      </section>

      <section className={styles.infoGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Project Overview</h3>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Project Name</span>
              <strong>{project.name}</strong>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Service Type</span>
              <strong>{project.service}</strong>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status</span>
              <strong>{project.status}</strong>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Deadline</span>
              <strong>{project.deadline}</strong>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Description</span>
              <strong>{project.description || "No description added yet."}</strong>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Client Information</h3>
          </div>

          <div className={styles.clientCard}>
            <div className={styles.clientIcon}>
              <UserCircle2 size={22} />
            </div>

            <div>
              <h4>{project.owner.name}</h4>
              <p>{project.owner.email}</p>
              <span>Main client contact for this project</span>
            </div>
          </div>

          <div className={styles.summaryList}>
            <div className={styles.summaryItem}>
              <Briefcase size={16} />
              <span>Project Type: {project.service}</span>
            </div>

            <div className={styles.summaryItem}>
              <CalendarDays size={16} />
              <span>Deadline: {project.deadline}</span>
            </div>

            <div className={styles.summaryItem}>
              <Clock3 size={16} />
              <span>Pending Items: {pendingCount}</span>
            </div>

            <div className={styles.summaryItem}>
              <Megaphone size={16} />
              <span>Status: {project.status}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Design Files</h3>
          </div>

          <div className={styles.cardList}>
            {designUploads.length > 0 ? (
              designUploads.map((item) => (
                <div key={item.id} className={styles.fileCard}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.fileType || "Design File"}</p>
                    <span>{item.note || "No client note yet."}</span>
                  </div>

                  <div className={styles.fileActions}>
                    <strong className={styles.statusBadge}>{item.status}</strong>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.openBtn}
                    >
                      Open
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyMini}>No design files linked yet.</div>
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Video Files</h3>
          </div>

          <div className={styles.cardList}>
            {videoUploads.length > 0 ? (
              videoUploads.map((item) => (
                <div key={item.id} className={styles.fileCard}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.fileType || "Video File"}</p>
                    <span>{item.note || "No client note yet."}</span>
                  </div>

                  <div className={styles.fileActions}>
                    <strong className={styles.statusBadge}>{item.status}</strong>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.openBtn}
                    >
                      Open
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyMini}>No video files linked yet.</div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Branding Files</h3>
          </div>

          <div className={styles.cardList}>
            {brandingUploads.length > 0 ? (
              brandingUploads.map((item) => (
                <div key={item.id} className={styles.fileCard}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.fileType || "Branding File"}</p>
                    <span>{item.note || "No additional note."}</span>
                  </div>

                  <div className={styles.fileActions}>
                    <strong className={styles.statusBadge}>{item.status}</strong>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.openBtn}
                    >
                      Open
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyMini}>No branding files linked yet.</div>
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Approvals Summary</h3>
          </div>

          <div className={styles.approvalsBox}>
            <div className={styles.approvalItem}>
              <span>Approved</span>
              <strong>{approvedCount}</strong>
            </div>

            <div className={styles.approvalItem}>
              <span>Pending / Waiting</span>
              <strong>{pendingCount}</strong>
            </div>

            <div className={styles.approvalItem}>
              <span>Total Linked Files</span>
              <strong>{totalFiles}</strong>
            </div>
          </div>

          <div className={styles.noteBox}>
            <h4>Client Notes</h4>
            <p>
              Review notes are pulled from uploaded items linked to this project,
              so the designer can track requested changes and approval progress
              more clearly.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.bottomGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Designer Workflow</h3>
          </div>

          <div className={styles.timelineList}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div>
                <h4>Project Brief Ready</h4>
                <p>The project scope and direction are already defined.</p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div>
                <h4>Upload & Review Stage</h4>
                <p>Designer uploads assets and waits for internal or client review.</p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div>
                <h4>Approval & Publishing</h4>
                <p>Approved assets move to publishing or campaign scheduling.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Communication</h3>
          </div>

          <div className={styles.messageSummary}>
            <div className={styles.summaryMessageRow}>
              <MessageSquare size={16} />
              <span>Use the dashboard chat to track project-related updates.</span>
            </div>
            <div className={styles.summaryMessageRow}>
              <MessageSquare size={16} />
              <span>Keep all revision notes tied to uploaded files.</span>
            </div>
            <div className={styles.summaryMessageRow}>
              <MessageSquare size={16} />
              <span>Use project details as the main reference before delivery.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}