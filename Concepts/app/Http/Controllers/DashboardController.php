<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        $todos = $user->todos()
            ->orderBy('completed', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        $completedCount = $todos->where('completed', true)->count();
        $pendingCount = $todos->where('completed', false)->count();

        return Inertia::render('dashboard', [
            'todos' => $todos,
            'stats' => [
                'total' => $todos->count(),
                'completed' => $completedCount,
                'pending' => $pendingCount,
            ],
        ]);
    }
}
