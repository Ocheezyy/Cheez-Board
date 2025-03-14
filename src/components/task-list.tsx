"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskForm } from "./task-form"
import { TaskDetailView } from "./task-detail-view"
import { getPriorityColor, getPriorityIcon, getStatusColor } from "@/lib/task-methods";
import { ITaskPopulated, IUser } from "@/db/models";


interface TaskListProps {
  tasks: ITaskPopulated[]
  users: IUser[]
  onUpdate: (task: Partial<ITaskPopulated>) => void
  onDelete: (taskId: string) => void
}

export function TaskList({ tasks, users, onUpdate, onDelete }: TaskListProps) {
  const [ editingTask, setEditingTask ] = useState<ITaskPopulated | null>(null)
  const [ viewingTask, setViewingTask ] = useState<ITaskPopulated | null>(null)
  const [ isEditDialogOpen, setIsEditDialogOpen ] = useState(false)
  const [ isViewDialogOpen, setIsViewDialogOpen ] = useState(false)

  console.log(tasks);

  const getUser = (assigneeId: string) => {
    return users.find((user) => user._id === assigneeId)
  }

  const handleEditTask = (task: ITaskPopulated) => {
    setEditingTask(task)
    setIsEditDialogOpen(true)
  }

  const handleViewTask = (task: ITaskPopulated) => {
    setViewingTask(task)
    setIsViewDialogOpen(true)
  }

  const handleUpdateTask = (updatedTaskData: Omit<ITaskPopulated, "_id"|"comments"|"files"|"createdAt"|"updatedAt">) => {
    if (editingTask) {
      const updatedTask = {
        ...editingTask,
        ...updatedTaskData,
      }
      onUpdate(updatedTask)
      setIsEditDialogOpen(false)
      setEditingTask(null)
    }
  }

  // const handleUpdateViewingTask = (updatedTask: ITaskPopulated) => {
  //   onUpdate(updatedTask)
  //   setViewingTask(updatedTask)
  // }

  if (tasks.length === 0) {
    return (
        <Card className="flex h-[300px] items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-sm text-muted-foreground">Try changing your filters or create a new task.</p>
          </div>
        </Card>
    )
  }

  return (
      <div className="space-y-4">
        {tasks.map((task) => {
          const assignee = getUser(task.userId.toString())
          const dueDate = task.dueDate || null
          const isOverdue = false // (new Date(dueDate) && dueDate < new Date().) && task.status !== "completed"
          const hasAttachments = true // task.attachments && task.attachments.length > 0
          const hasComments = true // task.comments && task.comments.length > 0

          return (
              <Card
                  key={task._id}
                  className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => handleViewTask(task)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{task.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">{task.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditTask(task)
                            }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(task._id)
                            }}
                            className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status === "todo" ? "To Do" : task.status === "in_progress" ? "In Progress" : "Completed"}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {getPriorityIcon(task.priority)}
                      <span className="ml-1 capitalize">{task.priority}</span>
                    </Badge>
                    <Badge
                        variant="outline"
                        className={isOverdue ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}
                    >
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(dueDate, "MMM d")}
                      {isOverdue && " (Overdue)"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <div className="flex items-center gap-2">
                    {assignee && (
                        <>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={""} alt={assignee.name} />
                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{assignee.name}</span>
                        </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {hasAttachments && <span>{0} attachment(s)</span>} {/* Attachment count */}
                    {hasComments && <span>{0} comment(s)</span>} {/* comment count */}
                  </div>
                </CardFooter>
              </Card>
          )
        })}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>

            {editingTask && <TaskForm onSubmit={handleUpdateTask} />}
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto [&>button]:hidden">
            <DialogHeader className="hidden">
              <DialogTitle>{viewingTask?.title}</DialogTitle>
            </DialogHeader>
            {viewingTask && (
                <TaskDetailView
                    task={viewingTask}
                    onClose={() => setIsViewDialogOpen(false)}
                />
            )}
          </DialogContent>
        </Dialog>
      </div>
  )
}

