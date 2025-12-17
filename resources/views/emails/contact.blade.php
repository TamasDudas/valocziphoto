<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Új kapcsolatfelvételi üzenet</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            border-radius: 5px 5px 0 0;
        }

        .content {
            background-color: #f9fafb;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }

        .field {
            margin-bottom: 15px;
        }

        .label {
            font-weight: bold;
            color: #4F46E5;
        }

        .value {
            margin-top: 5px;
            padding: 10px;
            background-color: white;
            border-left: 3px solid #4F46E5;
        }

        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1 style="margin: 0;">Új kapcsolatfelvételi üzenet</h1>
    </div>

    <div class="content">
        <div class="field">
            <div class="label">Név:</div>
            <div class="value">{{ $contactData['name'] }}</div>
        </div>

        <div class="field">
            <div class="label">Email cím:</div>
            <div class="value">
                <a href="mailto:{{ $contactData['email'] }}">{{ $contactData['email'] }}</a>
            </div>
        </div>

        @if (!empty($contactData['subject']))
            <div class="field">
                <div class="label">Tárgy:</div>
                <div class="value">{{ $contactData['subject'] }}</div>
            </div>
        @endif

        <div class="field">
            <div class="label">Üzenet:</div>
            <div class="value">{{ $contactData['message'] }}</div>
        </div>

        <div class="footer">
            <p>Ez az üzenet a Valoczi Photo kapcsolatfelvételi űrlapjáról érkezett.</p>
            <p>Beérkezés ideje: {{ now()->format('Y-m-d H:i:s') }}</p>
        </div>
    </div>
</body>

</html>
