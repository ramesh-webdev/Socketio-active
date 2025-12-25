import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type AccessRole = 'admin' | 'editor' | 'viewer' | 'restricted';

interface User {
  id: string;
  name: string;
  email: string;
  role: AccessRole;
  functionalityLimit: number;
  createdAt: Date;
}

const accessRoles: { value: AccessRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features' },
  { value: 'editor', label: 'Editor', description: 'Can edit content and settings' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
  { value: 'restricted', label: 'Restricted', description: 'Limited functionality' },
];

const roleColors: Record<AccessRole, string> = {
  admin: 'bg-destructive/10 text-destructive border-destructive/20',
  editor: 'bg-primary/10 text-primary border-primary/20',
  viewer: 'bg-success/10 text-success border-success/20',
  restricted: 'bg-warning/10 text-warning border-warning/20',
};

const initialUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', role: 'admin', functionalityLimit: 100, createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Sarah Connor', email: 'sarah@example.com', role: 'editor', functionalityLimit: 50, createdAt: new Date('2024-02-20') },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'viewer', functionalityLimit: 25, createdAt: new Date('2024-03-10') },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer' as AccessRole,
    functionalityLimit: 25,
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'viewer', functionalityLimit: 25 });
    setEditingUser(null);
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        functionalityLimit: user.functionalityLimit,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name and email are required.',
        variant: 'destructive',
      });
      return;
    }

    if (editingUser) {
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUser.id
            ? { ...u, ...formData }
            : u
        )
      );
      toast({
        title: 'User Updated',
        description: `${formData.name}'s access has been updated.`,
      });
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      };
      setUsers(prev => [...prev, newUser]);
      toast({
        title: 'User Created',
        description: `${formData.name} has been added with ${formData.role} access.`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast({
      title: 'User Removed',
      description: `${user?.name} has been removed from the system.`,
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Create users and assign access limits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Access Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: AccessRole) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessRoles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.label}</span>
                          <span className="text-muted-foreground text-xs">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="limit">Functionality Limit: {formData.functionalityLimit}%</Label>
                <Input
                  id="limit"
                  type="range"
                  min={0}
                  max={100}
                  value={formData.functionalityLimit}
                  onChange={e => setFormData(prev => ({ ...prev, functionalityLimit: parseInt(e.target.value) || 0 }))}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of app features this user can access
                </p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <UserPlus className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No users yet.</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Click "Add User" to create one.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {users.map(user => (
                <div
                  key={user.id}
                  className="p-4 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Role & Access */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={roleColors[user.role]}>
                        {user.role}
                      </Badge>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={user.functionalityLimit} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{user.functionalityLimit}%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 sm:ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(user)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit2 className="w-4 h-4 sm:mr-0 mr-2" />
                        <span className="sm:hidden">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive flex-1 sm:flex-none"
                      >
                        <Trash2 className="w-4 h-4 sm:mr-0 mr-2" />
                        <span className="sm:hidden">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
