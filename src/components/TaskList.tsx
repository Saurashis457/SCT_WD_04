import { useState } from 'react';
import { Search, Filter, CheckCircle, Circle, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TaskItem, Task } from './TaskItem';
import { Badge } from '@/components/ui/badge';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

type FilterType = 'all' | 'active' | 'completed';

export const TaskList = ({ tasks, onToggle, onEdit, onDelete }: TaskListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed);
    
    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const overdueCount = tasks.filter(task => 
    task.dueDate && !task.completed && new Date() > task.dueDate
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="bg-white/30 text-foreground border-white/20">
          <Circle className="w-3 h-3 mr-1" />
          {activeCount} Active
        </Badge>
        <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          {completedCount} Completed
        </Badge>
        {overdueCount > 0 && (
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-700 border-orange-500/20">
            <Calendar className="w-3 h-3 mr-1" />
            {overdueCount} Overdue
          </Badge>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10 bg-white/50 border-white/20 focus-visible:ring-primary/50"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={`${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-white/30 border-white/20 hover:bg-white/40'
            }`}
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            className={`${
              filter === 'active' 
                ? 'bg-primary text-white' 
                : 'bg-white/30 border-white/20 hover:bg-white/40'
            }`}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className={`${
              filter === 'completed' 
                ? 'bg-primary text-white' 
                : 'bg-white/30 border-white/20 hover:bg-white/40'
            }`}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 custom-scrollbar max-h-[60vh] overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">
              {searchTerm ? (
                <>No tasks found matching "{searchTerm}"</>
              ) : tasks.length === 0 ? (
                <>No tasks yet. Add your first task above!</>
              ) : (
                <>No {filter} tasks</>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 group">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};