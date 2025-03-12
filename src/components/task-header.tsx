import { CalendarDays, CheckCircle, Users } from "lucide-react"

export function TaskHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">Cheez Board</h1>
      <p className="text-muted-foreground">Collaborate and manage tasks with your team</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Track Progress</p>
            <p className="text-xs text-muted-foreground">Manage task status</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Team Collaboration</p>
            <p className="text-xs text-muted-foreground">Assign tasks to team members</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Deadlines</p>
            <p className="text-xs text-muted-foreground">Set and track due dates</p>
          </div>
        </div>
      </div>
    </div>
  )
}

