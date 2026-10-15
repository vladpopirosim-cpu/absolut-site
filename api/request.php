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

const SITE_HOSTS = ['absolutkuban.ru', 'www.absolutkuban.ru'];
const IP_COOLDOWN_SECONDS = 30;
const GLOBAL_LIMIT_PER_HOUR = 30;

function isSiteUrl(string $url): bool
{
    $host = strtolower((string) parse_url($url, PHP_URL_HOST));
    return in_array($host, SITE_HOSTS, true);
}

function clientIp(): string
{
    $remote = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    $isPublic = filter_var($remote, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
    if ($isPublic) {
        return $remote;
    }
    // Behind the hosting proxy REMOTE_ADDR is local; the proxy passes the visitor address.
    $forwarded = (string) ($_SERVER['HTTP_X_REAL_IP'] ?? explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''))[0]);
    $forwarded = trim($forwarded);
    return filter_var($forwarded, FILTER_VALIDATE_IP) ? $forwarded : ($remote ?: 'unknown');
}

function rateDir(): string
{
    $dir = sys_get_temp_dir() . '/absolut-form';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    return $dir;
}

/** Reserve a send slot atomically, so parallel requests cannot slip past the limits. */
function claimSlot(string $ip): void
{
    $now = time();
    $dir = rateDir();

    $ipHandle = @fopen($dir . '/ip-' . hash('sha256', $ip), 'c+');
    if ($ipHandle === false || !flock($ipHandle, LOCK_EX)) {
        respond(503, false, 'Сервис отправки временно недоступен. Позвоните нам или напишите на рабочую почту.');
    }
    $lastSent = (int) stream_get_contents($ipHandle);
    if ($lastSent > 0 && $now - $lastSent < IP_COOLDOWN_SECONDS) {
        flock($ipHandle, LOCK_UN);
        fclose($ipHandle);
        respond(429, false, 'Заявка уже отправлена. Подождите 30 секунд перед повторной отправкой.');
    }

    $globalHandle = @fopen($dir . '/global', 'c+');
    if ($globalHandle === false || !flock($globalHandle, LOCK_EX)) {
        flock($ipHandle, LOCK_UN);
        fclose($ipHandle);
        respond(503, false, 'Сервис отправки временно недоступен. Позвоните нам или напишите на рабочую почту.');
    }
    $recent = array_values(array_filter(
        array_map('intval', explode(',', (string) stream_get_contents($globalHandle))),
        static fn (int $time): bool => $now - $time < 3600
    ));
    if (count($recent) >= GLOBAL_LIMIT_PER_HOUR) {
        foreach ([$globalHandle, $ipHandle] as $handle) {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
        respond(429, false, 'Сейчас слишком много заявок. Позвоните нам или напишите на рабочую почту.');
    }
    $recent[] = $now;

    foreach ([[$globalHandle, implode(',', $recent)], [$ipHandle, (string) $now]] as [$handle, $value]) {
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, $value);
        fflush($handle);
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

/** Let the visitor retry at once when delivery failed on our side. */
function releaseIpSlot(string $ip): void
{
    @unlink(rateDir() . '/ip-' . hash('sha256', $ip));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Отправьте заявку через форму на сайте.');
}

$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
if (!isSiteUrl($origin)) {
    respond(403, false, 'Отправьте заявку через форму на сайте.');
}

if (stripos((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json') !== 0) {
    respond(415, false, 'Отправьте заявку через форму на сайте.');
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

if (($data['consent'] ?? false) !== true) {
    respond(422, false, 'Чтобы отправить заявку, подтвердите согласие на обработку персональных данных.');
}

$ip = clientIp();
claimSlot($ip);

$safeSource = filter_var($source, FILTER_VALIDATE_URL) && isSiteUrl($source) ? $source : 'absolutkuban.ru';
$relayPayload = json_encode([
    'Имя' => $name,
    'Телефон' => $phone,
    'Комментарий' => $message !== '' ? $message : 'не указан',
    'Источник' => $safeSource,
    'Согласие на обработку ПДн' => 'дано ' . date('d.m.Y H:i'),
    '_subject' => 'Заявка с сайта ООО АБСОЛЮТ',
    '_template' => 'table',
    '_captcha' => 'false',
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if ($relayPayload === false || !function_exists('curl_init')) {
    releaseIpSlot($ip);
    respond(500, false, 'Сервис отправки временно недоступен. Позвоните нам или напишите на рабочую почту.');
}

$curl = curl_init('https://formsubmit.co/ajax/absolut-projekt@mail.ru');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $relayPayload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
        'Origin: https://absolutkuban.ru',
        'Referer: https://absolutkuban.ru/',
    ],
]);

$relayResponse = curl_exec($curl);
$relayStatus = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);
$relayResult = is_string($relayResponse) ? json_decode($relayResponse, true) : null;

if (
    $relayStatus < 200 ||
    $relayStatus >= 300 ||
    !is_array($relayResult) ||
    ($relayResult['success'] ?? false) === false ||
    ($relayResult['success'] ?? '') === 'false'
) {
    releaseIpSlot($ip);
    respond(502, false, 'Не удалось отправить заявку. Попробуйте ещё раз или напишите нам на рабочую почту.');
}

respond(200, true, 'Заявка направлена');
