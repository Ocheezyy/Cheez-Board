import type { IFile } from "@/db/models";
import { Download } from "lucide-react";
import { getFileIcon } from "@/lib/task-methods";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/task-methods";
import Image from "next/image";

type AttachmentPreviewProps = {
    previewAttachment: IFile | null;
}

export const AttachmentPreview = ({ previewAttachment }: AttachmentPreviewProps) => {
    if (!previewAttachment) return null

    if (previewAttachment.type.startsWith("image/")) {
        return (
            <div className="flex items-center justify-center">
                <Image
                    src={previewAttachment.url || "/placeholder.svg"}
                    alt={previewAttachment.name}
                    className="max-h-[70vh] max-w-full object-contain rounded-md"
                    fill
                />
            </div>
        )
    }

    if (previewAttachment.type.startsWith("video/")) {
        return (
            <div className="flex items-center justify-center">
                <video src={previewAttachment.url} controls className="max-h-[70vh] max-w-full rounded-md">
                    Your browser does not support the video tag.
                </video>
            </div>
        )
    }

    if (previewAttachment.type === "application/pdf") {
        return (
            <div className="h-[70vh] w-full">
                <iframe
                    src={`${previewAttachment.url}#view=FitH`}
                    className="h-full w-full rounded-md border"
                    title={previewAttachment.name}
                />
            </div>
        )
    }

    // For other file types, show file info
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            {getFileIcon(previewAttachment.type)}
            <h3 className="mt-4 text-xl font-medium">{previewAttachment.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                {formatFileSize(previewAttachment.size)} • {previewAttachment.type}
            </p>
            <Button className="mt-6" asChild>
                <a href={previewAttachment.url} download={previewAttachment.name}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </a>
            </Button>
        </div>
    )
}