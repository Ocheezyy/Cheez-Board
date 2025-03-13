import { Task } from '@/db/models';

async function getTaskWithCommentsAndFiles(taskId: string) {
    const task = await Task.findById(taskId)
        .populate('comments')
        .populate('files')
        .exec();

    if (!task) {
        console.log('Task not found');
        return;
    }

    console.log('Task:', task);
    console.log('Comments:', task.comments);
    console.log('Files:', task.files);
}