"use client"

import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";

import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import type { FormEvent } from "react";
import type { ITask, ITaskPopulated } from "@/db/models";
import type { UserResource } from "@clerk/types";

interface TaskFormProps {
  onSubmit: (taskData:  Omit<ITaskPopulated, "_id"|"comments"|"files"|"createdAt"|"updatedAt">) => void;
  isSignedIn: boolean;
  authUser?: UserResource;
}

const initialTask: Partial<ITask> = {
  title: "",
  status: "todo",
  priority: "low",
  userId: "",
  dueDate: new Date()
}

export function TaskForm({ onSubmit, isSignedIn, authUser }: TaskFormProps) {
  const defaultUser = isSignedIn && authUser ? authUser.id : "";
  const users = useUserStore((state) => state.users);
  const [ title, setTitle ] = useState<string>(initialTask?.title || "");
  const [ description, setDescription ] = useState<string>(initialTask?.description || "");
  const [ status, setStatus ] = useState<string>(initialTask?.status || "todo");
  const [ priority, setPriority ] = useState<string>(initialTask?.priority || "medium");
  const [ assigneeId, setAssigneeId ] = useState<string>(defaultUser);
  const [ dueDate, setDueDate ] = useState<Date>(
    initialTask?.dueDate ? new Date(initialTask.dueDate) : new Date(),
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isSignedIn || !authUser) {
      toast("You must be signed in to create a task!");
      return;
    }

    onSubmit({
      title,
      description,
      status: status as "todo" | "in_progress" | "done",
      priority: priority as "low" | "medium" | "high",
      userId: assigneeId,
      dueDate: dueDate,
    });

    // Reset form if not editing
    if (!initialTask) {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setAssigneeId(defaultUser);
      setDueDate(new Date());
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create New Task</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {users && users.length > 0 && users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {/* @ts-expect-error onSelect needs a handle method */}
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

