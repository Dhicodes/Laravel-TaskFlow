<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        $todos = $user->todos()->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('todos/index', [
            'todos' => $todos,
        ]);
    }

    public function create()
    {
        return Inertia::render('todos/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        /** @var User $user */
        $user = Auth::user();
        $user->todos()->create([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => false,
        ]);

        return redirect()->route('dashboard')->with('success', 'Todo created successfully!');
    }

    public function edit(Todo $todo)
    {
        // Ensure the todo belongs to the authenticated user
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('todos/edit', [
            'todo' => $todo,
        ]);
    }

    public function update(Request $request, Todo $todo)
    {
        // Ensure the todo belongs to the authenticated user
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        $todo->update([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => $request->completed ?? false,
        ]);

        return redirect()->route('dashboard')->with('success', 'Todo updated successfully!');
    }

    public function destroy(Todo $todo)
    {
        // Ensure the todo belongs to the authenticated user
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $todo->delete();

        return redirect()->route('dashboard')->with('success', 'Todo deleted successfully!');
    }

    public function toggle(Todo $todo)
    {
        // Ensure the todo belongs to the authenticated user
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $todo->update([
            'completed' => !$todo->completed,
        ]);

        return back()->with('success', 'Todo status updated!');
    }
}
