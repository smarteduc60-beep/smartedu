# 🚀 سكربت لاستيراد البيانات إلى Railway MySQL
# تأكد من تشغيل create-railway-backup.ps1 أولاً

Write-Host "🚀 استيراد البيانات إلى Railway MySQL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# التحقق من وجود ملف الـ backup
$backupFile = "railway_import.sql"
if (-not (Test-Path $backupFile)) {
    Write-Host "❌ خطأ: لم يتم العثور على ملف: $backupFile" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 شغّل أولاً:" -ForegroundColor Yellow
    Write-Host "   .\create-railway-backup.ps1" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "✅ تم العثور على ملف الـ backup" -ForegroundColor Green
Write-Host ""

# طلب بيانات Railway
Write-Host "📋 أدخل بيانات MySQL من Railway Dashboard:" -ForegroundColor Yellow
Write-Host "(يمكنك نسخها من Railway → MySQL → Connect)" -ForegroundColor Gray
Write-Host ""

$mysqlHost = Read-Host "🌐 MYSQLHOST (e.g., containers-us-west-xxx.railway.app)"
$mysqlPort = Read-Host "🔌 MYSQLPORT (e.g., 6379)"
$mysqlUser = Read-Host "👤 MYSQLUSER (عادة: root)"
$mysqlPassword = Read-Host "🔑 MYSQLPASSWORD" -AsSecureString
$mysqlDatabase = Read-Host "💾 MYSQLDATABASE (عادة: railway)"

# تحويل SecureString إلى نص
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword)
)

Write-Host ""
Write-Host "🔍 التحقق من البيانات..." -ForegroundColor Cyan

# التحقق من أن جميع الحقول مملوءة
if ([string]::IsNullOrWhiteSpace($mysqlHost) -or 
    [string]::IsNullOrWhiteSpace($mysqlPort) -or 
    [string]::IsNullOrWhiteSpace($mysqlUser) -or 
    [string]::IsNullOrWhiteSpace($mysqlPasswordPlain) -or 
    [string]::IsNullOrWhiteSpace($mysqlDatabase)) {
    
    Write-Host "❌ خطأ: جميع الحقول مطلوبة!" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "✅ البيانات كاملة" -ForegroundColor Green
Write-Host ""

# مسار mysql.exe
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

# التحقق من وجود mysql
if (-not (Test-Path $mysqlPath)) {
    Write-Host "❌ خطأ: لم يتم العثور على mysql.exe" -ForegroundColor Red
    Write-Host "📝 ابحث عنه في:" -ForegroundColor Yellow
    Write-Host "   C:\Program Files\MySQL\MySQL Server X.X\bin\mysql.exe" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ تم العثور على mysql.exe" -ForegroundColor Green
Write-Host ""

# عرض ملخص
Write-Host "📊 ملخص الاستيراد:" -ForegroundColor Cyan
Write-Host "  🌐 Host: $mysqlHost" -ForegroundColor White
Write-Host "  🔌 Port: $mysqlPort" -ForegroundColor White
Write-Host "  👤 User: $mysqlUser" -ForegroundColor White
Write-Host "  💾 Database: $mysqlDatabase" -ForegroundColor White
Write-Host "  📄 File: $backupFile" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "✅ هل تريد المتابعة؟ (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y" -and $confirm -ne "yes") {
    Write-Host "❌ تم الإلغاء" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚀 جاري الاستيراد..." -ForegroundColor Cyan
Write-Host "⏳ قد يستغرق هذا عدة دقائق..." -ForegroundColor Yellow
Write-Host ""

try {
    # تنفيذ الاستيراد
    $command = "& `"$mysqlPath`" -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPasswordPlain $mysqlDatabase"
    
    Get-Content $backupFile | & $mysqlPath `
        -h $mysqlHost `
        -P $mysqlPort `
        -u $mysqlUser `
        -p"$mysqlPasswordPlain" `
        $mysqlDatabase
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ تم استيراد البيانات بنجاح!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 التالي:" -ForegroundColor Cyan
        Write-Host "1. تحقق من البيانات في Railway Dashboard" -ForegroundColor White
        Write-Host "2. حدّث DATABASE_URL في Railway Variables:" -ForegroundColor White
        Write-Host "   DATABASE_URL=`${MYSQL_URL}" -ForegroundColor Cyan
        Write-Host "3. أعد deploy المشروع" -ForegroundColor White
        Write-Host ""
        
    } else {
        Write-Host ""
        Write-Host "❌ فشل الاستيراد!" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔍 تحقق من:" -ForegroundColor Yellow
        Write-Host "   - بيانات الاتصال صحيحة" -ForegroundColor White
        Write-Host "   - قاعدة البيانات موجودة في Railway" -ForegroundColor White
        Write-Host "   - الاتصال بالإنترنت مستقر" -ForegroundColor White
        Write-Host ""
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ خطأ: $_" -ForegroundColor Red
    Write-Host ""
}

Write-Host ""
