<?php


namespace App\Enums;


enum ImagesSizeEnum: string
{
    case THUMBNAIL = 'thumbnail';
    case MEDIUM = 'medium';
    case LARGE = 'large';

    public function width(): int
    {
        return match ($this) {
            self::THUMBNAIL => 480,
            self::MEDIUM => 1024,
            self::LARGE => 1920,
        };
    }
}
