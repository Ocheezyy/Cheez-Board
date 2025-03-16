"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import type { TaskFilter, FilterCounts, TaskStatus, TaskPriority, IUser } from "@/lib/types";

interface TaskFiltersProps {
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  users: IUser[];
  counts: FilterCounts;
}

export function TaskFilters({ filter, setFilter, users, counts }: TaskFiltersProps) {
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
            onValueChange={(value) => setFilter({ ...filter, status: value as TaskStatus })}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="status-all" />
              <Label htmlFor="status-all" className="flex-1 cursor-pointer">
                All
              </Label>
              <Badge variant="outline">{counts.all}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="todo" id="status-todo" />
              <Label htmlFor="status-todo" className="flex-1 cursor-pointer">
                To Do
              </Label>
              <Badge variant="outline">{counts.todo}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in_progress" id="status-in-progress" />
              <Label htmlFor="status-in-progress" className="flex-1 cursor-pointer">
                In Progress
              </Label>
              <Badge variant="outline">{counts.inProgress}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="done" id="status-completed" />
              <Label htmlFor="status-completed" className="flex-1 cursor-pointer">
                Completed
              </Label>
              <Badge variant="outline">{counts.completed}</Badge>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={filter.priority} onValueChange={(value) => setFilter({ ...filter, priority: value as TaskPriority })}>
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
              {users && users.length && users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

