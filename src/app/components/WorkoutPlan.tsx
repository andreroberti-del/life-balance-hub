import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Dumbbell,
  Clock,
  Zap,
  ChevronRight,
  X,
  Check,
  Play,
  Info,
  TrendingUp
} from 'lucide-react';

// Mock workout plan data
const mockWorkoutPlan = {
  monday: {
    name_pt: 'Peito & Tr\u00EDceps',
    name_en: 'Chest & Triceps',
    name_es: 'Pecho & Tr\u00EDceps',
    emoji: '\u{1F4AA}',
    duration: '60 min',
    exercises: [
      {
        id: 1,
        name_pt: 'Supino Reto com Barra',
        name_en: 'Barbell Bench Press',
        name_es: 'Press de Banca com Barra',
        sets: 4,
        reps: '8-12',
        rest: '90s',
        weight: '40-50kg',
        difficulty: 'intermediate',
        muscleGroup_pt: 'Peito',
        muscleGroup_en: 'Chest',
        muscleGroup_es: 'Pecho',
        gifUrl: 'https://v2.exercisedb.io/image/R8elY-EsRy-yqy',
        instructions_pt: [
          'Deite-se no banco com os p\u00E9s firmes no ch\u00E3o',
          'Segure a barra com as m\u00E3os um pouco mais abertas que a largura dos ombros',
          'Des\u00E7a a barra controladamente at\u00E9 o peito',
          'Empurre a barra de volta at\u00E9 a posi\u00E7\u00E3o inicial',
          'Mantenha as esc\u00E1pulas retra\u00EDdas durante todo o movimento'
        ],
        instructions_en: [
          'Lie down on the bench with feet firmly on the floor',
          'Grip the bar slightly wider than shoulder-width',
          'Lower the bar in a controlled manner to your chest',
          'Push the bar back to starting position',
          'Keep shoulder blades retracted throughout the movement'
        ],
        instructions_es: [
          'Acu\u00E9stese en el banco con los pies firmes en el suelo',
          'Agarre la barra un poco mais ancha que el ancho de los hombros',
          'Baje la barra de manera controlada hasta el pecho',
          'Empuje la barra de regreso a la posici\u00F3n inicial',
          'Mantenga los om\u00F3platos retra\u00EDdos durante todo el movimiento'
        ],
        tips_pt: 'Mantenha os cotovelos a 45\u00B0 do corpo para proteger os ombros',
        tips_en: 'Keep elbows at 45\u00B0 from body to protect shoulders',
        tips_es: 'Mantenga los codos a 45\u00B0 del cuerpo para proteger los hombros',
      },
      {
        id: 2,
        name_pt: 'Supino Inclinado com Halteres',
        name_en: 'Incline Dumbbell Press',
        name_es: 'Press Inclinado con Mancuernas',
        sets: 3,
        reps: '10-15',
        rest: '75s',
        weight: '15-20kg',
        difficulty: 'beginner',
        muscleGroup_pt: 'Peito Superior',
        muscleGroup_en: 'Upper Chest',
        muscleGroup_es: 'Pecho Superior',
        gifUrl: 'https://v2.exercisedb.io/image/ewQs-40jHCXGMT',
        instructions_pt: [
          'Ajuste o banco para 30-45 graus de inclina\u00E7\u00E3o',
          'Segure os halteres com as palmas voltadas para frente',
          'Empurre os halteres para cima at\u00E9 quase tocar no topo',
          'Des\u00E7a controladamente at\u00E9 sentir alongamento no peito',
          'Mantenha os p\u00E9s firmes no ch\u00E3o'
        ],
        instructions_en: [
          'Set bench to 30-45 degrees incline',
          'Hold dumbbells with palms facing forward',
          'Push dumbbells up until they almost touch at the top',
          'Lower in a controlled manner until feeling stretch in chest',
          'Keep feet firmly planted on floor'
        ],
        instructions_es: [
          'Ajuste el banco a 30-45 grados de inclinaci\u00F3n',
          'Sostenga las mancuernas con las palmas hacia adelante',
          'Empuje las mancuernas hacia arriba hasta que casi se toquen en la parte superior',
          'Baje de manera controlada hasta sentir estiramiento en el pecho',
          'Mantenga los pies firmes en el suelo'
        ],
        tips_pt: 'Foque na contra\u00E7\u00E3o do peito superior no topo do movimento',
        tips_en: 'Focus on upper chest contraction at top of movement',
        tips_es: 'Enf\u00F3quese en la contracci\u00F3n del peito superior en la parte superior del movimiento',
      },
      {
        id: 3,
        name_pt: 'Crucifixo com Halteres',
        name_en: 'Dumbbell Flyes',
        name_es: 'Aperturas con Mancuernas',
        sets: 3,
        reps: '12-15',
        rest: '60s',
        weight: '10-15kg',
        difficulty: 'beginner',
        muscleGroup_pt: 'Peito',
        muscleGroup_en: 'Chest',
        muscleGroup_es: 'Pecho',
        gifUrl: 'https://v2.exercisedb.io/image/-rCLjBLxC4QMrT',
        instructions_pt: [
          'Deite-se no banco com halteres acima do peito',
          'Abra os bra\u00E7os em arco, mantendo leve flex\u00E3o nos cotovelos',
          'Des\u00E7a at\u00E9 sentir alongamento no peito',
          'Retorne \u00E0 posi\u00E7\u00E3o inicial contraindo o peito',
          'Mantenha o movimento controlado'
        ],
        instructions_en: [
          'Lie on bench with dumbbells above chest',
          'Open arms in an arc, maintaining slight elbow bend',
          'Lower until feeling chest stretch',
          'Return to starting position by contracting chest',
          'Keep movement controlled'
        ],
        instructions_es: [
          'Acu\u00E9stese en el banco con mancuernas sobre el pecho',
          'Abra los brazos en arco, manteniendo ligera flexi\u00F3n en los codos',
          'Baje hasta sentir estiramiento en el pecho',
          'Vuelva a la posici\u00F3n inicial contrayendo el pecho',
          'Mantenga el movimiento controlado'
        ],
        tips_pt: 'N\u00E3o estenda completamente os cotovelos para proteger as articula\u00E7\u00F5es',
        tips_en: 'Don\'t fully extend elbows to protect joints',
        tips_es: 'No extienda completamente los codos para proteger las articulaciones',
      },
      {
        id: 4,
        name_pt: 'Tr\u00EDceps Pulley',
        name_en: 'Cable Triceps Pushdown',
        name_es: 'Extensi\u00F3n de Tr\u00EDceps en Polea',
        sets: 3,
        reps: '12-15',
        rest: '60s',
        weight: '20-30kg',
        difficulty: 'beginner',
        muscleGroup_pt: 'Tr\u00EDceps',
        muscleGroup_en: 'Triceps',
        muscleGroup_es: 'Tr\u00EDceps',
        gifUrl: 'https://v2.exercisedb.io/image/L3TskkPHDGVzUn',
        instructions_pt: [
          'Fique de frente para a polia alta',
          'Segure a barra com pegada pronada (palmas para baixo)',
          'Mantenha cotovelos fixos ao lado do corpo',
          'Empurre a barra para baixo at\u00E9 extens\u00E3o completa',
          'Retorne controladamente \u00E0 posi\u00E7\u00E3o inicial'
        ],
        instructions_en: [
          'Stand facing high pulley',
          'Grip bar with overhand grip (palms down)',
          'Keep elbows fixed at sides',
          'Push bar down until full extension',
          'Return to starting position in controlled manner'
        ],
        instructions_es: [
          'P\u00E1rese frente a la polea alta',
          'Agarre la barra con agarre prono (palmas hacia abajo)',
          'Mantenga los codos fijos a los lados del cuerpo',
          'Empuje la barra hacia abajo hasta la extensi\u00F3n completa',
          'Regrese de manera controlada a la posici\u00F3n inicial'
        ],
        tips_pt: 'Mantenha os cotovelos im\u00F3veis - apenas o antebra\u00E7o deve se mover',
        tips_en: 'Keep elbows stationary - only forearm should move',
        tips_es: 'Mantenga los codos inm\u00F3viles - solo el antebrazo debe moverse',
      }
    ]
  },
  wednesday: {
    name_pt: 'Costas & B\u00EDceps',
    name_en: 'Back & Biceps',
    name_es: 'Espalda & B\u00EDceps',
    emoji: '\u{1F525}',
    duration: '65 min',
    exercises: [
      {
        id: 5,
        name_pt: 'Barra Fixa',
        name_en: 'Pull-ups',
        name_es: 'Dominadas',
        sets: 3,
        reps: '8-12',
        rest: '90s',
        weight: 'Peso corporal',
        difficulty: 'advanced',
        muscleGroup_pt: 'Costas',
        muscleGroup_en: 'Back',
        muscleGroup_es: 'Espalda',
        gifUrl: 'https://v2.exercisedb.io/image/MnHFBW4xLLn2wy',
        instructions_pt: [
          'Segure a barra com pegada pronada, m\u00E3os na largura dos ombros',
          'Puxe o corpo para cima at\u00E9 o queixo passar da barra',
          'Des\u00E7a controladamente at\u00E9 extens\u00E3o completa',
          'Mantenha o core ativado durante todo movimento',
          'Evite balan\u00E7ar o corpo'
        ],
        instructions_en: [
          'Grip bar with overhand grip, hands shoulder-width apart',
          'Pull body up until chin passes bar',
          'Lower in controlled manner to full extension',
          'Keep core engaged throughout movement',
          'Avoid swinging body'
        ],
        instructions_es: [
          'Agarre la barra con agarre prono, manos al ancho de los hombros',
          'Tire del cuerpo hacia arriba hasta que la barbilla pase la barra',
          'Baje de manera controlada hasta la extensi\u00F3n completa',
          'Mantenga el core activado durante todo el movimiento',
          'Evite balancear el cuerpo'
        ],
        tips_pt: 'Se n\u00E3o conseguir, use el\u00E1stico ou m\u00E1quina assistida',
        tips_en: 'If unable, use resistance band or assisted machine',
        tips_es: 'Si no puede, use banda el\u00E1stica o m\u00E1quina asistida',
      }
    ]
  },
  friday: {
    name_pt: 'Pernas & Ombros',
    name_en: 'Legs & Shoulders',
    name_es: 'Piernas & Hombros',
    emoji: '\u{1F9B5}',
    duration: '70 min',
    exercises: [
      {
        id: 10,
        name_pt: 'Agachamento Livre',
        name_en: 'Barbell Squat',
        name_es: 'Sentadilla con Barra',
        sets: 4,
        reps: '8-12',
        rest: '120s',
        weight: '50-70kg',
        difficulty: 'intermediate',
        muscleGroup_pt: 'Pernas',
        muscleGroup_en: 'Legs',
        muscleGroup_es: 'Piernas',
        gifUrl: 'https://v2.exercisedb.io/image/lW5qDkBf1L6VLE',
        instructions_pt: [
          'Posicione a barra nas costas (trap\u00E9zio)',
          'P\u00E9s na largura dos ombros, dedos levemente para fora',
          'Des\u00E7a at\u00E9 coxas paralelas ao ch\u00E3o',
          'Mantenha o peito erguido e olhar para frente',
          'Empurre pelos calcanhares para subir'
        ],
        instructions_en: [
          'Position bar on upper back (traps)',
          'Feet shoulder-width apart, toes slightly out',
          'Lower until thighs parallel to floor',
          'Keep chest up and eyes forward',
          'Push through heels to rise'
        ],
        instructions_es: [
          'Posicione la barra en la parte superior de la espalda (trapecios)',
          'Pies al ancho de los hombros, dedos ligeramente hacia afuera',
          'Baje hasta que los muslos est\u00E9n paralelos al suelo',
          'Mantenga el pecho erguido y la mirada al frente',
          'Empuje a trav\u00E9s de los talones para subir'
        ],
        tips_pt: 'Joelhos devem acompanhar a linha dos p\u00E9s - nunca para dentro',
        tips_en: 'Knees should track in line with toes - never inward',
        tips_es: 'Las rodillas deben seguir la l\u00EDnea de los pies - nunca hacia adentro',
      }
    ]
  }
};

interface Exercise {
  id: number;
  name_pt: string;
  name_en: string;
  name_es: string;
  sets: number;
  reps: string;
  rest: string;
  weight: string;
  difficulty: string;
  muscleGroup_pt: string;
  muscleGroup_en: string;
  muscleGroup_es: string;
  gifUrl: string;
  instructions_pt: string[];
  instructions_en: string[];
  instructions_es: string[];
  tips_pt: string;
  tips_en: string;
  tips_es: string;
}

interface WorkoutDay {
  name_pt: string;
  name_en: string;
  name_es: string;
  emoji: string;
  duration: string;
  exercises: Exercise[];
}

export function WorkoutPlan() {
  const { t, language } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  // Safe access to translation keys with fallbacks
  const tWorkout = (t as any)?.workout || {};

  const toggleExerciseComplete = (exerciseId: number) => {
    if (completedExercises.includes(exerciseId)) {
      setCompletedExercises(completedExercises.filter(id => id !== exerciseId));
    } else {
      setCompletedExercises([...completedExercises, exerciseId]);
    }
  };

  const getExerciseName = (exercise: Exercise) => {
    return language === 'pt' ? exercise.name_pt : language === 'es' ? exercise.name_es : exercise.name_en;
  };

  const getMuscleGroup = (exercise: Exercise) => {
    return language === 'pt' ? exercise.muscleGroup_pt : language === 'es' ? exercise.muscleGroup_es : exercise.muscleGroup_en;
  };

  const getInstructions = (exercise: Exercise) => {
    return language === 'pt' ? exercise.instructions_pt : language === 'es' ? exercise.instructions_es : exercise.instructions_en;
  };

  const getTips = (exercise: Exercise) => {
    return language === 'pt' ? exercise.tips_pt : language === 'es' ? exercise.tips_es : exercise.tips_en;
  };

  const getDayName = (day: WorkoutDay) => {
    return language === 'pt' ? day.name_pt : language === 'es' ? day.name_es : day.name_en;
  };

  const workoutDays = [
    { key: 'monday', day_pt: 'Segunda', day_en: 'Monday', day_es: 'Lunes', data: mockWorkoutPlan.monday },
    { key: 'wednesday', day_pt: 'Quarta', day_en: 'Wednesday', day_es: 'Mi\u00E9rcoles', data: mockWorkoutPlan.wednesday },
    { key: 'friday', day_pt: 'Sexta', day_en: 'Friday', day_es: 'Viernes', data: mockWorkoutPlan.friday },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">{tWorkout.myWorkoutPlan || 'My Workout Plan'}</h2>
          <p className="text-sm text-gray-500">{tWorkout.generatedByZeno || 'Generated by ZENO AI'}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#D4FF00] text-[#1a1a1a] rounded-xl font-semibold hover:opacity-90 transition-all">
          <Zap className="w-4 h-4" />
          <span>{tWorkout.regeneratePlan || 'Regenerate Plan'}</span>
        </button>
      </div>

      {/* Workout Days Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {workoutDays.map((workout) => {
          const dayLabel = language === 'pt' ? workout.day_pt : language === 'es' ? workout.day_es : workout.day_en;
          const completedCount = workout.data.exercises.filter(ex => completedExercises.includes(ex.id)).length;
          const totalCount = workout.data.exercises.length;
          const progress = (completedCount / totalCount) * 100;

          return (
            <button
              key={workout.key}
              onClick={() => setSelectedDay(workout.data as unknown as WorkoutDay)}
              className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#D4FF00] transition-all hover:scale-105 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{workout.data.emoji}</div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#D4FF00] transition-colors" />
              </div>

              <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">{dayLabel}</h3>
              <p className="text-sm font-semibold text-gray-700 mb-3">{getDayName(workout.data as unknown as WorkoutDay)}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-3 h-3" />
                  <span>{workout.data.exercises.length} {tWorkout.exercises || 'exercises'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{workout.data.duration}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{tWorkout.progress || 'Progress'}</span>
                  <span className="font-bold text-[#D4FF00]">{completedCount}/{totalCount}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4FF00] to-[#a8cc00] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedDay.emoji}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a]">{getDayName(selectedDay)}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Dumbbell className="w-4 h-4" />
                        <span>{selectedDay.exercises.length} {tWorkout.exercises || 'exercises'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedDay.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {selectedDay.exercises.map((exercise, index) => {
                  const isCompleted = completedExercises.includes(exercise.id);

                  return (
                    <div
                      key={exercise.id}
                      className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 transition-all ${
                        isCompleted ? 'border-[#D4FF00] bg-[#D4FF00]/5' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 bg-[#1a1a1a] text-white rounded-xl flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">{getExerciseName(exercise)}</h3>
                            <p className="text-sm text-gray-500 mb-3">{getMuscleGroup(exercise)}</p>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-white rounded-xl p-3 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">{tWorkout.sets || 'Sets'}</p>
                                <p className="text-lg font-bold text-[#1a1a1a]">{exercise.sets}</p>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">{tWorkout.reps || 'Reps'}</p>
                                <p className="text-lg font-bold text-[#1a1a1a]">{exercise.reps}</p>
                              </div>
                              <div className="bg-white rounded-xl p-3 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">{tWorkout.rest || 'Rest'}</p>
                                <p className="text-lg font-bold text-[#1a1a1a]">{exercise.rest}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleExerciseComplete(exercise.id)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                              isCompleted ? 'bg-[#D4FF00] text-[#1a1a1a]' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setSelectedExercise(exercise)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Quick weight suggestion */}
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-[#D4FF00]" />
                        <span className="text-gray-600">{tWorkout.suggestedWeight || 'Suggested weight'}: <strong className="text-[#1a1a1a]">{exercise.weight}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#D4FF00] to-[#a8cc00] text-[#1a1a1a] rounded-xl font-bold hover:opacity-90 transition-all">
                <Play className="w-5 h-5" />
                <span>{tWorkout.startWorkout || 'Start Workout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">{getExerciseName(selectedExercise)}</h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* GIF Demonstration - Large and Prominent */}
              {selectedExercise.gifUrl && (
                <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-200 shadow-lg">
                  <img
                    src={selectedExercise.gifUrl}
                    alt={getExerciseName(selectedExercise)}
                    className="w-full h-auto object-contain"
                    style={{ minHeight: '320px', maxHeight: '400px' }}
                    onError={(e) => {
                      // Fallback if GIF fails to load - show placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-80 flex items-center justify-center"><div class="text-center"><svg class="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class="text-gray-500 text-sm">GIF de demonstra\u00E7\u00E3o em breve</p></div></div>';
                      }
                    }}
                  />
                </div>
              )}

              {/* Muscle Group & Difficulty */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold">
                  {getMuscleGroup(selectedExercise)}
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  selectedExercise.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  selectedExercise.difficulty === 'intermediate' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {tWorkout[selectedExercise.difficulty as 'beginner' | 'intermediate' | 'advanced'] || selectedExercise.difficulty}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">{tWorkout.howToDo || 'How to Do'}</h3>
                <ol className="space-y-3">
                  {getInstructions(selectedExercise).map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#D4FF00] rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#1a1a1a]">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-0.5">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* ZENO Tips */}
              <div className="bg-gradient-to-r from-[#D4FF00]/20 to-[#a8cc00]/20 rounded-2xl p-6 border-2 border-[#D4FF00]">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-[#1a1a1a] flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">{tWorkout.zenoTip || 'ZENO Tip'}</h3>
                    <p className="text-sm text-gray-700">{getTips(selectedExercise)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
