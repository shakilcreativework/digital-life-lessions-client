"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Form,
    TextField,
    Input,
    Label,
    FieldError
} from "@heroui/react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
    FiFileText,
    FiFolder,
    FiSmile,
    FiEye,
    FiUnlock,
    FiSend,
    FiLoader,
    FiActivity,
    FiImage,
    FiCheckCircle
} from "react-icons/fi";
import BaseButton from "@/components/ui/BaseButton";
import { authClient } from "@/lib/auth-client";

const CATEGORIES = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned"
];

const EMOTIONAL_TONES = [
    "Motivational",
    "Sad",
    "Realization",
    "Gratitude"
];

const ALL_VISIBILITY_OPTIONS = [
    { value: "Public", label: "🌍 Public (Visible to everyone)" },
    { value: "Private", label: "🔒 Private (Personal draft space)" }
];

const ALL_ACCESS_LEVELS = [
    { value: "Free", label: "🆓 Free Access Tier" },
    { value: "Premium", label: "💎 Premium Access Tier" }
];

const generateSlug = (title) => {
    if (!title) return "";
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export default function EditLessonPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    
    // Core Engine States
    const [loading, setLoading] = useState(false);
    const [dataHydrating, setDataHydrating] = useState(true);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [existingImageUrl, setExistingImageUrl] = useState("");

    // Local state structure to map tracking values reactively
    const [lessonData, setLessonData] = useState({
        title: "",
        category: "",
        description: "",
        emotionalTone: "",
        visibility: "Public",
        accessLevel: "Free"
    });

    // Clearance Authorization Evaluations
    const isAdmin = session?.user?.role === "admin";
    const isPremium = session?.user?.isPremium === true;
    const hasFullAccess = isAdmin || isPremium;

    const visibilityOptions = hasFullAccess
        ? ALL_VISIBILITY_OPTIONS
        : ALL_VISIBILITY_OPTIONS.filter(opt => opt.value === "Public");

    const accessLevels = hasFullAccess
        ? ALL_ACCESS_LEVELS
        : ALL_ACCESS_LEVELS.filter(tier => tier.value === "Free");

    // Hydrate Data on Mount Component Sequence
    useEffect(() => {
        if (sessionLoading || !id) return;
        if (!session) {
            router.push("/login");
            return;
        }

        const fetchLesson = async () => {
            try {
                setDataHydrating(true);
                const targetUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/lessons/${id}`;
                const response = await fetch(targetUrl);
                
                if (!response.ok) throw new Error("Target record metadata unreachable.");
                const lesson = await response.json();

                setLessonData({
                    title: lesson.title || "",
                    category: lesson.category || "",
                    description: lesson.description || "",
                    emotionalTone: lesson.emotionalTone || EMOTIONAL_TONES[0],
                    visibility: lesson.visibility || "Public",
                    accessLevel: lesson.accessLevel || "Free"
                });

                if (lesson.image) {
                    setExistingImageUrl(lesson.image);
                    // Extract clean name token string from file address path if available
                    const nameExtract = lesson.image.split("/").pop();
                    setSelectedFileName(nameExtract || "current_cloud_banner.jpg");
                }
            } catch (err) {
                console.error("Hydration processing error:", err);
                toast.error("Could not fetch target document properties.");
                router.push("/dashboard/my-lessons");
            } finally {
                setDataHydrating(false);
            }
        };

        fetchLesson();
    }, [id, sessionLoading, session, router]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
        } else if (existingImageUrl) {
            const nameExtract = existingImageUrl.split("/").pop();
            setSelectedFileName(nameExtract || "current_cloud_banner.jpg");
        } else {
            setSelectedFileName("");
        }
    };

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        if (loading) return;

        const formData = new FormData(e.currentTarget);
        const title = lessonData.title.trim();
        const description = lessonData.description.trim();
        const category = lessonData.category;
        const emotionalTone = lessonData.emotionalTone;
        const imageFile = formData.get("lessonImage");

        // Anti-tamper configurations safety fallback validation checks
        const visibility = hasFullAccess ? lessonData.visibility : "Public";
        const accessLevel = hasFullAccess ? lessonData.accessLevel : "Free";

        if (!title) return toast.error("Please provide a lesson title");
        if (!category) return toast.error("Please select a valid category option");
        if (!description) return toast.error("Please fill in your lesson description content");

        try {
            setLoading(true);
            toast.loading("Re-synchronizing media assets and updating logs...", { id: "lesson-update-toast" });

            // Maintain existing image unless a brand new image binary asset is chosen
            let finalImageUrl = existingImageUrl;

            if (imageFile && imageFile.size > 0) {
                const imgBbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
                const imgFormData = new FormData();
                imgFormData.append("image", imageFile);

                const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgBbKey || "YOUR_FALLBACK_API_KEY"}`, {
                    method: "POST",
                    body: imgFormData,
                });

                if (!imgResponse.ok) throw new Error("ImgBB transmission failure");

                const imgResult = await imgResponse.json();
                finalImageUrl = imgResult.data.url;
            }

            const payload = {
                title,
                slug: generateSlug(title),
                description,
                category,
                emotionalTone,
                visibility,
                accessLevel,
                image: finalImageUrl,
                updatedAt: new Date().toISOString()
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/lessons/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Database dynamic commit document tracking returned a failure response state.");

            toast.success("Lesson configuration synchronized successfully! 🚀", { id: "lesson-update-toast" });
            router.push("/dashboard/my-lessons");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to safely alter workspace record logs.", { id: "lesson-update-toast" });
        } finally {
            setLoading(false);
        }
    };

    const isFormDisabled = loading || dataHydrating;

    // Loading Shimmer Placeholder Wrapper State
    if (dataHydrating || sessionLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-foreground">
                <FiLoader className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground font-bold tracking-wider mt-3 uppercase">Hydrating Lesson Metrics...</p>
            </div>
        );
    }

    return (
        <main className="pb-20 transition-colors duration-200">
            <div className="w-full">

                <div className="mb-8 border-b border-border pb-6">
                    <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                        Update Repository Insight
                    </h1>
                    <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-2xl">
                        Modify your tracked lesson parameters, update layout options, and commit records directly back to database clusters.
                    </p>
                </div>

                <Form onSubmit={handleFormSubmission} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Main content capture cards layout column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">

                            <div>
                                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <FiFileText className="text-primary text-base" /> Core Insight Parameters
                                </h2>
                                <p className="text-[11px] text-muted">Provide the absolute tracking points and definitions that govern this training record.</p>
                            </div>

                            {/* Title Form Field */}
                            <TextField isRequired className="w-full group">
                                <Label htmlFor="lesson-title" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Lesson Title
                                </Label>
                                <div className="relative flex items-center">
                                    <Input
                                        id="lesson-title"
                                        name="title"
                                        type="text"
                                        value={lessonData.title}
                                        onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="e.g., Implementing Monotone Spline Calculations Under React Framework Hooks"
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    />
                                </div>
                                <FieldError className="text-xs text-red-500 mt-1 font-semibold" />
                            </TextField>

                            {/* Category Options Field */}
                            <div className="w-full">
                                <label htmlFor="lesson-category" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Primary Core Classification Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-category"
                                        name="category"
                                        value={lessonData.category}
                                        onChange={(e) => setLessonData(prev => ({ ...prev, category: e.target.value }))}
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 cursor-pointer pr-10",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        <option value="" disabled hidden>Choose category categorization block...</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat} className="bg-card text-foreground">{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted opacity-80">
                                        <FiFolder className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Core Description Main Text Area */}
                            <div className="w-full">
                                <label htmlFor="lesson-description" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Complete Lesson Description & Insight Logs
                                </label>
                                <textarea
                                    id="lesson-description"
                                    name="description"
                                    rows={6}
                                    value={lessonData.description}
                                    onChange={(e) => setLessonData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Draft your code configurations, postmortems, or strategic career architecture choices directly in this field context wrapper..."
                                    disabled={isFormDisabled}
                                    className={cn(
                                        "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200 min-h-40 resize-y",
                                        "placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                />
                            </div>

                            {/* High Fidelity Interactive Media Upload Dropzone */}
                            <div className="w-full pt-2">
                                <span className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Lesson Visual Banner Image
                                </span>
                                <label
                                    htmlFor="lesson-image"
                                    className={cn(
                                        "group/dropzone relative flex flex-col items-center justify-center w-full min-h-32.5 rounded-xl border border-dashed bg-surface/40 hover:bg-surface transition-all duration-200 cursor-pointer text-center px-6 border-border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary",
                                        isFormDisabled && "opacity-40 cursor-not-allowed pointer-events-none"
                                    )}
                                >
                                    <input
                                        id="lesson-image"
                                        name="lessonImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={isFormDisabled}
                                        className="sr-only"
                                    />

                                    {selectedFileName ? (
                                        <div className="flex flex-col items-center space-y-2 animate-fadeIn">
                                            <FiCheckCircle className="text-2xl text-green-500" />
                                            <p className="text-xs font-bold text-foreground line-clamp-1 max-w-100">
                                                {selectedFileName}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground underline decoration-dotted">Click container to swap resource image</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="p-2.5 rounded-xl bg-muted/40 text-muted-foreground group-hover/dropzone:text-primary group-hover/dropzone:bg-primary/10 transition-all duration-200">
                                                <FiImage className="text-xl" />
                                            </div>
                                            <p className="text-xs text-foreground font-medium">
                                                <span className="text-primary font-bold">Click to upload new file attachment</span> or drag image here
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">PNG, JPG, or WEBP formats up to 10MB</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* Right Sidebar Parameter Configuration Metadata Stack */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">

                            <div>
                                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <FiActivity className="text-primary text-base" /> Logic Attributes
                                </h2>
                                <p className="text-[11px] text-muted">Govern system layer placement and user access groups globally.</p>
                            </div>

                            {/* Emotional Tone Selector */}
                            <div className="w-full">
                                <label htmlFor="lesson-tone" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Emotional Tone Accent
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-tone"
                                        name="emotionalTone"
                                        value={lessonData.emotionalTone}
                                        onChange={(e) => setLessonData(prev => ({ ...prev, emotionalTone: e.target.value }))}
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 cursor-pointer pr-10",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {EMOTIONAL_TONES.map((tone) => (
                                            <option key={tone} value={tone} className="bg-card text-foreground">{tone}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted opacity-80">
                                        <FiSmile className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Visibility Controls Selector */}
                            <div className="w-full">
                                <label htmlFor="lesson-visibility" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Stream Visibility Context
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-visibility"
                                        name="visibility"
                                        value={lessonData.visibility}
                                        onChange={(e) => setLessonData(prev => ({ ...prev, visibility: e.target.value }))}
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 cursor-pointer pr-10",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {visibilityOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value} className="bg-card text-foreground">{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted opacity-80">
                                        <FiEye className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Tier Access Level Selector */}
                            <div className="w-full">
                                <label htmlFor="lesson-access" className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wide">
                                    Access Level Tier
                                </label>
                                <div className="relative">
                                    <select
                                        id="lesson-access"
                                        name="accessLevel"
                                        value={lessonData.accessLevel}
                                        onChange={(e) => setLessonData(prev => ({ ...prev, accessLevel: e.target.value }))}
                                        disabled={isFormDisabled}
                                        className={cn(
                                            "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-all duration-200",
                                            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 cursor-pointer pr-10",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {accessLevels.map((tier) => (
                                            <option key={tier.value} value={tier.value} className="bg-card text-foreground">{tier.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted opacity-80">
                                        <FiUnlock className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Primary Action Button Context Trigger */}
                            <div className="pt-2">
                                <BaseButton
                                    animated
                                    animatedSpanOne={'animate-ping'}
                                    type="submit"
                                    disabled={isFormDisabled}
                                    className={cn(
                                        "w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-all duration-150 active:scale-[0.98]",
                                        "disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                                    )}
                                >
                                    {loading ? (
                                        <>
                                            <FiLoader className="text-base animate-spin" />
                                            <span>Updating Repository Array...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSend className="text-sm" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </BaseButton>
                            </div>

                        </div>
                    </div>

                </Form>
            </div>
        </main>
    );
}