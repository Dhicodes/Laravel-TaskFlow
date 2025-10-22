import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, CheckCircle, Circle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

interface Stats {
    total: number;
    completed: number;
    pending: number;
}

interface DashboardProps {
    todos: Todo[];
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'TODO',
        href: dashboard().url,
    },
];

export default function Dashboard({ todos, stats }: DashboardProps) {
    const handleToggle = (id: number) => {
        router.patch(`/todos/${id}/toggle`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this todo?')) {
            router.delete(`/todos/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="TODO Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
                            <Badge variant="secondary">{stats.total}</Badge>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <Badge variant="default" className="bg-green-500">{stats.completed}</Badge>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Badge variant="outline">{stats.pending}</Badge>
                        </CardHeader>
                    </Card>
                </div>

                {/* Add Todo Button */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Your Todos</h2>
                    <Button asChild>
                        <Link href="/todos/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Todo
                        </Link>
                    </Button>
                </div>

                {/* Todos List */}
                <div className="space-y-4">
                    {todos.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <PlaceholderPattern className="h-32 w-32 stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <p className="mt-4 text-muted-foreground">No todos yet. Create your first todo!</p>
                                <Button asChild className="mt-4">
                                    <Link href="/todos/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Todo
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        todos.map((todo) => (
                            <Card key={todo.id} className={todo.completed ? 'opacity-75' : ''}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => handleToggle(todo.id)}
                                            className="mt-1 flex-shrink-0"
                                        >
                                            {todo.completed ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-gray-400 hover:text-green-500" />
                                            )}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                                                {todo.title}
                                            </h3>
                                            {todo.description && (
                                                <p className={`text-sm text-muted-foreground mt-1 ${todo.completed ? 'line-through' : ''}`}>
                                                    {todo.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Created {new Date(todo.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/todos/${todo.id}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(todo.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
