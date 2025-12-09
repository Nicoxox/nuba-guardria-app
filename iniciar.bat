@echo off
REM Inicia un servidor HTTP simple usando Python
cd /d "%~dp0"
echo Iniciando servidor en http://localhost:8000
echo.
echo Abre tu navegador y ve a http://localhost:8000
echo Presiona Ctrl+C para detener el servidor
echo.
python -m http.server 8000 --bind 127.0.0.1
pause
