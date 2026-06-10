<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:100|unique:admins,username',
            'password' => 'required|string|min:6',
        ]);

        $admin = Admin::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $admin->generateToken();

        return response()->json([
            'message' => 'Admin registered successfully.',
            'admin'   => ['id' => $admin->id, 'username' => $admin->username],
            'token'   => $token,
        ], 201);
    }

    public function login(Request $request)
{
    // 1. Validate input first
    $validated = $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    // 2. Find the admin
    $admin = Admin::where('username', $validated['username'])->first();

    // 3. Check if admin exists AND password is correct
    if (!$admin || !Hash::check($validated['password'], $admin->password)) {
        return response()->json(['message' => 'Invalid credentials.'], 401);
    }

    // 4. Generate the token (using your custom method)
    $token = $admin->generateToken();

    return response()->json([
        'message' => 'Login successful.',
        'admin'   => ['id' => $admin->id, 'username' => $admin->username],
        'token'   => $token,
    ]);
}

    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'No token provided.'], 400);
        }

        $admin = Admin::where('api_token', hash('sha256', $token))->first();

        if (!$admin) {
            return response()->json(['message' => 'Invalid token.'], 401);
        }

        $admin->revokeToken();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'No token provided.'], 401);
        }

        $admin = Admin::where('api_token', hash('sha256', $token))->first();

        if (!$admin) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json([
            'id'       => $admin->id,
            'username' => $admin->username,
        ]);
    }
}