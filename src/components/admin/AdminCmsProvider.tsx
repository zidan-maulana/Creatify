"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_LANDING_CONTENT,
  DEFAULT_TEAM_PAGE_CONTENT,
  landingContentSchema,
  teamPageContentSchema,
} from "@/config/landing-cms";
import type {
  AboutContent,
  ContactSectionContent,
  DivisionCardContent,
  FaqSectionContent,
  HeroContent,
  LandingPageContent,
  MarqueeContent,
  ServicesSectionContent,
  SiteSettingsContent,
  TeamPageContent,
} from "@/types/cms";
import type { TeamMember } from "@/data/team";
import {
  updateLandingSectionAction,
  updateSiteSettingsAction,
  resetAllToDefaultAction,
} from "@/actions/content-actions";
import {
  updateTeamHeaderAction,
  upsertTeamMemberAction,
  deleteTeamMemberAction,
} from "@/actions/team-actions";

const STORAGE_KEY = "creatify-admin-cms-v1";
const CMS_CHANGE_EVENT = "creatify-cms-change";
export const DEFAULT_ADMIN_EMAIL = "admin@creatify.fasilkom.ac.id";

export interface AdminToastState {
  id: number;
  type: "success" | "error";
  message: string;
}

interface StoredCmsPayload {
  landingContent: LandingPageContent;
  teamContent: TeamPageContent;
  adminEmail: string;
}

const SERVER_SNAPSHOT: StoredCmsPayload = {
  landingContent: DEFAULT_LANDING_CONTENT,
  teamContent: DEFAULT_TEAM_PAGE_CONTENT,
  adminEmail: DEFAULT_ADMIN_EMAIL,
};

let cachedRawSnapshot: string | null | undefined = undefined;
let cachedParsedSnapshot: StoredCmsPayload = SERVER_SNAPSHOT;

function getClientSnapshot(): StoredCmsPayload {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRawSnapshot) {
      return cachedParsedSnapshot;
    }

    cachedRawSnapshot = raw;
    if (!raw) {
      cachedParsedSnapshot = SERVER_SNAPSHOT;
      return cachedParsedSnapshot;
    }

    const parsedJson = JSON.parse(raw) as Partial<StoredCmsPayload>;
    const parsedLanding = landingContentSchema.safeParse(
      parsedJson.landingContent
    );
    const parsedTeamHeader = teamPageContentSchema.safeParse(
      parsedJson.teamContent
    );
    const parsedEmail =
      typeof parsedJson.adminEmail === "string" && parsedJson.adminEmail.trim()
        ? parsedJson.adminEmail.trim()
        : DEFAULT_ADMIN_EMAIL;

    cachedParsedSnapshot = {
      landingContent: parsedLanding.success
        ? parsedLanding.data
        : DEFAULT_LANDING_CONTENT,
      teamContent:
        parsedTeamHeader.success &&
        Array.isArray(parsedJson.teamContent?.members)
          ? {
              ...parsedTeamHeader.data,
              members: parsedJson.teamContent.members,
            }
          : DEFAULT_TEAM_PAGE_CONTENT,
      adminEmail: parsedEmail,
    };
    return cachedParsedSnapshot;
  } catch {
    cachedParsedSnapshot = SERVER_SNAPSHOT;
    return cachedParsedSnapshot;
  }
}

export function setStoredAdminEmail(email: string) {
  if (typeof window === "undefined") return;
  const trimmed = email.trim();
  if (!trimmed) return;

  try {
    const current = getClientSnapshot();
    const nextPayload: StoredCmsPayload = {
      ...current,
      adminEmail: trimmed,
    };
    const serialized = JSON.stringify(nextPayload);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    cachedRawSnapshot = serialized;
    cachedParsedSnapshot = nextPayload;
    window.dispatchEvent(new Event(CMS_CHANGE_EVENT));
  } catch {
    // Abaikan bila localStorage tidak tersedia
  }
}

function getServerSnapshot(): StoredCmsPayload {
  return SERVER_SNAPSHOT;
}

function subscribeToCmsStore(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };
  const handleInternalChange = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CMS_CHANGE_EVENT, handleInternalChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CMS_CHANGE_EVENT, handleInternalChange);
  };
}

const subscribeHydration = () => () => {};

interface AdminCmsContextValue {
  landingContent: LandingPageContent;
  teamContent: TeamPageContent;
  adminEmail: string;
  isHydrated: boolean;
  toast: AdminToastState | null;
  showToast: (type: "success" | "error", message: string) => void;
  dismissToast: () => void;
  updateAdminEmail: (email: string) => void;
  updateSiteSettings: (settings: SiteSettingsContent) => void;
  updateHero: (hero: HeroContent) => void;
  updateMarquee: (marquee: MarqueeContent) => void;
  updateAbout: (about: AboutContent) => void;
  updateDivisions: (divisions: DivisionCardContent[]) => void;
  updateServices: (services: ServicesSectionContent) => void;
  updateFaq: (faq: FaqSectionContent) => void;
  updateContact: (contact: ContactSectionContent) => void;
  updateTeamHeader: (
    header: Pick<TeamPageContent, "titleLine1" | "titleLine2" | "subtitle">
  ) => void;
  upsertTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (memberId: string) => void;
  resetAllToDefault: () => void;
}

const AdminCmsContext = createContext<AdminCmsContextValue | null>(null);

export interface AdminCmsProviderProps {
  children: React.ReactNode;
  initialLandingContent?: LandingPageContent;
  initialTeamContent?: TeamPageContent;
  initialAdminEmail?: string;
}

export function AdminCmsProvider({
  children,
  initialLandingContent,
  initialTeamContent,
  initialAdminEmail,
}: AdminCmsProviderProps) {
  const store = useSyncExternalStore(
    subscribeToCmsStore,
    getClientSnapshot,
    getServerSnapshot
  );
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false
  );
  const [toast, setToast] = useState<AdminToastState | null>(null);

  // Sinkronisasi otoritatif dengan data server PostgreSQL saat inisialisasi
  useEffect(() => {
    if (initialLandingContent && initialTeamContent) {
      const payload: StoredCmsPayload = {
        landingContent: initialLandingContent,
        teamContent: initialTeamContent,
        adminEmail: initialAdminEmail || DEFAULT_ADMIN_EMAIL,
      };
      try {
        const serialized = JSON.stringify(payload);
        window.localStorage.setItem(STORAGE_KEY, serialized);
        cachedRawSnapshot = serialized;
        cachedParsedSnapshot = payload;
        window.dispatchEvent(new Event(CMS_CHANGE_EVENT));
      } catch {
        // Abaikan bila localStorage tidak tersedia
      }
    }
  }, [initialLandingContent, initialTeamContent, initialAdminEmail]);

  useEffect(() => {
    if (!toast || toast.type === "error") return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ id: Date.now(), type, message });
    },
    []
  );

  const dismissToast = useCallback(() => setToast(null), []);

  const persistStore = useCallback(
    (nextPayload: StoredCmsPayload, successMessage?: string) => {
      try {
        const serialized = JSON.stringify(nextPayload);
        window.localStorage.setItem(STORAGE_KEY, serialized);
        cachedRawSnapshot = serialized;
        cachedParsedSnapshot = nextPayload;
        window.dispatchEvent(new Event(CMS_CHANGE_EVENT));
        if (successMessage) {
          showToast("success", successMessage);
        }
      } catch {
        showToast(
          "error",
          "Gagal menyimpan draft perubahan ke penyimpanan lokal."
        );
      }
    },
    [showToast]
  );

  const saveLandingSection = useCallback(
    <K extends keyof LandingPageContent>(
      key: K,
      value: LandingPageContent[K],
      successMessage: string
    ) => {
      const current = getClientSnapshot();
      persistStore(
        {
          ...current,
          landingContent: { ...current.landingContent, [key]: value },
        },
        successMessage
      );

      // Sinkronisasi permanen ke basis data via Server Action
      updateLandingSectionAction(key, value).then((res) => {
        if (!res.success) {
          showToast(
            "error",
            res.error.message || `Gagal menyimpan seksi ${String(key)} ke database.`
          );
        }
      });
    },
    [persistStore, showToast]
  );

  const updateAdminEmail = useCallback(
    (email: string) => {
      const trimmed = email.trim();
      if (!trimmed) return;
      const current = getClientSnapshot();
      persistStore(
        {
          ...current,
          adminEmail: trimmed,
        },
        "Kredensial administrator berhasil diperbarui."
      );
    },
    [persistStore]
  );

  const updateSiteSettings = useCallback(
    (settings: SiteSettingsContent) => {
      saveLandingSection(
        "siteSettings",
        settings,
        "Pengaturan situs & kontak resmi berhasil diperbarui."
      );
      updateSiteSettingsAction(settings).then((res) => {
        if (!res.success) {
          showToast("error", res.error.message);
        }
      });
    },
    [saveLandingSection, showToast]
  );

  const updateHero = useCallback(
    (hero: HeroContent) =>
      saveLandingSection("hero", hero, "Konten Hero section berhasil disimpan."),
    [saveLandingSection]
  );

  const updateMarquee = useCallback(
    (marquee: MarqueeContent) =>
      saveLandingSection("marquee", marquee, "Label marquee berhasil disimpan."),
    [saveLandingSection]
  );

  const updateAbout = useCallback(
    (about: AboutContent) =>
      saveLandingSection("about", about, "Konten Tentang Creatify berhasil disimpan."),
    [saveLandingSection]
  );

  const updateDivisions = useCallback(
    (divisions: DivisionCardContent[]) =>
      saveLandingSection("divisions", divisions, "Kartu 3 divisi berhasil disimpan."),
    [saveLandingSection]
  );

  const updateServices = useCallback(
    (services: ServicesSectionContent) =>
      saveLandingSection("services", services, "Konten Karya Kami berhasil disimpan."),
    [saveLandingSection]
  );

  const updateFaq = useCallback(
    (faq: FaqSectionContent) =>
      saveLandingSection("faq", faq, "Daftar pertanyaan FAQ berhasil disimpan."),
    [saveLandingSection]
  );

  const updateContact = useCallback(
    (contact: ContactSectionContent) =>
      saveLandingSection(
        "contact",
        contact,
        "Konten Rekrutmen & Footer berhasil disimpan."
      ),
    [saveLandingSection]
  );

  const updateTeamHeader = useCallback(
    (header: Pick<TeamPageContent, "titleLine1" | "titleLine2" | "subtitle">) => {
      const current = getClientSnapshot();
      persistStore(
        {
          ...current,
          teamContent: { ...current.teamContent, ...header },
        },
        "Header halaman Tim berhasil disimpan."
      );

      updateTeamHeaderAction(header).then((res) => {
        if (!res.success) {
          showToast("error", res.error.message);
        }
      });
    },
    [persistStore, showToast]
  );

  const upsertTeamMember = useCallback(
    (member: TeamMember) => {
      const current = getClientSnapshot();
      const exists = current.teamContent.members.some(
        (item) => item.id === member.id
      );
      const nextMembers = exists
        ? current.teamContent.members.map((item) =>
            item.id === member.id ? member : item
          )
        : [member, ...current.teamContent.members];

      persistStore(
        {
          ...current,
          teamContent: { ...current.teamContent, members: nextMembers },
        },
        `Profil ${member.name} berhasil disimpan.`
      );

      upsertTeamMemberAction({
        id: member.id,
        name: member.name,
        role: member.role,
        divisionId: member.divisionId,
        photo: member.photo,
        avatar: member.avatar,
        quoteText: member.quoteText,
        instagramUrl: member.instagramUrl,
        isLeader: Boolean(member.isLeader),
      }).then((res) => {
        if (!res.success) {
          showToast("error", res.error.message);
        } else if (res.data) {
          const saved = res.data;
          const fresh = getClientSnapshot();
          const updated = fresh.teamContent.members.map((m) =>
            m.id === member.id || m.name === saved.name ? saved : m
          );
          persistStore({
            ...fresh,
            teamContent: { ...fresh.teamContent, members: updated },
          });
        }
      });
    },
    [persistStore, showToast]
  );

  const deleteTeamMember = useCallback(
    (memberId: string) => {
      const current = getClientSnapshot();
      const target = current.teamContent.members.find(
        (item) => item.id === memberId
      );
      persistStore(
        {
          ...current,
          teamContent: {
            ...current.teamContent,
            members: current.teamContent.members.filter(
              (item) => item.id !== memberId
            ),
          },
        },
        target
          ? `${target.name} dihapus dari daftar tim.`
          : "Anggota tim berhasil dihapus."
      );

      deleteTeamMemberAction(memberId).then((res) => {
        if (!res.success) {
          showToast("error", res.error.message);
        }
      });
    },
    [persistStore, showToast]
  );

  const resetAllToDefault = useCallback(() => {
    resetAllToDefaultAction().then((res) => {
      if (!res.success) {
        showToast("error", res.error.message);
      } else {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
          cachedRawSnapshot = null;
          cachedParsedSnapshot = SERVER_SNAPSHOT;
          window.dispatchEvent(new Event(CMS_CHANGE_EVENT));
          showToast("success", "Seluruh konten dikembalikan ke data bawaan database.");
        } catch {
          showToast("error", "Gagal mereset penyimpanan lokal.");
        }
      }
    });
  }, [showToast]);

  const contextValue = useMemo<AdminCmsContextValue>(
    () => ({
      landingContent: store.landingContent,
      teamContent: store.teamContent,
      adminEmail: store.adminEmail,
      isHydrated,
      toast,
      showToast,
      dismissToast,
      updateAdminEmail,
      updateSiteSettings,
      updateHero,
      updateMarquee,
      updateAbout,
      updateDivisions,
      updateServices,
      updateFaq,
      updateContact,
      updateTeamHeader,
      upsertTeamMember,
      deleteTeamMember,
      resetAllToDefault,
    }),
    [
      store.landingContent,
      store.teamContent,
      store.adminEmail,
      isHydrated,
      toast,
      showToast,
      dismissToast,
      updateAdminEmail,
      updateSiteSettings,
      updateHero,
      updateMarquee,
      updateAbout,
      updateDivisions,
      updateServices,
      updateFaq,
      updateContact,
      updateTeamHeader,
      upsertTeamMember,
      deleteTeamMember,
      resetAllToDefault,
    ]
  );

  return (
    <AdminCmsContext.Provider value={contextValue}>
      {children}
    </AdminCmsContext.Provider>
  );
}

export function useAdminCms() {
  const ctx = useContext(AdminCmsContext);
  if (!ctx) {
    throw new Error("useAdminCms harus digunakan di dalam AdminCmsProvider.");
  }
  return ctx;
}
