@echo off
echo Starting Canva Clone Services...

echo.
echo Starting API Gateway on port 5000...
start cmd /k "cd /d server\api-gateway && npm run dev"

timeout /t 3 >nul

echo Starting Design Service on port 5001...
start cmd /k "cd /d server\design-service && npm run dev"

timeout /t 3 >nul

echo Starting Upload Service on port 5002...
start cmd /k "cd /d server\upload-service && npm run dev"

timeout /t 3 >nul

echo Starting Subscription Service on port 5003...
start cmd /k "cd /d server\subscription-service && npm run dev"

timeout /t 3 >nul

echo Starting Client on port 3000...
start cmd /k "cd /d client && npm run dev"

echo.
echo All services are starting...
echo Frontend: http://localhost:3000
echo API Gateway: http://localhost:5000
echo.
pause
