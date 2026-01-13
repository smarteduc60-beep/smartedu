import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TermsPage() {
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
          <CardTitle className="text-3xl font-bold text-center">شروط استخدام منصة SmartEdu</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none space-y-4 text-right" dir="rtl">
          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 1: التعريف بالمنصة</h3>
            <p>SmartEdu هي منصة تعليمية رقمية ذكية، يملكها ويديرها مشروع فردي جزائري، تهدف إلى دعم العملية التعليمية وتسهيل متابعة التعلّم، وربط المتعلمين بأوليائهم ومعلميهم، مع الاستعانة بأدوات رقمية وأنظمة تقييم آلي ذات طابع تقويمي مساعد.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 2: نطاق التطبيق</h3>
            <p>تسري شروط الاستخدام هذه على جميع مستخدمي المنصة، بما في ذلك:</p>
            <ul className="list-disc list-inside mr-4">
              <li>الأولياء</li>
              <li>التلاميذ</li>
              <li>المعلمون</li>
              <li>المشرفون</li>
            </ul>
            <p>ويُعدّ إنشاء حساب أو الولوج إلى المنصة أو استخدام أي من خدماتها موافقة صريحة وغير مشروطة على هذه الشروط.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 3: طبيعة المنصة</h3>
            <ul className="list-disc list-inside mr-4">
              <li>المنصة ليست مؤسسة تعليمية رسمية.</li>
              <li>لا تمنح شهادات معتمدة أو قرارات تربوية رسمية.</li>
              <li>لا تُعدّ بديلاً عن التعليم الحضوري أو النظامي.</li>
              <li>الخدمات المقدّمة ذات طابع تعليمي وتقويمي مساعد فقط.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 4: إنشاء الحسابات وتحمل المسؤولية</h3>
            <ul className="list-disc list-inside mr-4">
              <li>يُنشئ الحساب شخص بالغ (ولي أو مستخدم راشد).</li>
              <li>في حال تمكين قاصر من استخدام المنصة، فإن ذلك يتم بعلم وموافقة ومسؤولية الولي الشرعي.</li>
              <li>يتحمل صاحب الحساب كامل المسؤولية القانونية عن:
                <ul className="list-[circle] list-inside mr-6 mt-1">
                  <li>إنشاء الحساب</li>
                  <li>استخدام الحساب</li>
                  <li>كل نشاط يتم عبر الحساب أو من خلال الأكواد المرتبطة به</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 5: نظام الأكواد</h3>
            <ul className="list-disc list-inside mr-4">
              <li>تتيح المنصة نظام أكواد لربط التلميذ بوليه الشرعي أو بمعلمه.</li>
              <li>يُعدّ إدخال الكود عند إنشاء الحساب أو بعده موافقة صريحة من صاحب الكود على ربط الحساب واستخدام المنصة.</li>
              <li>كل استخدام للحساب من طرف شخص مرتبط بالكود يُعدّ استخدامًا مشروعًا بعلم ومسؤولية صاحب الحساب الأصلي.</li>
              <li>في حال تبيّن وجود استخدام غير منظم أو غير مصرح به، تحتفظ المنصة بحق تعليق الحساب إلى غاية تسوية الوضع.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 6: التزامات المستخدمين</h3>
            <p>يلتزم المستخدمون بما يلي:</p>
            <ul className="list-disc list-inside mr-4">
              <li>استخدام المنصة لأغراض تعليمية فقط.</li>
              <li>احترام القوانين المعمول بها.</li>
              <li>عدم إساءة استخدام المنصة أو محتواها.</li>
              <li>عدم محاولة اختراق الأنظمة أو تعطيلها.</li>
              <li>احترام حقوق الملكية الفكرية.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 7: المحتوى والملكية الفكرية</h3>
            <ul className="list-disc list-inside mr-4">
              <li><strong>المحتوى الذي ينشئه المعلم:</strong>
                <ul className="list-[circle] list-inside mr-6 mt-1">
                  <li>يبقى ملكًا له.</li>
                  <li>له الحق في تعديله أو حذفه.</li>
                  <li>يتحمل المعلم مسؤوليته القانونية.</li>
                </ul>
              </li>
              <li><strong>المحتوى الذي ينشئه مشرفو المواد:</strong>
                <ul className="list-[circle] list-inside mr-6 mt-1">
                  <li>يُعدّ ملكًا للمنصة.</li>
                  <li>تتحمل المنصة مسؤوليته.</li>
                </ul>
              </li>
              <li>يمنع نسخ أو إعادة نشر أي محتوى دون إذن صاحبه أو إدارة المنصة.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 8: التقييم الآلي والذكاء الاصطناعي</h3>
            <p>تعتمد المنصة على أنظمة تقييم وتصحيح آلي مدعّمة بالذكاء الاصطناعي. نتائج التقييم:</p>
            <ul className="list-disc list-inside mr-4">
              <li>ذات طابع تقويمي مساعد فقط.</li>
              <li>تهدف إلى تمكين الولي من متابعة المستوى التعليمي.</li>
              <li>لا تُعدّ قرارًا تربويًا أو إداريًا نهائيًا.</li>
              <li>لا تتحمل المنصة أي مسؤولية قانونية عن الاعتماد على نتائج التقييم الآلي كمرجع رسمي.</li>
              <li>لا يتم استخدام محتوى المستخدمين أو بياناتهم في تدريب نماذج الذكاء الاصطناعي.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 9: التقويم السنوي للمنصة</h3>
            <p>تعتمد منصة SmartEdu تقويمًا سنويًا يتماشى مع السنة الدراسية المعمول بها في الجزائر. تبدأ السنة الدراسية للمنصة عادةً في 01 سبتمبر من كل سنة، وتنتهي في 30 جوان من السنة الموالية.</p>
            <p>خلال فترة نهاية السنة الدراسية، قد يتم:</p>
            <ul className="list-disc list-inside mr-4">
              <li>تعليق بعض الأنشطة التعليمية</li>
              <li>أو تقليص الخدمات</li>
              <li>أو إجراء صيانة وتحديثات تقنية</li>
            </ul>
            <p>دون أن يُعدّ ذلك إغلاقًا نهائيًا للمنصة.</p>
            <p>تحتفظ المنصة بالحسابات والبيانات، ولا يتم حذفها إلا وفق السياسات المعمول بها أو بطلب من صاحب الحساب. تحتفظ إدارة المنصة بحق تعديل تواريخ التقويم عند الاقتضاء، مع إعلام المستخدمين عبر المنصة.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 10: الاستضافة والمرحلة التجريبية</h3>
            <ul className="list-disc list-inside mr-4">
              <li>تُستضاف المنصة حاليًا على خوادم خارج الجزائر في إطار مرحلة تجريبية تقنية.</li>
              <li>قد يحدث انقطاع مؤقت للخدمة بسبب الصيانة أو التحديثات.</li>
              <li>لا تتحمل المنصة مسؤولية الأضرار الناتجة عن التوقفات التقنية المؤقتة.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 11: تعليق أو إنهاء الحساب</h3>
            <p>تحتفظ إدارة المنصة بحق:</p>
            <ul className="list-disc list-inside mr-4">
              <li>تعليق الحسابات المخالفة.</li>
              <li>حذف المحتوى غير المشروع.</li>
              <li>إنهاء الحساب نهائيًا في حال المخالفات الجسيمة أو المتكررة.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 12: حدود المسؤولية</h3>
            <ul className="list-disc list-inside mr-4">
              <li>لا تتحمل المنصة مسؤولية النتائج الدراسية أو القرارات التربوية.</li>
              <li>لا تتحمل مسؤولية أي ضرر ناتج عن سوء استخدام المنصة.</li>
              <li>يتحمل صاحب الحساب كامل المسؤولية عن استخدام القُصّر للحساب.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 13: تعديل الشروط</h3>
            <ul className="list-disc list-inside mr-4">
              <li>تحتفظ المنصة بحق تعديل شروط الاستخدام عند الاقتضاء.</li>
              <li>يُنشر أي تعديل عبر المنصة، ويُعدّ الاستخدام اللاحق موافقة عليه.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 14: القانون الواجب التطبيق</h3>
            <p>تخضع هذه الشروط لأحكام القوانين المعمول بها في الجمهورية الجزائرية الديمقراطية الشعبية، ويُختص القضاء الجزائري بالفصل في أي نزاع.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2">المادة 15: الإقرار والموافقة</h3>
            <p>يُقرّ المستخدم بما يلي: "أُقرّ بأنني قرأت هذه الشروط بتمعن، وفهمت محتواها، وأوافق عليها دون تحفظ."</p>
          </section>

          <div className="pt-6 border-t mt-6 text-center">
            <p className="font-bold text-lg">لخضر.ج</p>
            <p className="text-sm text-muted-foreground mt-2">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}