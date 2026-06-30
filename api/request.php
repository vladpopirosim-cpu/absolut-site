<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, bool $success, string $message): never
{
    http_response_code($status);
    echo json_encode(
        ['success' => $success, 'message' => $message],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Отправьте заявку через форму на сайте.');
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 20000) {
    respond(400, false, 'Заявка слишком большая. Сократите комментарий.');
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, false, 'Не удалось прочитать заявку. Обновите страницу и попробуйте ещё раз.');
}

$name = trim((string) ($data['name'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$website = trim((string) ($data['website'] ?? ''));
$source = trim((string) ($data['source'] ?? ''));

if ($website !== '') {
    respond(200, true, 'Заявка направлена');
}

if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
    respond(422, false, 'Проверьте поле «Имя»: укажите от 2 до 120 символов.');
}

$compactPhone = preg_replace('/\s+/', '', $phone) ?? '';
if (!preg_match('/^(?:\+7|8)\d{10}$/', $compactPhone)) {
    respond(422, false, 'Проверьте поле «Телефон»: используйте формат +7900 000 00 00 или 8900 000 00 00.');
}

if (mb_strlen($message) > 1200) {
    respond(422, false, 'Проверьте поле «Комментарий»: сократите текст до 1200 символов.');
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = sys_get_temp_dir() . '/absolut-form-' . hash('sha256', $ip);
$lastSent = is_file($rateFile) ? (int) file_get_contents($rateFile) : 0;
if ($lastSent > 0 && time() - $lastSent < 30) {
    respond(429, false, 'Заявка уже отправляется. Подождите 30 секунд перед повторной отправкой.');
}

$recipient = 'vladik_gess@mail.ru';
$subject = 'Заявка с сайта ООО «АБСОЛЮТ»';
$safeSource = filter_var($source, FILTER_VALIDATE_URL) ? $source : 'absolutkuban.ru';
$body = implode("\r\n", [
    'Новая заявка с сайта absolutkuban.ru',
    '',
    'Имя: ' . $name,
    'Телефон: ' . $phone,
    'Комментарий: ' . ($message !== '' ? $message : 'не указан'),
    'Страница: ' . $safeSource,
    'Дата: ' . date('d.m.Y H:i:s'),
]);

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$headers = implode("\r\n", [
    'From: ООО АБСОЛЮТ <website@absolutkuban.ru>',
    'Reply-To: absolut-projekt@mail.ru',
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
    'X-Mailer: Absolut Website',
]);

if (!mail($recipient, $encodedSubject, $body, $headers)) {
    respond(500, false, 'Не удалось отправить заявку. Позвоните нам или напишите на рабочую почту.');
}

@file_put_contents($rateFile, (string) time(), LOCK_EX);
respond(200, true, 'Заявка направлена');
