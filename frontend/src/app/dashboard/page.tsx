"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  Users,
  Calendar,
  Activity,
  Flame,
  TrendingUp,
  Award,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Bell,
  Clock,
  ChevronLeft,
  ChevronDown,
  Search,
  Plus,
  Globe,
  Palette,
  Server,
  FileCode,
  CheckCircle2,
  Save,
  Sliders,
  Image as ImageIcon,
  FolderOpen,
  Upload,
  Edit3,
  BookOpen,
  PhoneCall,
  Phone,
  Check,
  X,
  XCircle,
  Eye,
  Trash2,
  Trophy,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  MessageCircle,
  CornerDownLeft,
  Send,
  Star,
  CheckCircle,
  UserPlus,
  UserCog,
  KeyRound,
  Mail,
  FileCheck,
  RefreshCw,
  Download,
  AlertTriangle,
  Camera,
  Utensils,
  FileText,
  Copy,
  PlusCircle,
  CheckSquare,
  Square,
  Coffee,
  Apple,
  Moon,
  Zap,
  Filter,
  Sunrise,
  Calculator,
  Scale,
  TrendingDown,
  Percent,
  ChevronUp,
  Video,
  File,
} from "lucide-react";
import MediaPickerModal from "@/components/MediaPickerModal";
import PackagesManager from "@/components/PackagesManager";
import TiptapArticleEditor from "@/components/TiptapArticleEditor";
import BlogSeoPanel from "@/components/BlogSeoPanel";
import BlogFaqEditor, { parseFaqItems, type FaqItem } from "@/components/BlogFaqEditor";
import BlogCoverField from "@/components/BlogCoverField";

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number | string;
  reps: string;
  rest?: string;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  dayTitle: string;
  exercises: WorkoutExercise[];
}

const getDefaultSplitDays = (daysCount: number = 4): WorkoutDay[] => {
  const templates: WorkoutDay[] = [
    {
      id: "day-1",
      dayTitle: "روز اول: عضلات سینه و پشت بازو",
      exercises: [
        { id: "e-1-1", name: "پرس بالا سینه هالتر", sets: 4, reps: "8-10", rest: "90 ثانیه", notes: "تمرکز روی بخش منفی حرکت" },
        { id: "e-1-2", name: "پرس سینه دمبل موازی", sets: 4, reps: "10-12", rest: "75 ثانیه", notes: "" },
        { id: "e-1-3", name: "قفسه سینه سیم‌کش (کراس‌اور)", sets: 3, reps: "15", rest: "60 ثانیه", notes: "مکث ۲ ثانیه‌ای در انقباض قله" },
        { id: "e-1-4", name: "پشت بازو سیم‌کش طناب", sets: 4, reps: "12-15", rest: "60 ثانیه", notes: "" },
        { id: "e-1-5", name: "پشت بازو هالتر خوابیده (جمجمه شکن)", sets: 3, reps: "10", rest: "60 ثانیه", notes: "" },
      ],
    },
    {
      id: "day-2",
      dayTitle: "روز دوم: عضلات پشت، زیربغل و جلو بازو",
      exercises: [
        { id: "e-2-1", name: "بارفیکس دست باز", sets: 4, reps: "8-10", rest: "90 ثانیه", notes: "در صورت نیاز با کش کمکی" },
        { id: "e-2-2", name: "زیربغل هالتر خم دست برعکس", sets: 4, reps: "10", rest: "75 ثانیه", notes: "" },
        { id: "e-2-3", name: "لت سیم‌کش از جلو با مکث", sets: 4, reps: "12", rest: "60 ثانیه", notes: "" },
        { id: "e-2-4", name: "جلو بازو هالتر ایستاده EZ", sets: 4, reps: "10", rest: "60 ثانیه", notes: "" },
        { id: "e-2-5", name: "جلو بازو دمبل چکشی روی میز شیب‌دار", sets: 3, reps: "12", rest: "60 ثانیه", notes: "" },
      ],
    },
    {
      id: "day-3",
      dayTitle: "روز سوم: عضلات سرشانه و کول",
      exercises: [
        { id: "e-3-1", name: "پرس سرشانه دمبل نشسته", sets: 4, reps: "8-10", rest: "90 ثانیه", notes: "" },
        { id: "e-3-2", name: "نشر جانب دمبل", sets: 5, reps: "12-15", rest: "60 ثانیه", notes: "ست آخر دراپ‌ست" },
        { id: "e-3-3", name: "فیس‌پول سیم‌کش", sets: 4, reps: "15", rest: "60 ثانیه", notes: "تقویت دلتوئید خلفی" },
        { id: "e-3-4", name: "شراگ با دمبل سنگین", sets: 4, reps: "12-15", rest: "60 ثانیه", notes: "مکث ۲ ثانیه‌ای در بالا" },
      ],
    },
    {
      id: "day-4",
      dayTitle: "روز چهارم: عضلات چهارسر ران، همسترینگ و شکم",
      exercises: [
        { id: "e-4-1", name: "اسکوات هالتر از پشت یا پرس پا", sets: 4, reps: "8-10", rest: "90-120 ثانیه", notes: "دامنه حرکتی کامل" },
        { id: "e-4-2", name: "جلو ران دستگاه", sets: 3, reps: "15", rest: "60 ثانیه", notes: "" },
        { id: "e-4-3", name: "پشت ران دستگاه خوابیده", sets: 4, reps: "12", rest: "60 ثانیه", notes: "" },
        { id: "e-4-4", name: "ساق پا ایستاده دستگاه", sets: 4, reps: "20", rest: "45 ثانیه", notes: "" },
        { id: "e-4-5", name: "کرانچ سیم‌کش زانوزده", sets: 4, reps: "20", rest: "45 ثانیه", notes: "" },
      ],
    },
    {
      id: "day-5",
      dayTitle: "روز پنجم: میان‌تنه و هوازی اینتروال",
      exercises: [
        { id: "e-5-1", name: "پلانک روی ساعد", sets: 4, reps: "60 ثانیه", rest: "45 ثانیه", notes: "" },
        { id: "e-5-2", name: "زیرشکم خلبانی بارفیکس", sets: 4, reps: "15", rest: "45 ثانیه", notes: "" },
        { id: "e-5-3", name: "تردمیل اینتروال HIIT", sets: 1, reps: "20 دقیقه", rest: "-", notes: "۱ دقیقه تند، ۱ دقیقه کند" },
      ],
    },
  ];

  const count = Math.max(1, Math.min(daysCount || 4, templates.length));
  return templates.slice(0, count);
};

const generateTextFromDays = (days: WorkoutDay[]): string => {
  return days
    .map((day) => {
      const exLines = day.exercises
        .map((ex, i) => {
          let line = `${i + 1}. ${ex.name} | ${ex.sets} ست × ${ex.reps} تکرار`;
          if (ex.rest) line += ` (استراحت: ${ex.rest})`;
          if (ex.notes) line += ` [نکته: ${ex.notes}]`;
          return line;
        })
        .join("\n");
      return `### ${day.dayTitle}\n${exLines}`;
    })
    .join("\n\n");
};

const parseWorkoutContent = (content: string | undefined | null, defaultDaysCount: number = 4): WorkoutDay[] => {
  if (!content || !content.trim()) {
    return getDefaultSplitDays(defaultDaysCount);
  }

  const trimmed = content.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed.days) && parsed.days.length > 0) {
        return parsed.days;
      }
    } catch (e) {
      // not JSON, continue to line parsing
    }
  }

  const lines = trimmed.split("\n");
  const parsedDays: WorkoutDay[] = [];
  let currentDay: WorkoutDay | null = null;
  let dayIdx = 1;
  let exIdx = 1;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("#") || line.startsWith("روز ") || line.startsWith("جلسه ")) {
      const cleanTitle = line.replace(/^[#\s\-*]+/, "").trim();
      currentDay = {
        id: `day-${dayIdx++}`,
        dayTitle: cleanTitle,
        exercises: [],
      };
      parsedDays.push(currentDay);
      exIdx = 1;
      continue;
    }

    if (!currentDay) {
      currentDay = {
        id: `day-${dayIdx++}`,
        dayTitle: "روز اول: برنامه تمرینی",
        exercises: [],
      };
      parsedDays.push(currentDay);
    }

    const cleanedLine = line.replace(/^\d+[\.\-\)]\s*/, "").replace(/^[\-*•]\s*/, "").trim();
    if (!cleanedLine) continue;

    const parts = cleanedLine.split("|").map((p) => p.trim());
    const name = parts[0] || cleanedLine;
    let sets: number | string = 4;
    let reps: string = "10-12";
    let rest = "60 ثانیه";
    let notes = "";

    if (parts[1]) {
      const meta = parts[1];
      const setMatch = meta.match(/([۰-۹0-9]+)\s*ست/);
      if (setMatch) sets = parseInt(setMatch[1]) || 4;
      const repMatch = meta.match(/[×xX]\s*([۰-۹0-9\-–]+)\s*تکرار/);
      if (repMatch) reps = repMatch[1];
      const restMatch = meta.match(/\(استراحت:\s*([^)]+)\)/);
      if (restMatch) rest = restMatch[1];
      const noteMatch = meta.match(/\[نکته:\s*([^\]]+)\]/);
      if (noteMatch) notes = noteMatch[1];
    }

    currentDay.exercises.push({
      id: `ex-${dayIdx}-${exIdx++}`,
      name: name,
      sets: sets,
      reps: reps,
      rest: rest,
      notes: notes,
    });
  }

  if (parsedDays.length > 0 && parsedDays.some((d) => d.exercises.length > 0)) {
    return parsedDays;
  }

  return getDefaultSplitDays(defaultDaysCount);
};

export interface DietMealCategory {
  id: string;
  title: string;
  iconName?: string;
  content: string; // متن آزاد این وعده
}

export const ZIGZAG_WEEK_DAYS = [
  { key: "sat", name: "شنبه" },
  { key: "sun", name: "یکشنبه" },
  { key: "mon", name: "دوشنبه" },
  { key: "tue", name: "سه‌شنبه" },
  { key: "wed", name: "چهارشنبه" },
  { key: "thu", name: "پنجشنبه" },
  { key: "fri", name: "جمعه" },
];

const DEFAULT_DIET_CATEGORIES: DietMealCategory[] = [
  { id: "fasting", title: "ناشتا (ابتدای صبح)", iconName: "Sunrise", content: "" },
  { id: "breakfast", title: "صبحانه", iconName: "Coffee", content: "" },
  { id: "morning_snack", title: "میان‌وعده صبح", iconName: "Apple", content: "" },
  { id: "lunch", title: "ناهار", iconName: "Utensils", content: "" },
  { id: "afternoon_snack", title: "عصرانه و قبل تمرین", iconName: "Zap", content: "" },
  { id: "post_workout", title: "بعد از تمرین", iconName: "Dumbbell", content: "" },
  { id: "dinner", title: "شام", iconName: "Moon", content: "" },
  { id: "bedtime", title: "قبل از خواب", iconName: "ShieldCheck", content: "" },
  { id: "supplements", title: "مکمل‌ها و توصیه‌های آبرسانی", iconName: "Flame", content: "" },
];

const parseDietContent = (rawText: string | undefined | null): DietMealCategory[] => {
  if (!rawText || !rawText.trim()) {
    return DEFAULT_DIET_CATEGORIES.map((c) => ({ ...c, content: "" }));
  }

  const sections: { title: string; text: string }[] = [];
  const lines = rawText.split("\n");
  let currentTitle = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const headerMatch = trimmed.match(/^(?:#{1,4}\s*|-{1,2}\s*)?([^:\n]+)[:：]\s*(.*)$/);
    if (headerMatch && !trimmed.startsWith("- ") && headerMatch[1].length < 40) {
      if (currentTitle || currentLines.length > 0) {
        sections.push({ title: currentTitle || "دستورالعمل کلی", text: currentLines.join("\n").trim() });
      }
      currentTitle = headerMatch[1].replace(/^[#\s\-_*]+/, "").trim();
      currentLines = headerMatch[2] ? [headerMatch[2]] : [];
    } else {
      currentLines.push(line);
    }
  }
  if (currentTitle || currentLines.length > 0) {
    sections.push({ title: currentTitle || "دستورالعمل کلی", text: currentLines.join("\n").trim() });
  }

  if (sections.length === 0) {
    return DEFAULT_DIET_CATEGORIES.map((c, i) => (i === 0 ? { ...c, content: rawText } : { ...c, content: "" }));
  }

  const categories: DietMealCategory[] = DEFAULT_DIET_CATEGORIES.map((cat) => {
    const match = sections.find(
      (s) =>
        s.title.includes(cat.title) ||
        cat.title.includes(s.title) ||
        (cat.id === "fasting" && (s.title.includes("ناشتا") || s.title.includes("بیدار") || s.title.includes("صبح زود") || s.title.includes("قبل از صبحانه"))) ||
        (cat.id === "breakfast" && s.title.includes("صبحانه")) ||
        (cat.id === "morning_snack" && (s.title.includes("صبح") || s.title.includes("میان‌"))) ||
        (cat.id === "lunch" && s.title.includes("ناهار")) ||
        (cat.id === "afternoon_snack" && (s.title.includes("قبل تمرین") || s.title.includes("عصر"))) ||
        (cat.id === "post_workout" && (s.title.includes("بعد") || s.title.includes("ریکاوری"))) ||
        (cat.id === "dinner" && s.title.includes("شام")) ||
        (cat.id === "bedtime" && (s.title.includes("خواب") || s.title.includes("شب"))) ||
        (cat.id === "supplements" && (s.title.includes("مکمل") || s.title.includes("آب") || s.title.includes("توصیه")))
    );
    return {
      ...cat,
      content: match ? match.text : "",
    };
  });

  for (const s of sections) {
    const isMatched = categories.some((c) => c.content === s.text);
    if (!isMatched && s.text.trim()) {
      categories.push({
        id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: s.title,
        iconName: "Utensils",
        content: s.text,
      });
    }
  }

  return categories;
};

export interface ParsedMealFields {
  items: string[];
  notes: string[];
  otherText: string;
}

export const parseMealContentFields = (content: string): ParsedMealFields => {
  if (!content || !content.trim()) {
    return { items: [], notes: [], otherText: "" };
  }

  // حذف هرگونه سطر مربوط به ارقام کالری، BMR، TDEE یا جداول زیگزاگ از دید قهرمان
  const cleanedLines = content
    .split("\n")
    .map((l) => l.trim())
    .filter((line) => {
      const lower = line.toLowerCase();
      return (
        !line.includes("کیلوکالری") &&
        !line.includes("BMR") &&
        !line.includes("TDEE") &&
        !lower.includes("kcal") &&
        !lower.includes("calorie") &&
        !line.includes("زیگزاگ") &&
        !line.includes("کسری کالری") &&
        !line.includes("مازاد کالری")
      );
    });

  const items: string[] = [];
  const notes: string[] = [];
  const otherLines: string[] = [];

  for (const line of cleanedLines) {
    if (!line) continue;
    // تشخیص آیتم‌های لیست یا خطوط بولت‌دار (- آیتم یا * آیتم یا ۱- آیتم)
    const bulletMatch = line.match(/^[-*•\u2022\u25cf]\s*(.+)$/) || line.match(/^(\d+|[۰-۹]+)[\.\-\)]\s*(.+)$/);
    if (bulletMatch) {
      items.push(bulletMatch[bulletMatch.length - 1].trim());
    } else if (
      line.startsWith("توضیحات:") ||
      line.startsWith("توضیح:") ||
      line.startsWith("نکته:") ||
      line.startsWith("دستور:") ||
      line.startsWith("روش مصرف:") ||
      line.startsWith("راهنما:") ||
      line.startsWith("توجه:")
    ) {
      notes.push(line.replace(/^(توضیحات|توضیح|نکته|دستور|روش مصرف|راهنما|توجه)[:：]\s*/, "").trim());
    } else if (items.length > 0) {
      notes.push(line);
    } else {
      otherLines.push(line);
    }
  }

  return {
    items,
    notes,
    otherText: otherLines.join("\n").trim(),
  };
};

const generateDietTextFromCategories = (categories: DietMealCategory[]): string => {
  return categories
    .filter((c) => c.content && c.content.trim())
    .map((c) => `### ${c.title}:\n${c.content.trim()}`)
    .join("\n\n");
};

const renderMealIcon = (iconName?: string, className: string = "w-4 h-4") => {
  switch (iconName) {
    case "Sunrise":
      return <Sunrise className={className} />;
    case "Calculator":
      return <Calculator className={className} />;
    case "Scale":
      return <Scale className={className} />;
    case "Coffee":
      return <Coffee className={className} />;
    case "Apple":
      return <Apple className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Dumbbell":
      return <Dumbbell className={className} />;
    case "Moon":
      return <Moon className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Flame":
      return <Flame className={className} />;
    default:
      return <Utensils className={className} />;
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<"superadmin" | "admin" | "student">("admin");
  const [userName, setUserName] = useState("احسان ناظری");
  const [userEmail, setUserEmail] = useState("");
  const [userRoleTitle, setUserRoleTitle] = useState("مربی ارشد بدنسازی");
  const [activeMenu, setActiveMenu] = useState("overview");
  const [isDesignSubmenuOpen, setIsDesignSubmenuOpen] = useState(false);
  const [isProgrammingSubmenuOpen, setIsProgrammingSubmenuOpen] = useState(false);

  useEffect(() => {
    if (
      activeMenu.startsWith("hero") ||
      activeMenu.startsWith("about") ||
      activeMenu === "packages-cms" ||
      activeMenu === "theme-colors"
    ) {
      setIsDesignSubmenuOpen(true);
    }
    if (activeMenu === "plan-orders" || activeMenu === "plan-builder") {
      setIsProgrammingSubmenuOpen(true);
    }
  }, [activeMenu]);

  // Plan Orders (Student Intake & Coach Review) State
  const [userPlanOrders, setUserPlanOrders] = useState<any[]>([]);
  const [allPlanOrders, setAllPlanOrders] = useState<any[]>([]);
  const [selectedOrderForFeedback, setSelectedOrderForFeedback] = useState<any>(null);
  const [orderFeedbackText, setOrderFeedbackText] = useState("");
  const [orderStatusSelection, setOrderStatusSelection] = useState("preparing");
  const [orderWorkoutFile, setOrderWorkoutFile] = useState("");
  const [orderDietFile, setOrderDietFile] = useState("");

  // Student Edit Plan Order State
  const [editingPlanOrder, setEditingPlanOrder] = useState<any | null>(null);
  const [editOrderForm, setEditOrderForm] = useState<any>({
    age: 25,
    height: 175,
    weight: 75,
    primary_goal: "hypertrophy",
    training_location: "gym",
    experience_level: "intermediate",
    days_per_week: "4",
    injuries: "",
    dietary_restrictions: "",
    coach_notes: "",
  });
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [orderUpdateSuccessNotice, setOrderUpdateSuccessNotice] = useState(false);

  // Plan Builder (میز کار برنامه‌نویسی مربی) State
  const [builderOrder, setBuilderOrder] = useState<any | null>(null);
  const [builderWorkoutText, setBuilderWorkoutText] = useState("");
  const [builderDietText, setBuilderDietText] = useState("");
  const [builderFeedback, setBuilderFeedback] = useState("");
  const [builderStatus, setBuilderStatus] = useState("preparing");
  const [builderWorkoutFile, setBuilderWorkoutFile] = useState("");
  const [builderDietFile, setBuilderDietFile] = useState("");
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [planSaveNotice, setPlanSaveNotice] = useState(false);
  const [builderActiveTab, setBuilderActiveTab] = useState<"workout" | "diet" | "feedback" | "files">("workout");
  const [builderPreviewPhoto, setBuilderPreviewPhoto] = useState<string | null>(null);
  const [orderFilterTab, setOrderFilterTab] = useState<"active" | "archived" | "all">("active");

  // Structured Workout Builder & Student States
  const [builderDays, setBuilderDays] = useState<WorkoutDay[]>([]);
  const [builderActiveDayIndex, setBuilderActiveDayIndex] = useState(0);
  const [builderWorkoutMode, setBuilderWorkoutMode] = useState<"table" | "text">("table");
  const [studentActiveDayIndex, setStudentActiveDayIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // Diet Builder & Student Diet States (متن آزاد با فیلتربندی وعده‌ها)
  const [builderDietCategories, setBuilderDietCategories] = useState<DietMealCategory[]>(DEFAULT_DIET_CATEGORIES);
  const [builderActiveDietFilter, setBuilderActiveDietFilter] = useState<string>("all");
  const [builderDietMode, setBuilderDietMode] = useState<"filtered" | "unified">("filtered");
  const [newCustomMealTitle, setNewCustomMealTitle] = useState("");
  const [isAddingCustomMeal, setIsAddingCustomMeal] = useState(false);
  const [studentDietFilter, setStudentDietFilter] = useState<string>("all");

  // Calorie & Zigzag Calculator States (محاسبه خودکار مصرف کالری و رژیم زیگزاگی)
  const [calorieWeight, setCalorieWeight] = useState<number>(75);
  const [calorieHeight, setCalorieHeight] = useState<number>(178);
  const [calorieAge, setCalorieAge] = useState<number>(26);
  const [calorieGender, setCalorieGender] = useState<"male" | "female">("male");
  const [calorieActivity, setCalorieActivity] = useState<"sedentary" | "light" | "moderate" | "heavy" | "athlete">("moderate");
  const [calorieGoal, setCalorieGoal] = useState<"cut" | "bulk" | "recomp" | "custom">("cut");
  const [calorieCustomTarget, setCalorieCustomTarget] = useState<number>(0);
  const [calorieZigzagMethod, setCalorieZigzagMethod] = useState<"2high" | "workout" | "alternate" | "linear">("2high");
  const [zigzagHighDays, setZigzagHighDays] = useState<string[]>(["sat", "tue"]); // شنبه و سه‌شنبه پیش‌فرض ۲ روز پرکالری
  const [isCalorieCalculatorOpen, setIsCalorieCalculatorOpen] = useState<boolean>(false);
  const [calorieInsertSuccess, setCalorieInsertSuccess] = useState<boolean>(false);

  // Media Picker Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<"hero" | "about" | "student" | "blog-cover" | "blog-editor">("student");
  const [insertedBlogEditorImage, setInsertedBlogEditorImage] = useState<string | null>(null);

  // Users Management State (Admin & Supervisor)
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userFilter, setUserFilter] = useState<"all" | "admin" | "student">("all");
  const [userSearch, setUserSearch] = useState("");
  const [userViewMode, setUserViewMode] = useState<"list" | "form">("list");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState<any>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
    is_active: true,
  });
  const [userSavedNotice, setUserSavedNotice] = useState(false);

  // Blog Management State (Admin & Supervisor)
  const [blogPostsList, setBlogPostsList] = useState<any[]>([]);
  const [blogCategoriesList, setBlogCategoriesList] = useState<any[]>([]);
  const [blogViewMode, setBlogViewMode] = useState<"list" | "form" | "categories">("list");
  const [editingBlogPostId, setEditingBlogPostId] = useState<number | null>(null);

  // Blog Comments Moderation State
  const [blogCommentsList, setBlogCommentsList] = useState<any[]>([]);
  const [blogCommentFilter, setBlogCommentFilter] = useState<"all" | "pending" | "approved">("all");
  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("استاد احسان ناظری");
  const [blogSearch, setBlogSearch] = useState("");
  const [blogForm, setBlogForm] = useState<any>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    category: "علم تمرین و فیزیولوژی",
    author_name: "استاد احسان ناظری",
    author_role: "مربی ارشد بدنسازی",
    read_time: "۶ دقیقه مطالعه",
    image_url: "",
    image_alt: "",
    tags: "هایپرتروفی, بدنسازی علمی, تمرینات قدرتی",
    meta_title: "",
    meta_description: "",
    focus_keyword: "",
    faq_title: "",
    faq_items: [] as FaqItem[],
    is_published: true,
  });
  const [blogSavedNotice, setBlogSavedNotice] = useState(false);

  // New Category Form state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");

  // Students Management State (Admin & Supervisor)
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentViewMode, setStudentViewMode] = useState<"list" | "form">("list");
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [studentForm, setStudentForm] = useState<any>({
    slug: "",
    full_name: "",
    phone: "",
    email: "",
    category: "فیزیک کلاسیک",
    package_name: "پکیج جامع VIP + آمادگی استیج",
    duration: "۱۲ ماه",
    image_url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    initial_weight: 90,
    current_weight: 78,
    target_weight: 75,
    height: 180,
    age: 26,
    body_fat: 7,
    medals: "",
    bio: "",
    coach_notes: "",
    status: "active",
    is_champion: true,
  });
  const [studentSavedNotice, setStudentSavedNotice] = useState(false);

  // Testimonials State (Admin & Supervisor)
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [testimonialFilter, setTestimonialFilter] = useState<"all" | "pending" | "approved">("all");

  // SEO State for Supervisor
  const [seoConfig, setSeoConfig] = useState({
    meta_title: "آکادمی مربیگری و بدنسازی ناظری | دریافت برنامه تمرینی و غذایی آنلاین",
    meta_desc: "طراحی علمی برنامه‌های بدنسازی، فیتنس و تغذیه اختصاصی همراه با مربیگری و پشتیبانی هفتگی توسط احسان ناظری",
    keywords: "برنامه بدنسازی, مربی آنلاین, رژیم غذایی فیتنس, لاغری و عضله سازی, احسان ناظری",
    canonical_url: "https://nazeri.fit",
    robots_index: true,
    google_analytics_id: "G-NZR2026FIT",
  });
  const [seoSaved, setSeoSaved] = useState(false);

  // Hero Slides State for CMS
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<number>(1);
  const [currentSlideForm, setCurrentSlideForm] = useState<any>({
    title_prefix: "",
    title_highlight: "",
    description: "",
    primary_btn_text: "",
    primary_btn_href: "",
    secondary_btn_text: "",
    secondary_btn_href: "",
    image_url: "",
    is_active: true,
  });
  const [heroSaved, setHeroSaved] = useState(false);

  // About Section State for CMS
  const [aboutForm, setAboutForm] = useState<any>({
    title_prefix: "",
    title_highlight: "",
    paragraph1: "",
    paragraph2: "",
    coach_name: "",
    coach_role: "",
    experience_badge: "",
    coach_image_url: "",
    card1_title: "",
    card1_desc: "",
    card2_title: "",
    card2_desc: "",
    card3_title: "",
    card3_desc: "",
    card4_title: "",
    card4_desc: "",
    btn_text: "",
    btn_href: "",
  });
  const [aboutSaved, setAboutSaved] = useState(false);

  // Consultation Requests State
  const [consultationList, setConsultationList] = useState<any[]>([]);
  const [consultFilter, setConsultFilter] = useState<"all" | "pending" | "contacted">("all");

  // Media Library list & Management State
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [selectedMediaFile, setSelectedMediaFile] = useState<any | null>(null);
  const [mediaSearchQuery, setMediaSearchQuery] = useState("");
  const [mediaFilterType, setMediaFilterType] = useState<"all" | "image" | "video" | "document">("all");
  const [mediaSeoEditForm, setMediaSeoEditForm] = useState({
    file_name: "",
    alt_text: "",
    title: "",
    caption: "",
  });
  const [isSavingMediaSeo, setIsSavingMediaSeo] = useState(false);
  const [mediaSeoNotice, setMediaSeoNotice] = useState(false);
  const [isUploadingMediaFile, setIsUploadingMediaFile] = useState(false);
  const [mediaUploadSuccessNotice, setMediaUploadSuccessNotice] = useState(false);
  const [copiedMediaUrlId, setCopiedMediaUrlId] = useState<number | null>(null);
  const [isDeletingMediaFile, setIsDeletingMediaFile] = useState(false);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectMediaForDetail = (item: any) => {
    setSelectedMediaFile(item);
    setMediaSeoEditForm({
      file_name: item.file_name || "",
      alt_text: item.alt_text || "",
      title: item.title || "",
      caption: item.caption || "",
    });
  };

  const handleSaveMediaSeo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedMediaFile) return;
    setIsSavingMediaSeo(true);
    try {
      const res = await fetch(`https://fitbynazeri.com/api/media/${selectedMediaFile.id}/seo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mediaSeoEditForm),
      });
      const data = await res.json();
      if (res.ok && data.media) {
        setMediaSeoNotice(true);
        setSelectedMediaFile(data.media);
        setMediaItems((prev) =>
          prev.map((m) => (m.id === selectedMediaFile.id ? data.media : m))
        );
        setTimeout(() => setMediaSeoNotice(false), 3000);
      }
    } catch (err) {
      console.error("Error saving media SEO:", err);
    } finally {
      setIsSavingMediaSeo(false);
    }
  };

  const handleUploadMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMediaFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://fitbynazeri.com/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.media) {
        setMediaItems((prev) => [data.media, ...prev]);
        handleSelectMediaForDetail(data.media);
        setMediaUploadSuccessNotice(true);
        setTimeout(() => setMediaUploadSuccessNotice(false), 3000);
      }
    } catch (err) {
      console.error("Error uploading media:", err);
    } finally {
      setIsUploadingMediaFile(false);
      if (mediaFileInputRef.current) mediaFileInputRef.current.value = "";
    }
  };

  const handleDeleteMediaFile = async (id: number) => {
    if (!confirm("آیا از حذف این فایل از آرشیو رسانه اطمینان دارید؟")) return;
    setIsDeletingMediaFile(true);
    try {
      const res = await fetch(`https://fitbynazeri.com/api/media/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMediaItems((prev) => prev.filter((m) => m.id !== id));
        if (selectedMediaFile?.id === id) {
          setSelectedMediaFile(null);
        }
      }
    } catch (err) {
      console.error("Error deleting media:", err);
    } finally {
      setIsDeletingMediaFile(false);
    }
  };

  const handleCopyMediaUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedMediaUrlId(id);
    setTimeout(() => setCopiedMediaUrlId(null), 2500);
  };

  const fetchStudents = () => {
    fetch("https://fitbynazeri.com/api/students")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.students) {
          setStudentsList(data.students);
        }
      })
      .catch((err) => console.error("Could not fetch students:", err));
  };

  const fetchTestimonials = () => {
    fetch("https://fitbynazeri.com/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.testimonials) {
          setTestimonialsList(data.testimonials);
        }
      })
      .catch((err) => console.error("Could not fetch testimonials:", err));
  };

  const fetchHeroSlides = () => {
    fetch("https://fitbynazeri.com/api/hero-slides")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.slides) {
          setHeroSlides(data.slides);
          const found = data.slides.find((s: any) => s.id === selectedSlideId) || data.slides[0];
          if (found) {
            setSelectedSlideId(found.id);
            setCurrentSlideForm(found);
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchAboutData = () => {
    fetch("https://fitbynazeri.com/api/about-section")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.about) {
          setAboutForm(data.about);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchConsultations = () => {
    fetch("https://fitbynazeri.com/api/consultations")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.requests) {
          setConsultationList(data.requests);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleToggleConsultStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "contacted" : "pending";
    try {
      const res = await fetch(`https://fitbynazeri.com/api/consultations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setConsultationList((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBlogPosts = () => {
    fetch("https://fitbynazeri.com/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.posts) {
          setBlogPostsList(data.posts);
        }
      })
      .catch((err) => console.error("Could not fetch blog posts:", err));
  };

  const fetchBlogCategories = () => {
    fetch("https://fitbynazeri.com/api/blog-categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.categories) {
          setBlogCategoriesList(data.categories);
        }
      })
      .catch((err) => console.error("Could not fetch blog categories:", err));
  };

  const fetchBlogComments = () => {
    fetch("https://fitbynazeri.com/api/blog-comments")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.comments) {
          setBlogCommentsList(data.comments);
        }
      })
      .catch((err) => console.error("Could not fetch blog comments:", err));
  };

  const fetchUsers = () => {
    fetch("https://fitbynazeri.com/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.users) {
          setUsersList(data.users);
        }
      })
      .catch((err) => console.error("Could not fetch users:", err));
  };

  const handleOpenNewUser = () => {
    setEditingUserId(null);
    setUserForm({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role: "student",
      is_active: true,
    });
    setUserViewMode("form");
  };

  const handleEditUser = (u: any) => {
    setEditingUserId(u.id);
    setUserForm({
      full_name: u.full_name,
      email: u.email,
      phone: u.phone,
      password: "",
      role: u.role,
      is_active: u.is_active,
    });
    setUserViewMode("form");
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUserId
        ? `https://fitbynazeri.com/api/users/${editingUserId}`
        : "https://fitbynazeri.com/api/users";
      const method = editingUserId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUserSavedNotice(true);
        fetchUsers();
        setTimeout(() => {
          setUserSavedNotice(false);
          setUserViewMode("list");
        }, 1200);
      } else {
        alert(data.message || "خطا در ذخیره اطلاعات کاربر");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("آیا از حذف این کاربر اطمینان دارید؟ این عملیات قابل بازگشت نیست.")) return;
    try {
      const res = await fetch(`https://fitbynazeri.com/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsersList((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleUserActive = async (u: any) => {
    try {
      const res = await fetch(`https://fitbynazeri.com/api/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !u.is_active }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBlogCommentStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "approved" ? "pending" : "approved";
    try {
      const res = await fetch(`https://fitbynazeri.com/api/blog-comments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchBlogComments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReplyBlogComment = async (id: number) => {
    if (!replyText) return;
    try {
      const res = await fetch(`https://fitbynazeri.com/api/blog-comments/${id}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: replyText,
          reply_author: replyAuthor || "استاد احسان ناظری",
        }),
      });
      if (res.ok) {
        setReplyingCommentId(null);
        setReplyText("");
        fetchBlogComments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPlanOrders = (email: string) => {
    if (!email) return;
    fetch(`https://fitbynazeri.com/api/plan-orders/user/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.orders) {
          setUserPlanOrders(data.orders);
        }
      })
      .catch((err) => console.error("Could not fetch user plan orders:", err));
  };

  const fetchAllPlanOrders = () => {
    fetch("https://fitbynazeri.com/api/plan-orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.orders) {
          setAllPlanOrders(data.orders);
        }
      })
      .catch((err) => console.error("Could not fetch all plan orders:", err));
  };

  const handleUpdatePlanOrderStatus = async (orderId: number) => {
    try {
      const res = await fetch(`https://fitbynazeri.com/api/plan-orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: orderStatusSelection,
          admin_feedback: orderFeedbackText,
          workout_plan_file: orderWorkoutFile,
          diet_plan_file: orderDietFile,
        }),
      });

      if (res.ok) {
        fetchAllPlanOrders();
        if (userEmail) fetchPlanOrders(userEmail);
        setSelectedOrderForFeedback(null);
        setOrderFeedbackText("");
        setOrderWorkoutFile("");
        setOrderDietFile("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePlanOrder = async (orderId: number) => {
    if (!confirm("آیا از حذف این پرونده برنامه اطمینان دارید؟")) return;
    try {
      const res = await fetch(`https://fitbynazeri.com/api/plan-orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAllPlanOrders();
        if (userEmail) fetchPlanOrders(userEmail);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenEditOrder = (order: any) => {
    setEditingPlanOrder(order);
    setEditOrderForm({
      age: order.age || 25,
      height: order.height || 175,
      weight: order.weight || 75,
      primary_goal: order.primary_goal || "hypertrophy",
      training_location: order.training_location || "gym",
      experience_level: order.experience_level || "intermediate",
      days_per_week: order.days_per_week || "4",
      injuries: order.injuries || "",
      dietary_restrictions: order.dietary_restrictions || "",
      coach_notes: order.coach_notes || "",
    });
  };

  const handleSaveOrderEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlanOrder) return;
    setIsUpdatingOrder(true);
    try {
      const res = await fetch(`https://fitbynazeri.com/api/plan-orders/${editingPlanOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editOrderForm),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setUserPlanOrders((prev) => prev.map((o) => (o.id === editingPlanOrder.id ? data.order : o)));
        setAllPlanOrders((prev) => prev.map((o) => (o.id === editingPlanOrder.id ? data.order : o)));
        setOrderUpdateSuccessNotice(true);
        setTimeout(() => setOrderUpdateSuccessNotice(false), 3500);
        setEditingPlanOrder(null);
      } else {
        alert(data.message || "خطا در به‌روزرسانی اطلاعات پرونده");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در برقراری ارتباط با سرور");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Plan Builder (برنامه‌نویسی مربی) Handlers
  const handleOpenPlanBuilder = (order: any) => {
    setBuilderOrder(order);
    setBuilderWorkoutText(order.workout_plan_content || "");
    setBuilderDietText(order.diet_plan_content || "");
    const parsedDiet = parseDietContent(order.diet_plan_content);
    setBuilderDietCategories(parsedDiet);
    setBuilderActiveDietFilter("all");
    setBuilderDietMode("filtered");
    setBuilderFeedback(order.admin_feedback || "");
    setBuilderStatus(order.status || "preparing");
    setBuilderWorkoutFile(order.workout_plan_file || "");
    setBuilderDietFile(order.diet_plan_file || "");

    const daysCount = parseInt(order.days_per_week) || 4;
    const parsed = parseWorkoutContent(order.workout_plan_content, daysCount);
    setBuilderDays(parsed);
    setBuilderActiveDayIndex(0);
    setBuilderWorkoutMode("table");

    // مقداردهی خودکار محاسبه‌گر کالری از اطلاعات پرونده قهرمان
    if (order) {
      const w = parseFloat(order.weight || order.current_weight || order.initial_weight) || 75;
      const h = parseInt(order.height) || 178;
      const a = parseInt(order.age) || 26;
      const g = (order.gender === "female" || order.gender === "بانو" || order.gender === "زن") ? "female" : "male";
      setCalorieWeight(w);
      setCalorieHeight(h);
      setCalorieAge(a);
      setCalorieGender(g);

      let act: "sedentary" | "light" | "moderate" | "heavy" | "athlete" = "moderate";
      if (order.activity_level) {
        const actStr = String(order.activity_level).toLowerCase();
        if (actStr.includes("sedentary") || actStr.includes("کم")) act = "sedentary";
        else if (actStr.includes("light") || actStr.includes("سبک")) act = "light";
        else if (actStr.includes("very") || actStr.includes("high") || actStr.includes("سنگین") || actStr.includes("زیاد")) act = "heavy";
        else if (actStr.includes("athlete") || actStr.includes("حرفه")) act = "athlete";
      }
      setCalorieActivity(act);

      let goal: "cut" | "bulk" | "recomp" | "custom" = "cut";
      if (order.primary_goal) {
        const goalStr = String(order.primary_goal).toLowerCase();
        if (goalStr.includes("hypertrophy") || goalStr.includes("حجم") || goalStr.includes("عضله")) goal = "bulk";
        else if (goalStr.includes("loss") || goalStr.includes("کاهش") || goalStr.includes("چربی")) goal = "cut";
        else if (goalStr.includes("recomp") || goalStr.includes("تثبیت")) goal = "recomp";
      }
      setCalorieGoal(goal);
      setCalorieCustomTarget(0);
    }

    setActiveMenu("plan-builder");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateDietCategoryContent = (catId: string, newContent: string) => {
    setBuilderDietCategories((prev) => {
      const updated = prev.map((cat) => (cat.id === catId ? { ...cat, content: newContent } : cat));
      const syncText = generateDietTextFromCategories(updated);
      setBuilderDietText(syncText);
      return updated;
    });
  };

  const handleAddCustomDietCategory = () => {
    if (!newCustomMealTitle.trim()) return;
    const newCat: DietMealCategory = {
      id: `custom-${Date.now()}`,
      title: newCustomMealTitle.trim(),
      iconName: "Utensils",
      content: "",
    };
    setBuilderDietCategories((prev) => [...prev, newCat]);
    setBuilderActiveDietFilter(newCat.id);
    setNewCustomMealTitle("");
    setIsAddingCustomMeal(false);
  };

  const handleInsertZigzagIntoDiet = (
    bmrVal: number,
    tdeeVal: number,
    targetDaily: number,
    weeklyBudget: number,
    lowCal: number,
    highCal: number
  ) => {
    const goalTitle =
      calorieGoal === "cut"
        ? "چربی‌سوزی و کات علمی (Fat Loss)"
        : calorieGoal === "bulk"
        ? "عضله‌سازی و حجم تمیز (Lean Bulk)"
        : calorieGoal === "recomp"
        ? "تثبیت و ریکامپ بدنی (Body Recomposition)"
        : "کالری سفارشی مربی";

    const methodTitle =
      calorieZigzagMethod === "2high"
        ? "زیگزاگ ۲ روز پرکالری (High / ریفید) + ۵ روز کم‌کالری (Low)"
        : calorieZigzagMethod === "workout"
        ? "زیگزاگ روزهای تمرین بالا / روزهای استراحت پایین"
        : calorieZigzagMethod === "alternate"
        ? "زیگزاگ تناوبی یک روز در میان"
        : "کالری خطی و یکنواخت روزانه";

    let md = `### جدول و استراتژی رژیم زیگزاگی (Calorie Cycling):\n`;
    md += `• هدف دوره: ${goalTitle}\n`;
    md += `• متابولیسم پایه (BMR): ${bmrVal.toLocaleString("fa-IR")} کیلوکالری | کل مصرف روزانه (TDEE): ${tdeeVal.toLocaleString("fa-IR")} کیلوکالری\n`;
    md += `• میانگین کالری هدف: ${targetDaily.toLocaleString("fa-IR")} کیلوکالری در روز (مجموع هفتگی: ${weeklyBudget.toLocaleString("fa-IR")} kcal)\n`;
    md += `• الگوی اجرا: ${methodTitle}\n\n`;
    md += `| روز هفته | وضعیت روز | کالری هدف | پروتئین (g) | کربوهیدرات (g) | چربی (g) |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    ZIGZAG_WEEK_DAYS.forEach((d) => {
      let cal = targetDaily;
      let label = "ثابت";
      if (calorieZigzagMethod === "2high") {
        const isHigh = zigzagHighDays.includes(d.key);
        cal = isHigh ? highCal : lowCal;
        label = isHigh ? "⚡ پرکالری (ریفید)" : "📉 کم‌کالری (چربی‌سوزی)";
      } else if (calorieZigzagMethod === "workout") {
        const isTrain = ["sat", "mon", "wed", "thu"].includes(d.key);
        const tCal = Math.round(targetDaily * 1.12);
        cal = isTrain ? tCal : Math.round((weeklyBudget - 4 * tCal) / 3);
        label = isTrain ? "⚡ روز تمرین" : "📉 روز استراحت";
      } else if (calorieZigzagMethod === "alternate") {
        const isAlt = ["sat", "mon", "wed", "fri"].includes(d.key);
        const hCal = Math.round(targetDaily * 1.1);
        cal = isAlt ? hCal : Math.round((weeklyBudget - 4 * hCal) / 3);
        label = isAlt ? "⚡ تناوبی بالا" : "📉 تناوبی پایین";
      }

      const pG = Math.round(calorieWeight * 2.1);
      const fG = Math.round((cal * 0.25) / 9);
      const cG = Math.max(0, Math.round((cal - pG * 4 - fG * 9) / 4));

      md += `| ${d.name} | ${label} | ${cal.toLocaleString("fa-IR")} kcal | ${pG} گرم | ${cG} گرم | ${fG} گرم |\n`;
    });

    md += `\n* دستورالعمل و توصیه‌های مربی برای رژیم زیگزاگی:\n`;
    md += `- در روزهای پرکالری (ریفید)، کالری و کربوهیدرات اضافه را عمدتاً در وعده‌های ناشتا، قبل و بعد تمرین توزیع فرمایید تا ریکاوری و گلیکوژن احیا شوند.\n`;
    md += `- در روزهای کم‌کالری، مصرف فیبر و سبزیجات تازه را بالا نگه دارید تا احساس سیری حفظ شود.\n`;
    md += `- آب مصرفی روزانه حداقل ۳.۵ تا ۴ لیتر رعایت شود.\n`;

    setBuilderDietCategories((prev) => {
      const idx = prev.findIndex((c) => c.title.includes("زیگزاگ") || c.title.includes("کالری"));
      let updated: DietMealCategory[];
      if (idx !== -1) {
        updated = prev.map((c, i) => (i === idx ? { ...c, content: md } : c));
      } else {
        const newCat: DietMealCategory = {
          id: `zigzag-${Date.now()}`,
          title: "استراتژی و کالری زیگزاگی",
          iconName: "Flame",
          content: md,
        };
        const suppIdx = prev.findIndex((c) => c.id === "supplements");
        if (suppIdx !== -1) {
          updated = [...prev.slice(0, suppIdx), newCat, ...prev.slice(suppIdx)];
        } else {
          updated = [...prev, newCat];
        }
      }
      setBuilderDietText(generateDietTextFromCategories(updated));
      return updated;
    });

    setCalorieInsertSuccess(true);
    setTimeout(() => setCalorieInsertSuccess(false), 4000);
  };

  const handleDeleteDietCategory = (catId: string) => {
    if (!confirm("آیا از حذف این بخش از برنامه غذایی اطمینان دارید؟")) return;
    setBuilderDietCategories((prev) => {
      const updated = prev.filter((c) => c.id !== catId);
      setBuilderDietText(generateDietTextFromCategories(updated));
      return updated;
    });
    if (builderActiveDietFilter === catId) {
      setBuilderActiveDietFilter("all");
    }
  };

  const handleUpdateExercise = (dayIdx: number, exIdx: number, field: keyof WorkoutExercise, value: any) => {
    setBuilderDays((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy[dayIdx] && copy[dayIdx].exercises[exIdx]) {
        copy[dayIdx].exercises[exIdx][field] = value;
      }
      return copy;
    });
  };

  const handleAddExercise = (dayIdx: number) => {
    setBuilderDays((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy[dayIdx]) {
        copy[dayIdx].exercises.push({
          id: `ex-${Date.now()}-${copy[dayIdx].exercises.length + 1}`,
          name: "",
          sets: 4,
          reps: "10-12",
          rest: "60 ثانیه",
          notes: "",
        });
      }
      return copy;
    });
  };

  const handleRemoveExercise = (dayIdx: number, exIdx: number) => {
    setBuilderDays((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy[dayIdx]) {
        copy[dayIdx].exercises.splice(exIdx, 1);
      }
      return copy;
    });
  };

  const handleUpdateDayTitle = (dayIdx: number, title: string) => {
    setBuilderDays((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy[dayIdx]) {
        copy[dayIdx].dayTitle = title;
      }
      return copy;
    });
  };

  const handleAddDay = () => {
    setBuilderDays((prev) => {
      const nextNum = prev.length + 1;
      const newDay: WorkoutDay = {
        id: `day-${Date.now()}`,
        dayTitle: `روز ${nextNum}: تمرین تکمیلی`,
        exercises: [
          {
            id: `ex-${Date.now()}-1`,
            name: "",
            sets: 4,
            reps: "10-12",
            rest: "60 ثانیه",
            notes: "",
          },
        ],
      };
      return [...prev, newDay];
    });
    setBuilderActiveDayIndex(builderDays.length);
  };

  const handleRemoveDay = (dayIdx: number) => {
    if (builderDays.length <= 1) {
      alert("حداقل باید یک روز تمرینی وجود داشته باشد.");
      return;
    }
    if (confirm("آیا از حذف این روز تمرینی اطمینان دارید؟")) {
      setBuilderDays((prev) => prev.filter((_, i) => i !== dayIdx));
      if (builderActiveDayIndex >= builderDays.length - 1) {
        setBuilderActiveDayIndex(Math.max(0, builderDays.length - 2));
      }
    }
  };

  const handleSavePlanBuilder = async (targetStatus?: string) => {
    if (!builderOrder) return;
    setIsSavingPlan(true);
    try {
      const finalStatus = targetStatus || builderStatus;
      const workoutContentToSave = builderWorkoutMode === "text" 
        ? builderWorkoutText 
        : JSON.stringify({
            isStructured: true,
            days: builderDays,
            textBackup: generateTextFromDays(builderDays),
          });

      const finalDietText = builderDietMode === "unified"
        ? builderDietText 
        : generateDietTextFromCategories(builderDietCategories) || builderDietText;

      const res = await fetch(`https://fitbynazeri.com/api/plan-orders/${builderOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: finalStatus,
          workout_plan_content: workoutContentToSave,
          diet_plan_content: finalDietText,
          admin_feedback: builderFeedback,
          workout_plan_file: builderWorkoutFile,
          diet_plan_file: builderDietFile,
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setPlanSaveNotice(true);
        setTimeout(() => setPlanSaveNotice(false), 5000);
        setBuilderOrder(data.order);
        setBuilderStatus(data.order.status);
        if (finalStatus === "ready") {
          setOrderFilterTab("archived");
        }
        fetchAllPlanOrders();
      } else {
        alert(data.message || "خطا در ذخیره برنامه");
      }
    } catch (e) {
      console.error(e);
      alert("خطا در ارتباط با سرور هنگام ذخیره برنامه");
    } finally {
      setIsSavingPlan(false);
    }
  };

  const applyWorkoutTemplate = (type: "split" | "fullbody" | "home") => {
    if (builderWorkoutText.trim() && !confirm("آیا مایلید قالب تمرینی انتخابی جایگزین تنظیمات فعلی شود؟")) {
      return;
    }

    if (type === "split") {
      const days = getDefaultSplitDays(4);
      setBuilderDays(days);
      setBuilderWorkoutText(generateTextFromDays(days));
    } else if (type === "fullbody") {
      const days: WorkoutDay[] = [
        {
          id: "day-1",
          dayTitle: "جلسه ۱ (شنبه - فول بادی قدرتی A)",
          exercises: [
            { id: "fb-1-1", name: "اسکوات هالتر", sets: 4, reps: "6-8", rest: "120 ثانیه", notes: "تمرکز بر دامنه کامل" },
            { id: "fb-1-2", name: "پرس سینه هالتر", sets: 4, reps: "8", rest: "90 ثانیه", notes: "" },
            { id: "fb-1-3", name: "زیربغل هالتر خم", sets: 4, reps: "8-10", rest: "90 ثانیه", notes: "" },
            { id: "fb-1-4", name: "پرس سرشانه دمبل", sets: 3, reps: "10", rest: "60 ثانیه", notes: "" },
            { id: "fb-1-5", name: "جلو بازو + پشت بازو سوپرست", sets: 3, reps: "12", rest: "60 ثانیه", notes: "" },
          ],
        },
        {
          id: "day-2",
          dayTitle: "جلسه ۲ (دوشنبه - فول بادی هایپرتروفی B)",
          exercises: [
            { id: "fb-2-1", name: "ددلیفت رومانیایی با دمبل", sets: 4, reps: "10", rest: "90 ثانیه", notes: "" },
            { id: "fb-2-2", name: "پرس بالا سینه دمبل", sets: 4, reps: "10-12", rest: "75 ثانیه", notes: "" },
            { id: "fb-2-3", name: "لت سیم‌کش دست باز", sets: 4, reps: "10-12", rest: "60 ثانیه", notes: "" },
            { id: "fb-2-4", name: "نشر جانب دمبل", sets: 4, reps: "15", rest: "60 ثانیه", notes: "" },
            { id: "fb-2-5", name: "لانگز راه رفتنی با دمبل", sets: 3, reps: "12 گام", rest: "60 ثانیه", notes: "" },
          ],
        },
        {
          id: "day-3",
          dayTitle: "جلسه ۳ (چهارشنبه - فول بادی فرم‌دهی C)",
          exercises: [
            { id: "fb-3-1", name: "پرس پا دستگاه", sets: 4, reps: "12-15", rest: "90 ثانیه", notes: "" },
            { id: "fb-3-2", name: "زیربغل قایقی سیم‌کش", sets: 4, reps: "12", rest: "60 ثانیه", notes: "" },
            { id: "fb-3-3", name: "قفسه سینه دمبل", sets: 3, reps: "12-15", rest: "60 ثانیه", notes: "" },
            { id: "fb-3-4", name: "پشت ران دستگاه", sets: 4, reps: "12", rest: "60 ثانیه", notes: "" },
            { id: "fb-3-5", name: "ساق پا + کرانچ شکم سوپرست", sets: 4, reps: "20", rest: "45 ثانیه", notes: "" },
          ],
        },
      ];
      setBuilderDays(days);
      setBuilderWorkoutText(generateTextFromDays(days));
    } else {
      const days: WorkoutDay[] = [
        {
          id: "day-1",
          dayTitle: "جلسه ۱: بالاتنه و بازو (منزل)",
          exercises: [
            { id: "hm-1-1", name: "شنا سوئدی استاندارد", sets: 4, reps: "12-15", rest: "60 ثانیه", notes: "" },
            { id: "hm-1-2", name: "پرس سینه دمبل روی زمین", sets: 4, reps: "12", rest: "60 ثانیه", notes: "" },
            { id: "hm-1-3", name: "زیربغل دمبل تک‌خم روی صندلی", sets: 4, reps: "12", rest: "60 ثانیه", notes: "" },
            { id: "hm-1-4", name: "نشر جانب دمبل ایستاده", sets: 4, reps: "15", rest: "45 ثانیه", notes: "" },
            { id: "hm-1-5", name: "جلو بازو دمبل + دیپ پشت بازو صندلی", sets: 3, reps: "12", rest: "60 ثانیه", notes: "" },
          ],
        },
        {
          id: "day-2",
          dayTitle: "جلسه ۲: پایین‌تنه و میان‌تنه (منزل)",
          exercises: [
            { id: "hm-2-1", name: "گابلت اسکوات با دمبل", sets: 4, reps: "15", rest: "60 ثانیه", notes: "" },
            { id: "hm-2-2", name: "لانگز درجا با وزن بدن یا دمبل", sets: 3, reps: "12 هر پا", rest: "60 ثانیه", notes: "" },
            { id: "hm-2-3", name: "پل باسن تک‌پا روی زمین", sets: 3, reps: "15 هر طرف", rest: "45 ثانیه", notes: "" },
            { id: "hm-2-4", name: "پلانک روی آرنج", sets: 4, reps: "60 ثانیه", rest: "45 ثانیه", notes: "" },
            { id: "hm-2-5", name: "کرانچ دوچرخه", sets: 3, reps: "25", rest: "45 ثانیه", notes: "" },
          ],
        },
      ];
      setBuilderDays(days);
      setBuilderWorkoutText(generateTextFromDays(days));
    }
    setBuilderActiveDayIndex(0);
  };

  const applyDietTemplate = (type: "bulk" | "cut") => {
    let tpl = "";
    if (type === "bulk") {
      tpl = `### اصول دوره حجم تمیز (Lean Bulk):
- کالری دریافتی هدف: ۳۰۰ تا ۴۰۰ کالری بالاتر از سطح نگهداری
- دریافت آب روزانه: ۳.۵ الی ۴ لیتر

### ناشتا (ابتدای صبح):
- ۲ لیوان آب ولرم + ۱ قاشق آب لیموترش تازه + ۵ گرم گلوتامین

### صبحانه: ۴ عدد تخم‌مرغ (۲ کامل + ۲ سفیده) + ۷۰ گرم جو دوسر پرک با شیر کم‌چرب + ۱ قاشق عسل + گردو
- میان‌وعده صبح: ۱ عدد موز + ۲۰ عدد بادام درختی
- ناهار: ۱۸۰ گرم فیله مرغ گریل + ۲۰۰ گرم کته برنج ایرانی + سالاد فصل با روغن زیتون
- میان‌وعده قبل تمرین (۲ ساعت قبل): سیب‌زمینی پخته تنوری (۲۰۰ گرم) + سفیده تخم‌مرغ آبپز + ۱ فنجان قهوه
- بعد از تمرین (بلافاصله): شیک پروتئینی یا سفیده تخم‌مرغ + ۲ عدد خرما
- شام: ۱۶۰ گرم فیله ماهی یا گوشت راسته گوساله + سبزیجات بخارپز و بروکلی
- قبل خواب: ۱ پیاله ماست یونانی پرپروتئین`;
    } else {
      tpl = `### اصول دوره کات و چربی‌سوزی علمی (Fat Loss):
- کسری کنترل‌شده کالری (۴۰۰ الی ۵۰۰ کالری کسری)
- پروتئین بالا جهت حفظ بافت عضلانی
- آب مصرفی: روزانه حداقل ۴ لیتر

### ناشتا (ابتدای صبح):
- ۲ لیوان آب ولرم + ۱ فنجان قهوه تلخ یا چای سبز + مولتی‌ویتامین و امگا ۳

### صبحانه: ۵ عدد سفیده تخم‌مرغ + ۱ زرده به صورت املت با گوجه و قارچ + ۱ کف دست نان جو
- میان‌وعده صبح: ۱ عدد سیب سبز + ۱۰ عدد بادام درختی خام
- ناهار: ۲۰۰ گرم سینه مرغ آبپز + ۱۰۰ گرم کته برنج + بشقاب بزرگ سبزیجات و کلم بروکلی
- قبل تمرین: ۱ شات اسپرسو بدون شکر + ۲ عدد خرما
- شام: ۱ قوطی تن ماهی در آب‌نمک (روغن گرفته) + سالاد کلم و خیار با لیمو ترش تازه
- قبل خواب: دمنوش بابونه یا چای سبز ملایم`;
    }

    if (builderDietText.trim() && !confirm("آیا مایلید قالب غذایی انتخابی جایگزین متن فعلی شود؟")) {
      return;
    }
    setBuilderDietText(tpl);
    const parsed = parseDietContent(tpl);
    setBuilderDietCategories(parsed);
    setBuilderActiveDietFilter("all");
  };

  const handleDeleteBlogComment = async (id: number) => {
    if (!confirm("آیا از حذف این دیدگاه وبلاگ اطمینان دارید؟")) return;
    try {
      const res = await fetch(`https://fitbynazeri.com/api/blog-comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogCommentsList((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenNewBlogPost = () => {
    setEditingBlogPostId(null);
    setBlogForm({
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      category: blogCategoriesList[0]?.name || "علم تمرین و فیزیولوژی",
      author_name: "استاد احسان ناظری",
      author_role: "مربی ارشد بدنسازی",
      read_time: "۶ دقیقه مطالعه",
      image_url: "",
      image_alt: "",
      tags: "هایپرتروفی, بدنسازی علمی, تمرینات قدرتی",
      meta_title: "",
      meta_description: "",
      focus_keyword: "",
      faq_title: "",
      faq_items: [],
      is_published: true,
    });
    setBlogViewMode("form");
  };

  const handleEditBlogPost = (post: any) => {
    setEditingBlogPostId(post.id);
    setBlogForm({
      ...post,
      image_alt: post.image_alt || "",
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      focus_keyword: post.focus_keyword || "",
      faq_title: post.faq_title || "",
      faq_items: parseFaqItems(post.faq_items),
    });
    setBlogViewMode("form");
  };

  const handleDeleteBlogPost = async (id: number) => {
    if (!confirm("آیا از حذف این مقاله اطمینان دارید؟")) return;
    try {
      const res = await fetch(`https://fitbynazeri.com/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogPostsList((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveBlogPost = async (publishStatus: boolean) => {
    if (!blogForm.title) {
      alert("لطفاً عنوان مقاله را وارد کنید");
      return;
    }
    try {
      const url = editingBlogPostId 
        ? `https://fitbynazeri.com/api/blog/${editingBlogPostId}` 
        : "https://fitbynazeri.com/api/blog";
      const method = editingBlogPostId ? "PUT" : "POST";

      const cleanFaq = (blogForm.faq_items || []).filter(
        (it: FaqItem) => it.question.trim() && it.answer.trim()
      );
      const payload = {
        ...blogForm,
        faq_items: cleanFaq.length ? JSON.stringify(cleanFaq) : "",
        is_published: publishStatus,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.post) {
        alert(data?.message || "ذخیره مقاله ناموفق بود");
      }
      if (res.ok && data.post) {
        setBlogSavedNotice(true);
        fetchBlogPosts();
        setTimeout(() => {
          setBlogSavedNotice(false);
          setBlogViewMode("list");
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      const res = await fetch("https://fitbynazeri.com/api/blog-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          slug: newCategorySlug || newCategoryName.toLowerCase().replace(/\s+/g, "-"),
          description: newCategoryDesc,
        }),
      });
      if (res.ok) {
        setNewCategoryName("");
        setNewCategorySlug("");
        setNewCategoryDesc("");
        fetchBlogCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;
    try {
      const res = await fetch(`https://fitbynazeri.com/api/blog-categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogCategoriesList((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMediaItems = () => {
    fetch("https://fitbynazeri.com/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.media) {
          setMediaItems(data.media);
          if (data.media.length > 0) {
            setSelectedMediaFile((prev: any) => {
              if (prev) {
                const updated = data.media.find((m: any) => m.id === prev.id) || prev;
                return updated;
              }
              handleSelectMediaForDetail(data.media[0]);
              return data.media[0];
            });
          }
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("nazeri_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === "superadmin" || parsed.role === "admin" || parsed.role === "student") {
          setRole(parsed.role);
          const currentAdminName = parsed.full_name || "احسان ناظری";
          setUserName(currentAdminName);
          if (parsed.email) {
            setUserEmail(parsed.email);
            fetchPlanOrders(parsed.email);
          }
          if (parsed.role === "superadmin") {
            setUserRoleTitle("سوپروایزر و مدیر کل سایت");
            setReplyAuthor(`${currentAdminName} (سوپروایزر)`);
            setActiveMenu("overview");
          } else if (parsed.role === "admin") {
            setUserRoleTitle("مربی ارشد بدنسازی");
            setReplyAuthor(`مربی ${currentAdminName}`);
            setActiveMenu("overview");
          } else {
            setUserRoleTitle("قهرمان دوره VIP");
            setReplyAuthor(currentAdminName);
            setActiveMenu("my-plan");
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchStudents();
    fetchTestimonials();
    fetchHeroSlides();
    fetchAboutData();
    fetchConsultations();
    fetchMediaItems();
    fetchBlogPosts();
    fetchBlogCategories();
    fetchBlogComments();
    fetchUsers();
    fetchAllPlanOrders();
  }, []);

  const handleOpenNewStudent = () => {
    setEditingStudentId(null);
    setStudentForm({
      slug: "",
      full_name: "",
      phone: "",
      email: "",
      category: "فیزیک کلاسیک",
      package_name: "پکیج جامع VIP + آمادگی استیج",
      duration: "۱۲ ماه",
      image_url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
      initial_weight: 90,
      current_weight: 78,
      target_weight: 75,
      height: 180,
      age: 26,
      body_fat: 7.2,
      medals: "",
      bio: "",
      coach_notes: "",
      status: "active",
      is_champion: true,
    });
    setStudentViewMode("form");
  };

  const handleEditStudent = (st: any) => {
    setEditingStudentId(st.id);
    setStudentForm(st);
    setStudentViewMode("form");
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("آیا از حذف این پرونده قهرمان اطمینان دارید؟")) return;
    try {
      const res = await fetch(`https://fitbynazeri.com/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudentsList((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStudentId 
        ? `https://fitbynazeri.com/api/students/${editingStudentId}` 
        : "https://fitbynazeri.com/api/students";
      const method = editingStudentId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm),
      });

      const data = await res.json();
      if (res.ok && data.student) {
        setStudentSavedNotice(true);
        fetchStudents();
        setTimeout(() => {
          setStudentSavedNotice(false);
          setStudentViewMode("list");
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Testimonials Actions
  const handleToggleTestimonialStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "approved" ? "pending" : "approved";
    try {
      const res = await fetch(`https://fitbynazeri.com/api/testimonials/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("آیا از حذف این دیدگاه اطمینان دارید؟")) return;
    try {
      const res = await fetch(`https://fitbynazeri.com/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectHeroSlide = (slide: any) => {
    setSelectedSlideId(slide.id);
    setCurrentSlideForm({
      title_prefix: slide.title_prefix || "",
      title_highlight: slide.title_highlight || "",
      description: slide.description || "",
      primary_btn_text: slide.primary_btn_text || "",
      primary_btn_href: slide.primary_btn_href || "",
      secondary_btn_text: slide.secondary_btn_text || "",
      secondary_btn_href: slide.secondary_btn_href || "",
      image_url: slide.image_url || "",
      is_active: slide.is_active ?? true,
    });
  };

  const handleSaveHeroSlide = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedSlideId) return;
    try {
      const res = await fetch(`https://fitbynazeri.com/api/hero-slides/${selectedSlideId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentSlideForm),
      });
      const data = await res.json();
      if (data.status === "success") {
        setHeroSaved(true);
        setTimeout(() => setHeroSaved(false), 3500);
        fetchHeroSlides();
      } else {
        alert(data.message || "خطا در ذخیره‌سازی اسلاید");
      }
    } catch (err) {
      console.error("Error saving hero slide:", err);
      alert("خطا در ارتباط با سرور جهت ذخیره اسلاید");
    }
  };

  const handleSaveAbout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch("https://fitbynazeri.com/api/about-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutForm),
      });
      const data = await res.json();
      if (data.status === "success") {
        setAboutSaved(true);
        setTimeout(() => setAboutSaved(false), 3500);
        fetchAboutData();
      } else {
        alert(data.message || "خطا در ذخیره بخش درباره ما");
      }
    } catch (err) {
      console.error("Error saving about section:", err);
      alert("خطا در ارتباط با سرور");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nazeri_user");
    localStorage.removeItem("nazeri_token");
    router.push("/login");
  };

  const pendingConsultCount = consultationList.filter((c) => c.status === "pending").length;
  const pendingTestimonialsCount = testimonialsList.filter((t) => t.status === "pending").length;
  const pendingBlogCommentsCount = blogCommentsList.filter((c) => c.status === "pending").length;
  const pendingPlanOrdersCount = allPlanOrders.filter((o) => o.status === "reviewing" || o.status === "preparing").length;

  // ۱. منوهای سوپروایزر
  const superAdminMenuItems = [
    { id: "overview", label: "داشبورد و آمار کل", icon: TrendingUp },
    { id: "blog", label: "مدیریت مقالات و وبلاگ", icon: BookOpen, count: `${blogPostsList.length}` },
    { 
      id: "blog-comments", 
      label: "دیدگاه‌ها و نظرات مقالات", 
      icon: MessageCircle, 
      count: pendingBlogCommentsCount > 0 ? `${pendingBlogCommentsCount} تایید نشده` : undefined 
    },
    { id: "students", label: "مدیریت پرونده قهرمانان", icon: Users, count: `${studentsList.length}` },
    { 
      id: "testimonials", 
      label: "مدیریت نظرات قهرمانان", 
      icon: MessageSquare, 
      count: pendingTestimonialsCount > 0 ? `${pendingTestimonialsCount} تایید نشده` : undefined 
    },
    { 
      id: "consultations", 
      label: "مشاوره‌های رایگان", 
      icon: PhoneCall, 
      count: pendingConsultCount > 0 ? `${pendingConsultCount} جدید` : undefined 
    },
    { id: "seo", label: "مدیریت سئو و متاتگ‌ها", icon: Globe, count: "فعال" },
    {
      id: "design",
      label: "دیزاین و مدیریت محتوای سایت",
      icon: Palette,
      hasSubmenu: true,
      subItems: [
        { id: "hero-cms", label: "هیروسکشن (Hero Section)", icon: Sliders },
        { id: "about-cms", label: "درباره ما (صفحه اصلی)", icon: BookOpen },
        { id: "packages-cms", label: "پکیج‌ها و تعرفه‌ها", icon: Flame },
        { id: "theme-colors", label: "پالت رنگ و تم", icon: Palette },
      ],
    },
    { 
      id: "media-library", 
      label: "آرشیو رسانه و سئو تصاویر", 
      icon: FolderOpen, 
      count: mediaItems.length > 0 ? `${mediaItems.length} فایل` : undefined 
    },
    { id: "users", label: "مدیریت کاربران و مربیان", icon: UserCog, count: `${usersList.length}` },
    { id: "system-logs", label: "وضعیت سرور و سلامت API", icon: Server },
    {
      id: "programming-menu",
      label: "برنامه‌نویسی",
      icon: Dumbbell,
      hasSubmenu: true,
      count: pendingPlanOrdersCount > 0 ? `${pendingPlanOrdersCount}` : undefined,
      subItems: [
        { 
          id: "plan-orders", 
          label: "درخواست‌های برنامه", 
          icon: FileCheck, 
          count: pendingPlanOrdersCount > 0 ? `${pendingPlanOrdersCount} جدید` : undefined 
        },
        { id: "plan-builder-workout", label: "طراحی برنامه تمرینی", icon: Dumbbell },
        { id: "plan-builder-diet", label: "طراحی برنامه غذایی و کالری", icon: Utensils },
        { id: "plan-builder-feedback", label: "آنالیز و فیدبک مربی", icon: MessageSquare },
        { id: "plan-builder-files", label: "پیوست فایل و وضعیت تحویل", icon: FolderOpen },
      ],
    },
  ];

  // ۲. منوهای مربی (سطح دسترسی مربی: نمای کلی، درخواست‌های برنامه و برنامه‌نویسی)
  const coachMenuItems = [
    { id: "overview", label: "نمای کلی و آمار", icon: TrendingUp },
    { 
      id: "plan-orders", 
      label: "درخواست‌های برنامه", 
      icon: FileCheck, 
      count: allPlanOrders.filter((o) => o.status === "reviewing" || o.status === "preparing").length > 0
        ? `${allPlanOrders.filter((o) => o.status === "reviewing" || o.status === "preparing").length}`
        : undefined
    },
    { 
      id: "plan-builder", 
      label: "برنامه‌نویسی", 
      icon: Dumbbell,
      count: builderOrder ? "پرونده فعال" : undefined,
    },
  ];

  // ۳. منوهای قهرمان
  const hasReadyWorkout = userPlanOrders.some((o) => (o.status === "ready" || o.status === "completed") && (o.workout_plan_content || o.workout_plan_file));
  const hasReadyDiet = userPlanOrders.some((o) => (o.status === "ready" || o.status === "completed") && (o.diet_plan_content || o.diet_plan_file));

  const studentMenuItems = [
    { 
      id: "my-plan", 
      label: "درخواست و پرونده من", 
      icon: FileCheck, 
      count: userPlanOrders.some((o) => o.status === "ready") ? "تایید شد" : undefined 
    },
    { 
      id: "my-workout", 
      label: "برنامه تمرینی من", 
      icon: Dumbbell,
      count: hasReadyWorkout ? "برنامه نوشته شده" : undefined,
    },
    { 
      id: "my-diet", 
      label: "برنامه غذایی من", 
      icon: Flame,
      count: hasReadyDiet ? "برنامه نوشته شده" : undefined,
    },
  ];

  let menuItems = coachMenuItems;
  if (role === "superadmin") menuItems = superAdminMenuItems;
  else if (role === "student") menuItems = studentMenuItems;

  const filteredStudents = studentsList.filter((st) =>
    st.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    st.slug?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    st.category?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredBlogPosts = blogPostsList.filter((p) =>
    p.title?.toLowerCase().includes(blogSearch.toLowerCase()) ||
    p.slug?.toLowerCase().includes(blogSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(blogSearch.toLowerCase()) ||
    p.tags?.toLowerCase().includes(blogSearch.toLowerCase())
  );

  const filteredTestimonials = testimonialsList.filter((t) => {
    if (testimonialFilter === "pending") return t.status === "pending";
    if (testimonialFilter === "approved") return t.status === "approved";
    return true;
  });

  const filteredBlogComments = blogCommentsList.filter((c) => {
    if (blogCommentFilter === "pending") return c.status === "pending";
    if (blogCommentFilter === "approved") return c.status === "approved";
    return true;
  });

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone?.toLowerCase().includes(userSearch.toLowerCase());

    const matchesFilter =
      userFilter === "all" ||
      (userFilter === "admin" && (u.role === "admin" || u.role === "superadmin")) ||
      (userFilter === "student" && u.role === "student");

    return matchesSearch && matchesFilter;
  });

  const filteredMediaItems = mediaItems.filter((item) => {
    const q = mediaSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (item.file_name && item.file_name.toLowerCase().includes(q)) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(q)) ||
      (item.title && item.title.toLowerCase().includes(q));

    const matchesType =
      mediaFilterType === "all" ||
      (mediaFilterType === "image" && item.file_type === "image") ||
      (mediaFilterType === "video" && item.file_type === "video") ||
      (mediaFilterType === "document" && item.file_type === "document");

    return matchesSearch && matchesType;
  });

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#141414] text-[#e5e2e1] flex antialiased selection:bg-[#ff6600] selection:text-white" dir="rtl">
      
      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          fetchMediaItems();
        }}
        currentUrl={
          mediaTargetField === "student"
            ? studentForm.image_url
            : mediaTargetField === "hero"
            ? currentSlideForm.image_url
            : mediaTargetField === "blog-cover"
            ? blogForm.image_url
            : aboutForm.coach_image_url
        }
        onSelect={(newUrl) => {
          if (mediaTargetField === "student") {
            setStudentForm((prev: any) => ({ ...prev, image_url: newUrl }));
          } else if (mediaTargetField === "hero") {
            setCurrentSlideForm((prev: any) => ({ ...prev, image_url: newUrl }));
          } else if (mediaTargetField === "blog-cover") {
            setBlogForm((prev: any) => ({ ...prev, image_url: newUrl }));
          } else if (mediaTargetField === "blog-editor") {
            setInsertedBlogEditorImage(newUrl);
          } else {
            setAboutForm((prev: any) => ({ ...prev, coach_image_url: newUrl }));
          }
          fetchMediaItems();
        }}
      />

      {/* مدال ویرایش اطلاعات پرونده برنامه توسط قهرمان */}
      {editingPlanOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className="relative w-full max-w-2xl bg-[#141414] border border-[#2d2d2d] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar text-right">
            
            {/* هدر مدال */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2c2c2e]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff6600]/15 border border-[#ff6600]/30 flex items-center justify-center text-[#ff6600]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#e5e2e1]">
                    ویرایش مشخصات پرونده ({editingPlanOrder.package_title})
                  </h3>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    شماره پرونده: #{editingPlanOrder.id} • تغییرات ثبت‌شده مستقیماً جهت تنظیم برنامه توسط مربی اعمال می‌گردد.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlanOrder(null)}
                className="w-8 h-8 rounded-lg bg-[#202020] hover:bg-[#282828] text-[#64748b] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* فرم ویرایش */}
            <form onSubmit={handleSaveOrderEdit} className="space-y-5 text-xs">
              
              {/* سن، قد، وزن */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#e5e2e1] block">مشخصات فیزیکی (سن، قد، وزن ناشتا):</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#64748b] mb-1">سن (سال)</label>
                    <input
                      type="number"
                      min={14}
                      max={90}
                      value={editOrderForm.age}
                      onChange={(e) => setEditOrderForm({ ...editOrderForm, age: Number(e.target.value) })}
                      className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-3.5 py-2.5 text-center font-bold text-[#ff6600] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#64748b] mb-1">قد (سانتی‌متر)</label>
                    <input
                      type="number"
                      min={130}
                      max={230}
                      value={editOrderForm.height}
                      onChange={(e) => setEditOrderForm({ ...editOrderForm, height: Number(e.target.value) })}
                      className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-3.5 py-2.5 text-center font-bold text-[#ff6600] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#64748b] mb-1">وزن فعلی (کیلوگرم)</label>
                    <input
                      type="number"
                      step="0.5"
                      min={35}
                      max={200}
                      value={editOrderForm.weight}
                      onChange={(e) => setEditOrderForm({ ...editOrderForm, weight: Number(e.target.value) })}
                      className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-3.5 py-2.5 text-center font-bold text-[#ff6600] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>
                </div>
              </div>

              {/* هدف و محیط تمرین */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#64748b] mb-1.5 font-bold">هدف اصلی دوره</label>
                  <select
                    value={editOrderForm.primary_goal}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, primary_goal: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  >
                    <option value="hypertrophy">عضله‌سازی و هایپرتروفی خالص</option>
                    <option value="weight_loss">چربی‌سوزی و کاهش وزن</option>
                    <option value="recomp">فرم‌دهی و ریکامپوزیشن (کاهش چربی همزمان با عضله‌سازی)</option>
                    <option value="strength">افزایش قدرت و توان فیزیکی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#64748b] mb-1.5 font-bold">محیط تمرینی</label>
                  <select
                    value={editOrderForm.training_location}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, training_location: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  >
                    <option value="gym">باشگاه بدنسازی مجهز</option>
                    <option value="home">منزل (دمبل، کش، وزن بدن)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#64748b] mb-1.5 font-bold">سابقه تمرین</label>
                  <select
                    value={editOrderForm.experience_level}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, experience_level: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  >
                    <option value="beginner">مبتدی (کمتر از ۶ ماه)</option>
                    <option value="intermediate">متوسط (۶ ماه تا ۲ سال)</option>
                    <option value="advanced">پیشرفته (بیش از ۲ سال)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#64748b] mb-1.5 font-bold">تعداد روزهای تمرین در هفته</label>
                  <select
                    value={editOrderForm.days_per_week}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, days_per_week: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  >
                    <option value="3">۳ روز در هفته</option>
                    <option value="4">۴ روز در هفته (بهینه و پیشنهادی)</option>
                    <option value="5">۵ روز در هفته</option>
                    <option value="6">۶ روز در هفته</option>
                  </select>
                </div>
              </div>

              {/* آسیب‌دیدگی */}
              <div>
                <label className="block text-[11px] text-[#64748b] mb-1 font-bold">سابقه آسیب‌دیدگی، درد مفصلی یا وضعیت فیزیکی خاص</label>
                <input
                  type="text"
                  placeholder="مثال: دیسک کمر خفیف، حساسیت زانو در اسکات، یا کاملاً سالم"
                  value={editOrderForm.injuries}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, injuries: e.target.value })}
                  className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                />
              </div>

              {/* حساسیت‌های غذایی */}
              <div>
                <label className="block text-[11px] text-[#64748b] mb-1 font-bold">حساسیت‌های گوارشی، آلرژی‌ها و پرهیزهای غذایی</label>
                <input
                  type="text"
                  placeholder="مثال: عدم تحمل لاکتوز، گلوتن، حساسیت به مغزیجات، یا بدون پرهیز خاص"
                  value={editOrderForm.dietary_restrictions}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, dietary_restrictions: e.target.value })}
                  className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                />
              </div>

              {/* توضیحات تکمیلی */}
              <div>
                <label className="block text-[11px] text-[#64748b] mb-1 font-bold">توضیحات و یادداشت تکمیلی برای مربی</label>
                <textarea
                  rows={3}
                  placeholder="توضیحات درباره ساعات خواب، شیفت‌های کاری، سفرهای پیش‌رو یا تغییرات جدید در شرایط شما..."
                  value={editOrderForm.coach_notes}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, coach_notes: e.target.value })}
                  className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl p-3 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                />
              </div>

              {/* دکمه‌های اقدام */}
              <div className="pt-3 border-t border-[#2c2c2e] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPlanOrder(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#1e1e1e] hover:bg-[#2c2c2e] text-[#64748b] hover:text-[#e5e2e1] font-medium transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingOrder}
                  className="px-6 py-2.5 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white font-bold transition-all shadow-lg shadow-[#ff6600]/20 flex items-center gap-2"
                >
                  {isUpdatingOrder ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>در حال ذخیره تغییرات...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>ذخیره تغییرات پرونده</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* سایدبار سمت راست - کاملاً استیکی و ثابت */}
      <aside className="w-72 bg-[#141414] border-l border-[#2c2c2e] flex flex-col justify-between p-6 flex-shrink-0 h-screen sticky top-0 z-30 overflow-y-auto custom-scrollbar">
        
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded bg-[#ff6600] flex items-center justify-center text-white font-black shadow-lg shadow-[#ff6600]/30 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-bold text-[#e5e2e1] block tracking-tight">آکادمی ناظری</span>
              <span className="text-xs text-[#64748b]">
                {role === "superadmin" ? "پنل سوپروایزر و سئو" : role === "admin" ? "پنل مدیریت مربی" : "پنل کاربری قهرمان"}
              </span>
            </div>
          </Link>

          <nav className="space-y-1">
            {menuItems.map((item: any) => {
              const IconComp = item.icon;
              const isSelected = activeMenu === item.id;

              if (item.hasSubmenu) {
                const isOpen = item.id === "design" ? isDesignSubmenuOpen : isProgrammingSubmenuOpen;
                const toggleSubmenu = () => {
                  if (item.id === "design") {
                    setIsDesignSubmenuOpen(!isDesignSubmenuOpen);
                  } else {
                    setIsProgrammingSubmenuOpen(!isProgrammingSubmenuOpen);
                  }
                };
                const isParentActive =
                  item.id === "design"
                    ? activeMenu.startsWith("hero") || activeMenu.startsWith("about") || activeMenu.startsWith("design") || activeMenu === "packages-cms" || activeMenu === "theme-colors"
                    : activeMenu === "plan-orders" || activeMenu === "plan-builder";

                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={toggleSubmenu}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-medium transition-all duration-200 ${
                        isParentActive
                          ? "bg-[#1a1a1c] text-[#ff6600] font-bold border border-[#2c2c2e]"
                          : "text-[#e5e2e1]/75 hover:bg-[#1e1e1e] hover:text-[#e5e2e1]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className="w-4 h-4 text-[#ff6600]" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.count && (
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            isParentActive ? "bg-black/40 text-white" : "bg-[#2c2c2e] text-[#ff6600]"
                          }`}>
                            {item.count}
                          </span>
                        )}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="pr-4 space-y-1 pt-1 border-r border-[#2c2c2e] mr-3">
                        {item.subItems.map((sub: any) => {
                          const SubIcon = sub.icon;
                          const isSubActive =
                            sub.id === "plan-builder-workout"
                              ? activeMenu === "plan-builder" && builderActiveTab === "workout"
                              : sub.id === "plan-builder-diet"
                              ? activeMenu === "plan-builder" && builderActiveTab === "diet"
                              : sub.id === "plan-builder-feedback"
                              ? activeMenu === "plan-builder" && builderActiveTab === "feedback"
                              : sub.id === "plan-builder-files"
                              ? activeMenu === "plan-builder" && builderActiveTab === "files"
                              : activeMenu === sub.id;

                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                if (sub.id === "plan-builder-workout") {
                                  setActiveMenu("plan-builder");
                                  setBuilderActiveTab("workout");
                                } else if (sub.id === "plan-builder-diet") {
                                  setActiveMenu("plan-builder");
                                  setBuilderActiveTab("diet");
                                } else if (sub.id === "plan-builder-feedback") {
                                  setActiveMenu("plan-builder");
                                  setBuilderActiveTab("feedback");
                                } else if (sub.id === "plan-builder-files") {
                                  setActiveMenu("plan-builder");
                                  setBuilderActiveTab("files");
                                } else {
                                  setActiveMenu(sub.id);
                                }
                                setStudentViewMode("list");
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
                                isSubActive
                                  ? "bg-[#ff6600] text-white font-bold"
                                  : "text-[#e5e2e1]/70 hover:bg-[#1e1e1e] hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <SubIcon className="w-3.5 h-3.5" />
                                <span>{sub.label}</span>
                              </div>
                              {sub.count && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                  isSubActive ? "bg-black/30 text-white" : "bg-[#2c2c2e] text-[#ff6600]"
                                }`}>
                                  {sub.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    if (item.id === "students") setStudentViewMode("list");
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-[#ff6600] text-white font-bold"
                      : "text-[#e5e2e1]/75 hover:bg-[#1e1e1e] hover:text-[#e5e2e1]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      isSelected ? "bg-black/30 text-white" : "bg-[#2c2c2e] text-[#ff6600]"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#2c2c2e] space-y-4">
          <div className="p-3 rounded bg-[#1e1e1e] border border-[#2c2c2e] flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded bg-[#2c2c2e] border border-[#3a3a3c] flex items-center justify-center text-sm font-bold text-[#ff6600]">
                {role === "superadmin" ? "س.پ" : role === "admin" ? "م.ن" : "ع.ر"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1e1e1e] rounded-full" />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-[#e5e2e1] truncate">
                {userName}
              </div>
              <div className="text-[11px] text-[#64748b] mt-0.5">
                {userRoleTitle}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#1e1e1e] hover:bg-[#ffb4ab]/10 border border-[#2c2c2e] hover:border-[#ffb4ab]/30 text-xs font-medium text-[#ffb4ab] transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب</span>
          </button>
        </div>

      </aside>

      {/* بخش اصلی محتوا */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto h-screen w-full">
        
        {/* نوار بالایی */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#2c2c2e] w-full">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e2e1] tracking-tight">
              {activeMenu === "overview"
                ? "نمای کلی و آمار آکادمی"
                : activeMenu === "plan-orders"
                ? "درخواست‌های برنامه و پرونده‌های قهرمانان"
                : activeMenu === "plan-builder"
                ? (builderOrder ? `میز کار برنامه‌نویسی: ${builderOrder.user_name}` : "میز کار اختصاصی برنامه‌نویسی تمرین و تغذیه")
                : activeMenu === "my-workout"
                ? "برنامه تمرین اختصاصی شما"
                : activeMenu === "my-diet"
                ? "برنامه غذایی و رژیم اختصاصی شما"
                : activeMenu === "my-plan"
                ? "درخواست و وضعیت پرونده ورزشی"
                : activeMenu === "blog"
                ? (blogViewMode === "form"
                    ? (editingBlogPostId ? `ویرایش مقاله: ${blogForm.title}` : "نگارش و انتشار مقاله جدید")
                    : blogViewMode === "categories"
                    ? "مدیریت دسته‌بندی‌های وبلاگ"
                    : "مدیریت مقالات و وبلاگ تخصصی")
                : activeMenu === "students" 
                ? (studentViewMode === "form" 
                    ? (editingStudentId ? `ویرایش پرونده قهرمان: ${studentForm.full_name}` : "ایجاد پرونده و پروفایل قهرمان جدید")
                    : "مدیریت قهرمانان و پرونده‌های ورزشی")
                : activeMenu === "testimonials"
                ? "مدیریت و تایید دیدگاه‌های قهرمانان"
                : activeMenu === "consultations"
                ? "مدیریت درخواست‌های مشاوره رایگان"
                : activeMenu === "media-library"
                ? "آرشیو رسانه و مدیریت سئو تصاویر"
                : activeMenu === "hero-cms" 
                ? "مدیریت هیروسکشن (Hero CMS)" 
                : activeMenu === "about-cms"
                ? "مدیریت درباره ما (About CMS)"
                : activeMenu === "packages-cms"
                ? "مدیریت پکیج‌ها و تعرفه‌ها"
                : "داشبورد مدیریت آکادمی ناظری"}
            </h1>
            <p className="text-xs text-[#64748b] mt-1">
              {activeMenu === "overview"
                ? "خلاصه وضعیت پرونده‌ها، قهرمانان فعال و دسترسی سریع به درخواست‌های جدید"
                : activeMenu === "plan-orders"
                ? "بررسی مشخصات بیومتریک قهرمانان، تدوین برنامه و ارسال فایل‌های تمرینی و رژیم"
                : activeMenu === "plan-builder"
                ? "نگارش برنامه تمرینی و تغذیه اختصاصی با مشاهده هم‌زمان مشخصات، اهداف، سوابق و عکس‌های قدی قهرمان"
                : activeMenu === "my-workout"
                ? "جدول تمرینات، ست‌ها، تکرارها و سیستم‌های تمرینی تدوین‌شده توسط استاد احسان ناظری"
                : activeMenu === "my-diet"
                ? "برنامه غذایی، محاسبه درشت‌مغذی‌ها و توصیه‌های تخصصی تغذیه دوره شما"
                : activeMenu === "my-plan"
                ? "مشاهده وضعیت تایید پرونده، ویرایش مشخصات و دسترسی سریع به برنامه‌ها"
                : activeMenu === "blog"
                ? (blogViewMode === "form"
                    ? "نگارش متن مقاله با ادیتور پیشرفته، درج تصاویر، اسلاگ سئو و برچسب‌ها"
                    : blogViewMode === "categories"
                    ? "ایجاد و حذف دسته‌بندی‌های موضوعی مقالات علمی و آموزشی"
                    : "لیست مقالات منتشر شده و پیش‌نویس به همراه آمار و دسترسی سریع")
                : activeMenu === "students"
                ? (studentViewMode === "form" 
                    ? "تکمیل مشخصات فردی، اسلاگ صفحه اختصاصی (URL)، سوابق وزنی و افتخارات"
                    : "لیست کامل قهرمانان به همراه اسلاگ صفحات اختصاصی")
                : activeMenu === "testimonials"
                ? "تایید، رد یا حذف نظرات ثبت‌شده توسط کاربران برای نمایش در صفحه اصلی سایت"
                : activeMenu === "media-library"
                ? "مدیریت فایل‌ها، بهینه‌سازی خودکار حجم تصاویر با الگوریتم‌های مدرن Go، تنظیم متاتگ‌های سئو و لینک‌های مستقیم"
                : activeMenu === "hero-cms"
                ? "ویرایش و شخصی‌سازی اسلایدر هیروسکشن، تیترهای ترغیب‌کننده، دکمه‌ها و تصاویر پس‌زمینه"
                : activeMenu === "about-cms"
                ? "مدیریت بخش معرفی استاد احسان ناظری، کارت‌های مزایا و افتخارات در صفحه اصلی"
                : "مدیریت و پیکربندی سیستم آکادمی"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeMenu === "media-library" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchMediaItems}
                  className="flex items-center gap-2 px-4 py-2.5 rounded bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs font-bold text-[#e5e2e1] transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-[#ff6600]" />
                  <span>تازه‌سازی لیست</span>
                </button>
                <button
                  type="button"
                  onClick={() => mediaFileInputRef.current?.click()}
                  disabled={isUploadingMediaFile}
                  className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/30 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isUploadingMediaFile ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>در حال آپلود و بهینه‌سازی...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>آپلود رسانه جدید</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeMenu === "hero-cms" && (
              <button
                type="button"
                onClick={() => handleSaveHeroSlide()}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/30 hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره اسلاید</span>
              </button>
            )}

            {activeMenu === "about-cms" && (
              <button
                type="button"
                onClick={() => handleSaveAbout()}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/30 hover:scale-105 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره درباره ما</span>
              </button>
            )}

            {activeMenu === "blog" && blogViewMode === "list" && (
              <>
                <button
                  onClick={() => setBlogViewMode("categories")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs font-bold text-[#e5e2e1] transition-all"
                >
                  <FolderOpen className="w-4 h-4 text-[#ff6600]" />
                  <span>مدیریت دسته‌بندی‌ها</span>
                </button>
                <button
                  onClick={handleOpenNewBlogPost}
                  className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/30 hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>نوشتن مقاله جدید</span>
                </button>
              </>
            )}

            {activeMenu === "blog" && (blogViewMode === "form" || blogViewMode === "categories") && (
              <button
                onClick={() => setBlogViewMode("list")}
                className="flex items-center gap-2 px-4 py-2 rounded bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs font-bold text-[#e5e2e1]"
              >
                <ArrowRight className="w-4 h-4 text-[#ff6600]" />
                <span>بازگشت به لیست مقالات</span>
              </button>
            )}

            {activeMenu === "students" && studentViewMode === "list" && (
              <button
                onClick={handleOpenNewStudent}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/30 hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن قهرمان جدید</span>
              </button>
            )}

            {activeMenu === "students" && studentViewMode === "form" && (
              <button
                onClick={() => setStudentViewMode("list")}
                className="flex items-center gap-2 px-4 py-2 rounded bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs font-bold text-[#e5e2e1]"
              >
                <ArrowRight className="w-4 h-4 text-[#ff6600]" />
                <span>بازگشت به لیست قهرمانان</span>
              </button>
            )}

            {activeMenu === "plan-builder" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMenu("plan-orders")}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs font-bold text-[#e5e2e1]"
                >
                  <ArrowRight className="w-4 h-4 text-[#ff6600]" />
                  <span>لیست درخواست‌ها</span>
                </button>
                {builderOrder && (
                  <>
                    <button
                      onClick={() => handleSavePlanBuilder()}
                      disabled={isSavingPlan}
                      className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2b2b2b] text-xs font-bold text-[#e5e2e1] transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5 text-[#ff6600]" />
                      <span>{isSavingPlan ? "در حال ذخیره..." : "ذخیره پیش‌نویس"}</span>
                    </button>
                    <button
                      onClick={() => handleSavePlanBuilder("ready")}
                      disabled={isSavingPlan}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ارسال نهایی به قهرمان</span>
                    </button>
                  </>
                )}
              </div>
            )}

            <Link 
              href="/" 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs font-medium text-[#e5e2e1]"
            >
              <span>مشاهده صفحه اصلی</span>
              <Globe className="w-3.5 h-3.5 text-[#ff6600]" />
            </Link>
          </div>
        </div>

        {/* ۱. نمای داشبورد و آمار کل - مخصوص سوپروایزر و مدیر سایت (Overview View) */}
        {activeMenu === "overview" && (
          <div className="mt-8 space-y-8 w-full pb-16 text-right">
            
            {/* بنر خوش‌آمدگویی و معرفی مرکز کنترل مدیر سایت */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1c1c1c] via-[#161616] to-[#121212] border border-[#2c2c2e] p-6 sm:p-8 shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff6600]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6600]/10 border border-[#ff6600]/25 text-[#ff6600] text-xs font-bold mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>مرکز فرماندهی و مانیتورینگ سایت • پنل سوپروایزر</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#e5e2e1]">
                    خوش آمدید، {userName || "مدیر ارشد آکادمی ناظری"}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94a3b8] mt-2 max-w-2xl leading-relaxed">
                    کنترل لحظه‌ای بر انتشار مقالات علمی، بررسی فرم‌های مشاوره و نظرات ارسالی کاربران، پایش سلامت سرور Go و وضعیت رسانه‌ها و سئو.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleOpenNewBlogPost}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-lg shadow-[#ff6600]/20 hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>نگارش مقاله جدید</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu("consultations")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs font-bold text-[#e5e2e1] transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-[#ff6600]" />
                    <span>فرم‌های مشاوره ({pendingConsultCount} جدید)</span>
                  </button>
                  <button
                    onClick={() => {
                      fetchBlogPosts();
                      fetchBlogComments();
                      fetchConsultations();
                      fetchTestimonials();
                      fetchMediaItems();
                      fetchUsers();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161616] hover:bg-[#202020] border border-[#2c2c2e] text-xs font-medium text-[#87868b] hover:text-white transition-colors"
                    title="تازه‌سازی تمام آمار و فرم‌ها"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* کارت‌های شاخص‌های کلیدی مدیر سایت (Core Manager KPIs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* کارت ۱: مقالات و محتوا */}
              <div 
                onClick={() => setActiveMenu("blog")}
                className="p-5 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] hover:border-[#ff6600]/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#94a3b8] font-bold">مقالات و وبلاگ</span>
                  <div className="w-9 h-9 rounded-xl bg-[#ff6600]/10 border border-[#ff6600]/20 flex items-center justify-center text-[#ff6600] group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#e5e2e1] font-mono-tag">
                  {blogPostsList.length}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#262628] text-[11px]">
                  <span className="text-[#87868b]">{blogCategoriesList.length} دسته‌بندی موضوعی</span>
                  {pendingBlogCommentsCount > 0 ? (
                    <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                      {pendingBlogCommentsCount} دیدگاه جدید
                    </span>
                  ) : (
                    <span className="text-emerald-400">دیدگاه‌ها بروز</span>
                  )}
                </div>
              </div>

              {/* کارت ۲: فرم‌ها و مشاوره‌ها */}
              <div 
                onClick={() => setActiveMenu("consultations")}
                className="p-5 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] hover:border-amber-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#94a3b8] font-bold">مشاوره‌ها و فرم‌های ارسالی</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono-tag">
                  {pendingConsultCount}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#262628] text-[11px]">
                  <span className="text-[#87868b]">مجموع: {consultationList.length} فرم ثبت‌شده</span>
                  <span className="text-amber-400 font-bold">نیازمند تماس</span>
                </div>
              </div>

              {/* کارت ۳: سلامت سرور و زیرساخت API */}
              <div 
                onClick={() => setActiveMenu("system-logs")}
                className="p-5 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] hover:border-emerald-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#94a3b8] font-bold">سلامت سرور و وضعیت API</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Server className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-lg font-black text-emerald-400">آنلاین و فعال (200 OK)</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#262628] text-[11px]">
                  <span className="text-[#87868b]">پورت ۸۰۸۰ Go & SQLite</span>
                  <span className="text-emerald-400 font-mono-tag">Latency &lt; 5ms</span>
                </div>
              </div>

              {/* کارت ۴: آرشیو رسانه و هاست */}
              <div 
                onClick={() => setActiveMenu("media-library")}
                className="p-5 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] hover:border-blue-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#94a3b8] font-bold">آرشیو رسانه و فضای دیسک</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-400 font-mono-tag">
                  {mediaItems.length} فایل
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#262628] text-[11px]">
                  <span className="text-[#87868b]">حجم: {(mediaItems.reduce((acc, m) => acc + (m.file_size || 0), 0) / (1024 * 1024)).toFixed(1)} MB</span>
                  <span className="text-blue-400">بهینه‌شده Go ✓</span>
                </div>
              </div>

            </div>

            {/* بخش اولویت ۱: فرم‌های دریافتی کاربران و دیدگاه‌های نیازمند اقدام فوری (۲ ستونه) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* ستون راست: فرم‌های درخواست مشاوره اخیر (lg:col-span-7) */}
              <div className="lg:col-span-7 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] overflow-hidden shadow-lg">
                <div className="p-5 border-b border-[#2c2c2e] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#e5e2e1]">جدیدترین فرم‌های درخواست مشاوره رایگان</h3>
                      <p className="text-[11px] text-[#87868b] mt-0.5">کاربرانی که فرم مشاوره سایت را تکمیل کرده‌اند</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveMenu("consultations")}
                    className="text-xs text-[#ff6600] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>مدیریت کامل ({consultationList.length})</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#141414] text-[#87868b] border-b border-[#262628]">
                      <tr>
                        <th className="p-3.5 font-bold">نام متقاضی</th>
                        <th className="p-3.5 font-bold">شماره تماس</th>
                        <th className="p-3.5 font-bold">موضوع مشاوره</th>
                        <th className="p-3.5 font-bold">تاریخ ثبت</th>
                        <th className="p-3.5 font-bold text-center">وضعیت و اقدام</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222224]">
                      {consultationList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#87868b]">
                            هنوز هیچ فرم مشاوره‌ای در سایت ثبت نشده است.
                          </td>
                        </tr>
                      ) : (
                        consultationList.slice(0, 5).map((item) => (
                          <tr key={item.id} className="hover:bg-[#202022] transition-colors">
                            <td className="p-3.5 font-bold text-[#e5e2e1]">{item.full_name}</td>
                            <td className="p-3.5 font-mono-tag text-[#ff6600]" dir="ltr">
                              <a href={`tel:${item.phone}`} className="hover:underline flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{item.phone}</span>
                              </a>
                            </td>
                            <td className="p-3.5 text-[#cbd5e1] max-w-[140px] truncate" title={item.topic}>
                              {item.topic || "مشاوره عمومی"}
                            </td>
                            <td className="p-3.5 text-[#87868b] font-mono-tag text-[11px]" dir="ltr">
                              {new Date(item.created_at).toLocaleDateString("fa-IR")}
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleConsultStatus(item.id, item.status)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 mx-auto ${
                                  item.status === "pending"
                                    ? "bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400"
                                    : "bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400"
                                }`}
                                title="کلیک جهت تغییر وضعیت"
                              >
                                {item.status === "pending" ? (
                                  <>
                                    <Clock className="w-3 h-3" />
                                    <span>نیازمند تماس</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>تماس گرفته شد</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ستون چپ: دیدگاه‌های جدید مقالات نیازمند تایید (lg:col-span-5) */}
              <div className="lg:col-span-5 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] overflow-hidden shadow-lg space-y-0">
                <div className="p-5 border-b border-[#2c2c2e] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ff6600]/15 text-[#ff6600] flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#e5e2e1]">دیدگاه‌های مقالات نیازمند تایید</h3>
                      <p className="text-[11px] text-[#87868b] mt-0.5">نظرات ارسال‌شده توسط کاربران روی مقالات وبلاگ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveMenu("blog-comments")}
                    className="text-xs text-[#ff6600] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>همه دیدگاه‌ها</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar">
                  {blogCommentsList.filter((c) => c.status === "pending").length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <h4 className="text-xs font-bold text-[#e5e2e1]">همه دیدگاه‌ها تایید شده‌اند</h4>
                      <p className="text-[11px] text-[#87868b]">هیچ دیدگاه جدیدی در انتظار تایید وجود ندارد.</p>
                    </div>
                  ) : (
                    blogCommentsList
                      .filter((c) => c.status === "pending")
                      .slice(0, 4)
                      .map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3.5 rounded-xl bg-[#141414] border border-[#262628] space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#e5e2e1]">{comment.user_name || "کاربر ناشناس"}</span>
                            <span className="text-[10px] text-[#87868b] font-mono-tag">
                              {comment.created_at ? new Date(comment.created_at).toLocaleDateString("fa-IR") : "به‌تازگی"}
                            </span>
                          </div>
                          <p className="text-[#cbd5e1] leading-relaxed line-clamp-2 text-[11px]">
                            {comment.content}
                          </p>
                          <div className="pt-2 border-t border-[#222224] flex items-center justify-between gap-2">
                            <span className="text-[10px] text-[#ff6600] truncate max-w-[150px]">
                              مقاله: {comment.post_slug || "وبلاگ"}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleToggleBlogCommentStatus(comment.id, comment.status)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>تایید</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBlogComment(comment.id)}
                                className="px-2 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/40 text-rose-400 text-[10px] transition-all"
                                title="حذف دیدگاه"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

            </div>

            {/* بخش اولویت ۲: آخرین مقالات منتشر شده و مدیریت محتوا */}
            <div className="rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] overflow-hidden shadow-lg">
              <div className="p-5 border-b border-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ff6600]/15 text-[#ff6600] flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#e5e2e1]">آخرین مقالات تخصصی و وضعیت وبلاگ</h3>
                    <p className="text-[11px] text-[#87868b] mt-0.5">وضعیت انتشار مقالات، دسته‌ها و متاتگ‌های سئو</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNewBlogPost}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>مقاله جدید</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu("blog")}
                    className="text-xs text-[#ff6600] hover:underline font-bold flex items-center gap-1 mr-2"
                  >
                    <span>مدیریت کامل مقالات</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#141414] text-[#87868b] border-b border-[#262628]">
                    <tr>
                      <th className="p-4 font-bold">عنوان اصلی مقاله</th>
                      <th className="p-4 font-bold">دسته‌بندی</th>
                      <th className="p-4 font-bold">اسلاگ URL سئو</th>
                      <th className="p-4 font-bold">دیدگاه‌ها</th>
                      <th className="p-4 font-bold">تاریخ نگارش</th>
                      <th className="p-4 font-bold text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222224]">
                    {blogPostsList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#87868b]">
                          هنوز هیچ مقاله‌ای در وبلاگ ثبت نشده است. با دکمه «مقاله جدید» نخستین مقاله را منتشر کنید.
                        </td>
                      </tr>
                    ) : (
                      blogPostsList.slice(0, 5).map((post) => (
                        <tr key={post.id} className="hover:bg-[#202022] transition-colors">
                          <td className="p-4">
                            <strong className="text-[#e5e2e1] block line-clamp-1">{post.title}</strong>
                            <span className="text-[10px] text-[#87868b] mt-0.5 block">{post.read_time || "۵ دقیقه مطالعه"}</span>
                          </td>
                          <td className="p-4 font-bold text-[#ff6600]">{post.category || "عمومی"}</td>
                          <td className="p-4 font-mono-tag text-emerald-400 text-[11px]" dir="ltr">
                            /blog/{post.slug}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-[#141414] border border-[#262628] text-[11px] font-mono-tag text-[#cbd5e1]">
                              {blogCommentsList.filter((c) => c.post_slug === post.slug).length} نظر
                            </span>
                          </td>
                          <td className="p-4 font-mono-tag text-[#87868b] text-[11px]" dir="ltr">
                            {post.created_at ? new Date(post.created_at).toLocaleDateString("fa-IR") : "به‌تازگی"}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditBlogPost(post)}
                                className="px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#ff6600] text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>ویرایش</span>
                              </button>
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-[#141414] hover:bg-sky-600 text-[#87868b] hover:text-white transition-colors border border-[#262628]"
                                title="مشاهده در سایت"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* بخش اولویت ۳: پایش وضعیت سرور و دسترسی‌های سریع مدیر سایت */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* وضعیت سرور، دیتابیس و سئو */}
              <div className="p-6 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2c2c2e]">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-[#e5e2e1]">وضعیت سرور، دیتابیس و سرویس‌ها</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    وضعیت پایدار
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#262628]">
                    <span className="text-[#87868b]">سرویس بک‌اند (Go Fiber Engine):</span>
                    <strong className="text-emerald-400 font-mono-tag">Port 8080 • Active ✓</strong>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#262628]">
                    <span className="text-[#87868b]">پایگاه داده (SQLite Database):</span>
                    <strong className="text-emerald-400 font-mono-tag">Connected • Optimized ✓</strong>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#262628]">
                    <span className="text-[#87868b]">رندرینگ و SSR فرانت‌اند (Next.js):</span>
                    <strong className="text-emerald-400 font-mono-tag">Turbopack • Fast ✓</strong>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#262628]">
                    <span className="text-[#87868b]">پایش متاتگ‌های سئو و ایندکس گوگل:</span>
                    <strong className="text-[#ff6600] font-mono-tag">Active & Verified ✓</strong>
                  </div>
                </div>
              </div>

              {/* ابزارهای سریع CMS و مدیریت صفحات */}
              <div className="p-6 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2c2c2e]">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#ff6600]" />
                    <h3 className="text-xs font-bold text-[#e5e2e1]">دسترسی سریع به تنظیمات CMS و صفحات</h3>
                  </div>
                  <span className="text-[10px] text-[#87868b]">مدیریت محتوا</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setActiveMenu("hero-cms")}
                    className="p-3.5 rounded-xl bg-[#141414] hover:bg-[#202022] border border-[#262628] hover:border-[#ff6600]/40 text-right transition-all group"
                  >
                    <Sliders className="w-4 h-4 text-[#ff6600] mb-2 group-hover:scale-110 transition-transform" />
                    <strong className="text-xs text-[#e5e2e1] block">هیروسکشن (Hero CMS)</strong>
                    <span className="text-[10px] text-[#87868b] mt-0.5 block">تیترها و عکس پس‌زمینه</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu("about-cms")}
                    className="p-3.5 rounded-xl bg-[#141414] hover:bg-[#202022] border border-[#262628] hover:border-[#ff6600]/40 text-right transition-all group"
                  >
                    <BookOpen className="w-4 h-4 text-[#ff6600] mb-2 group-hover:scale-110 transition-transform" />
                    <strong className="text-xs text-[#e5e2e1] block">درباره ما (About CMS)</strong>
                    <span className="text-[10px] text-[#87868b] mt-0.5 block">معرفی مربی و افتخارات</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu("packages-cms")}
                    className="p-3.5 rounded-xl bg-[#141414] hover:bg-[#202022] border border-[#262628] hover:border-[#ff6600]/40 text-right transition-all group"
                  >
                    <Flame className="w-4 h-4 text-[#ff6600] mb-2 group-hover:scale-110 transition-transform" />
                    <strong className="text-xs text-[#e5e2e1] block">تعرفه‌ها و پکیج‌ها</strong>
                    <span className="text-[10px] text-[#87868b] mt-0.5 block">قیمت دوره‌ها و ویژگی‌ها</span>
                  </button>

                  <button
                    onClick={() => setActiveMenu("seo")}
                    className="p-3.5 rounded-xl bg-[#141414] hover:bg-[#202022] border border-[#262628] hover:border-[#ff6600]/40 text-right transition-all group"
                  >
                    <Globe className="w-4 h-4 text-[#ff6600] mb-2 group-hover:scale-110 transition-transform" />
                    <strong className="text-xs text-[#e5e2e1] block">تنظیمات سئو (SEO)</strong>
                    <span className="text-[10px] text-[#87868b] mt-0.5 block">متاتگ‌ها و عنوان صفحه</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* میز کار اختصاصی برنامه‌نویسی و تدوین تمرین (Plan Builder View) */}
        {activeMenu === "plan-builder" && (
          <div className="mt-8 space-y-6 w-full pb-16 text-right">
            
            {/* پیام موفقیت ذخیره برنامه */}
            {planSaveNotice && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between gap-3 text-xs text-emerald-300 animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold">برنامه تمرینی قهرمان با موفقیت در دیتابیس ثبت و وضعیت پرونده به‌روزرسانی شد.</span>
                </div>
                <button 
                  onClick={() => setPlanSaveNotice(false)} 
                  className="text-emerald-400 hover:text-white p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* نوار انتخاب پرونده و کنترل وضعیت */}
            <div className="p-5 rounded-2xl bg-[#1a1a1a] border border-[#262626] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#e5e2e1] shrink-0">
                  <Dumbbell className="w-4 h-4 text-[#ff6600]" />
                  <span>انتخاب پرونده قهرمان:</span>
                </div>
                <select
                  value={builderOrder?.id || ""}
                  onChange={(e) => {
                    const sel = allPlanOrders.find((o) => o.id === Number(e.target.value));
                    if (sel) handleOpenPlanBuilder(sel);
                  }}
                  className="w-full max-w-md bg-[#121212] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none"
                >
                  <option value="">-- انتخاب پرونده قهرمان جهت برنامه‌نویسی --</option>
                  {allPlanOrders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.user_name} | {ord.package_title} ({ord.status === "ready" ? "تحویل شده" : ord.status === "preparing" ? "در حال تدوین" : "نیازمند بررسی"})
                    </option>
                  ))}
                </select>
              </div>

              {builderOrder && (
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94a3b8] font-medium">وضعیت فعلی:</span>
                    <select
                      value={builderStatus}
                      onChange={(e) => setBuilderStatus(e.target.value)}
                      className="bg-[#121212] border border-[#2e2e2e] rounded-xl px-3 py-2 text-xs text-[#e5e2e1] font-bold focus:border-[#ff6600] focus:outline-none"
                    >
                      <option value="reviewing">نیازمند بررسی</option>
                      <option value="preparing">در حال تدوین</option>
                      <option value="ready">آماده و فعال در پنل قهرمان</option>
                      <option value="completed">پایان دوره</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleSavePlanBuilder()}
                    disabled={isSavingPlan}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] border border-[#333333] text-xs font-bold text-[#e5e2e1] transition-all disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5 text-[#ff6600]" />
                    <span>{isSavingPlan ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
                  </button>

                  <button
                    onClick={() => handleSavePlanBuilder("ready")}
                    disabled={isSavingPlan}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تایید نهایی و تحویل به قهرمان</span>
                  </button>
                </div>
              )}
            </div>

            {/* حالت بدون پرونده انتخاب‌شده */}
            {!builderOrder ? (
              <div className="p-12 rounded-2xl bg-[#1a1a1a] border border-[#262626] text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#ff6600]/10 border border-[#ff6600]/20 flex items-center justify-center mx-auto text-[#ff6600]">
                  <Dumbbell className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#e5e2e1]">هیچ پرونده‌ای برای برنامه‌نویسی انتخاب نشده است</h3>
                <p className="text-xs text-[#94a3b8] max-w-md mx-auto leading-relaxed">
                  می‌توانید از منوی بالا یک قهرمان را انتخاب کنید، یا از لیست درخواست‌های زیر مستقیماً دکمه «برنامه‌نویسی» را بزنید.
                </p>

                {allPlanOrders.length > 0 && (
                  <div className="pt-6 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                    {allPlanOrders.slice(0, 6).map((order) => (
                      <div
                        key={order.id}
                        onClick={() => handleOpenPlanBuilder(order)}
                        className="p-4 rounded-xl bg-[#141414] hover:bg-[#202020] border border-[#262626] hover:border-[#ff6600]/50 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-1">
                          <strong className="text-xs text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors block">
                            {order.user_name}
                          </strong>
                          <span className="text-[11px] text-[#64748b] block">
                            {order.package_title} • {order.height}cm / {order.weight}kg
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {order.status === "reviewing" && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                              جدید
                            </span>
                          )}
                          <ArrowLeft className="w-4 h-4 text-[#64748b] group-hover:text-[#ff6600] group-hover:-translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* طرح دو ستونه: سمت راست مشخصات قهرمان + تصاویر، سمت چپ ادیتور برنامه مربی */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ستون راست: اطلاعات پرونده و وضعیت بدنی قهرمان (lg:col-span-5 xl:col-span-4) */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                  
                  {/* کارت مشخصات فردی قهرمان */}
                  <div className="p-5 rounded-2xl bg-[#1a1a1a] border border-[#262626] space-y-4">
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#262626]">
                      <div>
                        <h3 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-[#ff6600]" />
                          <span>{builderOrder.user_name}</span>
                        </h3>
                        <p className="text-[11px] text-[#64748b] mt-0.5 font-mono-tag" dir="ltr">
                          {builderOrder.user_email}
                        </p>
                        {builderOrder.user_phone && (
                          <a
                            href={`tel:${builderOrder.user_phone}`}
                            className="text-[11px] text-[#ff6600] hover:underline font-mono-tag flex items-center gap-1 mt-1"
                            dir="ltr"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{builderOrder.user_phone}</span>
                          </a>
                        )}
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#ff6600]/10 border border-[#ff6600]/30 text-[#ff6600] text-[10px] font-bold">
                        {builderOrder.package_title}
                      </span>
                    </div>

                    {/* گرید بیومتریک و BMI */}
                    <div>
                      <span className="text-[11px] font-bold text-[#94a3b8] block mb-2">مشخصات فیزیکی و توده بدنی:</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#141414] border border-[#262626]">
                          <span className="text-[10px] text-[#64748b] block">قد و وزن:</span>
                          <span className="font-bold text-[#e5e2e1] font-mono-tag">{builderOrder.height} cm / {builderOrder.weight} kg</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#141414] border border-[#262626]">
                          <span className="text-[10px] text-[#64748b] block">سن و جنسیت:</span>
                          <span className="font-bold text-[#e5e2e1]">{builderOrder.age} سال ({builderOrder.gender === "female" ? "بانو" : "آقا"})</span>
                        </div>
                      </div>

                      {/* شاخص BMI محاسبه‌شده */}
                      {builderOrder.height && builderOrder.weight && (
                        <div className="mt-2 p-3 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#64748b] block">شاخص توده بدنی (BMI):</span>
                            <span className="text-sm font-black text-[#e5e2e1] font-mono-tag">
                              {(builderOrder.weight / Math.pow(builderOrder.height / 100, 2)).toFixed(1)}
                            </span>
                          </div>
                          {(() => {
                            const bmi = builderOrder.weight / Math.pow(builderOrder.height / 100, 2);
                            if (bmi < 18.5) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">کم‌وزن</span>;
                            if (bmi < 25) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">نرمال و متناسب</span>;
                            if (bmi < 30) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">اضافه وزن</span>;
                            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">چاقی</span>;
                          })()}
                        </div>
                      )}
                    </div>

                    {/* جزییات تمرینی و هدف قهرمان */}
                    <div className="space-y-2 pt-2 border-t border-[#262626] text-xs">
                      <div className="flex justify-between py-1 border-b border-[#222222]">
                        <span className="text-[#64748b]">هدف دوره:</span>
                        <strong className="text-[#e5e2e1]">
                          {builderOrder.primary_goal === "hypertrophy"
                            ? "عضله‌سازی و هایپرتروفی"
                            : builderOrder.primary_goal === "weight_loss"
                            ? "چربی‌سوزی و کاهش وزن"
                            : builderOrder.primary_goal === "recomp"
                            ? "ریکامپوزیشن (ترکیب حجم و کات)"
                            : builderOrder.primary_goal === "strength"
                            ? "افزایش قدرت و توان"
                            : builderOrder.primary_goal || "عمومی"}
                        </strong>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#222222]">
                        <span className="text-[#64748b]">محیط تمرین:</span>
                        <strong className="text-[#e5e2e1]">
                          {builderOrder.training_location === "gym" ? "باشگاه با امکانات کامل" : "منزل"}
                        </strong>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#222222]">
                        <span className="text-[#64748b]">سابقه تمرینی:</span>
                        <strong className="text-[#e5e2e1]">
                          {builderOrder.experience_level === "beginner"
                            ? "مبتدی (کمتر از ۶ ماه)"
                            : builderOrder.experience_level === "intermediate"
                            ? "متوسط (۶ ماه تا ۲ سال)"
                            : builderOrder.experience_level === "advanced"
                            ? "پیشرفته (بیش از ۲ سال)"
                            : builderOrder.experience_level || "متوسط"}
                        </strong>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#222222]">
                        <span className="text-[#64748b]">روزهای تمرین در هفته:</span>
                        <strong className="text-[#e5e2e1]">{builderOrder.days_per_week || "۴"} روز</strong>
                      </div>
                    </div>

                    {/* آسیب‌دیدگی‌ها و محدودیت‌ها (با هشدار) */}
                    {builderOrder.injuries ? (
                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-1">
                        <span className="font-bold text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>هشدار آسیب‌دیدگی / محدودیت:</span>
                        </span>
                        <p className="text-[#e5e2e1] leading-relaxed">{builderOrder.injuries}</p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-[#141414] border border-[#262626] text-[11px] text-[#64748b]">
                        ✓ بدون گزارش آسیب‌دیدگی یا محدودیت اسکلتی عضلانی
                      </div>
                    )}

                    {/* اطلاعات تغذیه و آلرژی‌ها */}
                    {(builderOrder.dietary_restrictions || builderOrder.daily_meals_count) && (
                      <div className="space-y-1 pt-2 border-t border-[#262626] text-xs">
                        <span className="text-[11px] font-bold text-[#94a3b8] flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-[#ff6600]" />
                          <span>عادات غذایی و آلرژی‌ها:</span>
                        </span>
                        {builderOrder.dietary_restrictions && (
                          <p className="text-[11px] text-[#e5e2e1]/90 bg-[#141414] p-2.5 rounded-xl border border-[#262626] leading-relaxed">
                            {builderOrder.dietary_restrictions}
                          </p>
                        )}
                        {builderOrder.daily_meals_count && (
                          <span className="text-[10px] text-[#64748b] block">
                            تعداد وعده ترجیحی: {builderOrder.daily_meals_count} وعده در روز
                          </span>
                        )}
                      </div>
                    )}

                    {/* توضیحات و یادداشت ارسالی قهرمان */}
                    {builderOrder.coach_notes && (
                      <div className="space-y-1 pt-2 border-t border-[#262626] text-xs">
                        <span className="text-[11px] font-bold text-[#94a3b8]">یادداشت و پرسشنامه قهرمان:</span>
                        <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] text-[11px] text-[#cbd5e1] leading-relaxed whitespace-pre-line">
                          {builderOrder.coach_notes}
                        </div>
                      </div>
                    )}

                    {/* تصاویر ارسالی قهرمان از ۴ زاویه */}
                    <div className="pt-2 border-t border-[#262626] space-y-2">
                      <span className="text-[11px] font-bold text-[#94a3b8] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#ff6600]" />
                        <span>تصاویر ارسالی قهرمان (جهت بررسی وضعیت عضلانی):</span>
                      </span>

                      {(() => {
                        let parsedPhotos: any = null;
                        if (builderOrder.photos_json) {
                          try {
                            parsedPhotos = JSON.parse(builderOrder.photos_json);
                          } catch (e) {
                            console.error(e);
                          }
                        }
                        const angles = [
                          { key: "front", label: "روبرو" },
                          { key: "back", label: "پشت" },
                          { key: "right", label: "نیم‌رخ راست" },
                          { key: "left", label: "نیم‌رخ چپ" },
                        ];

                        const hasAnyPhoto = parsedPhotos && angles.some((a) => Boolean(parsedPhotos[a.key]));

                        if (!hasAnyPhoto) {
                          return (
                            <div className="p-3 rounded-xl bg-[#141414] border border-[#262626] text-center text-[11px] text-[#64748b]">
                              تصویر قدی توسط قهرمان بارگذاری نشده است.
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-2 gap-2">
                            {angles.map((a) => {
                              const photoSrc = parsedPhotos ? parsedPhotos[a.key] : null;
                              return (
                                <div
                                  key={a.key}
                                  className="relative group rounded-xl overflow-hidden bg-[#141414] border border-[#262626] aspect-[3/4] flex items-center justify-center"
                                >
                                  {photoSrc ? (
                                    <>
                                      <img
                                        src={photoSrc}
                                        alt={a.label}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                                        onClick={() => setBuilderPreviewPhoto(photoSrc)}
                                      />
                                      <div 
                                        onClick={() => setBuilderPreviewPhoto(photoSrc)}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-white"
                                      >
                                        <Eye className="w-5 h-5 text-[#ff6600]" />
                                        <span className="text-[10px] font-bold">بزرگ‌نمایی {a.label}</span>
                                      </div>
                                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">
                                        {a.label}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-[10px] text-[#64748b]">{a.label}: ندارد</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* ستون چپ: میز کار تدوین مربی (lg:col-span-7 xl:col-span-8) */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                  
                  {/* تب‌های ویرایشگر برنامه مربی */}
                  <div className="p-1 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center gap-1">
                    <button
                      onClick={() => setBuilderActiveTab("workout")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        builderActiveTab === "workout"
                          ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/20"
                          : "text-[#94a3b8] hover:text-[#e5e2e1] hover:bg-[#202020]"
                      }`}
                    >
                      <Dumbbell className="w-4 h-4" />
                      <span>برنامه تمرینی اختصاصی</span>
                    </button>

                    <button
                      onClick={() => setBuilderActiveTab("diet")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        builderActiveTab === "diet"
                          ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/20"
                          : "text-[#94a3b8] hover:text-[#e5e2e1] hover:bg-[#202020]"
                      }`}
                    >
                      <Utensils className="w-4 h-4" />
                      <span>برنامه و توصیه‌های تغذیه</span>
                    </button>

                    <button
                      onClick={() => setBuilderActiveTab("feedback")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        builderActiveTab === "feedback"
                          ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/20"
                          : "text-[#94a3b8] hover:text-[#e5e2e1] hover:bg-[#202020]"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>پیام و نکات مربی</span>
                    </button>

                    <button
                      onClick={() => setBuilderActiveTab("files")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        builderActiveTab === "files"
                          ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/20"
                          : "text-[#94a3b8] hover:text-[#e5e2e1] hover:bg-[#202020]"
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>پیوست فایل PDF</span>
                    </button>
                  </div>

                  {/* بدنه تب ۱: برنامه تمرینی */}
                  {builderActiveTab === "workout" && (
                    <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#262626] space-y-5">
                      {/* نوار سربرگ، سوئیچ حالت و قالب‌های آماده */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262626]">
                        <div>
                          <h4 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                            <Dumbbell className="w-4 h-4 text-[#ff6600]" />
                            <span>طراحی و برنامه‌نویسی روزهای تمرین</span>
                          </h4>
                          <p className="text-xs text-[#64748b] mt-0.5">
                            جدول تفکیکی حرکات بر اساس روزهای هفته، تعداد ست، تکرار و استراحت
                          </p>
                        </div>

                        {/* انتخاب حالت ادیتور + قالب آماده */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="p-1 rounded-xl bg-[#121212] border border-[#262626] flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setBuilderWorkoutMode("table")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                builderWorkoutMode === "table"
                                  ? "bg-[#ff6600] text-white shadow-sm"
                                  : "text-[#94a3b8] hover:text-white"
                              }`}
                            >
                              طراحی جدولی
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setBuilderWorkoutText(generateTextFromDays(builderDays));
                                setBuilderWorkoutMode("text");
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                builderWorkoutMode === "text"
                                  ? "bg-[#ff6600] text-white shadow-sm"
                                  : "text-[#94a3b8] hover:text-white"
                              }`}
                            >
                              ویرایش متنی آزاد
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => applyWorkoutTemplate("split")}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#2c2c2e] border border-[#2e2e2e] text-[11px] text-[#cbd5e1] hover:text-[#ff6600] transition-all"
                            >
                              اسپلیت ۴ روزه
                            </button>
                            <button
                              type="button"
                              onClick={() => applyWorkoutTemplate("fullbody")}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#2c2c2e] border border-[#2e2e2e] text-[11px] text-[#cbd5e1] hover:text-[#ff6600] transition-all"
                            >
                              فول‌بادی ۳ روزه
                            </button>
                            <button
                              type="button"
                              onClick={() => applyWorkoutTemplate("home")}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#2c2c2e] border border-[#2e2e2e] text-[11px] text-[#cbd5e1] hover:text-[#ff6600] transition-all"
                            >
                              منزل
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* حالت جدول هوشمند */}
                      {builderWorkoutMode === "table" ? (
                        <div className="space-y-4">
                          {/* نوار انتخاب روزهای تمرین (Tabs) */}
                          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#242424]">
                            {builderDays.map((day, dIdx) => (
                              <button
                                key={day.id || dIdx}
                                type="button"
                                onClick={() => setBuilderActiveDayIndex(dIdx)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                  builderActiveDayIndex === dIdx
                                    ? "bg-[#ff6600] text-white shadow-lg shadow-[#ff6600]/20"
                                    : "bg-[#141414] hover:bg-[#202020] text-[#94a3b8] hover:text-[#e5e2e1] border border-[#262626]"
                                }`}
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{day.dayTitle.split(":")[0] || `روز ${dIdx + 1}`}</span>
                                <span className="px-1.5 py-0.5 rounded-full bg-black/30 text-[10px]">
                                  {day.exercises.length}
                                </span>
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={handleAddDay}
                              className="px-3 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#2c2c2e] border border-dashed border-[#3a3a3a] hover:border-[#ff6600] text-xs font-bold text-[#94a3b8] hover:text-[#ff6600] transition-all flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>افزودن روز تمرینی</span>
                            </button>
                          </div>

                          {/* محتوای روز فعال */}
                          {builderDays[builderActiveDayIndex] && (() => {
                            const currentDay = builderDays[builderActiveDayIndex];
                            return (
                              <div className="space-y-4">
                                {/* فیلد عنوان روز تمرینی و دکمه حذف روز */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#141414] border border-[#262626]">
                                  <div className="flex-1 flex items-center gap-3">
                                    <span className="text-xs font-bold text-[#94a3b8] shrink-0">عنوان این روز:</span>
                                    <input
                                      type="text"
                                      value={currentDay.dayTitle}
                                      onChange={(e) => handleUpdateDayTitle(builderActiveDayIndex, e.target.value)}
                                      placeholder="مثال: روز اول: عضلات سینه و پشت بازو"
                                      className="w-full bg-[#0d0d0d] border border-[#2c2c2c] rounded-lg px-3 py-2 text-xs font-bold text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none"
                                    />
                                  </div>

                                  {builderDays.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveDay(builderActiveDayIndex)}
                                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 shrink-0 px-2 py-1 hover:bg-rose-500/10 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>حذف این روز</span>
                                    </button>
                                  )}
                                </div>

                                {/* جدول حرکات این روز */}
                                <div className="overflow-x-auto rounded-xl border border-[#262626]">
                                  <table className="w-full text-right text-xs">
                                    <thead className="bg-[#121212] text-[#94a3b8] font-bold border-b border-[#262626]">
                                      <tr>
                                        <th className="p-3 w-12 text-center">#</th>
                                        <th className="p-3 min-w-[200px]">نام حرکت ورزشی</th>
                                        <th className="p-3 w-28 text-center">تعداد ست</th>
                                        <th className="p-3 w-32 text-center">تکرار هر ست</th>
                                        <th className="p-3 w-36">زمان استراحت</th>
                                        <th className="p-3 min-w-[160px]">نکات و سیستم تمرین</th>
                                        <th className="p-3 w-12 text-center">حذف</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#222222] bg-[#161616]">
                                      {currentDay.exercises.map((ex, exIdx) => (
                                        <tr key={ex.id || exIdx} className="hover:bg-[#1c1c1c] transition-colors">
                                          <td className="p-2.5 text-center text-[#64748b] font-mono-tag">
                                            {exIdx + 1}
                                          </td>
                                          <td className="p-2.5">
                                            <input
                                              type="text"
                                              value={ex.name}
                                              onChange={(e) => handleUpdateExercise(builderActiveDayIndex, exIdx, "name", e.target.value)}
                                              placeholder="مثال: پرس بالا سینه هالتر"
                                              className="w-full bg-[#101010] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs font-bold text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none"
                                            />
                                          </td>
                                          <td className="p-2.5 text-center">
                                            <input
                                              type="number"
                                              min="1"
                                              max="20"
                                              value={ex.sets}
                                              onChange={(e) => handleUpdateExercise(builderActiveDayIndex, exIdx, "sets", e.target.value)}
                                              placeholder="4"
                                              className="w-20 mx-auto bg-[#101010] border border-[#2a2a2a] rounded-lg px-2 py-2 text-xs font-bold text-center text-amber-400 focus:border-[#ff6600] focus:outline-none"
                                            />
                                          </td>
                                          <td className="p-2.5 text-center">
                                            <input
                                              type="text"
                                              value={ex.reps}
                                              onChange={(e) => handleUpdateExercise(builderActiveDayIndex, exIdx, "reps", e.target.value)}
                                              placeholder="10-12"
                                              className="w-24 mx-auto bg-[#101010] border border-[#2a2a2a] rounded-lg px-2 py-2 text-xs font-bold text-center text-sky-400 focus:border-[#ff6600] focus:outline-none"
                                            />
                                          </td>
                                          <td className="p-2.5">
                                            <input
                                              type="text"
                                              value={ex.rest || ""}
                                              onChange={(e) => handleUpdateExercise(builderActiveDayIndex, exIdx, "rest", e.target.value)}
                                              placeholder="۶۰ تا ۹۰ ثانیه"
                                              className="w-full bg-[#101010] border border-[#2a2a2a] rounded-lg px-2.5 py-2 text-xs text-[#cbd5e1] focus:border-[#ff6600] focus:outline-none"
                                            />
                                          </td>
                                          <td className="p-2.5">
                                            <input
                                              type="text"
                                              value={ex.notes || ""}
                                              onChange={(e) => handleUpdateExercise(builderActiveDayIndex, exIdx, "notes", e.target.value)}
                                              placeholder="مثال: ست آخر دراپ‌ست، مکث ۲ ثانیه"
                                              className="w-full bg-[#101010] border border-[#2a2a2a] rounded-lg px-2.5 py-2 text-xs text-[#94a3b8] focus:border-[#ff6600] focus:outline-none"
                                            />
                                          </td>
                                          <td className="p-2.5 text-center">
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveExercise(builderActiveDayIndex, exIdx)}
                                              className="p-1.5 text-[#64748b] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                              title="حذف حرکت"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}

                                      {currentDay.exercises.length === 0 && (
                                        <tr>
                                          <td colSpan={7} className="p-8 text-center text-xs text-[#64748b]">
                                            هنوز حرکتی برای این روز تعریف نشده است. از دکمه زیر برای افزودن اولین حرکت استفاده کنید.
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>

                                {/* دکمه افزودن حرکت جدید به روز فعال */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => handleAddExercise(builderActiveDayIndex)}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6600]/10 hover:bg-[#ff6600]/20 border border-[#ff6600]/30 text-xs font-bold text-[#ff6600] transition-all"
                                  >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>افزودن حرکت جدید به {currentDay.dayTitle.split(":")[0] || `روز ${builderActiveDayIndex + 1}`}</span>
                                  </button>

                                  <div className="flex items-center gap-4 text-xs text-[#64748b]">
                                    <span>مجموع حرکات این روز: <strong className="text-[#e5e2e1]">{currentDay.exercises.length}</strong></span>
                                    <span>مجموع ست‌ها: <strong className="text-amber-400">{currentDay.exercises.reduce((acc, x) => acc + (Number(x.sets) || 0), 0)}</strong> ست</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        /* حالت ویرایشگر متنی آزاد */
                        <div className="space-y-2">
                          <textarea
                            value={builderWorkoutText}
                            onChange={(e) => setBuilderWorkoutText(e.target.value)}
                            rows={18}
                            placeholder={`مثال برای نگارش برنامه تمرینی:\n\n### روز اول: عضلات سینه و پشت بازو\n1. پرس بالا سینه هالتر | ۴ ست × ۸-۱۰ تکرار (استراحت: ۹۰ ثانیه)\n2. پرس سینه دمبل موازی | ۴ ست × ۱۰-۱۲ تکرار\n3. قفسه سینه سیم‌کش | ۳ ست × ۱۵ تکرار\n4. پشت بازو سیم‌کش طناب | ۴ ست × ۱۲-۱۵ تکرار\n\n### روز دوم: عضلات پشت و جلو بازو...`}
                            className="w-full bg-[#121212] border border-[#2e2e2e] rounded-xl p-4 text-xs font-mono text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none leading-relaxed transition-colors"
                            dir="rtl"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const parsed = parseWorkoutContent(builderWorkoutText);
                                setBuilderDays(parsed);
                                setBuilderWorkoutMode("table");
                              }}
                              className="text-xs text-[#ff6600] hover:underline font-bold"
                            >
                              تبدیل این متن به جدول روزبه‌روز ←
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* بدنه تب ۲: برنامه و توصیه‌های تغذیه (متن آزاد با فیلتربندی وعده‌ها) */}
                  {builderActiveTab === "diet" && (
                    <div className="p-6 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] space-y-5">
                      {/* هدر: عنوان، کلیدهای قالب آماده و سوئیچ حالت فیلتربندی/متن یکپارچه */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#2c2c2e]">
                        <div>
                          <h4 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-[#ff6600]" />
                            <span>برنامه غذایی و رژیم (متن آزاد با فیلتربندی وعده‌ها)</span>
                          </h4>
                          <p className="text-xs text-[#87868b] mt-0.5">
                            وعده‌های روزانه را به صورت متن آزاد و با فیلتربندی هر وعده وارد نمایید تا قهرمان به تفکیک وعده‌ها دسترسی داشته باشد.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* انتخاب حالت: فیلتربندی وعده‌ها یا متن آزاد یکپارچه */}
                          <div className="p-1 rounded-xl bg-[#141414] border border-[#2c2c2e] flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setBuilderDietMode("filtered")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                builderDietMode === "filtered"
                                  ? "bg-[#ff6600] text-white shadow-sm"
                                  : "text-[#87868b] hover:text-white"
                              }`}
                            >
                              <Filter className="w-3.5 h-3.5" />
                              <span>فیلتربندی وعده‌ها</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setBuilderDietText(generateDietTextFromCategories(builderDietCategories));
                                setBuilderDietMode("unified");
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                builderDietMode === "unified"
                                  ? "bg-[#ff6600] text-white shadow-sm"
                                  : "text-[#87868b] hover:text-white"
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>متن آزاد یکپارچه</span>
                            </button>
                          </div>

                          {/* کلیدهای سریع قالب رژیم */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#87868b]">قالب آماده:</span>
                            <button
                              type="button"
                              onClick={() => applyDietTemplate("bulk")}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#222224] border border-[#2c2c2e] text-[11px] text-[#e5e2e1] hover:text-[#ff6600] transition-all"
                            >
                              حجم تمیز (Bulk)
                            </button>
                            <button
                              type="button"
                              onClick={() => applyDietTemplate("cut")}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#222224] border border-[#2c2c2e] text-[11px] text-[#e5e2e1] hover:text-[#ff6600] transition-all"
                            >
                              چربی‌سوزی (Cut)
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ویجت جمع‌وجور و مرتب محاسبه کالری و برنامه‌ریز رژیم زیگزاگی (TDEE & Calorie Cycling) */}
                      {(() => {
                        const bmrVal = Math.round(
                          calorieGender === "female"
                            ? 10 * calorieWeight + 6.25 * calorieHeight - 5 * calorieAge - 161
                            : 10 * calorieWeight + 6.25 * calorieHeight - 5 * calorieAge + 5
                        );

                        const actMultipliers: Record<string, { label: string; mult: number }> = {
                          sedentary: { label: "کم‌تحرک", mult: 1.2 },
                          light: { label: "سبک (۱-۲ روز)", mult: 1.375 },
                          moderate: { label: "متوسط (۳-۴ روز)", mult: 1.55 },
                          heavy: { label: "سنگین (۵-۶ روز)", mult: 1.725 },
                          athlete: { label: "حرفه‌ای", mult: 1.9 },
                        };

                        const currentMult = actMultipliers[calorieActivity]?.mult || 1.55;
                        const tdeeVal = Math.round(bmrVal * currentMult);

                        let targetDaily = tdeeVal;
                        if (calorieCustomTarget > 0) {
                          targetDaily = calorieCustomTarget;
                        } else if (calorieGoal === "cut") {
                          targetDaily = Math.round(tdeeVal * 0.8);
                        } else if (calorieGoal === "bulk") {
                          targetDaily = Math.round(tdeeVal * 1.1);
                        } else if (calorieGoal === "recomp") {
                          targetDaily = tdeeVal;
                        }

                        const weeklyBudget = targetDaily * 7;
                        const lowCal = Math.round(weeklyBudget / 7.5);
                        const highCal = Math.round(lowCal * 1.25);

                        return (
                          <div className="rounded-2xl bg-[#141414] border border-[#2c2c2e] overflow-hidden shadow-lg transition-all">
                            {/* نوار اصلی و خلاصه کالری (Compact Summary Bar) */}
                            <div className="p-3.5 sm:p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
                              {/* بخش سمت راست: آیکون و معرفی هدف */}
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#542201] text-[#ff6600] flex items-center justify-center shrink-0">
                                  <Flame className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#e5e2e1]">
                                      محاسبه‌گر کالری و رژیم زیگزاگی
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff6600]/15 text-[#ff6600] border border-[#ff6600]/30 font-bold">
                                      {calorieGoal === "cut"
                                        ? "چربی‌سوزی (-۲۰٪)"
                                        : calorieGoal === "bulk"
                                        ? "حجم تمیز (+۱۰٪)"
                                        : "تثبیت و ریکامپ"}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#87868b] mt-0.5">
                                    وزن {calorieWeight}kg • قد {calorieHeight}cm • سن {calorieAge} سال
                                  </p>
                                </div>
                              </div>

                              {/* بخش میانی: نمایش ارقام هوشمند BMR، TDEE و مقادیر زیگزاگ */}
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#1a1a1c] p-2 rounded-xl border border-[#262628] text-xs">
                                <div className="px-2 py-1 rounded-lg bg-[#141414] border border-[#222224] flex items-center gap-1.5">
                                  <span className="text-[10px] text-[#87868b]">BMR:</span>
                                  <strong className="text-[#e5e2e1] font-mono-tag">{bmrVal.toLocaleString("fa-IR")}</strong>
                                  <span className="text-[9px] text-[#64748b]">kcal</span>
                                </div>

                                <div className="px-2 py-1 rounded-lg bg-[#141414] border border-[#222224] flex items-center gap-1.5">
                                  <span className="text-[10px] text-[#87868b]">TDEE:</span>
                                  <strong className="text-amber-400 font-mono-tag">{tdeeVal.toLocaleString("fa-IR")}</strong>
                                  <span className="text-[9px] text-[#64748b]">kcal</span>
                                </div>

                                {calorieZigzagMethod === "2high" ? (
                                  <>
                                    <div className="px-2.5 py-1 rounded-lg bg-[#ff6600]/15 border border-[#ff6600]/30 flex items-center gap-1.5">
                                      <span className="text-[10px] text-[#ff6600] font-bold">۲ روز پرکالری ⚡:</span>
                                      <strong className="text-[#ff6600] font-mono-tag font-bold">{highCal.toLocaleString("fa-IR")}</strong>
                                      <span className="text-[9px] text-[#ff6600]/70">kcal</span>
                                    </div>
                                    <div className="px-2.5 py-1 rounded-lg bg-[#141414] border border-[#2c2c2e] flex items-center gap-1.5">
                                      <span className="text-[10px] text-[#87868b]">۵ روز کم‌کالری 📉:</span>
                                      <strong className="text-emerald-400 font-mono-tag">{lowCal.toLocaleString("fa-IR")}</strong>
                                      <span className="text-[9px] text-[#64748b]">kcal</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="px-2.5 py-1 rounded-lg bg-[#ff6600]/15 border border-[#ff6600]/30 flex items-center gap-1.5">
                                    <span className="text-[10px] text-[#ff6600] font-bold">هدف روزانه:</span>
                                    <strong className="text-[#ff6600] font-mono-tag font-bold">{targetDaily.toLocaleString("fa-IR")}</strong>
                                    <span className="text-[9px] text-[#ff6600]/70">kcal</span>
                                  </div>
                                )}
                              </div>

                              {/* بخش سمت چپ: دکمه‌های اکشن */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleInsertZigzagIntoDiet(bmrVal, tdeeVal, targetDaily, weeklyBudget, lowCal, highCal)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                                    calorieInsertSuccess
                                      ? "bg-emerald-600 text-white"
                                      : "bg-[#ff6600] hover:bg-[#ff8532] text-white"
                                  }`}
                                  title="درج جدول کامل زیگزاگ در برنامه غذایی"
                                >
                                  {calorieInsertSuccess ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>درج شد! ✓</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5" />
                                      <span>درج جدول زیگزاگ</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setIsCalorieCalculatorOpen((prev) => !prev)}
                                  className="px-2.5 py-1.5 rounded-xl bg-[#1a1a1c] hover:bg-[#222224] text-[#87868b] hover:text-white border border-[#2c2c2e] text-xs font-medium transition-all flex items-center gap-1"
                                >
                                  <Sliders className="w-3 h-3 text-[#ff6600]" />
                                  <span>{isCalorieCalculatorOpen ? "بستن جدول" : "تنظیمات و جدول ۷ روزه"}</span>
                                  {isCalorieCalculatorOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            {/* جزئیات و جدول ۷ روزه منظم (تنها در صورت باز شدن) */}
                            {isCalorieCalculatorOpen && (
                              <div className="p-4 sm:p-5 border-t border-[#2c2c2e] bg-[#101011] space-y-4">
                                {/* ردیف تنظیمات سریع و مینیمال */}
                                <div className="p-3.5 rounded-xl bg-[#18181a] border border-[#262628] flex flex-wrap items-center justify-between gap-3 text-xs">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] text-[#87868b]">هدف:</span>
                                      <select
                                        value={calorieGoal}
                                        onChange={(e) => setCalorieGoal(e.target.value as any)}
                                        className="bg-[#141414] border border-[#2c2c2e] text-white text-xs px-2.5 py-1 rounded-lg focus:border-[#ff6600] focus:outline-none"
                                      >
                                        <option value="cut">چربی‌سوزی (-۲۰٪)</option>
                                        <option value="bulk">افزایش حجم (+۱۰٪)</option>
                                        <option value="recomp">تثبیت و ریکامپ</option>
                                        <option value="custom">دستی...</option>
                                      </select>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] text-[#87868b]">فعالیت:</span>
                                      <select
                                        value={calorieActivity}
                                        onChange={(e) => setCalorieActivity(e.target.value as any)}
                                        className="bg-[#141414] border border-[#2c2c2e] text-white text-xs px-2.5 py-1 rounded-lg focus:border-[#ff6600] focus:outline-none"
                                      >
                                        <option value="sedentary">کم‌تحرک (۱.۲×)</option>
                                        <option value="light">سبک (۱.۳۷۵×)</option>
                                        <option value="moderate">متوسط (۱.۵۵×)</option>
                                        <option value="heavy">سنگین (۱.۷۲۵×)</option>
                                        <option value="athlete">حرفه‌ای (۱.۹×)</option>
                                      </select>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] text-[#87868b]">مدل زیگزاگ:</span>
                                      <select
                                        value={calorieZigzagMethod}
                                        onChange={(e) => setCalorieZigzagMethod(e.target.value as any)}
                                        className="bg-[#141414] border border-[#2c2c2e] text-white text-xs px-2.5 py-1 rounded-lg focus:border-[#ff6600] focus:outline-none"
                                      >
                                        <option value="2high">۲ روز پرکالری + ۵ روز کم‌کالری</option>
                                        <option value="workout">روزهای تمرین بالا / استراحت پایین</option>
                                        <option value="alternate">تناوبی (یک روز در میان)</option>
                                        <option value="linear">کالری یکنواخت و ثابت</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* انتخاب ۲ روز پرکالری */}
                                  {calorieZigzagMethod === "2high" && (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] text-[#87868b]">روزهای پرکالری:</span>
                                      <div className="flex items-center gap-1">
                                        {ZIGZAG_WEEK_DAYS.map((d) => {
                                          const isHigh = zigzagHighDays.includes(d.key);
                                          return (
                                            <button
                                              key={d.key}
                                              type="button"
                                              onClick={() => {
                                                if (isHigh) {
                                                  setZigzagHighDays((prev) => prev.filter((k) => k !== d.key));
                                                } else {
                                                  if (zigzagHighDays.length >= 2) {
                                                    setZigzagHighDays([zigzagHighDays[1], d.key]);
                                                  } else {
                                                    setZigzagHighDays((prev) => [...prev, d.key]);
                                                  }
                                                }
                                              }}
                                              className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                                                isHigh
                                                  ? "bg-[#ff6600] text-white shadow-sm font-black"
                                                  : "bg-[#141414] text-[#87868b] hover:text-white border border-[#2c2c2e]"
                                              }`}
                                              title={`${d.name} (${isHigh ? "پرکالری" : "کم‌کالری"})`}
                                            >
                                              {d.name.slice(0, 1)}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* جدول افقی منظم ۷ روز هفته */}
                                <div className="overflow-x-auto rounded-xl border border-[#262628] bg-[#141414]">
                                  <table className="w-full text-right text-xs">
                                    <thead className="bg-[#1a1a1c] text-[#87868b] font-bold border-b border-[#262628]">
                                      <tr>
                                        <th className="p-3">روز هفته</th>
                                        <th className="p-3">وضعیت روز</th>
                                        <th className="p-3">کالری روزانه</th>
                                        <th className="p-3">پروتئین (~۲.۱g)</th>
                                        <th className="p-3">کربوهیدرات</th>
                                        <th className="p-3">چربی (۲۵٪)</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#222224]">
                                      {ZIGZAG_WEEK_DAYS.map((d) => {
                                        let cal = targetDaily;
                                        let isHigh = false;
                                        let label = "متعادل";

                                        if (calorieZigzagMethod === "2high") {
                                          isHigh = zigzagHighDays.includes(d.key);
                                          cal = isHigh ? highCal : lowCal;
                                          label = isHigh ? "⚡ پرکالری (ریفید)" : "📉 کم‌کالری (چربی‌سوزی)";
                                        } else if (calorieZigzagMethod === "workout") {
                                          const isTrain = ["sat", "mon", "wed", "thu"].includes(d.key);
                                          const tCal = Math.round(targetDaily * 1.12);
                                          cal = isTrain ? tCal : Math.round((weeklyBudget - 4 * tCal) / 3);
                                          isHigh = isTrain;
                                          label = isTrain ? "⚡ روز تمرین" : "📉 روز استراحت";
                                        } else if (calorieZigzagMethod === "alternate") {
                                          const isAlt = ["sat", "mon", "wed", "fri"].includes(d.key);
                                          const hCal = Math.round(targetDaily * 1.1);
                                          cal = isAlt ? hCal : Math.round((weeklyBudget - 4 * hCal) / 3);
                                          isHigh = isAlt;
                                          label = isAlt ? "⚡ تناوبی بالا" : "📉 تناوبی پایین";
                                        } else {
                                          label = "⚖️ یکنواخت";
                                        }

                                        const pG = Math.round(calorieWeight * 2.1);
                                        const fG = Math.round((cal * 0.25) / 9);
                                        const cG = Math.max(0, Math.round((cal - pG * 4 - fG * 9) / 4));

                                        return (
                                          <tr
                                            key={d.key}
                                            className={`transition-colors ${
                                              isHigh ? "bg-[#ff6600]/5 hover:bg-[#ff6600]/10" : "hover:bg-[#1a1a1c]"
                                            }`}
                                          >
                                            <td className="p-3 font-bold text-[#e5e2e1]">{d.name}</td>
                                            <td className="p-3">
                                              <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                  isHigh
                                                    ? "bg-[#ff6600]/20 text-[#ff6600] border border-[#ff6600]/30"
                                                    : "bg-[#222224] text-[#87868b]"
                                                }`}
                                              >
                                                {label}
                                              </span>
                                            </td>
                                            <td className="p-3 font-mono-tag font-bold text-white">
                                              {cal.toLocaleString("fa-IR")} <span className="text-[10px] font-normal text-[#87868b]">kcal</span>
                                            </td>
                                            <td className="p-3 font-mono-tag text-emerald-400">{pG} گرم</td>
                                            <td className={`p-3 font-mono-tag font-bold ${isHigh ? "text-[#ff6600]" : "text-[#e5e2e1]"}`}>
                                              {cG} گرم {isHigh && <span className="text-[9px] text-[#ff6600]">⚡</span>}
                                            </td>
                                            <td className="p-3 font-mono-tag text-amber-400">{fG} گرم</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="text-[11px] text-[#87868b] flex items-center justify-between pt-1">
                                  <span>💡 با زدن دکمه «درج جدول زیگزاگ»، این جدول تفکیک‌شده به طور مستقیم وارد رژیم قهرمان خواهد شد.</span>
                                  <span>مجموع هفتگی: <strong className="text-white font-mono-tag">{weeklyBudget.toLocaleString("fa-IR")} kcal</strong></span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                                            {/* حالت ۱: فیلتربندی وعده‌ها */}
                      {builderDietMode === "filtered" ? (
                        <div className="space-y-4">
                          {/* نوار فیلتر و تب‌های وعده‌ها */}
                          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-[#2c2c2e]">
                            {/* دکمه فیلتر همه وعده‌ها */}
                            <button
                              type="button"
                              onClick={() => setBuilderActiveDietFilter("all")}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                builderActiveDietFilter === "all"
                                  ? "bg-[#ff6600] text-white shadow-lg shadow-[#ff6600]/20"
                                  : "bg-[#141414] hover:bg-[#222224] text-[#87868b] hover:text-[#e5e2e1] border border-[#2c2c2e]"
                              }`}
                            >
                              <Utensils className="w-3.5 h-3.5" />
                              <span>همه وعده‌ها</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px]">
                                {builderDietCategories.filter((c) => c.content.trim().length > 0).length}
                              </span>
                            </button>

                            {/* تب‌های تک‌تک وعده‌ها */}
                            {builderDietCategories.map((cat) => {
                              const isSelected = builderActiveDietFilter === cat.id;
                              const isFilled = cat.content.trim().length > 0;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => setBuilderActiveDietFilter(cat.id)}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    isSelected
                                      ? "bg-[#ff6600] text-white shadow-lg shadow-[#ff6600]/20"
                                      : "bg-[#141414] hover:bg-[#222224] text-[#87868b] hover:text-[#e5e2e1] border border-[#2c2c2e]"
                                  }`}
                                >
                                  {renderMealIcon(cat.iconName, "w-3.5 h-3.5")}
                                  <span>{cat.title}</span>
                                  {isFilled && (
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        isSelected ? "bg-white" : "bg-emerald-400"
                                      }`}
                                      title="تکمیل شده"
                                    />
                                  )}
                                </button>
                              );
                            })}

                            {/* افزودن وعده سفارشی جدید */}
                            {isAddingCustomMeal ? (
                              <div className="flex items-center gap-1.5 bg-[#141414] border border-[#ff6600] rounded-xl p-1">
                                <input
                                  type="text"
                                  value={newCustomMealTitle}
                                  onChange={(e) => setNewCustomMealTitle(e.target.value)}
                                  placeholder="نام وعده جدید..."
                                  className="bg-transparent text-xs text-white px-2 py-1 focus:outline-none w-32"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddCustomDietCategory();
                                    if (e.key === "Escape") setIsAddingCustomMeal(false);
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={handleAddCustomDietCategory}
                                  className="px-2 py-1 rounded bg-[#ff6600] text-white text-[11px] font-bold"
                                >
                                  ثبت
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsAddingCustomMeal(false)}
                                  className="p-1 text-[#87868b] hover:text-white"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setIsAddingCustomMeal(true)}
                                className="px-3 py-2 rounded-xl bg-[#141414] hover:bg-[#222224] border border-dashed border-[#605f64] hover:border-[#ff6600] text-xs font-bold text-[#87868b] hover:text-[#ff6600] transition-all flex items-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>افزودن وعده جدید</span>
                              </button>
                            )}
                          </div>

                          {/* اگر فیلتر یک وعده خاص انتخاب شده باشد */}
                          {builderActiveDietFilter !== "all" && (() => {
                            const activeCat = builderDietCategories.find((c) => c.id === builderActiveDietFilter);
                            if (!activeCat) return null;
                            const isCustom = activeCat.id.startsWith("custom-");

                            return (
                              <div className="space-y-3 p-5 rounded-xl bg-[#141414] border border-[#2c2c2e]">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2c2c2e]">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#542201] text-[#ff6600] flex items-center justify-center">
                                      {renderMealIcon(activeCat.iconName, "w-4 h-4")}
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-bold text-[#e5e2e1] flex items-center gap-2">
                                        <span>دستورات و اقلام {activeCat.title}</span>
                                        {activeCat.content.trim() ? (
                                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px]">
                                            تکمیل شده
                                          </span>
                                        ) : (
                                          <span className="px-2 py-0.5 rounded-full bg-[#2c2c2e] text-[#87868b] text-[10px]">
                                            خالی
                                          </span>
                                        )}
                                      </h5>
                                      <span className="text-[10px] text-[#87868b]">
                                        متن آزاد: مقادیر گرمی، دستور طبخ، جایگزین‌ها و توصیه‌ها
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = activeCat.content ? activeCat.content + "\n- " : "- ";
                                        handleUpdateDietCategoryContent(activeCat.id, current);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-[#1a1a1c] hover:bg-[#222224] border border-[#2c2c2e] text-[11px] text-[#e5e2e1] hover:text-[#ff6600] transition-all"
                                      title="افزودن خط بولت‌دار"
                                    >
                                      + آیتم (- )
                                    </button>
                                    {activeCat.content && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm(`آیا متن ${activeCat.title} پاک شود؟`)) {
                                            handleUpdateDietCategoryContent(activeCat.id, "");
                                          }
                                        }}
                                        className="px-2 py-1 rounded-lg bg-[#1a1a1c] hover:bg-red-500/10 text-[11px] text-[#87868b] hover:text-red-400 transition-all"
                                      >
                                        پاک کردن
                                      </button>
                                    )}
                                    {isCustom && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteDietCategory(activeCat.id)}
                                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-all"
                                        title="حذف کامل این وعده"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* ادیتور متن آزاد این وعده */}
                                <textarea
                                  value={activeCat.content}
                                  onChange={(e) => handleUpdateDietCategoryContent(activeCat.id, e.target.value)}
                                  rows={11}
                                  placeholder={`اقلام و مواد غذایی ${activeCat.title} را به صورت آزاد یادداشت نمایید...
مثال:
- ۳ عدد سفیده تخم‌مرغ + ۱ زرده کامل
- ۶۰ گرم جو دوسر پرک با آب یا شیر کم‌چرب
- ۱ قاشق عسل طبیعی + ۳ عدد مغز گردو`}
                                  className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded-xl p-4 text-xs font-mono text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none leading-relaxed transition-colors select-text"
                                  dir="rtl"
                                />

                                <div className="flex items-center justify-between text-[11px] text-[#87868b] pt-1">
                                  <span>تعداد کاراکتر: {activeCat.content.length} | خطوط: {activeCat.content ? activeCat.content.split("\n").length : 0}</span>
                                  <button
                                    type="button"
                                    onClick={() => setBuilderActiveDietFilter("all")}
                                    className="text-[#ff6600] hover:underline font-bold"
                                  >
                                    مشاهده تمام وعده‌ها کنار هم ←
                                  </button>
                                </div>
                              </div>
                            );
                          })()}

                          {/* اگر فیلتر «همه وعده‌ها» انتخاب شده باشد: نمایش یکپارچه کارت‌های همه وعده‌ها */}
                          {builderActiveDietFilter === "all" && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {builderDietCategories.map((cat) => {
                                  const isFilled = cat.content.trim().length > 0;
                                  return (
                                    <div
                                      key={cat.id}
                                      className={`p-4 rounded-xl border transition-all ${
                                        isFilled
                                          ? "bg-[#141414] border-[#2c2c2e]"
                                          : "bg-[#141414]/60 border-[#222224] opacity-85"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#2c2c2e]">
                                        <div className="flex items-center gap-2">
                                          <div className="w-7 h-7 rounded-lg bg-[#542201] text-[#ff6600] flex items-center justify-center">
                                            {renderMealIcon(cat.iconName, "w-3.5 h-3.5")}
                                          </div>
                                          <span className="text-xs font-bold text-[#e5e2e1]">{cat.title}</span>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => setBuilderActiveDietFilter(cat.id)}
                                          className="text-[11px] text-[#ff6600] hover:underline font-medium"
                                        >
                                          ویرایش در صفحه اختصاصی
                                        </button>
                                      </div>

                                      <textarea
                                        value={cat.content}
                                        onChange={(e) => handleUpdateDietCategoryContent(cat.id, e.target.value)}
                                        rows={4}
                                        placeholder={`اقلام ${cat.title} (متن آزاد)...`}
                                        className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded-lg p-3 text-xs font-mono text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none leading-relaxed transition-colors"
                                        dir="rtl"
                                      />
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="p-3 rounded-xl bg-[#141414] border border-[#2c2c2e] text-center">
                                <button
                                  type="button"
                                  onClick={() => setIsAddingCustomMeal(true)}
                                  className="text-xs text-[#ff6600] hover:underline font-bold inline-flex items-center gap-1.5"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>افزودن وعده یا بخش غذایی جدید</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* حالت ۲: ادیتور متن آزاد یکپارچه */
                        <div className="space-y-3">
                          <textarea
                            value={builderDietText}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBuilderDietText(val);
                              const parsed = parseDietContent(val);
                              setBuilderDietCategories(parsed);
                            }}
                            rows={16}
                            placeholder={`مثال برای نگارش برنامه رژیم غذایی:

### صبحانه:
- ۴ عدد تخم‌مرغ (۲ کامل + ۲ سفیده) + ۷۰ گرم جو دوسر پرک با شیر کم‌چرب + ۱ لیوان شیر کم‌چرب

### ناهار:
- ۲۰۰ گرم فیله مرغ گریل + ۱۵۰ گرم کته برنج قهوه‌ای + سالاد فصل با روغن زیتون

### وعده قبل و بعد تمرین...`}
                            className="w-full bg-[#141414] border border-[#2c2c2e] rounded-xl p-4 text-xs font-mono text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none leading-relaxed transition-colors select-text"
                            dir="rtl"
                          />
                          <div className="flex items-center justify-between text-xs text-[#87868b]">
                            <span>هر تیتر با قالب <code className="text-[#ff6600]">### عنوان:</code> به صورت خودکار به تب‌های فیلتربندی تبدیل می‌شود.</span>
                            <button
                              type="button"
                              onClick={() => {
                                const parsed = parseDietContent(builderDietText);
                                setBuilderDietCategories(parsed);
                                setBuilderDietMode("filtered");
                              }}
                              className="text-xs text-[#ff6600] hover:underline font-bold"
                            >
                              بازگشت به نمای فیلتربندی وعده‌ها ←
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* بدنه تب ۳: پیام و توصیه‌های مربی */}
                  {builderActiveTab === "feedback" && (
                    <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#262626] space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#ff6600]" />
                          <span>پیام و توصیه‌های مربی به قهرمان</span>
                        </h4>
                        <p className="text-xs text-[#64748b] mt-0.5">
                          این پیام در کادر اختصاصی وضعیت پرونده در پنل کاربری قهرمان نمایش داده خواهد شد.
                        </p>
                      </div>

                      <textarea
                        value={builderFeedback}
                        onChange={(e) => setBuilderFeedback(e.target.value)}
                        rows={8}
                        placeholder="نکات انگیزشی، توصیه‌های اولیه دوره، نحوه ارسال گزارش هفتگی یا شرایط شروع برنامه..."
                        className="w-full bg-[#121212] border border-[#2e2e2e] rounded-xl p-4 text-xs text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none leading-relaxed transition-colors"
                        dir="rtl"
                      />
                    </div>
                  )}

                  {/* بدنه تب ۴: پیوست فایل PDF */}
                  {builderActiveTab === "files" && (
                    <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-[#262626] space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                          <Download className="w-4 h-4 text-[#ff6600]" />
                          <span>لینک یا آدرس فایل‌های PDF طراحی‌شده</span>
                        </h4>
                        <p className="text-xs text-[#64748b] mt-0.5">
                          اگر مایلید فایل پی‌دی‌اف طراحی‌شده در نرم‌افزارهای خارجی یا اکسل را در اختیار قهرمان قرار دهید، لینک آن را در این قسمت وارد نمایید.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#94a3b8]">لینک فایل برنامه تمرینی (PDF یا Excel):</label>
                          <input
                            type="text"
                            value={builderWorkoutFile}
                            onChange={(e) => setBuilderWorkoutFile(e.target.value)}
                            placeholder="https://... یا /uploads/workout-plan.pdf"
                            className="w-full bg-[#121212] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none font-mono-tag"
                            dir="ltr"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#94a3b8]">لینک فایل برنامه رژیم غذایی (PDF):</label>
                          <input
                            type="text"
                            value={builderDietFile}
                            onChange={(e) => setBuilderDietFile(e.target.value)}
                            placeholder="https://... یا /uploads/diet-plan.pdf"
                            className="w-full bg-[#121212] border border-[#2e2e2e] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:border-[#ff6600] focus:outline-none font-mono-tag"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* نوار ذخیره و عملیات پایینی */}
                  <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-[#262626] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-[#64748b]">
                      <span>وضعیت پرونده:</span>
                      <span className="font-bold text-[#e5e2e1]">
                        {builderStatus === "reviewing" && "نیازمند بررسی"}
                        {builderStatus === "preparing" && "در حال تدوین برنامه"}
                        {builderStatus === "ready" && "آماده و تحویل شده به قهرمان"}
                        {builderStatus === "completed" && "پایان دوره"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSavePlanBuilder()}
                        disabled={isSavingPlan}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] border border-[#333333] text-xs font-bold text-[#e5e2e1] transition-all disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 text-[#ff6600]" />
                        <span>{isSavingPlan ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
                      </button>

                      <button
                        onClick={() => handleSavePlanBuilder("ready")}
                        disabled={isSavingPlan}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تایید نهایی و ارسال برای قهرمان</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* مدال مشاهده تمام‌صفحه تصاویر ارسالی قهرمان */}
            {builderPreviewPhoto && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setBuilderPreviewPhoto(null)}
              >
                <div 
                  className="relative max-w-2xl w-full bg-[#1c1c1c] border border-[#333] rounded-2xl overflow-hidden shadow-2xl p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setBuilderPreviewPhoto(null)}
                    className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <img
                    src={builderPreviewPhoto}
                    alt="تصویر قهرمان"
                    className="w-full max-h-[80vh] object-contain rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ۰. نمای مدیریت مقالات و وبلاگ (Blog View) */}
        {activeMenu === "blog" && (
          <div className="mt-8 space-y-6 w-full pb-12">

            {/* بخش فرم نگارش/ویرایش مقاله */}
            {blogViewMode === "form" ? (
              <div className="p-6 sm:p-8 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] space-y-6 w-full">
                
                <div className="sticky top-0 z-30 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 px-6 sm:px-8 py-4 bg-[#1e1e1e]/95 backdrop-blur border-b border-[#2c2c2e] rounded-t-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#e5e2e1] flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#ff6600]" />
                      <span>{editingBlogPostId ? "ویرایش مقاله تخصصی" : "نگارش مقاله تخصصی جدید"}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        blogForm.is_published
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                      }`}>
                        {blogForm.is_published ? "منتشر شده" : "پیش‌نویس"}
                      </span>
                    </h3>
                    <p className="text-xs text-[#64748b] mt-1">
                      آدرس مستقیم مقاله در سایت: <span className="font-mono-tag text-emerald-400">/blog/{blogForm.slug || "slug"}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBlogViewMode("list")}
                      className="px-4 py-2.5 rounded bg-[#141414] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs text-[#64748b] hover:text-[#e5e2e1] font-bold"
                    >
                      انصراف
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveBlogPost(false)}
                      className="px-5 py-2.5 rounded bg-[#1a1a1c] hover:bg-[#2c2c2e] border border-amber-500/40 text-amber-400 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>ذخیره به عنوان پیش‌نویس</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveBlogPost(true)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold shadow-md shadow-[#ff6600]/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>انتشار عمومی مقاله</span>
                    </button>
                  </div>
                </div>

                {blogSavedNotice && (
                  <div className="p-4 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>مقاله با موفقیت ذخیره شد!</span>
                  </div>
                )}

                {/* 2-Col Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-right text-xs">
                  
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">عنوان اصلی مقاله *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: اصول بیومکانیک در هایپرتروفی عضلات سینه"
                      value={blogForm.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setBlogForm({
                          ...blogForm,
                          title: newTitle,
                          slug: editingBlogPostId ? blogForm.slug : newTitle.toLowerCase().replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, "-").replace(/^-+|-+$/g, "")
                        });
                      }}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] font-bold text-sm focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">اسلاگ یکتا (Slug URL) *</label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      placeholder="chest-hypertrophy-biomechanics"
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-emerald-400 font-mono-tag focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-medium text-[#e5e2e1]">دسته‌بندی موضوعی *</label>
                      <button
                        type="button"
                        onClick={() => setBlogViewMode("categories")}
                        className="text-[10px] text-[#ff6600] hover:underline"
                      >
                        + مدیریت دسته‌ها
                      </button>
                    </div>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    >
                      {blogCategoriesList.map((cat) => (
                        <option key={cat.id} value={cat.name} className="bg-[#1e1e1e] text-[#e5e2e1]">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">زمان تخمینی مطالعه</label>
                    <input
                      type="text"
                      placeholder="مثال: ۷ دقیقه مطالعه"
                      value={blogForm.read_time}
                      onChange={(e) => setBlogForm({ ...blogForm, read_time: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">برچسب‌ها (با کاما جدا کنید)</label>
                    <input
                      type="text"
                      placeholder="بدنسازی, هایپرتروفی, علم تمرین, رژیم"
                      value={blogForm.tags}
                      onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="lg:col-span-2">
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">چکیده و خلاصه مقاله (مخصوص پیش‌نمایش و متاتگ سئو)</label>
                    <textarea
                      rows={2}
                      placeholder="خلاصه ۲ تا ۳ خطی جذاب از مقاله جهت نمایش در کارت‌های وبلاگ..."
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                    />
                  </div>

                </div>

                {/* Cover Image */}
                <BlogCoverField
                  imageUrl={blogForm.image_url}
                  imageAlt={blogForm.image_alt}
                  onImageUrlChange={(v) => setBlogForm((prev: any) => ({ ...prev, image_url: v }))}
                  onImageAltChange={(v) => setBlogForm((prev: any) => ({ ...prev, image_alt: v }))}
                  onOpenMediaPicker={() => {
                    setMediaTargetField("blog-cover");
                    setIsMediaModalOpen(true);
                  }}
                />

                {/* Main Body - Rich Text Editor */}
                <div className="space-y-3 pt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2c2c2e]">
                    <div>
                      <label className="block font-bold text-[#e5e2e1] text-sm">محتوای کامل و متن مقاله </label>
                      <p className="text-[11px] text-[#64748b] mt-0.5">
                        قابلیت فرمت‌بندی کامل تیترها، جداول، نقل‌قول، لیست‌ها و درج تصاویر مستقیم
                      </p>
                    </div>
                  </div>

                  <TiptapArticleEditor
                    value={blogForm.content}
                    onChange={(newContent) => setBlogForm((prev: any) => ({ ...prev, content: newContent }))}
                    onOpenMediaPickerForEditor={() => {
                      setMediaTargetField("blog-editor");
                      setIsMediaModalOpen(true);
                    }}
                    insertedImageUrl={insertedBlogEditorImage}
                    onClearInsertedImage={() => setInsertedBlogEditorImage(null)}
                  />
                </div>

                {/* FAQ */}
                <BlogFaqEditor
                  title={blogForm.faq_title}
                  items={blogForm.faq_items || []}
                  onTitleChange={(v) => setBlogForm((prev: any) => ({ ...prev, faq_title: v }))}
                  onItemsChange={(items) => setBlogForm((prev: any) => ({ ...prev, faq_items: items }))}
                />

                {/* SEO */}
                <BlogSeoPanel
                  form={blogForm}
                  onChange={(patch) => setBlogForm((prev: any) => ({ ...prev, ...patch }))}
                />

              </div>
            ) : blogViewMode === "categories" ? (
              /* بخش مدیریت دسته‌بندی‌ها */
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Create category form */}
                  <form onSubmit={handleCreateCategory} className="p-6 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] space-y-4 text-right text-xs">
                    <h4 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2 pb-3 border-b border-[#2c2c2e]">
                      <Plus className="w-4 h-4 text-[#ff6600]" />
                      <span>افزودن دسته‌بندی جدید</span>
                    </h4>

                    <div>
                      <label className="block font-medium text-[#e5e2e1] mb-1.5">عنوان دسته‌بندی *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: تغذیه و مکمل‌های ورزشی"
                        value={newCategoryName}
                        onChange={(e) => {
                          setNewCategoryName(e.target.value);
                          if (!newCategorySlug) {
                            setNewCategorySlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                          }
                        }}
                        className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#e5e2e1] mb-1.5">اسلاگ URL دسته‌بندی</label>
                      <input
                        type="text"
                        dir="ltr"
                        placeholder="nutrition-supplements"
                        value={newCategorySlug}
                        onChange={(e) => setNewCategorySlug(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-emerald-400 font-mono-tag focus:outline-none focus:border-[#ff6600]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#e5e2e1] mb-1.5">توضیح کوتاه</label>
                      <textarea
                        rows={2}
                        placeholder="شرح کوتاه درباره مقالات این موضوع..."
                        value={newCategoryDesc}
                        onChange={(e) => setNewCategoryDesc(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/30"
                    >
                      افزودن دسته‌بندی
                    </button>
                  </form>

                  {/* Categories List */}
                  <div className="lg:col-span-2 p-6 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] space-y-4 text-right">
                    <h4 className="text-sm font-bold text-[#e5e2e1] flex items-center justify-between pb-3 border-b border-[#2c2c2e]">
                      <span>دسته‌بندی‌های موجود ({blogCategoriesList.length})</span>
                      <button
                        onClick={fetchBlogCategories}
                        className="text-[11px] text-[#64748b] hover:text-[#e5e2e1]"
                      >
                        به‌روزرسانی
                      </button>
                    </h4>

                    <div className="divide-y divide-[#2c2c2e]">
                      {blogCategoriesList.map((cat) => (
                        <div key={cat.id} className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <div className="font-bold text-xs text-[#e5e2e1]">{cat.name}</div>
                            <div className="text-[11px] text-emerald-400 font-mono-tag mt-0.5" dir="ltr">
                              /blog/category/{cat.slug}
                            </div>
                            {cat.description && (
                              <p className="text-[11px] text-[#64748b] mt-1">{cat.description}</p>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 rounded bg-[#141414] hover:bg-rose-900/40 text-[#64748b] hover:text-rose-400 border border-[#2c2c2e] transition-colors"
                            title="حذف دسته‌بندی"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* بخش لیست مقالات (Articles Cards List) */
              <>
                <div className="p-4 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-[#64748b] absolute top-3 right-3.5" />
                    <input
                      type="text"
                      placeholder="جستجو در مقالات (عنوان، اسلاگ، دسته یا برچسب)..."
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded pr-10 pl-4 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#64748b] font-medium">
                    <span>کل مقالات: <strong className="text-[#ff6600]">{blogPostsList.length}</strong></span>
                    <span>•</span>
                    <span>منتشر شده: <strong className="text-emerald-400">{blogPostsList.filter(p => p.is_published).length}</strong></span>
                    <span>•</span>
                    <span>پیش‌نویس: <strong className="text-amber-400">{blogPostsList.filter(p => !p.is_published).length}</strong></span>
                  </div>
                </div>

                {filteredBlogPosts.length === 0 ? (
                  <div className="p-12 text-center rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] text-xs text-[#64748b]">
                    هیچ مقاله‌ای یافت نشد. برای ایجاد اولین مقاله روی دکمه «نوشتن مقاله جدید» کلیک کنید.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogPosts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/60 overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-[#ff6600]/10"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141414]">
                          <img
                            src={post.image_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />

                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-[#2c2c2e] text-[10px] font-mono-tag text-emerald-400 flex items-center gap-1.5" dir="ltr">
                            <span>/{post.slug}</span>
                            <ExternalLink className="w-3 h-3 text-[#64748b]" />
                          </div>

                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-[#2c2c2e] text-[10px] font-bold text-[#ff6600]">
                            {post.category}
                          </div>

                          <div className="absolute bottom-3 right-3">
                            {post.is_published ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/80 backdrop-blur-sm text-white font-bold text-[10px] flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>منتشر شده</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-500/80 backdrop-blur-sm text-black font-bold text-[10px] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>پیش‌نویس</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-right">
                          <div className="space-y-2">
                            <h3 className="text-base font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed">
                              {post.excerpt || "برای مشاهده متن کامل مقاله کلیک کنید..."}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#2c2c2e] flex items-center justify-between text-[11px] text-[#64748b]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#ff6600]" />
                              <span>{post.read_time || "۵ دقیقه"}</span>
                            </span>
                            <span className="font-mono-tag text-[10px]" dir="ltr">
                              {new Date(post.created_at).toLocaleDateString("fa-IR")}
                            </span>
                          </div>

                          <div className="pt-3 border-t border-[#2c2c2e] flex items-center justify-between gap-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="flex-1 py-2 rounded bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs font-bold text-[#e5e2e1] flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              <span>مشاهده مقاله</span>
                            </Link>

                            <button
                              onClick={() => handleEditBlogPost(post)}
                              className="p-2 rounded bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] transition-colors"
                              title="ویرایش مقاله"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteBlogPost(post.id)}
                              className="p-2 rounded bg-[#1e1e1e] hover:bg-rose-900/40 text-[#64748b] hover:text-rose-400 border border-[#2c2c2e] transition-colors"
                              title="حذف مقاله"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        )}

        {/* ۱-ب: نمای مدیریت دیدگاه‌های مقالات وبلاگ (Blog Comments Moderation & Reply) */}
        {activeMenu === "blog-comments" && (
          <div className="mt-8 space-y-6 w-full pb-12">
            
            {/* نوار فیلتر و آمار */}
            <div className="p-4 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBlogCommentFilter("all")}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    blogCommentFilter === "all"
                      ? "bg-[#ff6600] text-white"
                      : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70 hover:text-white"
                  }`}
                >
                  همه دیدگاه‌های وبلاگ ({blogCommentsList.length})
                </button>
                <button
                  onClick={() => setBlogCommentFilter("pending")}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    blogCommentFilter === "pending"
                      ? "bg-[#ff6600] text-white"
                      : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70 hover:text-white"
                  }`}
                >
                  در انتظار تایید ({blogCommentsList.filter((c) => c.status === "pending").length})
                </button>
                <button
                  onClick={() => setBlogCommentFilter("approved")}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    blogCommentFilter === "approved"
                      ? "bg-[#ff6600] text-white"
                      : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70 hover:text-white"
                  }`}
                >
                  تایید شده ({blogCommentsList.filter((c) => c.status === "approved").length})
                </button>
              </div>

              <button
                onClick={fetchBlogComments}
                className="px-4 py-2 rounded bg-[#141414] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs text-[#e5e2e1] font-medium transition-colors"
              >
                به‌روزرسانی لیست دیدگاه‌ها
              </button>
            </div>

            {/* لیست دیدگاه‌های مقالات */}
            <div className="space-y-4">
              {filteredBlogComments.length === 0 ? (
                <div className="p-16 text-center rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] text-xs text-[#64748b] space-y-2">
                  <MessageCircle className="w-8 h-8 text-[#64748b] mx-auto opacity-50" />
                  <p>هیچ دیدگاهی برای مقالات در این بخش ثبت نشده است.</p>
                </div>
              ) : (
                filteredBlogComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-6 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] hover:border-[#ff6600]/40 transition-all space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      {/* مشخصات کاربر و مقاله */}
                      <div className="space-y-2 text-right flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-sm font-bold text-[#e5e2e1]">{comment.full_name}</h4>
                          {comment.email && (
                            <span className="text-[11px] text-[#64748b] font-mono-tag">({comment.email})</span>
                          )}
                          
                          <div className="flex items-center gap-1 text-[#ff6600]">
                            {[...Array(comment.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#ff6600]" />
                            ))}
                          </div>

                          {comment.status === "approved" ? (
                            <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>تایید شده (در حال نمایش)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[10px] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>در انتظار بررسی و تایید</span>
                            </span>
                          )}
                        </div>

                        {/* لینک مقاله مربوطه */}
                        <div className="flex items-center gap-2 text-xs text-[#64748b]">
                          <span>دیدگاه روی مقاله:</span>
                          <Link
                            href={`/blog/${comment.post_slug}`}
                            target="_blank"
                            className="text-[#ff6600] hover:underline font-bold flex items-center gap-1"
                          >
                            <span>{comment.post_title || comment.post_slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <span>•</span>
                          <span className="text-[10px] text-[#64748b]">
                            {comment.created_at ? new Date(comment.created_at).toLocaleDateString("fa-IR") : "به‌تازگی"}
                          </span>
                        </div>

                        {/* متن دیدگاه */}
                        <p className="text-xs text-[#e5e2e1]/90 leading-relaxed bg-[#141414] p-4 rounded border border-[#2c2c2e] text-justify">
                          {comment.comment}
                        </p>
                      </div>

                      {/* دکمه‌های تایید، پاسخ و حذف */}
                      <div className="flex flex-wrap items-center gap-2 flex-shrink-0 self-end md:self-start">
                        <button
                          onClick={() => handleToggleBlogCommentStatus(comment.id, comment.status)}
                          className={`px-3.5 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                            comment.status === "approved"
                              ? "bg-amber-600 hover:bg-amber-500 text-white"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white"
                          }`}
                        >
                          {comment.status === "approved" ? (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>عدم نمایش</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>تایید و انتشار</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (replyingCommentId === comment.id) {
                              setReplyingCommentId(null);
                            } else {
                              setReplyingCommentId(comment.id);
                              setReplyText(comment.reply || "");
                              if (!comment.reply) {
                                const currentName = userName ? (role === "superadmin" ? `${userName} (سوپروایزر)` : `مربی ${userName}`) : "استاد احسان ناظری";
                                setReplyAuthor(currentName);
                              } else {
                                setReplyAuthor(comment.reply_author || userName || "استاد احسان ناظری");
                              }
                            }
                          }}
                          className="px-3.5 py-2 rounded bg-[#141414] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-[#ff6600] hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <CornerDownLeft className="w-3.5 h-3.5" />
                          <span>{comment.reply ? "ویرایش پاسخ" : "ثبت پاسخ مربی"}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteBlogComment(comment.id)}
                          className="p-2 rounded bg-[#141414] hover:bg-rose-900/40 text-[#64748b] hover:text-rose-400 border border-[#2c2c2e] transition-colors"
                          title="حذف دیدگاه"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    {/* نمایش پاسخ ثبت شده قبلی */}
                    {comment.reply && replyingCommentId !== comment.id && (
                      <div className="mr-6 p-4 rounded bg-[#161616] border-r-2 border-r-[#ff6600] border-y border-l border-[#2c2c2e] space-y-1.5 text-right">
                        <div className="flex items-center justify-between text-xs font-bold text-[#ff6600]">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            <span>پاسخ {comment.reply_author || "استاد احسان ناظری"}:</span>
                          </span>
                          {comment.reply_created_at && (
                            <span className="text-[10px] text-[#64748b] font-normal">
                              {new Date(comment.reply_created_at).toLocaleDateString("fa-IR")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#e5e2e1] leading-relaxed text-justify">
                          {comment.reply}
                        </p>
                      </div>
                    )}

                    {/* فرم ارسال/ویرایش پاسخ مربی */}
                    {replyingCommentId === comment.id && (
                      <div className="mr-4 sm:mr-6 p-4 rounded-lg bg-[#161616] border border-[#ff6600]/40 space-y-3 text-right">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-[#ff6600] flex items-center gap-1.5">
                            <CornerDownLeft className="w-4 h-4" />
                            <span>ارسال پاسخ مربی به دیدگاه {comment.full_name}:</span>
                          </label>
                          <input
                            type="text"
                            value={replyAuthor}
                            onChange={(e) => setReplyAuthor(e.target.value)}
                            placeholder="نام پاسخ‌دهنده"
                            className="bg-[#1a1a1c] border border-[#2c2c2e] rounded px-2.5 py-1 text-[11px] text-[#e5e2e1]"
                          />
                        </div>

                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="متن پاسخ تخصصی و تحلیلی مربی را وارد فرمایید..."
                          className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded p-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                        />

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingCommentId(null)}
                            className="px-4 py-1.5 rounded bg-[#1a1a1c] text-xs text-[#64748b] hover:text-white"
                          >
                            انصراف
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReplyBlogComment(comment.id)}
                            className="px-6 py-1.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#ff6600]/30"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>ثبت و انتشار پاسخ</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* ۱. نمای بانک قهرمانان (Students View) */}
        {activeMenu === "students" && (
          <div className="mt-8 space-y-6 w-full pb-12">
            
            {/* ۱-الف: نمای فرم درون‌صفحه‌ای (In-page Form - Not Modal) */}
            {studentViewMode === "form" ? (
              <form onSubmit={handleSaveStudent} className="p-6 sm:p-8 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] space-y-6 w-full">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2c2c2e]">
                  <div>
                    <h3 className="text-base font-bold text-[#e5e2e1] flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-[#ff6600]" />
                      <span>{editingStudentId ? "ویرایش اطلاعات پرونده قهرمان" : "مشخصات پرونده قهرمان جدید"}</span>
                    </h3>
                    <p className="text-xs text-[#64748b] mt-1">
                      با ذخیره فرم، صفحه اختصاصی قهرمان به آدرس <span className="font-mono-tag text-emerald-400">/students/{studentForm.slug || "slug"}</span> در دسترس خواهد بود.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStudentViewMode("list")}
                      className="px-5 py-2.5 rounded bg-[#141414] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs text-[#64748b] hover:text-[#e5e2e1] font-bold"
                    >
                      انصراف و بازگشت
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-7 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold shadow-md shadow-[#ff6600]/30"
                    >
                      <Save className="w-4 h-4" />
                      <span>ذخیره نهایی پرونده</span>
                    </button>
                  </div>
                </div>

                {studentSavedNotice && (
                  <div className="p-4 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اطلاعات قهرمان با موفقیت در دیتابیس ذخیره شد!</span>
                  </div>
                )}

                {/* Main 2-Col Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-right text-xs">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">نام و نام خانوادگی قهرمان *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: امیررضا شمس"
                      value={studentForm.full_name}
                      onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">اسلاگ صفحه اختصاصی (Slug URL) *</label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      placeholder="amir-shams"
                      value={studentForm.slug}
                      onChange={(e) => setStudentForm({ ...studentForm, slug: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-emerald-400 font-mono-tag focus:outline-none focus:border-[#ff6600]"
                    />
                    <span className="text-[10px] text-[#64748b] mt-1 block">آدرس مستقیم: nazeri.fit/students/{studentForm.slug || "slug"}</span>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">دسته ورزشی / هدف بدنی</label>
                    <input
                      type="text"
                      placeholder="مثال: فیزیک کلاسیک - مسابقات کشوری"
                      value={studentForm.category}
                      onChange={(e) => setStudentForm({ ...studentForm, category: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">سابقه تمرین / مدت دوره</label>
                    <input
                      type="text"
                      placeholder="مثال: ۱۴ ماه تمرین تخصصی"
                      value={studentForm.duration}
                      onChange={(e) => setStudentForm({ ...studentForm, duration: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">شماره تماس قهرمان</label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="0912xxxxxxx"
                      value={studentForm.phone}
                      onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  {/* Package */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1.5">پکیج ثبت‌نامی</label>
                    <input
                      type="text"
                      placeholder="پکیج جامع VIP بدنسازی و تغذیه"
                      value={studentForm.package_name}
                      onChange={(e) => setStudentForm({ ...studentForm, package_name: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                </div>

                {/* Weights & Body Stats */}
                <div className="p-5 rounded bg-[#141414] border border-[#2c2c2e] space-y-4">
                  <div className="font-bold text-[#ff6600] text-xs">سوابق وزنی و فیزیکی قهرمان</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[#64748b] mb-1">وزن شروع دوره (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={studentForm.initial_weight}
                        onChange={(e) => setStudentForm({ ...studentForm, initial_weight: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded p-2.5 text-[#e5e2e1] text-center font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[#64748b] mb-1">وزن فعلی (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={studentForm.current_weight}
                        onChange={(e) => setStudentForm({ ...studentForm, current_weight: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded p-2.5 text-emerald-400 text-center font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[#64748b] mb-1">قد (cm)</label>
                      <input
                        type="number"
                        value={studentForm.height}
                        onChange={(e) => setStudentForm({ ...studentForm, height: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded p-2.5 text-[#e5e2e1] text-center font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[#64748b] mb-1">درصد چربی (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={studentForm.body_fat}
                        onChange={(e) => setStudentForm({ ...studentForm, body_fat: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded p-2.5 text-[#ff6600] text-center font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload with Media Picker */}
                <div className="p-5 rounded bg-[#141414] border border-[#2c2c2e] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="font-bold text-[#e5e2e1] flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#ff6600]" />
                      <span>تصویر ترنسفورمیشن / پروفایل قهرمان</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTargetField("student");
                        setIsMediaModalOpen(true);
                      }}
                      className="px-5 py-2 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold shadow-md shadow-[#ff6600]/25 flex items-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>انتخاب یا آپلود از گالری مدیا</span>
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-5 pt-2">
                    <div className="w-full md:w-44 h-52 rounded border border-[#2c2c2e] overflow-hidden bg-[#141414] flex-shrink-0 relative shadow-inner">
                      {studentForm.image_url ? (
                        <img src={studentForm.image_url} alt="Student Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#64748b]">بدون تصویر</div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <label className="block text-[11px] text-[#64748b]">آدرس مستقیم تصویر:</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={studentForm.image_url}
                        onChange={(e) => setStudentForm({ ...studentForm, image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] text-xs font-mono-tag focus:outline-none focus:border-[#ff6600]"
                      />
                    </div>
                  </div>
                </div>

                {/* Medals */}
                <div>
                  <label className="block font-medium text-[#e5e2e1] mb-1.5">مدال‌ها و افتخارات ورزشی (با علامت | جدا کنید)</label>
                  <input
                    type="text"
                    placeholder="مدال طلا کشوری ۱۴۰۴ | اورال کاپ استان تهران | مدال نقره جام البرز"
                    value={studentForm.medals}
                    onChange={(e) => setStudentForm({ ...studentForm, medals: e.target.value })}
                    className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block font-medium text-[#e5e2e1] mb-1.5">شرح پرونده ترنسفورمیشن</label>
                  <textarea
                    rows={3}
                    placeholder="توضیحات روند کاهش چربی، عضله‌سازی، مکمل‌ها و برنامه‌های اجرا شده..."
                    value={studentForm.bio}
                    onChange={(e) => setStudentForm({ ...studentForm, bio: e.target.value })}
                    className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                  />
                </div>

                {/* Coach notes */}
                <div>
                  <label className="block font-medium text-[#e5e2e1] mb-1.5">یادداشت و تحلیل تخصصی استاد ناظری</label>
                  <textarea
                    rows={3}
                    placeholder="دیدگاه فنی مربی در مورد پاسخ بدنی قهرمان به بیومکانیک و رژیم غذایی..."
                    value={studentForm.coach_notes}
                    onChange={(e) => setStudentForm({ ...studentForm, coach_notes: e.target.value })}
                    className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                  />
                </div>

                {/* Champion toggle */}
                <div className="flex items-center gap-3 p-4 rounded bg-[#141414] border border-[#2c2c2e]">
                  <input
                    type="checkbox"
                    id="is_champ_page"
                    checked={studentForm.is_champion}
                    onChange={(e) => setStudentForm({ ...studentForm, is_champion: e.target.checked })}
                    className="w-4 h-4 accent-[#ff6600]"
                  />
                  <label htmlFor="is_champ_page" className="text-xs text-[#e5e2e1] font-bold cursor-pointer">
                    نمایش در بخش «قهرمانان برتر و افتخارآفرینان» در صفحه اصلی سایت
                  </label>
                </div>

                {/* Submit bar */}
                <div className="pt-4 border-t border-[#2c2c2e] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setStudentViewMode("list")}
                    className="px-6 py-3 rounded bg-[#141414] hover:bg-[#2c2c2e] text-xs text-[#64748b] hover:text-[#e5e2e1] font-bold border border-[#2c2c2e]"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-3 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold shadow-lg shadow-[#ff6600]/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    ذخیره و ثبت پرونده
                  </button>
                </div>

              </form>
            ) : (
              /* ۱-ب: نمای لیست کارت‌های قهرمانان */
              <>
                <div className="p-4 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-[#64748b] absolute top-3 right-3.5" />
                    <input
                      type="text"
                      placeholder="جستجو بر اساس نام، اسلاگ (slug) یا دسته وزنی..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded pr-10 pl-4 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div className="text-xs text-[#64748b] font-medium">
                    تعداد کل قهرمانان: <span className="text-[#ff6600] font-bold">{studentsList.length}</span> پرونده
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((st) => (
                    <div
                      key={st.id}
                      className="rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/60 overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:shadow-[#ff6600]/10"
                    >
                      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#141414]">
                        <img
                          src={st.image_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"}
                          alt={st.full_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />

                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-[#2c2c2e] text-[10px] font-mono-tag text-emerald-400 flex items-center gap-1.5" dir="ltr">
                          <span>/{st.slug}</span>
                          <ExternalLink className="w-3 h-3 text-[#64748b]" />
                        </div>

                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-[#2c2c2e] text-[10px] font-bold text-[#ff6600]">
                          {st.duration || "دوره فیتنس"}
                        </div>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-right">
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors">
                              {st.full_name}
                            </h3>
                            {st.is_champion && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                <span>قهرمان برتر</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#64748b]">{st.category}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono-tag pt-1 border-t border-[#2c2c2e]">
                          <div className="p-1.5 rounded bg-[#1a1a1c] border border-[#2c2c2e]">
                            <span className="text-[#64748b] block text-[9px]">وزن اولیه</span>
                            <span className="text-[#e5e2e1] font-bold">{st.initial_weight} kg</span>
                          </div>
                          <div className="p-1.5 rounded bg-[#1a1a1c] border border-[#2c2c2e]">
                            <span className="text-[#64748b] block text-[9px]">وزن فعلی</span>
                            <span className="text-emerald-400 font-bold">{st.current_weight} kg</span>
                          </div>
                          <div className="p-1.5 rounded bg-[#1a1a1c] border border-[#2c2c2e]">
                            <span className="text-[#64748b] block text-[9px]">چربی بدنی</span>
                            <span className="text-[#ff6600] font-bold">{st.body_fat}%</span>
                          </div>
                        </div>

                        {st.medals && (
                          <div className="p-2 rounded bg-[#1a1a1c] border border-[#2c2c2e] text-[11px] text-[#e5e2e1]/80 truncate">
                            <span className="text-[#ff6600] font-bold ml-1">مدال‌ها:</span>
                            <span>{st.medals}</span>
                          </div>
                        )}

                        <div className="pt-3 border-t border-[#2c2c2e] flex items-center justify-between gap-2">
                          <Link
                            href={`/students/${st.slug}`}
                            target="_blank"
                            className="flex-1 py-2 rounded bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs font-bold text-[#e5e2e1] flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            <span>مشاهده پروفایل</span>
                          </Link>

                          <button
                            onClick={() => handleEditStudent(st)}
                            className="p-2 rounded bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] transition-colors"
                            title="ویرایش پرونده"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteStudent(st.id)}
                            className="p-2 rounded bg-[#1e1e1e] hover:bg-rose-900/40 text-[#64748b] hover:text-rose-400 border border-[#2c2c2e] transition-colors"
                            title="حذف پرونده"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        )}

        {/* ۲. نمای مدیریت نظرات قهرمانان (Testimonials Moderation) */}
        {activeMenu === "testimonials" && (
          <div className="mt-8 space-y-6 w-full pb-12">
            
            {/* Filter bar */}
            <div className="p-4 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTestimonialFilter("all")}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    testimonialFilter === "all"
                      ? "bg-[#ff6600] text-white"
                      : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70"
                  }`}
                >
                  همه نظرات ({testimonialsList.length})
                </button>
                <button
                  onClick={() => setTestimonialFilter("pending")}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    testimonialFilter === "pending"
                      ? "bg-[#ff6600] text-white"
                      : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70"
                  }`}
                >
                  در انتظار تایید ({testimonialsList.filter((t) => t.status === "pending").length})
                </button>
                <button
                  onClick={() => setTestimonialFilter("approved")}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    testimonialFilter === "approved"
                      ? "bg-[#ff6600] text-white"
                      : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70"
                  }`}
                >
                  تایید شده و در حال نمایش ({testimonialsList.filter((t) => t.status === "approved").length})
                </button>
              </div>

              <button
                onClick={fetchTestimonials}
                className="px-4 py-2 rounded bg-[#141414] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs text-[#e5e2e1] font-medium"
              >
                به‌روزرسانی لیست
              </button>
            </div>

            {/* Testimonials List */}
            <div className="space-y-4">
              {filteredTestimonials.length === 0 ? (
                <div className="p-12 text-center rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] text-xs text-[#64748b]">
                  هیچ دیدگاهی در این وضعیت یافت نشد.
                </div>
              ) : (
                filteredTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] hover:border-[#ff6600]/40 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#2c2c2e] bg-[#141414] flex-shrink-0">
                        <img src={t.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} alt={t.full_name} className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-2 text-right flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-sm font-bold text-[#e5e2e1]">{t.full_name}</h4>
                          <span className="text-[11px] text-[#64748b]">| {t.course || "پکیج جامع VIP"}</span>
                          
                          <div className="flex items-center gap-1 text-[#ff6600]">
                            {[...Array(t.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#ff6600]" />
                            ))}
                          </div>

                          {t.status === "approved" ? (
                            <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>تایید شده (نمایش در سایت)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[10px] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>در انتظار بررسی و تایید</span>
                            </span>
                          )}
                        </div>

                        {t.result && (
                          <div className="text-[11px] text-emerald-400 font-bold">
                            نتیجه قهرمان: {t.result}
                          </div>
                        )}

                        <p className="text-xs text-[#e5e2e1]/85 leading-relaxed bg-[#141414] p-3.5 rounded border border-[#2c2c2e]">
                          {t.comment}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleToggleTestimonialStatus(t.id, t.status)}
                        className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                          t.status === "approved"
                            ? "bg-amber-600 hover:bg-amber-500 text-white"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white"
                        }`}
                      >
                        {t.status === "approved" ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>عدم نمایش در سایت</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>تایید و نمایش در سایت</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="p-2 rounded bg-[#141414] hover:bg-rose-900/40 text-[#64748b] hover:text-rose-400 border border-[#2c2c2e] transition-colors"
                        title="حذف دیدگاه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* نمای مدیریت پکیج‌ها و تعرفه‌ها (فقط سوپروایزر) */}
        {activeMenu === "packages-cms" && role === "superadmin" && <PackagesManager />}

        {/* ۳. نمای درخواست‌های مشاوره رایگان */}
        {activeMenu === "consultations" && (
          <div className="mt-8 space-y-6 w-full pb-12">
            <div className="p-4 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsultFilter("all")}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    consultFilter === "all"
                      ? "bg-[#ff6600] text-white"
                      : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70"
                  }`}
                >
                  همه ({consultationList.length})
                </button>
                <button
                  onClick={() => setConsultFilter("pending")}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    consultFilter === "pending"
                      ? "bg-[#ff6600] text-white"
                      : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70"
                  }`}
                >
                  در انتظار تماس ({consultationList.filter((c) => c.status === "pending").length})
                </button>
                <button
                  onClick={() => setConsultFilter("contacted")}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                    consultFilter === "contacted"
                      ? "bg-[#ff6600] text-white"
                      : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70"
                  }`}
                >
                  تماس گرفته شده ({consultationList.filter((c) => c.status !== "pending").length})
                </button>
              </div>

              <button
                onClick={fetchConsultations}
                className="px-4 py-2 rounded bg-[#141414] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs text-[#e5e2e1] font-medium"
              >
                به‌روزرسانی لیست
              </button>
            </div>

            <div className="rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#161616] text-[#64748b] border-b border-[#2c2c2e]">
                    <tr>
                      <th className="p-4 font-bold">نام متقاضی</th>
                      <th className="p-4 font-bold">شماره تماس</th>
                      <th className="p-4 font-bold">موضوع مشاوره</th>
                      <th className="p-4 font-bold">تاریخ ثبت</th>
                      <th className="p-4 font-bold">وضعیت</th>
                      <th className="p-4 font-bold text-center">عملیات مربی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2c2c2e]">
                    {consultationList.map((item) => (
                      <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                        <td className="p-4 font-bold text-[#e5e2e1]">{item.full_name}</td>
                        <td className="p-4 font-mono-tag text-[#ff6600] font-bold" dir="ltr">
                          <a href={`tel:${item.phone}`} className="hover:underline flex items-center gap-1.5 justify-end">
                            <span>{item.phone}</span>
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </td>
                        <td className="p-4 text-[#e5e2e1]/80">{item.topic}</td>
                        <td className="p-4 text-[#64748b] font-mono-tag text-[11px]" dir="ltr">
                          {new Date(item.created_at).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="p-4">
                          {item.status === "pending" ? (
                            <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[11px]">
                              نیازمند تماس
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                              تماس گرفته شد
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleConsultStatus(item.id, item.status)}
                            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1.5 mx-auto"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>تغییر وضعیت</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ۴. نمای مدیریت کاربران سایت و مربیان (Users Management View) */}
        {activeMenu === "users" && (
          <div className="mt-8 space-y-6 w-full pb-12">
            
            {/* نمای فرم افزودن / ویرایش کاربر */}
            {userViewMode === "form" ? (
              <form onSubmit={handleSaveUser} className="p-6 sm:p-8 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] space-y-6 w-full max-w-3xl mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-[#2c2c2e]">
                  <h3 className="text-base font-bold text-[#e5e2e1] flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#ff6600]" />
                    <span>{editingUserId ? "ویرایش مشخصات و سطح دسترسی کاربر" : "افزودن کاربر یا مربی جدید"}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setUserViewMode("list")}
                    className="px-4 py-1.5 rounded bg-[#141414] hover:bg-[#2c2c2e] text-xs text-[#64748b] hover:text-white"
                  >
                    بازگشت به لیست
                  </button>
                </div>

                {userSavedNotice && (
                  <div className="p-4 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اطلاعات کاربر با موفقیت در دیتابیس ذخیره شد!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-right">
                  <div>
                    <label className="block text-[#64748b] mb-1.5 font-medium">نام و نام خانوادگی *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: دکتر سهراب اسماعیلی"
                      value={userForm.full_name}
                      onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] mb-1.5 font-medium">آدرس ایمیل (شناسه ورود) *</label>
                    <input
                      type="email"
                      required
                      placeholder="example@nazeri.fit"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] mb-1.5 font-medium">شماره تماس (اختیاری)</label>
                    <input
                      type="text"
                      placeholder="09123456789"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] mb-1.5 font-medium">
                      {editingUserId ? "تغییر رمز عبور (در صورت خالی بودن تغییر نمی‌کند)" : "کلمه عبور حساب کاربری *"}
                    </label>
                    <input
                      type="password"
                      placeholder={editingUserId ? "رمز جدید را وارد کنید..." : "حداقل ۶ کاراکتر"}
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748b] mb-1.5 font-medium">سطح دسترسی و نقش کاربر *</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    >
                      <option value="student">قهرمان / کاربر عادی سایت (Student)</option>
                      <option value="admin">مربی بدنسازی و فیتنس (Coach / Admin)</option>
                      <option value="superadmin">سوپروایزر و مدیر کل (SuperAdmin)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="is_user_active"
                      checked={userForm.is_active}
                      onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })}
                      className="w-4 h-4 accent-[#ff6600]"
                    />
                    <label htmlFor="is_user_active" className="text-xs text-[#e5e2e1] font-bold cursor-pointer">
                      حساب کاربری فعال باشد و اجازه ورود داشته باشد
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2c2c2e] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setUserViewMode("list")}
                    className="px-6 py-2.5 rounded bg-[#141414] hover:bg-[#2c2c2e] text-xs text-[#64748b] font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold shadow-md shadow-[#ff6600]/30"
                  >
                    {editingUserId ? "ذخیره تغییرات" : "افزودن کاربر"}
                  </button>
                </div>
              </form>
            ) : (
              /* نمای لیست و فیلتر کاربران */
              <>
                <div className="p-4 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* دکمه‌های فیلتر: همه، مربیان، یوزرهای عادی */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setUserFilter("all")}
                      className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                        userFilter === "all"
                          ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/25"
                          : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70 hover:text-white"
                      }`}
                    >
                      همه کاربران ({usersList.length})
                    </button>
                    <button
                      onClick={() => setUserFilter("admin")}
                      className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                        userFilter === "admin"
                          ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/25"
                          : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70 hover:text-white"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>مربیان و ادمین‌ها ({usersList.filter((u) => u.role === "admin" || u.role === "superadmin").length})</span>
                    </button>
                    <button
                      onClick={() => setUserFilter("student")}
                      className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                        userFilter === "student"
                          ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/25"
                          : "bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/70 hover:text-white"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>یوزرهای سایت و قهرمانان ({usersList.filter((u) => u.role === "student").length})</span>
                    </button>
                  </div>

                  {/* نوار جستجو و دکمه افزودن کاربر جدید */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-[#64748b] absolute top-2.5 right-3" />
                      <input
                        type="text"
                        placeholder="جستجو نام، ایمیل، شماره..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="bg-[#141414] border border-[#2c2c2e] rounded pr-9 pl-4 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      />
                    </div>

                    <button
                      onClick={handleOpenNewUser}
                      className="px-4 py-2 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#ff6600]/25 flex-shrink-0"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>افزودن کاربر جدید</span>
                    </button>
                  </div>

                </div>

                {/* جدول لیست کاربران */}
                <div className="rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-[#161616] text-[#64748b] border-b border-[#2c2c2e]">
                        <tr>
                          <th className="p-4 font-bold">نام و تصویر کاربر</th>
                          <th className="p-4 font-bold">ایمیل (شناسه کاربری)</th>
                          <th className="p-4 font-bold">شماره تماس</th>
                          <th className="p-4 font-bold">نقش و سطح دسترسی</th>
                          <th className="p-4 font-bold">وضعیت حساب</th>
                          <th className="p-4 font-bold">تاریخ عضویت</th>
                          <th className="p-4 font-bold text-center">عملیات مدیریت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2c2c2e]">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-12 text-center text-[#64748b]">
                              هیچ کاربری با این مشخصات یا فیلتر یافت نشد.
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-[#1a1a1a] transition-colors">
                              
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-[#141414] border border-[#2c2c2e] flex items-center justify-center font-bold text-xs text-[#ff6600] overflow-hidden">
                                    {u.avatar ? (
                                      <img src={u.avatar} alt={u.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span>{u.full_name?.slice(0, 2) || "نا"}</span>
                                    )}
                                  </div>
                                  <span className="font-bold text-[#e5e2e1]">{u.full_name}</span>
                                </div>
                              </td>

                              <td className="p-4 font-mono-tag text-[#e5e2e1]/80" dir="ltr">
                                {u.email}
                              </td>

                              <td className="p-4 font-mono-tag text-[#64748b]" dir="ltr">
                                {u.phone || "—"}
                              </td>

                              <td className="p-4">
                                {u.role === "superadmin" ? (
                                  <span className="px-2.5 py-1 rounded bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold text-[11px] inline-flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>سوپروایزر (مدیر کل)</span>
                                  </span>
                                ) : u.role === "admin" ? (
                                  <span className="px-2.5 py-1 rounded bg-[#ff6600]/15 border border-[#ff6600]/30 text-[#ff6600] font-bold text-[11px] inline-flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>مربی بدنسازی (Coach)</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold text-[11px] inline-flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>قهرمان / یوزر سایت</span>
                                  </span>
                                )}
                              </td>

                              <td className="p-4">
                                <button
                                  onClick={() => handleToggleUserActive(u)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                                    u.is_active
                                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                                      : "bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25"
                                  }`}
                                  title="کلیک برای تغییر وضعیت فعال/غیرفعال"
                                >
                                  {u.is_active ? "حساب فعال" : "مسدود / غیرفعال"}
                                </button>
                              </td>

                              <td className="p-4 font-mono-tag text-[11px] text-[#64748b]" dir="ltr">
                                {u.created_at ? new Date(u.created_at).toLocaleDateString("fa-IR") : "۱۴۰۴/۰۶/۰۱"}
                              </td>

                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEditUser(u)}
                                    className="p-1.5 rounded bg-[#141414] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] transition-colors"
                                    title="ویرایش کاربر"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-1.5 rounded bg-[#141414] hover:bg-rose-900/40 text-[#64748b] hover:text-rose-400 border border-[#2c2c2e] transition-colors"
                                    title="حذف کاربر"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* آرشیو رسانه، آپلود و مدیریت سئو تصاویر (Media Library & SEO View) */}
        {activeMenu === "media-library" && (
          <div className="mt-8 space-y-6 w-full pb-16 text-right">
            
            {/* اینپوت مخفی آپلود فایل */}
            <input
              type="file"
              ref={mediaFileInputRef}
              onChange={handleUploadMediaFile}
              className="hidden"
              accept="image/*,video/*,application/pdf"
            />

            {/* پیام‌های وضعیت */}
            {mediaUploadSuccessNotice && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold">فایل با موفقیت در سرور آپلود شد و با الگوریتم‌های مدرن فشرده‌سازی Go بهینه‌سازی گردید 🚀</span>
                </div>
                <button onClick={() => setMediaUploadSuccessNotice(false)} className="text-emerald-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {mediaSeoNotice && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold">تغییرات سئو تصویر (متن جایگزین Alt، عنوان و کپشن) با موفقیت در دیتابیس ثبت شد.</span>
                </div>
                <button onClick={() => setMediaSeoNotice(false)} className="text-emerald-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* کارت‌های خلاصه وضعیت رسانه‌ها */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#87868b] font-medium">مجموع فایل‌های رسانه</span>
                  <div className="w-8 h-8 rounded-lg bg-[#ff6600]/10 text-[#ff6600] flex items-center justify-center">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#e5e2e1] font-mono-tag">
                  {mediaItems.length}
                </div>
                <span className="text-[11px] text-[#87868b]">تصاویر، ویدیوها و اسناد آپلود شده</span>
              </div>

              <div className="p-5 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#87868b] font-medium">تصاویر بهینه‌شده با Go</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono-tag">
                  {mediaItems.filter((m) => m.is_optimized || m.file_type === "image").length}
                </div>
                <span className="text-[11px] text-emerald-500/80">فشرده‌سازی با کیفیت حفظ‌شده</span>
              </div>

              <div className="p-5 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#87868b] font-medium">حجم اشغال‌شده دیسک</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-400 font-mono-tag">
                  {(mediaItems.reduce((acc, m) => acc + (m.file_size || 0), 0) / (1024 * 1024)).toFixed(1)} MB
                </div>
                <span className="text-[11px] text-[#87868b]">مجموع فضای ذخیره‌سازی در هاست</span>
              </div>
            </div>

            {/* نوار جستجو، فیلتر و دراپ‌زون سریع */}
            <div className="p-5 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* جستجو */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#87868b] absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="جستجو در نام فایل، متن سئو (Alt) یا عنوان..."
                    value={mediaSearchQuery}
                    onChange={(e) => setMediaSearchQuery(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2c2c2e] rounded-xl pr-9 pl-4 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                  {mediaSearchQuery && (
                    <button
                      onClick={() => setMediaSearchQuery("")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87868b] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* فیلتر نوع رسانه */}
                <div className="flex items-center gap-1.5 bg-[#141414] p-1 rounded-xl border border-[#2c2c2e] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMediaFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mediaFilterType === "all"
                        ? "bg-[#ff6600] text-white shadow-sm"
                        : "text-[#87868b] hover:text-[#e5e2e1]"
                    }`}
                  >
                    همه ({mediaItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaFilterType("image")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mediaFilterType === "image"
                        ? "bg-[#ff6600] text-white shadow-sm"
                        : "text-[#87868b] hover:text-[#e5e2e1]"
                    }`}
                  >
                    تصاویر ({mediaItems.filter((m) => m.file_type === "image").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaFilterType("video")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mediaFilterType === "video"
                        ? "bg-[#ff6600] text-white shadow-sm"
                        : "text-[#87868b] hover:text-[#e5e2e1]"
                    }`}
                  >
                    ویدیوها ({mediaItems.filter((m) => m.file_type === "video").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaFilterType("document")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mediaFilterType === "document"
                        ? "bg-[#ff6600] text-white shadow-sm"
                        : "text-[#87868b] hover:text-[#e5e2e1]"
                    }`}
                  >
                    اسناد ({mediaItems.filter((m) => m.file_type === "document").length})
                  </button>
                </div>

              </div>

              {/* باکس درگ و دراپ آپلود فایل */}
              <div
                onClick={() => mediaFileInputRef.current?.click()}
                className="border-2 border-dashed border-[#2c2c2e] hover:border-[#ff6600]/60 bg-[#141414]/60 hover:bg-[#ff6600]/5 transition-all rounded-xl p-6 text-center cursor-pointer group"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[#ff6600]/10 text-[#ff6600] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isUploadingMediaFile ? (
                      <RefreshCw className="w-6 h-6 animate-spin text-[#ff6600]" />
                    ) : (
                      <Upload className="w-6 h-6 stroke-[2]" />
                    )}
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors block">
                      {isUploadingMediaFile ? "در حال آپلود، فشرده‌سازی و بهینه‌سازی فایل..." : "برای آپلود فایل کلیک کنید یا فایل را اینجا بکشید و رها کنید"}
                    </strong>
                    <span className="text-[11px] text-[#87868b] mt-0.5 block">
                      پشتیبانی از فرمت‌های JPG, PNG, WEBP, MP4, PDF • بهینه‌سازی خودکار تا ۱۹۲۰ پیکسل و فشرده‌سازی لنسوس Go
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* طرح اصلی ۲ ستونه: گالری در راست، بازرسی سئو در چپ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* ستون راست: شبکه تصاویر و رسانه‌ها (lg:col-span-7 xl:col-span-8) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                
                {filteredMediaItems.length === 0 ? (
                  <div className="p-16 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e] text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-[#2c2c2e] text-[#87868b] flex items-center justify-center mx-auto">
                      <FolderOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-[#e5e2e1]">هیچ رسانه‌ای یافت نشد</h3>
                    <p className="text-xs text-[#87868b]">
                      {mediaSearchQuery || mediaFilterType !== "all"
                        ? "با این شرایط جستجو یا فیلتر موردی در آرشیو ثبت نشده است."
                        : "هنوز فایلی در سیستم آپلود نشده است. اولین فایل خود را با دکمه بالا آپلود کنید."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {filteredMediaItems.map((item) => {
                      const isSelected = selectedMediaFile?.id === item.id;
                      const isCopied = copiedMediaUrlId === item.id;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectMediaForDetail(item)}
                          className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all flex flex-col bg-[#161616] ${
                            isSelected
                              ? "border-[#ff6600] ring-2 ring-[#ff6600]/40 shadow-lg shadow-[#ff6600]/10"
                              : "border-[#2c2c2e] hover:border-[#404040] hover:bg-[#1a1a1c]"
                          }`}
                        >
                          {/* باکس پیش‌نمایش تصویر با نسبت ۱:۱ */}
                          <div className="aspect-square w-full bg-[#121212] relative overflow-hidden flex items-center justify-center">
                            {item.file_type === "image" ? (
                              <img
                                src={item.file_url}
                                alt={item.alt_text || item.file_name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : item.file_type === "video" ? (
                              <div className="flex flex-col items-center justify-center gap-1.5 text-blue-400">
                                <Video className="w-8 h-8" />
                                <span className="text-[10px] font-bold">ویدیو</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-1.5 text-amber-400">
                                <FileText className="w-8 h-8" />
                                <span className="text-[10px] font-bold">سند</span>
                              </div>
                            )}

                            {/* بج بهینه‌شده */}
                            {item.is_optimized && (
                              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold">
                                Go Opt ✓
                              </span>
                            )}

                            {/* بج تگ Alt */}
                            {item.alt_text ? (
                              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[#cbd5e1] text-[9px] font-mono-tag">
                                Alt ✓
                              </span>
                            ) : (
                              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[9px] font-bold">
                                بدون Alt
                              </span>
                            )}

                            {/* هاور اکشن سریع */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyMediaUrl(item.file_url, item.id);
                                }}
                                className="w-8 h-8 rounded-lg bg-[#202020] hover:bg-[#ff6600] text-white flex items-center justify-center transition-colors shadow-md"
                                title="کپی لینک مستقیم"
                              >
                                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                              <a
                                href={item.file_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-8 h-8 rounded-lg bg-[#202020] hover:bg-sky-600 text-white flex items-center justify-center transition-colors shadow-md"
                                title="مشاهده فایل اصلی"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>

                          {/* جزییات پایین کارت */}
                          <div className="p-2.5 space-y-1">
                            <span className="text-[11px] font-bold text-[#e5e2e1] truncate block dir-ltr text-right" title={item.file_name}>
                              {item.file_name}
                            </span>
                            <div className="flex items-center justify-between text-[10px] text-[#87868b] font-mono-tag">
                              <span>{(item.file_size / 1024).toFixed(0)} KB</span>
                              {item.width > 0 && <span>{item.width}×{item.height}</span>}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* ستون چپ: پنل بازرسی سئو و ویرایش متاتگ‌ها (lg:col-span-5 xl:col-span-4) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-6">
                
                {selectedMediaFile ? (
                  <div className="p-5 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] space-y-5 shadow-xl">
                    
                    {/* هدر پنل بازرسی */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#2c2c2e]">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#ff6600]" />
                        <h4 className="text-xs font-bold text-[#e5e2e1]">بازرسی و سئو فایل انتخابی</h4>
                      </div>
                      <span className="text-[10px] font-mono-tag text-[#87868b]">
                        ID: #{selectedMediaFile.id}
                      </span>
                    </div>

                    {/* پیش‌نمایش بزرگ */}
                    <div className="rounded-xl overflow-hidden bg-[#121212] border border-[#2c2c2e] relative aspect-video flex items-center justify-center">
                      {selectedMediaFile.file_type === "image" ? (
                        <img
                          src={selectedMediaFile.file_url}
                          alt={selectedMediaFile.alt_text || selectedMediaFile.file_name}
                          className="w-full h-full object-contain"
                        />
                      ) : selectedMediaFile.file_type === "video" ? (
                        <video src={selectedMediaFile.file_url} controls className="w-full h-full" />
                      ) : (
                        <FileText className="w-12 h-12 text-[#ff6600]" />
                      )}
                    </div>

                    {/* کادر لینک مستقیم */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#87868b] block">لینک مستقیم فایل در هاست:</label>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#141414] border border-[#2c2c2e]">
                        <input
                          type="text"
                          readOnly
                          value={selectedMediaFile.file_url}
                          className="flex-1 bg-transparent text-[11px] font-mono-tag text-[#cbd5e1] pr-2 focus:outline-none select-all dir-ltr"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyMediaUrl(selectedMediaFile.file_url, selectedMediaFile.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#202020] hover:bg-[#ff6600] text-white text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
                        >
                          {copiedMediaUrlId === selectedMediaFile.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">کپی شد</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>کپی</span>
                            </>
                          )}
                        </button>
                        <a
                          href={selectedMediaFile.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-[#202020] hover:bg-sky-600 text-white transition-colors shrink-0"
                          title="باز کردن در تب جدید"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* جزییات مشخصات فنی */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#141414] border border-[#2c2c2e]">
                        <span className="text-[10px] text-[#87868b] block">ابعاد تصویر:</span>
                        <span className="font-bold text-[#e5e2e1] font-mono-tag">
                          {selectedMediaFile.width > 0 ? `${selectedMediaFile.width} × ${selectedMediaFile.height} px` : "نامشخص"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#141414] border border-[#2c2c2e]">
                        <span className="text-[10px] text-[#87868b] block">حجم فایل:</span>
                        <span className="font-bold text-[#e5e2e1] font-mono-tag">
                          {(selectedMediaFile.file_size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#141414] border border-[#2c2c2e]">
                        <span className="text-[10px] text-[#87868b] block">نوع فایل:</span>
                        <span className="font-bold text-[#e5e2e1] font-mono-tag">
                          {selectedMediaFile.mime_type || selectedMediaFile.file_type}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#141414] border border-[#2c2c2e]">
                        <span className="text-[10px] text-[#87868b] block">تاریخ آپلود:</span>
                        <span className="font-bold text-[#e5e2e1] text-[11px]">
                          {selectedMediaFile.created_at ? new Date(selectedMediaFile.created_at).toLocaleDateString("fa-IR") : "به‌تازگی"}
                        </span>
                      </div>
                    </div>

                    {/* فرم سئو تصاویر */}
                    <form onSubmit={handleSaveMediaSeo} className="space-y-3.5 pt-2 border-t border-[#2c2c2e]">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff6600]">
                        <Globe className="w-3.5 h-3.5" />
                        <span>متاتگ‌ها و سئوی تصویر برای گوگل (SEO)</span>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#87868b] mb-1 font-medium">نام نمایشی فایل</label>
                        <input
                          type="text"
                          value={mediaSeoEditForm.file_name}
                          onChange={(e) => setMediaSeoEditForm({ ...mediaSeoEditForm, file_name: e.target.value })}
                          className="w-full bg-[#141414] border border-[#2c2c2e] rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] text-[#87868b] font-bold text-[#ff6600]">متن جایگزین (Alt Text) *</label>
                          <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">مهم‌ترین فاکتور سئو</span>
                        </div>
                        <input
                          type="text"
                          placeholder="توضیح موضوع تصویر برای گوگل (مثلاً: تمرین پرس سینه با دمبل ناظری)"
                          value={mediaSeoEditForm.alt_text}
                          onChange={(e) => setMediaSeoEditForm({ ...mediaSeoEditForm, alt_text: e.target.value })}
                          className="w-full bg-[#141414] border border-[#2c2c2e] rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                        />
                        <p className="text-[10px] text-[#64748b] mt-1 leading-relaxed">
                          متن Alt در صورت لود نشدن عکس و به خزنده‌های گوگل نمایش داده می‌شود.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#87868b] mb-1 font-medium">عنوان تصویر (Title Attribute)</label>
                        <input
                          type="text"
                          placeholder="متن نمایش داده شده هنگام نگه داشتن موس روی عکس"
                          value={mediaSeoEditForm.title}
                          onChange={(e) => setMediaSeoEditForm({ ...mediaSeoEditForm, title: e.target.value })}
                          className="w-full bg-[#141414] border border-[#2c2c2e] rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#87868b] mb-1 font-medium">کپشن و توضیح تصویر (Caption)</label>
                        <textarea
                          rows={2}
                          placeholder="توضیح تکمیلی یا زیرنویس مرتبط با عکس..."
                          value={mediaSeoEditForm.caption}
                          onChange={(e) => setMediaSeoEditForm({ ...mediaSeoEditForm, caption: e.target.value })}
                          className="w-full bg-[#141414] border border-[#2c2c2e] rounded-xl p-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                        />
                      </div>

                      {/* دکمه‌های اقدام سئو */}
                      <div className="pt-2 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteMediaFile(selectedMediaFile.id)}
                          disabled={isDeletingMediaFile}
                          className="px-3.5 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                          title="حذف دائمی فایل از هاست"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف فایل</span>
                        </button>

                        <button
                          type="submit"
                          disabled={isSavingMediaSeo}
                          className="px-5 py-2 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/20 flex items-center gap-2"
                        >
                          {isSavingMediaSeo ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>در حال ذخیره...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>ذخیره تنظیمات سئو</span>
                            </>
                          )}
                        </button>
                      </div>

                    </form>

                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#1a1a1c] border border-[#2c2c2e] text-center space-y-2">
                    <ImageIcon className="w-8 h-8 text-[#87868b] mx-auto" />
                    <h4 className="text-xs font-bold text-[#e5e2e1]">هیچ فایلی انتخاب نشده است</h4>
                    <p className="text-[11px] text-[#87868b]">
                      روی هر یک از کارت‌های سمت راست کلیک کنید تا پیش‌نمایش، لینک مستقیم و فرم سئو فعال شود.
                    </p>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ۵. نمای پرونده و وضعیت دریافت برنامه قهرمان (Student My Plan View) */}
        {activeMenu === "my-plan" && (
          <div className="mt-8 space-y-6 w-full pb-12 text-right">
            
            {orderUpdateSuccessNotice && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in shadow-lg">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold">مشخصات پرونده شما با موفقیت ویرایش شد و در پرونده ورزشی شما ثبت گردید.</span>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#2c2c2e] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#e5e2e1] flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#ff6600]" />
                  <span>پرونده‌های ورزشی و وضعیت دریافت برنامه شما</span>
                </h3>
                <p className="text-xs text-[#64748b] mt-1">
                  در این بخش روند طراحی برنامه اختصاصی توسط استاد احسان ناظری و فایل‌های تمرینی و غذایی بارگذاری شده را مشاهده می‌کنید.
                </p>
              </div>

              <Link
                href="/get-plan"
                className="px-5 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/30 hover:scale-105 active:scale-95 flex items-center gap-1.5 self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت پرونده یا پکیج جدید</span>
              </Link>
            </div>

            {userPlanOrders.length === 0 ? (
              <div className="p-16 text-center rounded-2xl bg-[#141414] border border-[#2c2c2e] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1a1a1c] border border-[#282828] flex items-center justify-center text-[#ff6600] mx-auto">
                  <Dumbbell className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-[#e5e2e1]">هنوز برنامه‌ای برای شما ثبت نشده است!</h4>
                  <p className="text-xs text-[#64748b] max-w-md mx-auto leading-relaxed">
                    شما می‌توانید همین حالا با تکمیل پرسشنامه فیزیولوژی و انتخاب نوع دوره، دریافت برنامه اختصاصی خود را آغاز فرمایید.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/get-plan"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#ff6600] text-white text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-[#ff6600]/25"
                  >
                    <span>دریافت برنامه اختصاصی</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {userPlanOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/40 transition-all space-y-6"
                  >
                    {/* هدر کارت سفارش قهرمان */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2c2c2e]">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#ff6600] text-black flex items-center justify-center font-bold">
                          <Dumbbell className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-[#e5e2e1]">{order.package_title}</h4>
                            <span className="font-mono-tag text-[11px] text-[#64748b]">#{order.id}</span>
                          </div>
                          <span className="text-xs text-[#64748b] block mt-0.5">
                            تاریخ ثبت: {order.created_at ? new Date(order.created_at).toLocaleDateString("fa-IR") : "به‌تازگی"} • مبلغ: <strong className="text-[#e5e2e1]">{order.price}</strong>
                          </span>
                        </div>
                      </div>

                      {/* وضعیت فعلی پرونده و دکمه ویرایش */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEditOrder(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] text-xs font-bold text-[#e5e2e1] hover:text-[#ff6600] border border-[#303030] hover:border-[#ff6600]/50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                          title="ویرایش اطلاعات فیزیولوژی، هدف یا توضیحات این پرونده"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#ff6600]" />
                          <span>ویرایش اطلاعات پرونده</span>
                        </button>

                        {order.status === "reviewing" && (
                          <div className="px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1.5">
                            <Clock className="w-4 h-4 animate-pulse" />
                            <span>در حال بررسی اولیه توسط مربی</span>
                          </div>
                        )}
                        {order.status === "preparing" && (
                          <div className="px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center gap-1.5">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>در حال تدوین و طراحی علمی برنامه</span>
                          </div>
                        )}
                        {order.status === "ready" && (
                          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>برنامه آماده و فعال است</span>
                          </div>
                        )}
                        {order.status === "completed" && (
                          <div className="px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold text-xs flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            <span>دوره با موفقیت تکمیل شد</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* تایم‌لاین مراحل پیشرفت پرونده */}
                    <div className="py-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className={`p-4 rounded-xl border space-y-1 ${
                          order.status === "reviewing" || order.status === "preparing" || order.status === "ready" || order.status === "completed"
                            ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400"
                            : "bg-[#1a1a1c] border-[#2c2c2e] text-[#64748b]"
                        }`}>
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>۱. ثبت اطلاعات و پرسشنامه</span>
                          </div>
                          <p className="text-[11px] text-[#64748b]">مشخصات فیزیولوژی با موفقیت ثبت شد</p>
                        </div>

                        <div className={`p-4 rounded-xl border space-y-1 ${
                          order.status === "preparing" || order.status === "ready" || order.status === "completed"
                            ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400"
                            : order.status === "reviewing"
                            ? "bg-amber-950/20 border-amber-500/40 text-amber-400"
                            : "bg-[#1a1a1c] border-[#2c2c2e] text-[#64748b]"
                        }`}>
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <Clock className="w-4 h-4" />
                            <span>۲. طراحی برنامه توسط مربی</span>
                          </div>
                          <p className="text-[11px] text-[#64748b]">زمان تقریبی: {order.estimated_delivery || "۲۴ الی ۴۸ ساعت"}</p>
                        </div>

                        <div className={`p-4 rounded-xl border space-y-1 ${
                          order.status === "ready" || order.status === "completed"
                            ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400"
                            : "bg-[#1a1a1c] border-[#2c2c2e] text-[#64748b]"
                        }`}>
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <FileCheck className="w-4 h-4" />
                            <span>۳. تحویل و شروع دوره</span>
                          </div>
                          <p className="text-[11px] text-[#64748b]">
                            {order.status === "ready" ? "برنامه هم‌اکنون قابل دریافت است" : "در انتظار تکمیل طراحی"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* پیام و توضیحات مربی به قهرمان */}
                    {order.admin_feedback && (
                      <div className="p-4 rounded-xl bg-[#1a1a1c] border-r-2 border-r-[#ff6600] border-y border-l border-[#2c2c2e] space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#ff6600]">
                          <ShieldCheck className="w-4 h-4" />
                          <span>پیام و توضیحات استاد احسان ناظری:</span>
                        </div>
                        <p className="text-xs text-[#e5e2e1] leading-relaxed text-justify">
                          {order.admin_feedback}
                        </p>
                      </div>
                    )}

                    {/* پیام تایید نهایی پرونده و دکمه ورود به برنامه تمرینی */}
                    {order.status === "ready" && (
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-[#18261e] to-[#141d17] border-2 border-emerald-500/50 space-y-4 shadow-xl shadow-emerald-950/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>پرونده تایید شد • برنامه نوشته شده است</span>
                            </div>
                            <h3 className="text-base font-black text-[#e5e2e1] pt-1">
                              برنامه اختصاصی شما آماده اجرا است!
                            </h3>
                            <p className="text-xs text-[#94a3b8] leading-relaxed">
                              برنامه تمرینی اختصاصی شما توسط استاد احسان ناظری طراحی، تایید و در پنل شما قرار گرفت.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => setActiveMenu("my-workout")}
                              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-lg shadow-[#ff6600]/30 hover:scale-105 active:scale-95"
                            >
                              <Dumbbell className="w-4 h-4" />
                              <span>مشاهده برنامه تمرینی</span>
                              <ArrowLeft className="w-4 h-4" />
                            </button>

                            {(order.diet_plan_content || order.diet_plan_file) && (
                              <button
                                onClick={() => setActiveMenu("my-diet")}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 hover:scale-105 active:scale-95"
                              >
                                <Utensils className="w-4 h-4" />
                                <span>مشاهده برنامه غذایی</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* دکمه‌های دانلود PDF در صورت وجود */}
                        {(order.workout_plan_file || order.diet_plan_file) && (
                          <div className="pt-3 border-t border-emerald-500/20 flex flex-wrap items-center gap-3">
                            <span className="text-[11px] text-[#94a3b8]">دانلود فایل‌های ضمیمه:</span>
                            {order.workout_plan_file && (
                              <a
                                href={order.workout_plan_file}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>دانلود PDF تمرین</span>
                              </a>
                            )}
                            {order.diet_plan_file && (
                              <a
                                href={order.diet_plan_file}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>دانلود PDF رژیم</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* نمایش متن برنامه تمرینی و تغذیه تدوین‌شده توسط مربی */}
                    {(order.workout_plan_content || order.diet_plan_content) && (
                      <div className="space-y-4 pt-4 border-t border-[#2c2c2e]">
                        {order.workout_plan_content && (
                          <div className="p-5 rounded-2xl bg-[#181818] border border-[#2e2e2e] space-y-3">
                            <h4 className="text-xs font-bold text-[#ff6600] flex items-center gap-2">
                              <Dumbbell className="w-4 h-4" />
                              <span>برنامه تمرینی اختصاصی تدوین‌شده توسط مربی:</span>
                            </h4>
                            <div className="p-4 rounded-xl bg-[#121212] text-xs font-mono text-[#e5e2e1] leading-relaxed whitespace-pre-line border border-[#262626]">
                              {order.workout_plan_content}
                            </div>
                          </div>
                        )}

                        {order.diet_plan_content && (
                          <div className="p-5 rounded-2xl bg-[#181818] border border-[#2e2e2e] space-y-3">
                            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                              <Utensils className="w-4 h-4" />
                              <span>برنامه غذایی و توصیه‌های رژیم:</span>
                            </h4>
                            <div className="p-4 rounded-xl bg-[#121212] text-xs font-mono text-[#e5e2e1] leading-relaxed whitespace-pre-line border border-[#262626]">
                              {order.diet_plan_content}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* خلاصه اطلاعات ثبت شده در پرسشنامه */}
                    <div className="pt-2 border-t border-[#2c2c2e]">
                      <details className="cursor-pointer group">
                        <summary className="text-xs font-bold text-[#64748b] group-hover:text-[#e5e2e1] transition-colors flex items-center justify-between">
                          <span>مشاهده و بررسی جزییات پرسشنامه فیزیولوژی ثبت شده</span>
                          <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                        </summary>

                        <div className="space-y-4 pt-4 text-xs text-[#64748b]">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                              <span className="block text-[10px] text-[#64748b]">سن / قد / وزن:</span>
                              <strong className="text-[#e5e2e1]">{order.age} سال / {order.height}cm / {order.weight}kg</strong>
                            </div>

                            <div className="p-3 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                              <span className="block text-[10px] text-[#64748b]">هدف دوره:</span>
                              <strong className="text-[#e5e2e1]">
                                {order.primary_goal === "hypertrophy"
                                  ? "عضله‌سازی و هایپرتروفی"
                                  : order.primary_goal === "weight_loss"
                                  ? "چربی‌سوزی و کاهش وزن"
                                  : order.primary_goal === "recomp"
                                  ? "ریکامپوزیشن (عضله‌سازی + چربی‌سوزی)"
                                  : "افزایش قدرت"}
                              </strong>
                            </div>

                            <div className="p-3 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                              <span className="block text-[10px] text-[#64748b]">محیط تمرین:</span>
                              <strong className="text-[#e5e2e1]">{order.training_location === "gym" ? "باشگاه بدنسازی" : "منزل"}</strong>
                            </div>

                            <div className="p-3 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                              <span className="block text-[10px] text-[#64748b]">روزهای تمرین:</span>
                              <strong className="text-[#e5e2e1]">{order.days_per_week} روز در هفته</strong>
                            </div>

                            {order.injuries && (
                              <div className="sm:col-span-2 p-3 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                                <span className="block text-[10px] text-[#64748b]">آسیب‌دیدگی یا محدودیت:</span>
                                <strong className="text-[#e5e2e1]">{order.injuries}</strong>
                              </div>
                            )}

                            {order.dietary_restrictions && (
                              <div className="sm:col-span-2 p-3 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                                <span className="block text-[10px] text-[#64748b]">حساسیت و پرهیز غذایی:</span>
                                <strong className="text-[#e5e2e1]">{order.dietary_restrictions}</strong>
                              </div>
                            )}

                            {order.coach_notes && (
                              <div className="col-span-2 sm:col-span-4 p-3 rounded-xl bg-[#1a1a1c] border border-[#2c2c2e]">
                                <span className="block text-[10px] text-[#64748b]">یادداشت‌های تکمیلی قهرمان:</span>
                                <p className="text-xs text-[#e5e2e1] leading-relaxed mt-1">{order.coach_notes}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditOrder(order)}
                              className="px-4 py-2 rounded-xl bg-[#1e1e1e] hover:bg-[#2c2c2e] text-xs font-bold text-[#ff6600] border border-[#303030] hover:border-[#ff6600]/40 transition-all flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>ویرایش مشخصات این پرونده</span>
                            </button>
                          </div>
                        </div>
                      </details>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* نمای برنامه تمرینی اختصاصی قهرمان (Student My-Workout View) */}
        {activeMenu === "my-workout" && (
          <div className="mt-8 space-y-6 w-full pb-16 text-right">
            {(() => {
              const activeOrder = userPlanOrders.find(
                (o) => (o.status === "ready" || o.status === "completed") && (o.workout_plan_content || o.workout_plan_file)
              ) || userPlanOrders[0];

              if (!activeOrder) {
                return (
                  <div className="p-12 rounded-2xl bg-[#1a1a1a] border border-[#262626] text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff6600]/10 border border-[#ff6600]/20 flex items-center justify-center mx-auto text-[#ff6600]">
                      <Dumbbell className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-[#e5e2e1]">هنوز برنامه‌ای برای شما ثبت نشده است</h3>
                    <p className="text-xs text-[#94a3b8] max-w-md mx-auto leading-relaxed">
                      شما می‌توانید از طریق صفحه دریافت برنامه، مشخصات فیزیولوژی خود را تکمیل کنید تا برنامه علمی شما توسط مربی تدوین گردد.
                    </p>
                    <Link
                      href="/get-plan"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-lg shadow-[#ff6600]/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ثبت و دریافت برنامه اختصاصی</span>
                    </Link>
                  </div>
                );
              }

              const isPlanReady = (activeOrder.status === "ready" || activeOrder.status === "completed") && (activeOrder.workout_plan_content || activeOrder.workout_plan_file);

              if (!isPlanReady) {
                return (
                  <div className="p-12 rounded-2xl bg-[#1a1a1a] border border-[#262626] text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                      <Clock className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                        <span>وضعیت پرونده: در حال تدوین و برنامه‌نویسی</span>
                      </div>
                      <h3 className="text-lg font-black text-[#e5e2e1]">برنامه تمرینی شما در حال نگارش است</h3>
                      <p className="text-xs text-[#94a3b8] max-w-lg mx-auto leading-relaxed">
                        استاد احسان ناظری در حال بررسی مشخصات فیزیکی، آناتومی و هدف ورزشی شما هستند. به محض تکمیل و تایید نهایی، برنامه هفتگی شما در این بخش فعال خواهد شد.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveMenu("my-plan")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#303030] text-xs font-bold text-[#e5e2e1] transition-all"
                    >
                      <span>مشاهده جزئیات پرونده و ویرایش</span>
                      <ArrowLeft className="w-4 h-4 text-[#ff6600]" />
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {/* بنر تایید شده و مشخصات برنامه */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1c1c1c] via-[#181818] to-[#141414] border border-[#2e2e2e] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>برنامه نوشته شده و تایید گردید</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#e5e2e1]">
                          برنامه تمرینی اختصاصی {activeOrder.user_name}
                        </h2>
                        <p className="text-xs text-[#94a3b8] mt-1">
                          طراحی شده توسط استاد احسان ناظری | {activeOrder.package_title}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {activeOrder.workout_plan_file && (
                          <a
                            href={activeOrder.workout_plan_file}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-lg shadow-[#ff6600]/20"
                          >
                            <Download className="w-4 h-4" />
                            <span>دانلود فایل PDF برنامه</span>
                          </a>
                        )}

                        <button
                          onClick={() => {
                            if (activeOrder.workout_plan_content) {
                              navigator.clipboard.writeText(activeOrder.workout_plan_content);
                              alert("متن برنامه تمرینی با موفقیت در کلیپ‌بورد کپی شد.");
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e1e1e] hover:bg-[#2c2c2e] border border-[#303030] text-xs font-medium text-[#e5e2e1] transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#ff6600]" />
                          <span>کپی متن برنامه</span>
                        </button>
                      </div>
                    </div>

                    {/* مشخصات دوره تمرینی */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#262626] text-xs">
                      <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                        <span className="text-[10px] text-[#64748b] block">هدف دوره:</span>
                        <strong className="text-[#e5e2e1]">
                          {activeOrder.primary_goal === "hypertrophy"
                            ? "عضله‌سازی و هایپرتروفی"
                            : activeOrder.primary_goal === "weight_loss"
                            ? "چربی‌سوزی و کاهش وزن"
                            : activeOrder.primary_goal === "recomp"
                            ? "ریکامپوزیشن"
                            : activeOrder.primary_goal || "عمومی"}
                        </strong>
                      </div>

                      <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                        <span className="text-[10px] text-[#64748b] block">محیط تمرین:</span>
                        <strong className="text-[#e5e2e1]">
                          {activeOrder.training_location === "gym" ? "باشگاه بدنسازی" : "منزل"}
                        </strong>
                      </div>

                      <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                        <span className="text-[10px] text-[#64748b] block">روزهای تمرین:</span>
                        <strong className="text-[#e5e2e1]">{activeOrder.days_per_week || "۴"} روز در هفته</strong>
                      </div>

                      <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                        <span className="text-[10px] text-[#64748b] block">وضعیت فعلی:</span>
                        <span className="font-bold text-emerald-400">فعال در حال اجرا</span>
                      </div>
                    </div>

                    {/* پیام انگیزشی و نکات مربی */}
                    {activeOrder.admin_feedback && (
                      <div className="p-4 rounded-xl bg-[#141414] border-r-2 border-r-[#ff6600] border-y border-l border-[#262626] text-xs space-y-1">
                        <span className="font-bold text-[#ff6600] flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>نکات اختصاصی مربی برای شروع:</span>
                        </span>
                        <p className="text-[#cbd5e1] leading-relaxed">{activeOrder.admin_feedback}</p>
                      </div>
                    )}
                  </div>

                  {/* بدنه برنامه تمرینی قهرمان (با دیزاین مدرن روزبه‌روز مطابق میزکار مربی) */}
                  {activeOrder.workout_plan_content ? (() => {
                    const studentDays = parseWorkoutContent(activeOrder.workout_plan_content, activeOrder.days_per_week);
                    const safeDayIndex = Math.min(studentActiveDayIndex, Math.max(0, studentDays.length - 1));
                    const currentDay = studentDays[safeDayIndex] || studentDays[0];

                    return (
                      <div className="p-6 sm:p-8 rounded-2xl bg-[#181818] border border-[#282828] space-y-6 shadow-xl">
                        {/* سربرگ بخش جدول تمرین */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#282828]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#ff6600]/10 border border-[#ff6600]/30 flex items-center justify-center text-[#ff6600]">
                              <Dumbbell className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-[#e5e2e1]">
                                زمان‌بندی و جدول روزبه‌روز تمرینات شما
                              </h3>
                              <p className="text-xs text-[#64748b] mt-0.5">
                                جلسات هفتگی خود را انتخاب کرده و حرکات را با رعایت دقیق ست و تکرار انجام دهید
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-[#121212] border border-[#2b2b2b] text-[11px] text-[#94a3b8]">
                              برنامه {studentDays.length} روزه در هفته
                            </span>
                          </div>
                        </div>

                        {/* انتخاب روزهای هفته (Tabs) */}
                        <div className="flex flex-wrap items-center gap-2 pb-2">
                          {studentDays.map((day, dIdx) => (
                            <button
                              key={day.id || dIdx}
                              type="button"
                              onClick={() => setStudentActiveDayIndex(dIdx)}
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                                safeDayIndex === dIdx
                                  ? "bg-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25 ring-2 ring-[#ff6600]/50"
                                  : "bg-[#141414] hover:bg-[#202020] text-[#94a3b8] hover:text-[#e5e2e1] border border-[#282828]"
                              }`}
                            >
                              <Calendar className="w-4 h-4" />
                              <span>{day.dayTitle}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                safeDayIndex === dIdx ? "bg-black/30 text-white" : "bg-[#1f1f1f] text-[#64748b]"
                              }`}>
                                {day.exercises.length} حرکت
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* محتوای روز انتخاب‌شده */}
                        {currentDay && (
                          <div className="space-y-4">
                            {/* بنر خلاصه روز فعال */}
                            <div className="p-4 rounded-xl bg-[#141414] border border-[#282828] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[#ff6600]" />
                                <span className="text-xs font-black text-[#e5e2e1]">{currentDay.dayTitle}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                                <span>تعداد حرکات: <strong className="text-white">{currentDay.exercises.length}</strong></span>
                                <span>•</span>
                                <span>مجموع ست‌ها: <strong className="text-amber-400">{currentDay.exercises.reduce((acc, x) => acc + (Number(x.sets) || 0), 0)}</strong> ست</span>
                              </div>
                            </div>

                            {/* جدول حرکات روز */}
                            <div className="overflow-x-auto rounded-2xl border border-[#282828] bg-[#141414]">
                              <table className="w-full text-right text-xs">
                                <thead className="bg-[#101010] text-[#94a3b8] font-bold border-b border-[#262626]">
                                  <tr>
                                    <th className="p-4 w-12 text-center">ردیف</th>
                                    <th className="p-4 min-w-[220px]">نام حرکت ورزشی</th>
                                    <th className="p-4 w-32 text-center">تعداد ست</th>
                                    <th className="p-4 w-32 text-center">تکرار هر ست</th>
                                    <th className="p-4 w-36">زمان استراحت</th>
                                    <th className="p-4 min-w-[180px]">نکات و سیستم اجرایی</th>
                                    <th className="p-4 w-28 text-center">ثبت انجام</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#202020]">
                                  {currentDay.exercises.map((ex, exIdx) => {
                                    const isDone = completedExercises[ex.id || `${safeDayIndex}-${exIdx}`];
                                    const exerciseKey = ex.id || `${safeDayIndex}-${exIdx}`;
                                    return (
                                      <tr
                                        key={exerciseKey}
                                        className={`transition-colors ${
                                          isDone ? "bg-emerald-950/15" : "hover:bg-[#181818]"
                                        }`}
                                      >
                                        <td className="p-4 text-center">
                                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1e1e1e] text-[#94a3b8] text-[11px] font-bold font-mono-tag">
                                            {exIdx + 1}
                                          </span>
                                        </td>
                                        <td className="p-4">
                                          <div className="flex items-center gap-2">
                                            <Dumbbell className={`w-4 h-4 shrink-0 ${isDone ? "text-emerald-400" : "text-[#ff6600]"}`} />
                                            <span className={`font-bold text-sm ${isDone ? "text-emerald-200 line-through opacity-75" : "text-[#e5e2e1]"}`}>
                                              {ex.name}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="p-4 text-center">
                                          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 font-black text-xs">
                                            {ex.sets} ست
                                          </span>
                                        </td>
                                        <td className="p-4 text-center">
                                          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-400 font-black text-xs font-mono-tag">
                                            {ex.reps} تکرار
                                          </span>
                                        </td>
                                        <td className="p-4">
                                          <div className="flex items-center gap-1.5 text-xs text-[#cbd5e1]">
                                            <Clock className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                                            <span>{ex.rest || "۶۰ ثانیه"}</span>
                                          </div>
                                        </td>
                                        <td className="p-4">
                                          {ex.notes ? (
                                            <span className="inline-block px-2.5 py-1 rounded-lg bg-[#1f1f1f] text-[11px] text-[#cbd5e1] border border-[#2e2e2e]">
                                              {ex.notes}
                                            </span>
                                          ) : (
                                            <span className="text-[11px] text-[#64748b]">-</span>
                                          )}
                                        </td>
                                        <td className="p-4 text-center">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setCompletedExercises((prev) => ({
                                                ...prev,
                                                [exerciseKey]: !prev[exerciseKey],
                                              }));
                                            }}
                                            className={`p-2 rounded-xl transition-all flex items-center justify-center mx-auto ${
                                              isDone
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                                : "bg-[#1f1f1f] text-[#64748b] hover:text-[#e5e2e1] border border-[#2e2e2e]"
                                            }`}
                                            title={isDone ? "علامت‌گذاری به عنوان انجام‌نشده" : "علامت‌گذاری به عنوان انجام‌شده"}
                                          >
                                            {isDone ? (
                                              <CheckSquare className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                              <Square className="w-4 h-4" />
                                            )}
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })() : (
                    activeOrder.workout_plan_file && (
                      <div className="p-8 rounded-2xl bg-[#181818] border border-[#282828] text-center space-y-4">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                        <h4 className="text-sm font-bold text-[#e5e2e1]">برنامه تمرینی شما در قالب فایل PDF آماده دانلود است</h4>
                        <p className="text-xs text-[#94a3b8] max-w-md mx-auto">
                          فایل با کیفیت بالای تمرینات همراه با توضیحات حرکات، سیستم‌های وزنی و استراحت آماده می‌باشد.
                        </p>
                        <a
                          href={activeOrder.workout_plan_file}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-lg shadow-[#ff6600]/20"
                        >
                          <Download className="w-4 h-4" />
                          <span>دانلود و ذخیره فایل PDF برنامه تمرینی</span>
                        </a>
                      </div>
                    )
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* نمای برنامه غذایی و رژیم قهرمان (Student My-Diet View) */}
        {activeMenu === "my-diet" && (
          <div className="mt-8 space-y-6 w-full pb-16 text-right">
            {(() => {
              const activeOrder = userPlanOrders.find(
                (o) => (o.status === "ready" || o.status === "completed") && (o.diet_plan_content || o.diet_plan_file)
              ) || userPlanOrders[0];

              if (!activeOrder) {
                return (
                  <div className="p-12 rounded-2xl bg-[#1a1a1a] border border-[#262626] text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-[#e5e2e1]">هنوز برنامه غذایی برای شما ثبت نشده است</h3>
                    <p className="text-xs text-[#94a3b8] max-w-md mx-auto leading-relaxed">
                      جهت دریافت برنامه تغذیه اختصاصی، می‌توانید پکیج VIP یا رژیم را انتخاب نمایید.
                    </p>
                  </div>
                );
              }

              const hasDiet = (activeOrder.diet_plan_content || activeOrder.diet_plan_file);

              if (!hasDiet) {
                return (
                  <div className="p-12 rounded-2xl bg-[#1a1a1a] border border-[#262626] text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-[#e5e2e1]">برنامه غذایی در این دوره تعریف نشده است</h3>
                    <p className="text-xs text-[#94a3b8] max-w-md mx-auto leading-relaxed">
                      پکیج فعال شما ({activeOrder.package_title}) در حال حاضر شامل برنامه تمرینی می‌باشد. جهت دریافت برنامه غذایی می‌توانید با مربی هماهنگ فرمایید.
                    </p>
                    <button
                      onClick={() => setActiveMenu("my-workout")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all"
                    >
                      <Dumbbell className="w-4 h-4" />
                      <span>مشاهده برنامه تمرینی</span>
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {/* بنر رژیم غذایی */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1c1c1c] via-[#181818] to-[#141414] border border-[#2e2e2e] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>برنامه غذایی اختصاصی آماده است</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#e5e2e1]">
                          رژیم و دستورالعمل‌های تغذیه {activeOrder.user_name}
                        </h2>
                        <p className="text-xs text-[#94a3b8] mt-1">
                          برنامه تغذیه علمی و دستورالعمل‌های اختصاصی تنظیم‌شده توسط استاد احسان ناظری
                        </p>
                      </div>

                      {activeOrder.diet_plan_file && (
                        <a
                          href={activeOrder.diet_plan_file}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                        >
                          <Download className="w-4 h-4" />
                          <span>دانلود PDF برنامه غذایی</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* بدنه برنامه غذایی با فیلتربندی و نمای تفکیک‌شده وعده‌ها */}
                  {activeOrder.diet_plan_content && (() => {
                    // فیلتر کردن دسته‌بندی‌های محاسبات کالری تا قهرمان فقط غذاها و توضیحات را ببیند
                    const allParsed = parseDietContent(activeOrder.diet_plan_content);
                    const parsedMeals = allParsed.filter(
                      (m) =>
                        !m.title.includes("کالری") &&
                        !m.title.includes("زیگزاگ") &&
                        !m.title.includes("BMR") &&
                        !m.title.includes("TDEE") &&
                        !m.id.includes("zigzag")
                    );

                    const filledMeals = parsedMeals.filter((m) => m.content.trim().length > 0);
                    const displayMeals = studentDietFilter === "all"
                      ? (filledMeals.length > 0 ? filledMeals : parsedMeals)
                      : parsedMeals.filter((m) => m.id === studentDietFilter);

                    return (
                      <div className="space-y-6">
                        {/* نوار فیلتر وعده‌ها برای قهرمان */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#181818] border border-[#282828] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#542201] text-[#ff6600] flex items-center justify-center">
                              <Utensils className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-[#e5e2e1]">فیلتر وعده‌های غذایی</span>
                              <p className="text-[11px] text-[#87868b]">جهت مشاهده اقلام و توضیحات هر وعده، روی دکمه مربوطه کلیک کنید</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setStudentDietFilter("all")}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                studentDietFilter === "all"
                                  ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/25"
                                  : "bg-[#141414] hover:bg-[#222224] text-[#87868b] hover:text-[#e5e2e1] border border-[#2c2c2e]"
                              }`}
                            >
                              <span>همه وعده‌ها</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px]">
                                {filledMeals.length}
                              </span>
                            </button>

                            {parsedMeals.map((meal) => {
                              const isFilled = meal.content.trim().length > 0;
                              const isSelected = studentDietFilter === meal.id;
                              if (!isFilled && studentDietFilter !== meal.id) return null;
                              return (
                                <button
                                  key={meal.id}
                                  type="button"
                                  onClick={() => setStudentDietFilter(meal.id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    isSelected
                                      ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/25"
                                      : "bg-[#141414] hover:bg-[#222224] text-[#87868b] hover:text-[#e5e2e1] border border-[#2c2c2e]"
                                  }`}
                                >
                                  {renderMealIcon(meal.iconName, "w-3.5 h-3.5")}
                                  <span>{meal.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* لیست کارت‌های وعده‌ها به صورت فیلدهای مشخص + توضیحات مربی */}
                        <div className={studentDietFilter === "all" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "space-y-6"}>
                          {displayMeals.map((meal) => {
                            const fields = parseMealContentFields(meal.content);
                            return (
                              <div
                                key={meal.id}
                                className="p-6 rounded-2xl bg-[#181818] border border-[#282828] hover:border-[#383838] transition-all space-y-4 shadow-md"
                              >
                                {/* هدر وعده */}
                                <div className="flex items-center justify-between pb-3.5 border-b border-[#282828]">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#542201] text-[#ff6600] flex items-center justify-center shrink-0">
                                      {renderMealIcon(meal.iconName, "w-4 h-4")}
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-bold text-[#e5e2e1]">{meal.title}</h4>
                                      {fields.items.length > 0 && (
                                        <span className="text-[11px] text-[#87868b]">
                                          شامل {fields.items.length} قلم غذایی
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {studentDietFilter === "all" ? (
                                    <button
                                      type="button"
                                      onClick={() => setStudentDietFilter(meal.id)}
                                      className="text-xs text-[#ff6600] hover:underline font-medium"
                                    >
                                      نمای تکی ←
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setStudentDietFilter("all")}
                                      className="text-xs text-[#ff6600] hover:underline font-bold"
                                    >
                                      مشاهده همه وعده‌ها ←
                                    </button>
                                  )}
                                </div>

                                {/* فیلدهای اقلام و مواد غذایی */}
                                {fields.items.length > 0 && (
                                  <div className="space-y-2">
                                    <span className="text-[11px] font-bold text-[#94a3b8] flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6600]" />
                                      <span>اقلام و مواد مصرفی:</span>
                                    </span>
                                    <div className="grid grid-cols-1 gap-2">
                                      {fields.items.map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="p-3 rounded-xl bg-[#141414] border border-[#262628] hover:border-[#ff6600]/40 transition-all flex items-center gap-2.5"
                                        >
                                          <span className="w-6 h-6 rounded-lg bg-[#542201] text-[#ff6600] text-[11px] font-bold flex items-center justify-center shrink-0 font-mono-tag">
                                            {idx + 1}
                                          </span>
                                          <span className="text-xs font-medium text-[#e5e2e1] leading-relaxed select-text">
                                            {item}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* فیلد توضیحات و دستورالعمل مربی */}
                                {(fields.notes.length > 0 || fields.otherText) && (
                                  <div className="p-3.5 rounded-xl bg-[#141414] border-r-2 border-r-[#ff6600] border-y border-l border-[#262628] space-y-1.5">
                                    <span className="text-[11px] font-bold text-[#ff6600] flex items-center gap-1.5">
                                      <Sparkles className="w-3.5 h-3.5" />
                                      <span>توضیحات و دستورالعمل مربی:</span>
                                    </span>
                                    {fields.notes.map((note, nIdx) => (
                                      <p key={nIdx} className="text-xs text-[#cbd5e1] leading-relaxed">
                                        {note}
                                      </p>
                                    ))}
                                    {fields.otherText && (
                                      <p className="text-xs text-[#94a3b8] leading-relaxed whitespace-pre-line">
                                        {fields.otherText}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {/* اگر هیچ آیتمی تفکیک نشده باشد */}
                                {fields.items.length === 0 && !fields.otherText && fields.notes.length === 0 && (
                                  <div className="p-4 rounded-xl bg-[#121212] border border-[#222224] text-xs font-mono text-[#e5e2e1] leading-relaxed whitespace-pre-line select-text" dir="rtl">
                                    {meal.content || "موردی برای این بخش ثبت نشده است."}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ۶. نمای مدیریت سفارشات و پرونده‌های برنامه توسط مربی/سوپروایزر (Coach Plan Orders View) */}
        {activeMenu === "plan-orders" && (
          <div className="mt-8 space-y-6 w-full pb-12 text-right">
            
            {/* تب‌های جاری و بایگانی سفارشات */}
            <div className="p-4 rounded-xl bg-[#1e1e1e] border border-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOrderFilterTab("active")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    orderFilterTab === "active"
                      ? "bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/20"
                      : "bg-[#141414] text-[#94a3b8] hover:text-[#e5e2e1] border border-[#262626]"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>درخواست‌های جاری (در انتظار تدوین)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40">
                    {allPlanOrders.filter((o) => o.status === "reviewing" || o.status === "preparing").length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilterTab("archived")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    orderFilterTab === "archived"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-[#141414] text-[#94a3b8] hover:text-[#e5e2e1] border border-[#262626]"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>بایگانی برنامه‌های ارسال و تایید شده</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40">
                    {allPlanOrders.filter((o) => o.status === "ready" || o.status === "completed").length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilterTab("all")}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    orderFilterTab === "all"
                      ? "bg-[#282828] text-white font-bold"
                      : "text-[#64748b] hover:text-[#e5e2e1]"
                  }`}
                >
                  <span>همه پرونده‌ها ({allPlanOrders.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={fetchAllPlanOrders}
                className="px-3.5 py-2 rounded bg-[#141414] hover:bg-[#2c2c2e] border border-[#2c2c2e] text-xs text-[#e5e2e1] font-medium transition-colors flex items-center gap-1.5 self-end sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#ff6600]" />
                <span>به‌روزرسانی</span>
              </button>
            </div>

            {/* لیست جدول پرونده‌های مربی */}
            <div className="rounded-xl bg-[#1e1e1e] border border-[#2c2c2e] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#161616] text-[#64748b] border-b border-[#2c2c2e]">
                    <tr>
                      <th className="p-4 font-bold">نام قهرمان</th>
                      <th className="p-4 font-bold">ایمیل و تماس</th>
                      <th className="p-4 font-bold">نوع پکیج</th>
                      <th className="p-4 font-bold">هدف و قد/وزن</th>
                      <th className="p-4 font-bold">وضعیت پرونده</th>
                      <th className="p-4 font-bold">تاریخ ثبت</th>
                      <th className="p-4 font-bold text-center">عملیات مربی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2c2c2e]">
                    {(() => {
                      const filteredOrders = allPlanOrders.filter((order) => {
                        if (orderFilterTab === "active") return order.status === "reviewing" || order.status === "preparing";
                        if (orderFilterTab === "archived") return order.status === "ready" || order.status === "completed";
                        return true;
                      });

                      if (filteredOrders.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="p-12 text-center text-[#64748b]">
                              {orderFilterTab === "archived"
                                ? "هنوز برنامه‌ای در بایگانی وجود ندارد. پس از تایید و ارسال برنامه، پرونده‌ها در این بخش بایگانی می‌شوند."
                                : orderFilterTab === "active"
                                ? "در حال حاضر هیچ درخواست برنامه‌ای در صف بررسی یا تدوین وجود ندارد."
                                : "هنوز هیچ پرونده برنامه‌ای ثبت نشده است."}
                            </td>
                          </tr>
                        );
                      }

                      return filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#1a1a1a] transition-colors">
                          <td className="p-4 font-bold text-[#e5e2e1]">{order.user_name}</td>
                          <td className="p-4 space-y-0.5">
                            <span className="block font-mono-tag text-[#64748b] text-[11px]" dir="ltr">{order.user_email}</span>
                            {order.user_phone && (
                              <span className="block font-mono-tag text-[#ff6600] text-[11px]" dir="ltr">{order.user_phone}</span>
                            )}
                          </td>
                          <td className="p-4 font-bold text-[#ff6600]">{order.package_title}</td>
                          <td className="p-4 text-[#e5e2e1]/80">
                            {order.primary_goal === "hypertrophy" ? "عضله‌سازی" : order.primary_goal === "weight_loss" ? "چربی‌سوزی" : order.primary_goal}
                            <span className="block text-[10px] text-[#64748b]">{order.height}cm / {order.weight}kg</span>
                          </td>
                          <td className="p-4">
                            {order.status === "reviewing" && (
                              <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[11px]">
                                نیازمند بررسی
                              </span>
                            )}
                            {order.status === "preparing" && (
                              <span className="px-2.5 py-1 rounded bg-blue-500/15 border border-blue-500/30 text-blue-400 font-bold text-[11px]">
                                در حال تدوین
                              </span>
                            )}
                            {order.status === "ready" && (
                              <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                                آماده و تحویل شده
                              </span>
                            )}
                            {order.status === "completed" && (
                              <span className="px-2.5 py-1 rounded bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold text-[11px]">
                                پایان دوره
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-mono-tag text-[11px] text-[#64748b]" dir="ltr">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString("fa-IR") : "به‌تازگی"}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenPlanBuilder(order)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-[11px] font-bold transition-all shadow-md shadow-[#ff6600]/20"
                                title="ورود به میز کار برنامه‌نویسی برای این قهرمان"
                              >
                                <Dumbbell className="w-3.5 h-3.5" />
                                <span>برنامه‌نویسی</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedOrderForFeedback(order);
                                  setOrderStatusSelection(order.status || "preparing");
                                  setOrderFeedbackText(order.admin_feedback || "");
                                  setOrderWorkoutFile(order.workout_plan_file || "");
                                  setOrderDietFile(order.diet_plan_file || "");
                                }}
                                className="px-3 py-1.5 rounded bg-[#141414] hover:bg-[#2c2c2e] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] text-[11px] font-bold transition-all"
                              >
                                وضعیت و فایل
                              </button>
                              <button
                                onClick={() => handleDeletePlanOrder(order.id)}
                                className="p-1.5 rounded bg-[#141414] hover:bg-rose-900/40 text-[#64748b] hover:text-rose-400 border border-[#2c2c2e] transition-colors"
                                title="حذف سفارش"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* مدال مدیریت پرونده و بارگذاری برنامه مربی */}
            {selectedOrderForFeedback && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-[#1e1e1e] border border-[#2c2c2e] rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 text-right">
                  <div className="flex items-center justify-between pb-4 border-b border-[#2c2c2e]">
                    <div>
                      <h4 className="text-base font-bold text-[#e5e2e1]">
                        مدیریت پرونده برنامه: {selectedOrderForFeedback.user_name}
                      </h4>
                      <span className="text-xs text-[#64748b]">پکیج: {selectedOrderForFeedback.package_title}</span>
                    </div>
                    <button
                      onClick={() => setSelectedOrderForFeedback(null)}
                      className="p-1.5 rounded bg-[#141414] text-[#64748b] hover:text-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    
                    {/* اطلاعات کامل پرونده قهرمان برای بررسی مربی */}
                    <div className="p-4 rounded-xl bg-[#141414] border border-[#282828] space-y-2.5 text-xs text-[#64748b]">
                      <div className="flex items-center justify-between text-xs font-bold text-[#ff6600] border-b border-[#222222] pb-2">
                        <span>اطلاعات پرونده و ارزیابی قهرمان:</span>
                        <span className="text-[#e5e2e1] font-mono-tag">تماس: {selectedOrderForFeedback.user_phone || "ثبت‌نشده"}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>سن: <strong className="text-[#e5e2e1]">{selectedOrderForFeedback.age} سال</strong></div>
                        <div>قد: <strong className="text-[#e5e2e1]">{selectedOrderForFeedback.height} cm</strong></div>
                        <div>وزن: <strong className="text-[#e5e2e1]">{selectedOrderForFeedback.weight} kg</strong></div>
                        <div>هدف: <strong className="text-[#e5e2e1]">
                          {selectedOrderForFeedback.primary_goal === "hypertrophy" ? "هایپرتروفی" : selectedOrderForFeedback.primary_goal === "weight_loss" ? "چربی‌سوزی" : selectedOrderForFeedback.primary_goal}
                        </strong></div>
                        <div>محیط: <strong className="text-[#e5e2e1]">{selectedOrderForFeedback.training_location === "gym" ? "باشگاه" : "منزل"}</strong></div>
                        <div>روزهای تمرین: <strong className="text-[#e5e2e1]">{selectedOrderForFeedback.days_per_week} روز</strong></div>
                        <div className="col-span-2">سابقه: <strong className="text-[#e5e2e1]">{selectedOrderForFeedback.experience_level === "beginner" ? "مبتدی" : selectedOrderForFeedback.experience_level === "intermediate" ? "متوسط" : "پیشرفته"}</strong></div>
                      </div>
                      {selectedOrderForFeedback.injuries && (
                        <div className="text-[11px] pt-1 border-t border-[#222222]">
                          <span>آسیب‌دیدگی: </span>
                          <strong className="text-amber-400">{selectedOrderForFeedback.injuries}</strong>
                        </div>
                      )}
                      {selectedOrderForFeedback.dietary_restrictions && (
                        <div className="text-[11px]">
                          <span>پرهیز غذایی: </span>
                          <strong className="text-rose-400">{selectedOrderForFeedback.dietary_restrictions}</strong>
                        </div>
                      )}
                      {selectedOrderForFeedback.coach_notes && (
                        <div className="text-[11px] bg-[#181818] p-2.5 rounded-lg text-[#e5e2e1] leading-relaxed border border-[#2c2c2e]">
                          <span className="text-[#64748b] block mb-0.5">یادداشت قهرمان:</span>
                          {selectedOrderForFeedback.coach_notes}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#64748b] mb-1.5 font-medium">وضعیت پرونده قهرمان *</label>
                      <select
                        value={orderStatusSelection}
                        onChange={(e) => setOrderStatusSelection(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      >
                        <option value="reviewing">در حال بررسی اولیه توسط مربی (Reviewing)</option>
                        <option value="preparing">در حال تدوین و طراحی علمی برنامه (Preparing)</option>
                        <option value="ready">برنامه آماده است و لینک‌های دانلود فعال شوند (Ready)</option>
                        <option value="completed">پایان دوره و بسته شدن پرونده (Completed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#64748b] mb-1.5 font-medium">لینک فایل PDF برنامه تمرینی</label>
                      <input
                        type="text"
                        placeholder="https://... یا /uploads/workout-plan.pdf"
                        value={orderWorkoutFile}
                        onChange={(e) => setOrderWorkoutFile(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-[#64748b] mb-1.5 font-medium">لینک فایل PDF برنامه غذایی</label>
                      <input
                        type="text"
                        placeholder="https://... یا /uploads/diet-plan.pdf"
                        value={orderDietFile}
                        onChange={(e) => setOrderDietFile(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-[#64748b] mb-1.5 font-medium">پیام و توضیحات مربی به قهرمان</label>
                      <textarea
                        rows={3}
                        placeholder="توضیحات و دستورالعمل‌های شروع تمرین یا وضعیت پرونده..."
                        value={orderFeedbackText}
                        onChange={(e) => setOrderFeedbackText(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2c2c2e] rounded p-3 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2c2c2e] flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedOrderForFeedback(null)}
                      className="px-5 py-2.5 rounded bg-[#141414] hover:bg-[#2c2c2e] text-xs text-[#64748b] font-bold"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={() => handleUpdatePlanOrderStatus(selectedOrderForFeedback.id)}
                      className="px-6 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold shadow-md shadow-[#ff6600]/30"
                    >
                      ذخیره تغییرات و ارسال به قهرمان
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ۷. نمای مدیریت هیروسکشن (Hero CMS) */}
        {activeMenu === "hero-cms" && (
          <div className="mt-8 space-y-6 w-full pb-16 text-right">
            
            {/* پیام موفقیت ذخیره */}
            {heroSaved && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-bold">
                    تغییرات اسلاید شماره {selectedSlideId} با موفقیت در پایگاه داده ذخیره شد و در صفحه اصلی سایت اعمال گردید.
                  </span>
                </div>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-all"
                >
                  <span>مشاهده در سایت</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* تب‌های انتخاب اسلاید */}
            <div className="p-4 rounded-xl bg-[#1e1e1e] border border-[#2c2c2e] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#94a3b8] ml-2">انتخاب اسلاید جهت ویرایش:</span>
                {heroSlides.map((slide, idx) => {
                  const isCurrent = slide.id === selectedSlideId;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => handleSelectHeroSlide(slide)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-[#ff6600] text-white shadow-lg shadow-[#ff6600]/30 ring-2 ring-[#ff6600]/50 scale-[1.02]"
                          : "bg-[#141414] hover:bg-[#2c2c2e] text-[#e5e2e1] border border-[#262626]"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                        {slide.image_url ? (
                          <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Sliders className="w-3.5 h-3.5 m-auto text-white/50" />
                        )}
                      </div>
                      <span>اسلاید شماره {idx + 1}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          slide.is_active
                            ? isCurrent
                              ? "bg-black/30 text-white"
                              : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {slide.is_active ? "فعال" : "غیرفعال"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchHeroSlides}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141414] hover:bg-[#2c2c2e] border border-[#262626] text-xs text-[#94a3b8] hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>بازخوانی مجدد</span>
                </button>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141414] hover:bg-[#2c2c2e] border border-[#262626] text-xs text-[#94a3b8] hover:text-[#ff6600] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>مشاهده سایت</span>
                </Link>
              </div>
            </div>

            {/* پیش‌نمایش زنده کارت اسلاید */}
            <div className="relative rounded-2xl overflow-hidden border border-[#2d2d2d] bg-[#111111] shadow-2xl">
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-bold text-[#e5e2e1]">
                <Eye className="w-3.5 h-3.5 text-[#ff6600]" />
                <span>پیش‌نمایش زنده در نمای دسکتاپ</span>
              </div>

              <div className="relative h-64 sm:h-80 w-full overflow-hidden flex flex-col justify-end p-6 sm:p-10">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                  style={{
                    backgroundImage: currentSlideForm.image_url
                      ? `url('${currentSlideForm.image_url}')`
                      : "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-black/30" />

                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="inline-block px-2.5 py-1 rounded bg-[#ff6600]/20 border border-[#ff6600]/40 text-[#ff6600] text-[10px] font-bold">
                    {currentSlideForm.is_active ? "وضعیت: اسلاید فعال (نمایش در صفحه اصلی)" : "وضعیت: اسلاید غیرفعال (مخفی در صفحه اصلی)"}
                  </div>

                  <h2 className="text-xl sm:text-3xl font-black text-[#e5e2e1] leading-tight">
                    {currentSlideForm.title_prefix || "عنوان پیشوند اسلاید"}{" "}
                    <span className="text-[#ff6600]">
                      {currentSlideForm.title_highlight || "تیتر برجسته رنگی"}
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#cbd5e1] line-clamp-2 leading-relaxed">
                    {currentSlideForm.description || "متن توضیحی اسلاید هیروسکشن در اینجا به نمایش گذاشته می‌شود..."}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    {currentSlideForm.primary_btn_text && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#ff6600] text-white text-xs font-bold shadow-md shadow-[#ff6600]/30">
                        {currentSlideForm.primary_btn_text}
                        <ArrowLeft className="w-3 h-3" />
                      </span>
                    )}
                    {currentSlideForm.secondary_btn_text && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-black/60 backdrop-blur-sm border border-white/20 text-[#e5e2e1] text-xs font-medium">
                        {currentSlideForm.secondary_btn_text}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* فرم ویرایش مشخصات اسلاید */}
            <form onSubmit={handleSaveHeroSlide} className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#2c2c2e] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#2c2c2e]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff6600]/15 border border-[#ff6600]/30 flex items-center justify-center text-[#ff6600]">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#e5e2e1]">
                      ویرایش محتوا و ظاهر اسلاید شماره {selectedSlideId}
                    </h3>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      اطلاعات ورودی در این فرم مستقیماً در دیتابیس ثبت و در اسلایدر صفحه نخست نمایش داده خواهد شد.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none bg-[#1a1a1c] px-4 py-2 rounded-xl border border-[#2d2d2d] hover:border-[#ff6600]/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={currentSlideForm.is_active ?? true}
                    onChange={(e) => setCurrentSlideForm({ ...currentSlideForm, is_active: e.target.checked })}
                    className="w-4 h-4 accent-[#ff6600] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#e5e2e1]">
                    {currentSlideForm.is_active ? "اسلاید فعال است" : "اسلاید غیرفعال است"}
                  </span>
                </label>
              </div>

              {/* انتخاب تصویر پس‌زمینه */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#e5e2e1]">
                  تصویر پس‌زمینه اسلاید (Background Image URL) *
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="https://... یا /uploads/..."
                      value={currentSlideForm.image_url || ""}
                      onChange={(e) => setCurrentSlideForm({ ...currentSlideForm, image_url: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      dir="ltr"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetField("hero");
                      setIsMediaModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#333] text-xs font-bold text-[#e5e2e1] transition-all hover:text-[#ff6600]"
                  >
                    <FolderOpen className="w-4 h-4 text-[#ff6600]" />
                    <span>انتخاب از کتابخانه رسانه / آپلود</span>
                  </button>
                  {currentSlideForm.image_url && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#333] flex-shrink-0 bg-black">
                      <img src={currentSlideForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* تیتر پیشوند و تیتر برجسته */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#e5e2e1]">
                    پیشوند عنوان اسلاید (متن با رنگ سفید) *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: تغییر ماندگار اندام شما، با"
                    value={currentSlideForm.title_prefix || ""}
                    onChange={(e) => setCurrentSlideForm({ ...currentSlideForm, title_prefix: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#ff6600]">
                    بخش تأکیدی عنوان (متن با رنگ نارنجی برند) *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: دقت علمی و هوش مصنوعی"
                    value={currentSlideForm.title_highlight || ""}
                    onChange={(e) => setCurrentSlideForm({ ...currentSlideForm, title_highlight: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-xs font-bold text-[#ff6600] focus:outline-none focus:border-[#ff6600]"
                    required
                  />
                </div>
              </div>

              {/* متن توضیحات اسلاید */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#e5e2e1]">
                  متن توضیحات / پاراگراف انگیزشی اسلاید *
                </label>
                <textarea
                  rows={3}
                  placeholder="توضیحات معرفی دوره‌ها، سیستم اختصاصی، اهداف بدنی و..."
                  value={currentSlideForm.description || ""}
                  onChange={(e) => setCurrentSlideForm({ ...currentSlideForm, description: e.target.value })}
                  className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl p-4 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                  required
                />
              </div>

              {/* دکمه‌های اقدام به عمل (CTA) */}
              <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2c2c2e] space-y-4">
                <h4 className="text-xs font-bold text-[#e5e2e1] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ff6600]" />
                  <span>دکمه‌های اقدام به عمل اسلاید (CTA Buttons)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[11px] text-[#94a3b8]">متن دکمه اصلی (نارنجی)</label>
                    <input
                      type="text"
                      placeholder="مثال: دریافت برنامه اختصاصی"
                      value={currentSlideForm.primary_btn_text || ""}
                      onChange={(e) => setCurrentSlideForm({ ...currentSlideForm, primary_btn_text: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] text-[#94a3b8]">لینک دکمه اصلی (URL یا شناسه سکشن)</label>
                    <input
                      type="text"
                      placeholder="#packages یا /get-plan"
                      value={currentSlideForm.primary_btn_href || ""}
                      onChange={(e) => setCurrentSlideForm({ ...currentSlideForm, primary_btn_href: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#2c2c2e]">
                  <div className="space-y-2">
                    <label className="block text-[11px] text-[#94a3b8]">متن دکمه دوم (خاکستری/شیشه‌ای)</label>
                    <input
                      type="text"
                      placeholder="مثال: مشاهده نتایج قهرمانان"
                      value={currentSlideForm.secondary_btn_text || ""}
                      onChange={(e) => setCurrentSlideForm({ ...currentSlideForm, secondary_btn_text: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] text-[#94a3b8]">لینک دکمه دوم (URL یا شناسه سکشن)</label>
                    <input
                      type="text"
                      placeholder="#transformations یا #about"
                      value={currentSlideForm.secondary_btn_href || ""}
                      onChange={(e) => setCurrentSlideForm({ ...currentSlideForm, secondary_btn_href: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* ذخیره فرم */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2c2c2e]">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-lg shadow-[#ff6600]/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره و اعمال تغییرات اسلاید شماره {selectedSlideId}</span>
                </button>
              </div>
            </form>

          </div>
        )}

        {/* ۸. نمای مدیریت درباره ما (About CMS) */}
        {activeMenu === "about-cms" && (
          <div className="mt-8 space-y-6 w-full pb-16 text-right">
            
            {aboutSaved && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-bold">
                    تغییرات بخش «درباره ما» با موفقیت در پایگاه داده ذخیره شد و در صفحه اصلی سایت اعمال گردید.
                  </span>
                </div>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-all"
                >
                  <span>مشاهده در سایت</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            <form onSubmit={handleSaveAbout} className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#2c2c2e] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#2c2c2e]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff6600]/15 border border-[#ff6600]/30 flex items-center justify-center text-[#ff6600]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#e5e2e1]">
                      مدیریت محتوای بخش درباره ما (About Section CMS)
                    </h3>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      ویرایش معرفی مربی، متن بیوگرافی و ۴ کارت ویژگی‌های آکادمی در صفحه اصلی
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/20"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره تغییرات</span>
                </button>
              </div>

              {/* تیتر سکشن */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#e5e2e1]">پیشوند عنوان سکشن</label>
                  <input
                    type="text"
                    value={aboutForm.title_prefix || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, title_prefix: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#ff6600]">بخش تأکیدی عنوان سکشن</label>
                  <input
                    type="text"
                    value={aboutForm.title_highlight || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, title_highlight: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-xs font-bold text-[#ff6600] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
              </div>

              {/* نام مربی، تخصص و سابقه */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#e5e2e1]">نام مربی</label>
                  <input
                    type="text"
                    value={aboutForm.coach_name || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, coach_name: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#e5e2e1]">عنوان شغلی / تخصص</label>
                  <input
                    type="text"
                    value={aboutForm.coach_role || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, coach_role: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#e5e2e1]">نشان سابقه (Badge)</label>
                  <input
                    type="text"
                    value={aboutForm.experience_badge || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, experience_badge: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
              </div>

              {/* تصویر مربی */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#e5e2e1]">تصویر استاد ناظری</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={aboutForm.coach_image_url || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, coach_image_url: e.target.value })}
                    className="flex-1 bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetField("about");
                      setIsMediaModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#333] text-xs font-bold text-[#e5e2e1]"
                  >
                    <FolderOpen className="w-4 h-4 text-[#ff6600]" />
                    <span>انتخاب از کتابخانه رسانه</span>
                  </button>
                  {aboutForm.coach_image_url && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#333] flex-shrink-0 bg-black">
                      <img src={aboutForm.coach_image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* پاراگراف ۱ و ۲ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#e5e2e1]">پاراگراف اول بیوگرافی</label>
                  <textarea
                    rows={4}
                    value={aboutForm.paragraph1 || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, paragraph1: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl p-4 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#e5e2e1]">پاراگراف دوم بیوگرافی</label>
                  <textarea
                    rows={4}
                    value={aboutForm.paragraph2 || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, paragraph2: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-xl p-4 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                  />
                </div>
              </div>

              {/* کارت‌های ۴ گانه ویژگی‌ها */}
              <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2c2c2e] space-y-4">
                <h4 className="text-xs font-bold text-[#e5e2e1]">کارت‌های ۴ گانه ویژگی‌ها و مزایا</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 p-3 rounded-lg bg-[#141414] border border-[#242424]">
                    <span className="text-[11px] font-bold text-[#ff6600]">کارت شماره ۱</span>
                    <input
                      type="text"
                      placeholder="عنوان کارت ۱"
                      value={aboutForm.card1_title || ""}
                      onChange={(e) => setAboutForm({ ...aboutForm, card1_title: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                    <textarea
                      rows={2}
                      placeholder="توضیحات کارت ۱"
                      value={aboutForm.card1_desc || ""}
                      onChange={(e) => setAboutForm({ ...aboutForm, card1_desc: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg p-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div className="space-y-2 p-3 rounded-lg bg-[#141414] border border-[#242424]">
                    <span className="text-[11px] font-bold text-[#ff6600]">کارت شماره ۲</span>
                    <input
                      type="text"
                      placeholder="عنوان کارت ۲"
                      value={aboutForm.card2_title || ""}
                      onChange={(e) => setAboutForm({ ...aboutForm, card2_title: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                    <textarea
                      rows={2}
                      placeholder="توضیحات کارت ۲"
                      value={aboutForm.card2_desc || ""}
                      onChange={(e) => setAboutForm({ ...aboutForm, card2_desc: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg p-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div className="space-y-2 p-3 rounded-lg bg-[#141414] border border-[#242424]">
                    <span className="text-[11px] font-bold text-[#ff6600]">کارت شماره ۳</span>
                    <input
                      type="text"
                      placeholder="عنوان کارت ۳"
                      value={aboutForm.card3_title || ""}
                      onChange={(e) => setAboutForm({ ...aboutForm, card3_title: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                    <textarea
                      rows={2}
                      placeholder="توضیحات کارت ۳"
                      value={aboutForm.card3_desc || ""}
                      onChange={(e) => setAboutForm({ ...aboutForm, card3_desc: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg p-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div className="space-y-2 p-3 rounded-lg bg-[#141414] border border-[#242424]">
                    <span className="text-[11px] font-bold text-[#ff6600]">کارت شماره ۴</span>
                    <input
                      type="text"
                      placeholder="عنوان کارت ۴"
                      value={aboutForm.card4_title || ""}
                      onChange={(e) => setAboutForm({ ...aboutForm, card4_title: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg px-3 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                    <textarea
                      rows={2}
                      placeholder="توضیحات کارت ۴"
                      value={aboutForm.card4_desc || ""}
                      onChange={(e) => setAboutForm({ ...aboutForm, card4_desc: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2d2d2d] rounded-lg p-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>
                </div>
              </div>

              {/* دکمه ذخیره */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2c2c2e]">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-lg shadow-[#ff6600]/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره تغییرات بخش درباره ما</span>
                </button>
              </div>
            </form>

          </div>
        )}

      </main>

    </div>
  );
}
