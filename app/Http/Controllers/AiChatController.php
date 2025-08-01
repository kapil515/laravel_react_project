<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiChatController extends Controller
{
    public function chat(Request $request)
    {
        $message = $request->input('message');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENROUTER_API_KEY'),
            'HTTP-Referer'  => 'http://localhost',
            'X-Title'       => 'Laravel AI Chat',
        ])->post('https://openrouter.ai/api/v1/chat/completions', [
            'model'    => 'openai/gpt-3.5-turbo',
            'messages' => [
                ['role' => 'user', 'content' => $message],
            ],
        ]);

        return response()->json([
            'reply' => $response['choices'][0]['message']['content'] ?? 'No response from AI.',
        ]);
    }
}
