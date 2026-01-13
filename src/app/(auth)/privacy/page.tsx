import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/signup">
          <Button variant="ghost" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            العودة للتسجيل
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">سياسة الخصوصية - SmartEdu</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none space-y-4 text-right" dir="rtl">
          <section>
            <h3 className="text-xl font-semibold mb-2">1. مقدمة</h3>
            <p>نحن في منصة SmartEdu نولي أهمية قصوى لخصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدامك للمنصة.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">2. المعلومات التي نجمعها</h3>
            <ul className="list-disc list-inside mr-4">
              <li><strong>معلومات الحساب:</strong> الاسم، البريد الإلكتروني، كلمة المرور (مشفرة)، والدور (طالب، معلم، ولي أمر).</li>
              <li><strong>المعلومات التعليمية:</strong> الدرجات، التقدم الدراسي، الإجابات على التمارين، والملاحظات.</li>
              <li><strong>معلومات الاستخدام:</strong> سجلات الدخول، والنشاطات داخل المنصة لتحسين تجربة المستخدم.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">3. كيف نستخدم معلوماتك</h3>
            <p>نستخدم المعلومات للأغراض التالية:</p>
            <ul className="list-disc list-inside mr-4">
              <li>تقديم الخدمات التعليمية وإدارة الحسابات.</li>
              <li>متابعة تقدم الطلاب وإعداد التقارير لأولياء الأمور والمعلمين.</li>
              <li>تحسين أداء المنصة وتطوير محتوى تعليمي أفضل.</li>
              <li>التواصل معك بخصوص التحديثات أو الإشعارات المهمة.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">4. مشاركة البيانات</h3>
            <p>نحن لا نبيع بياناتك الشخصية لأطراف ثالثة. تتم مشاركة البيانات فقط في الحالات التالية:</p>
            <ul className="list-disc list-inside mr-4">
              <li><strong>داخل المنظومة التعليمية:</strong> مشاركة نتائج الطالب مع ولي أمره ومعلميه المرتبطين به.</li>
              <li><strong>الامتثال القانوني:</strong> إذا طلب منا ذلك بموجب القانون أو لحماية حقوقنا.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">5. أمن البيانات</h3>
            <p>نطبق إجراءات أمنية تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">6. حقوقك</h3>
            <p>لديك الحق في الوصول إلى بياناتك الشخصية، وتصحيحها، أو طلب حذفها (مع مراعاة المتطلبات التعليمية والقانونية للاحتفاظ بالسجلات).</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">7. ملفات تعريف الارتباط (Cookies)</h3>
            <p>نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح والحفاظ على جلسة تسجيل الدخول الخاصة بك.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">8. التغييرات على سياسة الخصوصية</h3>
            <p>قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم إشعارك بأي تغييرات جوهرية عبر المنصة.</p>
          </section>

          <div className="pt-6 border-t mt-6">
            <p className="text-sm text-muted-foreground text-center">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
