# 🚀 سكربت لإنشاء backup مناسب لـ Railway
# هذا الملف يصدر البيانات فقط بدون CREATE DATABASE

Write-Host "🔄 جاري إنشاء backup للرفع على Railway..." -ForegroundColor Cyan

# المتغيرات
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"
$dbName = "smartedu"
$outputFile = "railway_import.sql"

# التحقق من وجود mysqldump
if (-not (Test-Path $mysqlPath)) {
    Write-Host "❌ خطأ: لم يتم العثور على mysqldump في المسار:" -ForegroundColor Red
    Write-Host $mysqlPath -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 ابحث عن mysqldump.exe في:" -ForegroundColor Cyan
    Write-Host "   C:\Program Files\MySQL\MySQL Server X.X\bin\" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ تم العثور على mysqldump" -ForegroundColor Green
Write-Host ""

# إنشاء الـ backup
Write-Host "📦 إنشاء backup من قاعدة البيانات: $dbName" -ForegroundColor Cyan
Write-Host "📝 سيتم حفظه في: $outputFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  أدخل كلمة مرور MySQL عندما يُطلب منك..." -ForegroundColor Yellow
Write-Host ""

try {
    # تصدير البيانات فقط بدون CREATE DATABASE
    & $mysqlPath `
        -u root `
        -p `
        --no-create-db `
        --skip-add-drop-table `
        --skip-comments `
        --compact `
        $dbName | Out-File -Encoding UTF8 $outputFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ تم إنشاء الـ backup بنجاح!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📄 الملف: $outputFile" -ForegroundColor Cyan
        
        # حجم الملف
        $fileSize = (Get-Item $outputFile).Length
        $fileSizeKB = [math]::Round($fileSize / 1KB, 2)
        $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
        
        if ($fileSizeMB -gt 1) {
            Write-Host "📊 الحجم: $fileSizeMB MB" -ForegroundColor Yellow
        } else {
            Write-Host "📊 الحجم: $fileSizeKB KB" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "🚀 الخطوات التالية:" -ForegroundColor Green
        Write-Host "1. أضف MySQL في Railway Dashboard" -ForegroundColor White
        Write-Host "2. احصل على بيانات الاتصال (MYSQL_URL)" -ForegroundColor White
        Write-Host "3. استورد البيانات باستخدام:" -ForegroundColor White
        Write-Host ""
        Write-Host '   mysql -h HOST -P PORT -u USER -pPASSWORD DATABASE < railway_import.sql' -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📖 راجع: RAILWAY_DATABASE_SETUP.md للتفاصيل" -ForegroundColor Yellow
        
    } else {
        Write-Host ""
        Write-Host "❌ فشل إنشاء الـ backup!" -ForegroundColor Red
        Write-Host "🔍 تحقق من:" -ForegroundColor Yellow
        Write-Host "   - اسم المستخدم وكلمة المرور صحيحة" -ForegroundColor White
        Write-Host "   - اسم قاعدة البيانات صحيح: $dbName" -ForegroundColor White
        Write-Host "   - MySQL Server يعمل" -ForegroundColor White
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ خطأ: $_" -ForegroundColor Red
}

Write-Host ""
