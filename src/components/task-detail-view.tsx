import { useState, ChangeEvent } from "react"
import { format } from "date-fns"
import { Calendar, Download, FileText, Paperclip, Send, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { getPriorityColor, getPriorityIcon, getStatusColor } from "@/lib/task-methods";
import { ITaskPopulated } from "@/db/models";
import { useUserStore } from "@/stores/useUserStore";
import { useCreateComment } from "@/hooks/useComments";
import { useCreateFile } from "@/hooks/useFiles";

interface TaskDetailViewProps {
    task: ITaskPopulated
    onClose: () => void
}

export function TaskDetailView({ task, onClose }: TaskDetailViewProps) {
    const users = useUserStore((state) => state.users);
    const { mutate: createComment } = useCreateComment();
    const { mutate: createFile } = useCreateFile();
    const [newComment, setNewComment] = useState("")
    const [newAttachment, setNewAttachment] = useState<File | null>(null)
    const [attachmentName, setAttachmentName] = useState("")

    const assignee = users.find((user) => user.id === task.userId.toString())
    const dueDate = task.dueDate
    const isOverdue = dueDate < new Date() && task.status !== "done"

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        createComment({ content: newComment, userId: users[0].id, taskId: task.id })
        setNewComment("")
    }

    const handleAddAttachment = () => {
        if (!newAttachment || !attachmentName.trim()) return

        createFile({
            url: URL.createObjectURL(newAttachment),
            key: "key-here",
            name: attachmentName || newAttachment.name,
            size: newAttachment.size,
            userId: users[0].id,
            taskId: task.id,
        })

        setNewAttachment(null)
        setAttachmentName("")
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewAttachment(e.target.files[0])
            setAttachmentName(e.target.files[0].name)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{task.title}</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status === "todo" ? "To Do" : task.status === "in_progress" ? "In Progress" : "Completed"}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {getPriorityIcon(task.priority)}
                    <span className="ml-1 capitalize">{task.priority} Priority</span>
                </Badge>
                <Badge
                    variant="outline"
                    className={isOverdue ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}
                >
                    <Calendar className="mr-1 h-3 w-3" />
                    Due {format(dueDate, "MMM d, yyyy")}
                    {isOverdue && " (Overdue)"}
                </Badge>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <div className="rounded-md border p-3 text-sm">
                    {task.description || <span className="text-muted-foreground">No description provided</span>}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Assignee</Label>
                {assignee ? (
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={""} alt={assignee.name} />
                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{assignee.name}</p>
                            <p className="text-sm text-muted-foreground">{assignee.email}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Unassigned</p>
                )}
            </div>

            <Separator />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Attachments</h3>
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            placeholder="File name"
                            value={attachmentName}
                            onChange={(e) => setAttachmentName(e.target.value)}
                            className="w-[200px]"
                        />
                        <Input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm" type="button" asChild>
                <span>
                  <Paperclip className="mr-2 h-4 w-4" />
                  Browse
                </span>
                            </Button>
                        </Label>
                        <Button
                            size="sm"
                            onClick={handleAddAttachment}
                            disabled={!newAttachment}
                        >
                            Add
                        </Button>
                    </div>
                </div>

                {task.files && task.files.length > 0 ? (
                    <div className="space-y-2">
                        {task.files.map((attachment) => (
                            <Card key={attachment.id.toString()} className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{attachment.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(attachment.size)} • {format(new Date(attachment.createdAt), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" asChild>
                                    <a href={attachment.url} download={attachment.name}>
                                        <Download className="h-4 w-4" />
                                        <span className="sr-only">Download</span>
                                    </a>
                                </Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No attachments yet</p>
                )}
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Comments</h3>

                <div className="flex gap-2">
                    <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px]"
                    />
                    <Button className="self-end" onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </div>

                {task.comments && task.comments.length > 0 ? (
                    <div className="space-y-4">
                        {task.comments.map((comment) => {
                            const commentUser = users.find((user) => user.id === comment.userId)
                            return (
                                <div key={comment.id} className="flex gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={""} alt={commentUser?.name || "User"} />
                                        <AvatarFallback>{commentUser?.name.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{commentUser?.name || "Unknown User"}</span>
                                            <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                                        </div>
                                        <p className="text-sm">{comment.content}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                )}
            </div>
        </div>
    )
}
