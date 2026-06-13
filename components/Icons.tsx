import {
  LayoutDashboard,
  Users,
  ListChecks,
  FileText,
  Sparkles,
  Settings,
  ClipboardCheck,
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  Pencil,
  Send,
  Globe2,
  AlertTriangle,
  Check,
  LogOut,
  type LucideIcon,
} from "lucide-react";

// Enterprise icon style guide: size 20, strokeWidth 1.75, inherits currentColor
// so each icon adopts the colour of its surrounding context (muted slate by
// default, white inside primary buttons, navy/green inside tinted chips).
const ICON_SIZE = 20;
const ICON_STROKE = 1.75;

function make(Cmp: LucideIcon) {
  return <Cmp size={ICON_SIZE} strokeWidth={ICON_STROKE} />;
}

export const Icon = {
  Dashboard: make(LayoutDashboard),
  People: make(Users),
  Tasks: make(ListChecks),
  Docs: make(FileText),
  AI: make(Sparkles),
  Settings: make(Settings),
  Checklist: make(ClipboardCheck),
  Plus: make(Plus),
  Search: make(Search),
  Download: make(Download),
  Upload: make(Upload),
  Trash: make(Trash2),
  Edit: make(Pencil),
  Send: make(Send),
  Sparkle: make(Sparkles),
  Globe: make(Globe2),
  Alert: make(AlertTriangle),
  Check: make(Check),
  SignOut: make(LogOut),
};

// Re-export the raw components for cases that need a custom size/stroke.
export {
  LayoutDashboard,
  Users,
  ListChecks,
  FileText,
  Sparkles,
  Settings,
  ClipboardCheck,
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  Pencil,
  Send,
  Globe2,
  AlertTriangle,
  Check,
  LogOut,
};
