"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./project-details.module.css";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  UserRound,
  Video,
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

type MessageItem = {
  id: number;
  text: string;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    role: string;
  };
};

type ConversationItem = {
  id: number;
  title: string;
  messages: MessageItem[];
};

type ProjectDetails = {
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
  designer?: {
    id: number;
    name: string;
    email: string;
  } | null;
  uploads: UploadItem[];
  conversations: ConversationItem[];
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params?.id;

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProject() {
    try {
      setLoading(true);

      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();

      if (data.success) {
        setProject(data.project);
      }
    } catch (error) {
      console.error("LOAD PROJECT DETAILS ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const designFiles = useMemo(() => {
    return project?.uploads.filter((item) => item.category === "design") || [];
  }, [project]);

  const videoFiles = useMemo(() => {
    return project?.uploads.filter((item) => item.category === "video") || [];
  }, [project]);

  const totalMessages = useMemo(() => {
    return (
      project?.conversations.reduce((sum, chat) => sum + chat.messages.length, 0) || 0
    );
  }, [project]);

  const latestConversation = useMemo(() => {
    return project?.conversations?.[0] || null;
  }, [project]);

  if (loading) {
    return <div className={styles.loading}>Loading project details...</div>;
  }

  if (!project) {
    return <div className={styles.loading}>Project not found.</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.topActions}>
        <Link href="/designer-dashboard" className={styles.backBtn}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>

      <section className={styles.hero}>
        <div>
          <h1>{project.name}</h1>
          <p>{project.service}</p>
        </div>

        <div className={styles.heroBadges}>
          <span className={styles.statusBadge}>{project.status}</span>
          <span className={styles.deadlineBadge}>Deadline: {project.deadline}</span>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FolderOpen size={18} />
          </div>
          <div>
            <h3>{project.uploads.length}</h3>
            <p>Total Files</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <ImageIcon size={18} />
          </div>
          <div>
            <h3>{designFiles.length}</h3>
            <p>Design Files</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Video size={18} />
          </div>
          <div>
            <h3>{videoFiles.length}</h3>
            <p>Video Files</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={18} />
          </div>
          <div>
            <h3>{totalMessages}</h3>
            <p>Messages</p>
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Project Overview</h3>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <Briefcase size={16} />
              <span>
                <strong>Service:</strong> {project.service}
              </span>
            </div>

            <div className={styles.infoRow}>
              <CalendarDays size={16} />
              <span>
                <strong>Deadline:</strong> {project.deadline}
              </span>
            </div>

            <div className={styles.infoRow}>
              <CheckCircle2 size={16} />
              <span>
                <strong>Status:</strong> {project.status}
              </span>
            </div>

            <div className={styles.infoRow}>
              <UserRound size={16} />
              <span>
                <strong>Owner:</strong> {project.owner.name}
              </span>
            </div>

            <div className={styles.infoRow}>
              <UserRound size={16} />
              <span>
                <strong>Designer:</strong>{" "}
                {project.designer?.name || "No designer assigned"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Latest Conversation</h3>
          </div>

          {latestConversation ? (
            <div className={styles.chatPreview}>
              <h4>{latestConversation.title}</h4>
              {latestConversation.messages.length > 0 ? (
                latestConversation.messages.slice(-3).map((msg) => (
                  <div key={msg.id} className={styles.messageCard}>
                    <strong>{msg.sender.name}</strong>
                    <p>{msg.text}</p>
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No messages yet.</p>
              )}
            </div>
          ) : (
            <p className={styles.emptyText}>No conversation linked to this project.</p>
          )}
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Design Files</h3>
          </div>

          <div className={styles.cardList}>
            {designFiles.length > 0 ? (
              designFiles.map((item) => (
                <div className={styles.fileCard} key={item.id}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.status}</p>
                    <span>{item.note || "No notes"}</span>
                  </div>
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className={styles.openBtn}>
                    Open
                  </a>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No design files found.</p>
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>Video Files</h3>
          </div>

          <div className={styles.cardList}>
            {videoFiles.length > 0 ? (
              videoFiles.map((item) => (
                <div className={styles.fileCard} key={item.id}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.status}</p>
                    <span>{item.note || "No notes"}</span>
                  </div>
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className={styles.openBtn}>
                    Open
                  </a>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No video files found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}