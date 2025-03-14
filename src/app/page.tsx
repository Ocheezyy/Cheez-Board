import { Navbar } from "@/components/navbar"
import { TaskDashboard } from "@/components/task-dashboard"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <TaskDashboard />
      </main>
    </>
  )
}
