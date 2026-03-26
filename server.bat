@echo off
cd /d "%~dp0"
echo Iniciando servidor en http://localhost:8000
echo Presiona Ctrl+C para detener
powershell -Command "& {$null = [System.Reflection.Assembly]::LoadWithPartialName('System.Net.HttpListener'); $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); $listener.Start(); Write-Host 'Servidor escuchando en http://localhost:8000'; while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $filePath = '%cd%' + $request.RawUrl.Replace('/', '\'); if ([System.IO.File]::Exists($filePath)) { $content = [System.IO.File]::ReadAllBytes($filePath); $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length); } else { $response.StatusCode = 404; } $response.OutputStream.Close(); } }"
pause
