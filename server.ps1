$port = 8081
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Servidor ejecutándose en http://localhost:$port"
Write-Host "Abre tu navegador en esa dirección"
Write-Host "Presiona Ctrl+C para detener"

$dir = "c:\Users\HP PREMIUM\Desktop\app nuba"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $filePath = $request.Url.LocalPath
        if ($filePath -eq "/api/state") {
            $stateFile = Join-Path $dir "state.json"
            if ($request.HttpMethod -eq "GET") {
                if (Test-Path $stateFile) {
                    $json = Get-Content $stateFile -Raw
                } else {
                    $json = "{}"
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json"
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.StatusCode = 200
            } elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream)
                $body = $reader.ReadToEnd()
                Set-Content -Path $stateFile -Value $body -Encoding UTF8
                $response.StatusCode = 200
                $response.OutputStream.Write([System.Text.Encoding]::UTF8.GetBytes("OK"), 0, 2)
            } else {
                $response.StatusCode = 405
                $response.OutputStream.Write([System.Text.Encoding]::UTF8.GetBytes("405"), 0, 3)
            }
            $response.OutputStream.Close()
            continue
        }

        if ($filePath -eq "/" -or $filePath -eq "") {
            $filePath = "/index.html"
        }
        $fullPath = Join-Path $dir $filePath.Replace("/", "\")
        if (Test-Path $fullPath) {
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            $ext = [System.IO.Path]::GetExtension($fullPath)
            $mimeTypes = @{
                ".html" = "text/html"
                ".js" = "text/javascript"
                ".css" = "text/css"
                ".json" = "application/json"
            }
            $contentType = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { "text/plain" }
            $response.ContentType = $contentType
            $response.OutputStream.Write($content, 0, $content.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $response.OutputStream.Write([System.Text.Encoding]::UTF8.GetBytes("404"), 0, 3)
        }
        $response.OutputStream.Close()
    } catch {
        Write-Host "Error: $_"
    }
}

$listener.Stop()
