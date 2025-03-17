import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from "next/server";

const f = createUploadthing();

const auth = (req: NextRequest) => {
    return getAuth(req);
};

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
    taskAttachmentUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
        video: {
            maxFileCount: 1,
            maxFileSize: "4MB",
        },
        pdf: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
        text: {
            maxFileCount: 1,
            maxFileSize: "4MB",
        }
    })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const user = auth(req);

      if (!user || !user.userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);



      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
          ...metadata
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
