<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PersonToContact extends Mailable
{
    use Queueable, SerializesModels;

    public $message;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $data['subAccountName'] = $this->message['subAccountName'];
        $data['responderName'] = $this->message['responderName'];
        $data['responderLatitude'] = $this->message['responderLatitude'];
        $data['responderLongitude'] = $this->message['responderLongitude'];
        $data['name'] = $this->message['name'];
        $data['email'] = $this->message['email'];

        return $this->view('emails.personToContact', compact('data'))
            ->text('emails.personToContactText', compact('data'))
            ->subject('Emergency | ' . $data['responderName']);
    }
}
