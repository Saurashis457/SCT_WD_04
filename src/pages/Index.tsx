import { useState, useEffect } from 'react';
import { CheckSquare, Sparkles } from 'lucide-react';
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';
import { Task } from '@/components/TaskItem';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        const tasksWithDates = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, dueDate?: Date, dueTime?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      dueDate,
      dueTime,
      createdAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
    
    toast({
      title: "Task added!",
      description: `"${title}" has been added to your list.`,
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updated = { ...task, completed: !task.completed };
        
        toast({
          title: updated.completed ? "Task completed! 🎉" : "Task reopened",
          description: `"${task.title}" ${updated.completed ? 'marked as complete' : 'marked as active'}.`,
        });
        
        return updated;
      }
      return task;
    }));
  };

  const editTask = (id: string, title: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, title } : task
    ));
    
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated.",
    });
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: `"${task?.title}" has been removed from your list.`,
      variant: "destructive",
    });
  };

  const completedPercentage = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Task Manager
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          
          <p className="text-white/80 text-lg max-w-md mx-auto">
            Organize your life with beautiful, intuitive task management
          </p>

          {/* Progress */}
          {tasks.length > 0 && (
            <Card className="glass-card p-4 mt-6 max-w-sm mx-auto animate-bounce-in">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {completedPercentage}%
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Tasks Completed
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${completedPercentage}%` }}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Add Task Form */}
        <div className="mb-8">
          <AddTaskForm onAdd={addTask} />
        </div>

        {/* Task List */}
        <div className="animate-fade-in">
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-white/60">
          <p className="text-sm">
            Built with ❤️ using React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
