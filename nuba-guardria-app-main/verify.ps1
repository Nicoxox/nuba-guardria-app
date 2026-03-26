# verify.ps1 — script de verificación automática
# Lee data-export.json, crea un perro de prueba con adjunto (data URL), crea hospedaje y calcula pago (noches * tarifa)

$jsonPath = Join-Path $PSScriptRoot 'data-export.json'
$reportPath = Join-Path $PSScriptRoot 'verification-report.txt'

if (-Not (Test-Path $jsonPath)) {
  Write-Error "No se encontró data-export.json en $PSScriptRoot"
  exit 1
}

$data = Get-Content $jsonPath -Raw | ConvertFrom-Json

# Mostrar tarifa
$precioNoche = [int]$data.tarifa.precioNoche
Write-Host "Tarifa por noche: Gs $precioNoche"

# Crear perro de prueba
$testPerro = [PSCustomObject]@{
  id = ([int][double]::Parse((Get-Date -UFormat %s)))
  nombre = "PruebaBot"
  cliente = "Cliente Test"
  cliente_telefono = "000-0000"
  cliente_email = "test@example.com"
  notas = "Perro creado por script de verificación"
  etiquetas = @("test")
  tamano = "Mediano"
  adjuntos = @()
}

# Crear adjunto de imagen (data URI muy pequeña: 1x1 PNG)
$placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
$adj = [PSCustomObject]@{ id = ([int][double]::Parse((Get-Date -UFormat %s)) + 1); nombre = 'placeholder.png'; tipo='image/png'; data = $placeholder }
$testPerro.adjuntos += $adj

# Añadir perro a data (en memoria sólo)
$data.perros += $testPerro

# Crear hospedaje de prueba: desde mañana hasta pasado mañana (2 noches => noches=1 if same-day rule; script uses noches = floor(diff)
$hoy = Get-Date -Date $data.today
$desde = $hoy.AddDays(1).ToString('yyyy-MM-dd')
$hasta = $hoy.AddDays(3).ToString('yyyy-MM-dd')

# calcular noches -> floor difference in days
function Calcular-Noches($desdeStr,$hastaStr){
  $d1 = [DateTime]::Parse($desdeStr)
  $d2 = [DateTime]::Parse($hastaStr)
  $msPerDay = 24 * 60 * 60
  $diff = [Math]::Floor((($d2 - $d1).TotalSeconds) / $msPerDay)
  if ($diff -lt 1) { return 1 }
  return [int]$diff
}

$noches = Calcular-Noches $desde $hasta
$montoCalculado = $noches * $precioNoche

$newHospId = ([int][double]::Parse((Get-Date -UFormat %s)) + 10)
$newPagoId = $newHospId + 1

$newHosp = [PSCustomObject]@{
  id = $newHospId
  perroId = $testPerro.id
  habitacion = 'Prueba 1'
  desde = $desde
  hasta = $hasta
  estado = 'programado'
}

$data.hospedajes += $newHosp

$newPago = [PSCustomObject]@{
  id = $newPagoId
  perroId = $testPerro.id
  monto = $montoCalculado
  vence = $hasta
  estado = 'pendiente'
  hospedajeId = $newHospId
  notas = "Pago por hospedaje $noches noches (calculado automáticamente)"
}

$data.pagos += $newPago

# Generar reporte
$report = @()
$report += "VERIFICATION REPORT - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$report += "Tarifa por noche: Gs $precioNoche"
$report += "Perro de prueba creado: ID=$($testPerro.id), Nombre=$($testPerro.nombre), Tamano=$($testPerro.tamano)"
$report += "Adjunto añadido: $($adj.nombre) (data URL length: $($adj.data.Length))"
$report += "Hospedaje creado: ID=$newHospId, Desde=$desde, Hasta=$hasta, Noches=$noches"
$report += "Pago creado: ID=$newPagoId, Monto=$([string]::Format('Gs {0:N0}',$montoCalculado)), Vence=$hasta"

# Verificar consistencia: monto coincide con noches * tarifa?
$expected = $noches * $precioNoche
if ($expected -eq $montoCalculado) { $report += "Cálculo OK: monto coincide con noches × tarifa" } else { $report += "ERROR: monto NO coincide: esperado Gs $expected pero fue Gs $montoCalculado" }

# Guardar reporte
$report | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "Reporte de verificación generado en: $reportPath"
Write-Host "Resumen:"
$report | ForEach-Object { Write-Host $_ }

# Además actualizar un archivo JSON de salida con el nuevo estado (opcional)
$outJson = Join-Path $PSScriptRoot 'data-export-with-test.json'
$data | ConvertTo-Json -Depth 10 | Out-File -FilePath $outJson -Encoding UTF8
Write-Host "Estado con test exportado a: $outJson"
