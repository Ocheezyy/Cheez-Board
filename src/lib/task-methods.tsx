import { AlertCircle, CheckCircle, Clock, FileText, ImageIcon, Video } from "lucide-react";

export const getFileIcon = (fileType: string) => {
    if (!fileType) return null;

    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-muted-foreground" />
    if (fileType.startsWith("video/")) return <Video className="h-5 w-5 text-muted-foreground" />
    return <FileText className="h-5 w-5 text-muted-foreground" />
}

export const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case "todo":
            return "bg-blue-500/10 text-blue-500"
        case "in-progress":
            return "bg-amber-500/10 text-amber-500"
        case "completed":
            return "bg-green-500/10 text-green-500"
        default:
            return "bg-gray-500/10 text-gray-500"
    }
}

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "high":
            return "bg-red-500/10 text-red-500"
        case "medium":
            return "bg-amber-500/10 text-amber-500"
        case "low":
            return "bg-green-500/10 text-green-500"
        default:
            return "bg-gray-500/10 text-gray-500"
    }
}

export const getPriorityIcon = (priority: string) => {
    switch (priority) {
        case "high":
            return <AlertCircle className="h-3 w-3" />
        case "medium":
            return <Clock className="h-3 w-3" />
        case "low":
            return <CheckCircle className="h-3 w-3" />
        default:
            return null
    }
}