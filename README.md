# CheeseBoard 🧀✨

CheeseBoard is a **task management application** built with modern web technologies. It allows users to create, organize, and track tasks with ease. The app is designed to be fast, responsive, and user-friendly.

---

## Features

- **Task Management**: Create, update, and delete tasks with ease.
- **Comments**: Add comments to tasks for better collaboration.
- **File Attachments**: Upload and manage files associated with tasks.
- **Real-Time Updates**: Tasks and comments are updated in real-time.
- **Responsive Design**: Built with **Tailwind CSS** and **shadcn/ui** for a sleek and responsive UI.

---

## Technologies Used

- **Frontend**:
  - [Next.js](https://nextjs.org/): React framework for server-side rendering and static site generation.
  - [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for styling.
  - [shadcn/ui](https://ui.shadcn.com/): Beautifully designed UI components built on top of Tailwind CSS.
  - [Zustand](https://zustand-demo.pmnd.rs/): Lightweight state management library.
  - [TanStack Query (React Query)](https://tanstack.com/query): Data fetching and caching library.

- **Backend**:
  - [MongoDB](https://www.mongodb.com/): NoSQL database for storing tasks, comments, and files.
  - [Mongoose](https://mongoosejs.com/): MongoDB object modeling for Node.js.
  - [NextAuth.js](https://next-auth.js.org/): Authentication library for Next.js.

- **Other Tools**:
  - [TypeScript](https://www.typescriptlang.org/): Static typing for JavaScript.
  - [UploadThing](https://uploadthing.com/): File upload service (optional, if used).

---

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18 or higher).
- **MongoDB**: Set up a MongoDB database (local or cloud-based).

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/cheeseboard.git
    cd cheeseboard
    ```

2. **Install Dependencies:**:
    ```bash
    npm install
    ```

3. **Setup Environment Variables:**:
Create a .env.local file in the root directory and add the following variables:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=key-here
    CLERK_SECRET_KEY=sk_test_key_here
    MONGODB_URI=mongodb+srv://url-here
    UPLOADTHING_TOKEN=token-here
    ```

4. **Run Development Server:**:
    ```bash
    npm run dev
    ```

5. **Open the App:**:
Visit http://localhost:3000 in your browser.


## Project Structure
```
cheez-board/
├── src/
│   ├── app/                  # NextJS App router (layout and page files)
│       ├── api/                  # API routes
│   ├── components/           # Components
│       ├── ui/               # Shadcn/ui components
│   ├── hooks/                # React Query hooks
│   ├── db/                   # Database methods and classes
    │   ├── models/                   # Mongoose models
│   ├── stores/               # Zustand stores
│   └── utils/                # Utility functions
├── public/                   # Static assets
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Usage
### Tasks

- Create a Task: Click the "Add Task" button to create a new task.

- Update a Task: Click the task to edit its details.

- Delete a Task: Click the trash icon to delete a task.

### Comments

- Add a Comment: Click the "Add Comment" button to add a comment to a task.

- Edit a Comment: Click the edit icon to update a comment.

- Delete a Comment: Click the trash icon to delete a comment.

### Files

- Upload a File: Click the "Upload File" button to attach a file to a task.

- Delete a File: Click the trash icon to delete a file. (Upcoming)

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/ocheezyy/Cheez-Board/blob/master/LICENSE) file for details.

## Contact

If you have any questions or feedback, feel free to reach out:

- Email: [seanodonnellse@gmail.com](mailto:seanodonnellse@gmail.com)

- GitHub: [ocheezyy](https://github.com/ocheezyy)