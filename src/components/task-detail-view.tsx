"use client"

import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useCreateComment } from "@/hooks/useComments";
import { useCreateFile } from "@/hooks/useFiles";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AttachmentPreview } from "@/components/attachment-preview";
import { Calendar, Download, Eye, Send, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
// import Image from "next/image";

import { getPriorityColor, getPriorityIcon, getStatusColor, formatFileSize, getFileIcon } from "@/lib/task-methods";
import { format } from "date-fns";
import { toast } from "sonner";

import type { ITaskPopulated, IFile } from "@/db/models";


type TaskDetailViewProps = {
    task: ITaskPopulated
    onClose: () => void
}

export function TaskDetailView({ task, onClose }: TaskDetailViewProps) {
    const users = useUserStore((state) => state.users);
    const { isSignedIn, user: authUser } = useUser();
    const { mutate: createComment } = useCreateComment();
    const { mutate: createFile } = useCreateFile();
    const [ newComment, setNewComment ] = useState("");
    const [ taskFiles, setTaskFiles ] = useState<IFile[]>(task.files);
    const [ previewAttachment, setPreviewAttachment ] = useState<IFile | null>(null);
    const [ isPreviewOpen, setIsPreviewOpen ] = useState(false);

    const assignee = users.find((user) => user.id === task.userId);
    const dueDate = task.dueDate;
    const isOverdue = dueDate < new Date() && task.status !== "done";

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        if (!isSignedIn || !authUser) {
            toast("You must be signed in to comment!");
            return;
        }

        createComment({ content: newComment, userId: users[0].id, taskId: task._id });
        setNewComment("");
    }

    const openPreview = (attachment: IFile) => {
        setPreviewAttachment(attachment);
        setIsPreviewOpen(true);
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
                            <AvatarImage src={""} alt={assignee.username} />
                            <AvatarFallback>{assignee.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{assignee.username}</p>
                            <p className="text-sm text-muted-foreground">{assignee.emailAddresses.find((emailAddress) => emailAddress.id === assignee.primaryEmailAddressId)?.emailAddress || ""}</p>
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
                        <SignedIn>
                            <UploadButton
                                endpoint="taskAttachmentUploader"
                                onClientUploadComplete={(res) => {
                                    const file = res[0];
                                    console.log("fileRes", res)
                                    console.log("File: ", file);
                                    createFile({
                                        url: file.ufsUrl,
                                        userId: file.serverData.userId,
                                        taskId: task._id,
                                        size: file.size,
                                        type: file.type,
                                        name: file.name,
                                        key: file.key
                                    })
                                    setTaskFiles([
                                        {
                                            _id: "",
                                            url: file.ufsUrl,
                                            userId: file.serverData.userId,
                                            size: file.size,
                                            name: file.name,
                                            type: file.type,
                                            key: file.key,
                                            createdAt: new Date()
                                        }, ...taskFiles
                                    ])
                                    toast(`Upload complete for ${res[0].name}`);
                                }}
                                onUploadError={(error: Error) => {
                                    console.error(error);
                                    toast(`File upload failed: ${error.message}`);
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>

                {taskFiles && taskFiles.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                        {taskFiles.map((attachment) => (
                            <Card key={attachment._id} className="overflow-hidden p-0">
                                <div className="pr-2 pl-2 pt-2">
                                    <div className="flex items-center gap-2">
                                        {getFileIcon(attachment.type)}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{attachment.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(attachment.size)} • {format(new Date(attachment.createdAt), "MMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/*{attachment.type.startsWith("image/") && (*/}
                                {/*    <div className="relative h-32 w-full cursor-pointer border-t" onClick={() => openPreview(attachment)}>*/}
                                {/*        <Image*/}
                                {/*            src={attachment.url || "/placeholder.svg"}*/}
                                {/*            alt={attachment.name}*/}
                                {/*            className="object-cover"*/}
                                {/*            fill*/}
                                {/*        />*/}
                                {/*        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">*/}
                                {/*            <Eye className="h-6 w-6 text-white" />*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                <div className="flex border-t">
                                    <Button variant="ghost" className="flex-1 rounded-none" onClick={() => openPreview(attachment)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Preview
                                    </Button>
                                    <Separator orientation="vertical" />
                                    <SignedIn>
                                        <Button variant="ghost" className="flex-1 rounded-none" asChild>
                                            <a href={attachment.url} download={attachment.name}>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </a>
                                        </Button>
                                    </SignedIn>
                                    <SignedOut>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="flex-1 rounded-none"
                                            onClick={() => toast("You must be signed in to download attachments!")}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                    </SignedOut>
                                </div>
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

                <div className="relative">
                    <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] pr-12"
                    />
                    <Button
                        size="icon"
                        className="absolute bottom-4 right-2"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                    >
                        <Send className="h-8 w-8" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>

                {task.comments && task.comments.length > 0 ? (
                    <div className="space-y-4">
                        {task.comments.map((comment) => {
                            const commentUser = users.find((user) => user.id === comment.userId)
                            return (
                                <div key={comment._id} className="flex gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={""} alt={commentUser?.username || "User"} />
                                        <AvatarFallback>{commentUser?.username.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{commentUser?.username || "Unknown User"}</span>
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
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{previewAttachment?.name}</DialogTitle>
                    </DialogHeader>
                    <AttachmentPreview previewAttachment={previewAttachment} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
