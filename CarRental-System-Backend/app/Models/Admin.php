<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class Admin extends Authenticatable
{
    use HasFactory, HasApiTokens;
    protected $table = 'admins';

    protected $fillable = [
        'username',
        'password',
        'api_token',
    ];

    protected $hidden = [
        'password',
        'api_token',
    ];

    public function generateToken(): string
    {
        $token = Str::random(60);
        $this->update(['api_token' => hash('sha256', $token)]);
        return $token;
    }

    public function revokeToken(): void
    {
        $this->update(['api_token' => null]);
    }
}