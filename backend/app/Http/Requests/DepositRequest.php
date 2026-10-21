<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DepositRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Nominal deposit wajib diisi.',
            'amount.integer' => 'Nominal deposit harus berupa angka.',
            'amount.min' => 'Nominal deposit minimal Rp 1.',
            'note.string' => 'Catatan harus berupa teks.',
            'note.max' => 'Catatan maksimal 255 karakter.',
        ];
    }
}
