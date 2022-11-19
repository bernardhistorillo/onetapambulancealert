<?php

namespace App\Console\Commands;

use App\Models\Responder;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateResponders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'otaa:create_responders';

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
        $responder = new Responder();
        $responder->name = "Leon D. Hernandez Memorial Hospital";
        $responder->latitude = 14.1144898;
        $responder->longitude = 122.9567868;
        $responder->save();

        $responder = new Responder();
        $responder->name = "Camarines Norte Provincial Hospital";
        $responder->latitude = 14.1213072;
        $responder->longitude = 122.9569715;
        $responder->save();

        $responder = new Responder();
        $responder->name = "Our Lady Of Lourdes Hospital";
        $responder->latitude = 14.1209822;
        $responder->longitude = 122.9470459;
        $responder->save();

        $responder = new Responder();
        $responder->name = "Daet Doctors Hospital Incorporated";
        $responder->latitude = 14.1152310;
        $responder->longitude = 122.9637641;
        $responder->save();

        $responder = new Responder();
        $responder->name = "ANIMAL HEART VETERINARY CLINIC AND GROOMING CENTER";
        $responder->latitude = 14.1103217;
        $responder->longitude = 122.9562648;
        $responder->save();

        $responder = new Responder();
        $responder->name = "Dr. Moises V. Cacawa Memorial Hospital";
        $responder->latitude = 14.1133570;
        $responder->longitude = 122.9484509;
        $responder->save();

        $responder = new Responder();
        $responder->name = "Santissima Trinidad Hospital of Daet";
        $responder->latitude = 14.1064145;
        $responder->longitude = 122.9493790;
        $responder->save();

        $responder = new Responder();
        $responder->name = "Animalandia Veterinary Clinic and Grooming Center";
        $responder->latitude = 14.1184046;
        $responder->longitude = 122.9483790;
        $responder->save();

        $responder = new Responder();
        $responder->name = "Animal Park Veterinary Clinic";
        $responder->latitude = 14.1126040;
        $responder->longitude = 122.9351279;
        $responder->save();

        return 0;
    }
}
