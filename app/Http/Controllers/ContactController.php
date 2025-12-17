<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'nullable|string|max:255',
                'message' => 'required|string|min:10',
            ]);

            // Mentés adatbázisba
            Contact::create($validated);

            // Email küldés (RETURN ELŐTT!)
            Mail::to('tamasdudas230@gmail.com')->send(new ContactFormMail($validated));

            return redirect()->back()->with('success', 'Üzeneted sikeresen elküldve!');
        } catch (\Exception $e) {
            Log::error('Hiba az üzenet küldésekor', ['error' => $e->getMessage()]);

            return redirect()->back()
                ->withErrors(['error' => 'Váratlan hiba történt: '.$e->getMessage()])
                ->withInput();
        }
    }
}
