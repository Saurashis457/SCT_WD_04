import { useState } from 'react';
import { Check, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
  createdAt: Date;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onEdit, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleEdit = () => {
    if (editTitle.trim()) {
      onEdit(task.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const isOverdue = task.dueDate && !task.completed && new Date() > task.dueDate;

  return (
    <Card 
      className={`task-item p-4 rounded-xl border-0 ${
        task.completed ? 'task-completed' : ''
      } ${isOverdue ? 'border-l-4 border-l-orange-400' : ''} animate-slide-up`}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle(task.id)}
          className={`min-w-8 h-8 rounded-full p-0 border-2 transition-all duration-300 ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white animate-checkmark'
              : 'border-muted-foreground/30 hover:border-primary'
          }`}
        >
          {task.completed && <Check className="w-4 h-4" />}
        </Button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyPress}
              className="bg-transparent border-0 p-0 h-auto text-base font-medium focus-visible:ring-1"
              autoFocus
            />
          ) : (
            <div>
              <p 
                className={`font-medium text-base leading-relaxed ${
                  task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}
              >
                {task.title}
              </p>
              
              {/* Due Date/Time */}
              {(task.dueDate || task.dueTime) && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className={isOverdue ? 'text-orange-500 font-medium' : ''}>
                        {format(task.dueDate, 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  {task.dueTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.dueTime}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};