<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return redirect('/login');
        }

        // Jika user adalah super admin, izinkan akses ke semua
        if ($user->hasRole('super-admin')) {
            return $next($request);
        }

        // Parse roles from comma-separated string
        $roleArray = explode(',', $roles);
        $roleArray = array_map('trim', $roleArray); // Remove any whitespace

        // Check if user has any of the required roles using Spatie's hasAnyRole method
        if ($user->hasAnyRole($roleArray)) {
            return $next($request);
        }

        // Jika tidak punya role yang diperlukan, redirect atau abort
        abort(403, 'Unauthorized. You do not have permission to access this resource.');
    }
}
