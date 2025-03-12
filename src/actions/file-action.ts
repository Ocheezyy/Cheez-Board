import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { files } from "@/db/schema";
import { File, NewFile } from "@/db/types";
import { revalidatePath } from "next/cache";