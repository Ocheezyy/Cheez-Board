import { AlertCircle, CheckCircle, Clock } from "lucide-react";

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