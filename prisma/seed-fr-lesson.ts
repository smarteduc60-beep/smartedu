const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding French Lesson for 1AM...');

  // 1. Create/Get Teacher
  const hashedPassword = await bcrypt.hash('password123', 10);
  const teacherRole = await prisma.role.findUnique({ where: { name: 'teacher' } });

  if (!teacherRole) throw new Error('Teacher role not found');

  const teacher = await prisma.user.upsert({
    where: { email: 'Fr.teacher.1cem@smartedu.com' },
    update: {},
    create: {
      email: 'Fr.teacher.1cem@smartedu.com',
      firstName: 'Prof',
      lastName: 'Français',
      password: hashedPassword,
      roleId: teacherRole.id,
      userDetails: {
        create: {
          teacherCode: 'FR1CEM',
        }
      }
    },
  });

  console.log(`✅ Teacher ensured: ${teacher.email}`);

  // 2. Get Subject and Level
  // البحث عن المستوى والمادة أو إنشاؤهما إذا لزم الأمر
  const levelName = 'أولى متوسط'; // 1AM
  const subjectName = 'اللغة الفرنسية';

  // البحث عن المستوى (قد يكون اسمه مختلفاً قليلاً في قاعدة البيانات، لذا نبحث بجزء من الاسم)
  let level = await prisma.level.findFirst({ where: { name: { contains: 'أولى متوسط' } } });
  // إذا لم نجد المستوى بالاسم العربي، نحاول البحث عنه بالمعرف المتوقع (3 حسب الـ seeds السابقة)
  if (!level) level = await prisma.level.findFirst({ where: { id: 3 } });
  
  let subject = await prisma.subject.findFirst({ where: { name: subjectName } });
  
  if (!level || !subject) {
      console.error('❌ Level or Subject not found. Please run main seed first.');
      return;
  }

  // ربط المادة بالمستوى
  await prisma.subject.update({
      where: { id: subject.id },
      data: {
          levels: {
              connect: { id: level.id }
          }
      }
  });

  // 3. Create Lesson
  const lessonContent = `
    <h1>Projet 1: "Afin de vivre sainement"</h1>
    <h2>Séquence 1: L'importance de se laver les mains</h2>
    
    <h3>Écran 1: Découverte</h3>
    <p><strong>Situation:</strong> Regarde l'image de l'enfant qui se lave les mains.</p>
    <blockquote>"Pourquoi je me lave les mains si souvent ?"</blockquote>
    <p><strong>Question:</strong> Toi, tu te laves les mains quand ?</p>
    <ul>
      <li>Avant de manger</li>
      <li>Après le sport</li>
      <li>Le soir</li>
    </ul>

    <h3>Écran 2: Le Texte</h3>
    <p>Le lavage des mains est une action simple. Il permet d’enlever la saleté et les microbes. Les microbes sont très petits. Ils peuvent nous rendre malades. Alors, je me lave les mains pour protéger ma santé.</p>

    <h3>Écran 3: Analyse</h3>
    <p><strong>La question:</strong> Pourquoi je me lave les mains ?</p>
    <p><strong>L'explication:</strong> Il permet d’enlever la saleté et les microbes...</p>
    <p><strong>La conclusion:</strong> Alors, je me lave les mains pour protéger ma santé.</p>
  `;

  const lesson = await prisma.lesson.create({
    data: {
      title: 'Pourquoi se laver les mains ? - لماذا نغسل أيدينا؟',
      content: lessonContent,
      subjectId: subject.id,
      levelId: level.id,
      authorId: teacher.id,
      type: 'public',
      status: 'approved',
    }
  });

  console.log(`✅ Lesson created: ${lesson.title}`);

  // 4. Create Exercises
  const exercises = [
    {
      question: 'Choisis la bonne réponse: Le lavage des mains est important pour... a) jouer. b) enlever les microbes. c) dessiner.',
      modelAnswer: 'b) enlever les microbes.',
    },
    {
      question: 'Regarde l\'image (une main sale). C\'est: a) une main sale. b) une main propre. c) un gant.',
      modelAnswer: 'a) une main sale.',
    },
    {
      question: 'Complète: On se lave les mains ______ de manger. (avant/après/avec)',
      modelAnswer: 'avant',
    },
    {
      question: 'Relie l\'action à son moment:\n- Avant de manger\n- Après être allé aux toilettes\n→ On se lave les mains',
      modelAnswer: 'Avant de manger → On se lave les mains\nAprès être allé aux toilettes → On se lave les mains',
    },
    {
      question: 'Transforme à la forme négative: "Je me lave les mains."',
      modelAnswer: 'Je ne me lave pas les mains.',
    },
    {
      question: 'Trouve l\'intrus: savon / eau / livre / serviette',
      modelAnswer: 'livre',
    },
    {
      question: 'Remets les phrases en ordre pour faire une explication:\n1. (C) Alors, je me lave les mains.\n2. (A) Les microbes peuvent rendre malade.\n3. (B) Le savon enlève les microbes.',
      modelAnswer: '2. (A) Les microbes peuvent rendre malade.\n3. (B) Le savon enlève les microbes.\n1. (C) Alors, je me lave les mains.',
    },
    {
      question: 'Trouve le nom de l\'action:\nlaver → ...\nnettoyer → ...',
      modelAnswer: 'laver → le lavage\nnettoyer → le nettoyage',
    },
    {
      question: 'Réponds par une phrase: "Quand est-ce que tu te laves les mains ?" (Utilise: Je me lave les mains...)',
      modelAnswer: 'Je me lave les mains avant le repas. (Ou toute réponse cohérente)',
    },
    {
      question: 'Cette phrase est: "Je ne me lave pas les mains avec du sable."\na) interrogative\nb) déclarative négative\nc) exclamative',
      modelAnswer: 'b) déclarative négative',
    }
  ];

  for (const [index, ex] of exercises.entries()) {
    await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        question: ex.question,
        modelAnswer: ex.modelAnswer,
        type: 'main', // All exercises are main as requested
        maxScore: 10,
        displayOrder: index + 1,
      }
    });
  }

  console.log(`✅ ${exercises.length} exercises added successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });