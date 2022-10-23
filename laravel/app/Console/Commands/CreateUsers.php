<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'otaa:create_users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $user = new User();
        $user->email = 'otaa@gmail.com';
        $user->password = Hash::make('admin123');
        $user->firstname = 'One-Tap';
        $user->middlename = 'Ambulance';
        $user->lastname = 'Alert';
        $user->birthdate = '1990-01-02';
        $user->contact_number = '09123456789';
        $user->address = '123 Purok 1, Bagumbayan, Daraga, Albay';
        $user->role = 1;
        $user->save();

        return 0;
    }
}
