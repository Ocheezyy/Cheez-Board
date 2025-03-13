"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IUser } from "@/db/models";

interface TaskFiltersProps {
  filter: {
    status: string
    priority: string
    assignee: string
  }
  setFilter: (filter: any) => void
  users: IUser[]
}

export function TaskFilters({ filter, setFilter, users }: TaskFiltersProps) {
  console.log(users);
  const taskCount = {
    all: 0,
    todo: 0,
    "in-progress": 0,
    completed: 0,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <RadioGroup
            defaultValue={filter.status}
            onValueChange={(value) => setFilter({ ...filter, status: value })}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="status-all" />
              <Label htmlFor="status-all" className="flex-1 cursor-pointer">
                All
              </Label>
              <Badge variant="outline">{taskCount.all}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="todo" id="status-todo" />
              <Label htmlFor="status-todo" className="flex-1 cursor-pointer">
                To Do
              </Label>
              <Badge variant="outline">{taskCount.todo}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-progress" id="status-in-progress" />
              <Label htmlFor="status-in-progress" className="flex-1 cursor-pointer">
                In Progress
              </Label>
              <Badge variant="outline">{taskCount["in-progress"]}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="status-completed" />
              <Label htmlFor="status-completed" className="flex-1 cursor-pointer">
                Completed
              </Label>
              <Badge variant="outline">{taskCount.completed}</Badge>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={filter.priority} onValueChange={(value) => setFilter({ ...filter, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Assignee</Label>
          <Select value={filter.assignee} onValueChange={(value) => setFilter({ ...filter, assignee: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Team Members</SelectItem>
              {users && users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

