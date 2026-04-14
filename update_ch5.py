with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

# ─── 1. Insert WorkoutProgramSelector before LessonView ───────────────────────
ws_comp = r"""// ── Workout Program Selector ─────────────────────────────────────────────────
const WorkoutProgramSelector = ({ programs }) => {
  const [selected, setSelected] = useState(null);
  const prog = programs.find(p => p.id === selected);
  const boldify = (t) => t.replace(/\*\*(.+?)\*\*/g, '<strong class="text-neutral-200">$1</strong>');

  if (!selected) {
    return (
      <div className="my-4 space-y-3">
        {programs.map(p => (
          <button key={p.id} onClick={() => setSelected(p.id)}
            className="w-full bg-[#1A1A1A] border border-white/10 hover:border-orange-500/30 rounded-xl p-4 text-left flex items-center justify-between group transition-all duration-200">
            <div>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-0.5">{p.title}</p>
              <p className="text-white font-semibold text-sm">{p.subtitle}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-orange-500 transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="my-4">
      <button onClick={() => setSelected(null)}
        className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-5 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Kembali ke pilihan program
      </button>
      <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">{prog.title}</p>
      <h3 className="text-white font-bold text-lg mb-5">{prog.subtitle}</h3>

      <div className="rounded-xl overflow-x-auto border border-white/10">
        <table className="w-full text-xs min-w-[520px]">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-3 py-2.5 text-left text-neutral-400 font-semibold uppercase tracking-wider w-36">Day</th>
              <th className="px-3 py-2.5 text-left text-neutral-400 font-semibold uppercase tracking-wider">Exercise</th>
              <th className="px-3 py-2.5 text-left text-neutral-400 font-semibold uppercase tracking-wider w-28">Sets & Reps</th>
            </tr>
          </thead>
          <tbody>
            {prog.days.map((day, di) =>
              day.exercises.map((ex, ei) => (
                <tr key={`${di}-${ei}`} className={`border-t border-white/5 ${di % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                  {ei === 0 && (
                    <td rowSpan={day.exercises.length}
                      className={`px-3 py-2 align-top text-xs font-semibold border-r border-white/5 ${day.isRest ? 'text-neutral-600' : 'text-orange-400'}`}>
                      {day.day}
                    </td>
                  )}
                  <td className={`px-3 py-1.5 leading-relaxed ${day.isRest ? 'text-neutral-600' : 'text-neutral-300'}`}>{ex.name}</td>
                  <td className={`px-3 py-1.5 font-mono whitespace-nowrap ${day.isRest ? 'text-neutral-700' : 'text-neutral-400'}`}>{ex.setsReps}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {prog.reminders && (
        <div className="mt-4 bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-3">Reminder</p>
          <ul className="space-y-1.5">
            {prog.reminders.map((r, i) => (
              <li key={i} className="text-neutral-400 text-xs flex gap-2 leading-relaxed">
                <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full bg-neutral-600" />
                <span dangerouslySetInnerHTML={{ __html: boldify(r) }} />
              </li>
            ))}
          </ul>
          {prog.tips && (
            <p className="text-neutral-500 text-xs mt-3 italic border-t border-white/5 pt-3"
              dangerouslySetInnerHTML={{ __html: boldify(prog.tips) }} />
          )}
        </div>
      )}
    </div>
  );
};

"""

marker = "// \u2500\u2500 Lesson View \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"
if marker in src:
    src = src.replace(marker, ws_comp + marker)
    print("WorkoutProgramSelector inserted")
else:
    print("Marker not found!")

# ─── 2. Add program_selector case to renderer ─────────────────────────────────
old_acc = """            case 'accordion':
              return <AccordionBlock key={i} title={block.title} items={block.items} />;"""
new_acc = """            case 'accordion':
              return <AccordionBlock key={i} title={block.title} items={block.items} />;
            case 'program_selector':
              return <WorkoutProgramSelector key={i} programs={block.programs} />;"""
if old_acc in src:
    src = src.replace(old_acc, new_acc)
    print("program_selector case added")
else:
    print("accordion case not found!")

# ─── 3. Replace chapter 5 ─────────────────────────────────────────────────────
ch5_start = src.find("    id: 5,")
ch5_start = src.rfind("\n  {", 0, ch5_start) + 1
ch5_end = src.find("\n  {", ch5_start + 10)
if ch5_end == -1:
    ch5_end = src.find("\n];", ch5_start)

old_ch5 = src[ch5_start:ch5_end]
print("Ch5 found:", repr(old_ch5[:60]))

REMINDERS = [
    'Selalu start dari warm up dulu sebelum mulai latihan beban',
    'Selalu fokus ke intensitas latihan',
    'Beban yang dimainin itu harus max sesuai dengan reps yang udah ditulis',
    'Selalu progressive overload 2-4 minggu sekali bisa dari set, reps, dan beban.',
    'Fokus latihan, kurang kurangi ngobrol.',
    '**Istirahat secukupnya, ga ada patokan seberapa lama lo harus beristirahat (jangan terlalu lama dan jangan terlalu cepat)**',
]
TIPS = 'Kalau latihan di variasi awal dengan 3 set, make sure selalu ada 1 set untuk warm up sebanyak 10-15 reps, dan total set akan jadi 4.'

def js_str_list(items):
    return '[\n' + ''.join(f"              '{i}',\n" for i in items) + '            ]'

new_ch5 = (
    "  {\n"
    "    id: 5, code: 'WORKOUT', title: 'Split Gym 3-5/Week Program', icon: Calendar,\n"
    "    color: 'from-blue-500/20 to-blue-500/5', accent: 'text-blue-400',\n"
    "    border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-400',\n"
    "    locked: false,\n"
    "    lessons: [\n"
    "      { id: '5-1', type: 'text', title: 'Split Gym 3-5/Week Program', duration: '10 min', content: [\n"
    "        { type: 'image', src: '/ch5-program.webp', alt: 'Program Latihan' },\n"
    "        { type: 'callout', icon: '\U0001F3AF', text: 'GOAL: Bisa menyesuaikan jadwal latihan sesuai dengan free time yang kalian punya' },\n"
    "        { type: 'heading2', text: 'Pilih Program Latihan' },\n"
    "        { type: 'program_selector', programs: [\n"
    "          {\n"
    "            id: '3x', title: '3x Per Week', subtitle: 'Full Body / Upper Body & Lower Body',\n"
    "            days: [\n"
    "              { day: '1. Full Body WO', isRest: false, exercises: [\n"
    "                { name: 'Back Squat, Goblet Squat, atau Leg Press', setsReps: '3 & 5-10' },\n"
    "                { name: 'Deadlift / RDL', setsReps: '3 & 5-10' },\n"
    "                { name: 'Flat Bench Press / Dumbbell Press', setsReps: '3 & 8-12' },\n"
    "                { name: 'Bent-over Row / Cable Row', setsReps: '3 & 8-12' },\n"
    "                { name: 'Dumbbell / Barbell Overhead Press', setsReps: '3 & 10-15' },\n"
    "                { name: 'Pull-ups / Lat Pulldown', setsReps: '3 & 8-12' },\n"
    "                { name: 'Plank', setsReps: '2-3 x 30s\u20131m' },\n"
    "              ]},\n"
    "              { day: '2. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '\u2014' }] },\n"
    "              { day: '3. Upper Body WO', isRest: false, exercises: [\n"
    "                { name: 'Barbell Overhead Press', setsReps: '2 & 4-6' },\n"
    "                { name: 'Pull Up / Lat Pull Down', setsReps: '3 & 8-10' },\n"
    "                { name: 'Close Grip Bench Press', setsReps: '3 & 8-10' },\n"
    "                { name: 'Wide Grip Seated Row \u00D7 Dumbbell Lateral Raise', setsReps: '3&12 \u00D7 3&15' },\n"
    "                { name: 'Lower Cable Cross Over', setsReps: '1 & 10' },\n"
    "                { name: 'Upper Cable Cross Over', setsReps: '1 & 10' },\n"
    "                { name: 'Facepull / Rear Delt Fly', setsReps: '2 \u00D7 12-15' },\n"
    "                { name: 'Seated Bicep Curl', setsReps: '3 \u00D7 10-12' },\n"
    "              ]},\n"
    "              { day: '4. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '\u2014' }] },\n"
    "              { day: '5. Lower Body WO', isRest: false, exercises: [\n"
    "                { name: 'Deadlift / RDL', setsReps: '3 & 5-10' },\n"
    "                { name: 'Barbell / Machine Squat', setsReps: '3 & 5-10' },\n"
    "                { name: 'Leg Press', setsReps: '3 & 10-12' },\n"
    "                { name: 'Leg Extensions', setsReps: '3 & 10-12' },\n"
    "                { name: 'Hip Thrust / Abduction Machine', setsReps: '3\u201310-15' },\n"
    "                { name: 'Calf Raises', setsReps: '3 & 12' },\n"
    "              ]},\n"
    "              { day: '6\u20137. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '\u2014' }] },\n"
    "            ],\n"
    "            reminders: " + js_str_list(REMINDERS) + ",\n"
    "            tips: '" + TIPS + "',\n"
    "          },\n"
    "          {\n"
    "            id: '4x', title: '4x Per Week', subtitle: 'Upper / Lower / Rest / Upper / Lower / Rest / Rest',\n"
    "            days: [\n"
    "              { day: '1. Upper Body WO', isRest: false, exercises: [\n"
    "                { name: 'Barbell Overhead Press', setsReps: '2 & 4-6' },\n"
    "                { name: 'Pull Up / Lat Pull Down', setsReps: '3 & 8-10' },\n"
    "                { name: 'Close Grip Bench Press', setsReps: '3 & 8-10' },\n"
    "                { name: 'Wide Grip Seated Row \u00D7 Lateral Raise', setsReps: '3&12 \u00D7 3&15' },\n"
    "                { name: 'Lower Cable Cross Over', setsReps: '1 & 10' },\n"
    "                { name: 'Upper Cable Cross Over', setsReps: '1 & 10' },\n"
    "                { name: 'Facepull / Rear Delt Fly', setsReps: '2 \u00D7 12-15' },\n"
    "                { name: 'Seated Bicep Curl', setsReps: '3 \u00D7 10-12' },\n"
    "              ]},\n"
    "              { day: '2. Lower Body WO', isRest: false, exercises: [\n"
    "                { name: 'Deadlift / RDL', setsReps: '3 & 5-10' },\n"
    "                { name: 'Barbell / Machine Squat', setsReps: '3 & 5-10' },\n"
    "                { name: 'Leg Press', setsReps: '3 & 10-12' },\n"
    "                { name: 'Leg Extension', setsReps: '3 & 10-12' },\n"
    "                { name: 'Hip Thrust / Abduction Machine', setsReps: '3\u201310-15' },\n"
    "                { name: 'Calf Raises', setsReps: '3 & 15-20' },\n"
    "              ]},\n"
    "              { day: '3. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '\u2014' }] },\n"
    "              { day: '4. Upper Body WO', isRest: false, exercises: [\n"
    "                { name: 'Incline Bench Press', setsReps: '3 & 6-8' },\n"
    "                { name: 'Cable Fly', setsReps: '2 & 10-12' },\n"
    "                { name: 'Weighted Pull Up', setsReps: '3 & 6-8' },\n"
    "                { name: 'High Cable Lateral Raise', setsReps: '2-3 & 8-10' },\n"
    "                { name: 'Deficit Pendlay Row', setsReps: '2 & 6-8' },\n"
    "                { name: 'Cable Overhead Tricep Extension', setsReps: '2 & 8-10' },\n"
    "                { name: 'Bayesian Curl', setsReps: '2 & 8-10' },\n"
    "              ]},\n"
    "              { day: '5. Lower Body WO', isRest: false, exercises: [\n"
    "                { name: 'Deadlift / RDL', setsReps: '4 & 5-10' },\n"
    "                { name: 'Leg Press', setsReps: '4 & 10-12' },\n"
    "                { name: 'Hip Thrust / Abduction Machine', setsReps: '3 & 8-10' },\n"
    "                { name: 'Slow Eccentric Leg Extension', setsReps: '3 & 8-10' },\n"
    "                { name: 'Calf Raises', setsReps: '4 \u00D7 15-20' },\n"
    "                { name: 'Leg Raises', setsReps: '3 \u00D7 10-20' },\n"
    "              ]},\n"
    "              { day: '6\u20137. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '\u2014' }] },\n"
    "            ],\n"
    "            reminders: " + js_str_list(REMINDERS) + ",\n"
    "            tips: '" + TIPS + "',\n"
    "          },\n"
    "          {\n"
    "            id: '5x', title: '5x Per Week', subtitle: 'Push / Pull / Legs & Shoulder / Rest / Upper / Lower / Rest',\n"
    "            days: [\n"
    "              { day: '1. Push', isRest: false, exercises: [\n"
    "                { name: 'Incline Bench Press', setsReps: '3 & 6-8' },\n"
    "                { name: 'Flat Bench Press', setsReps: '3 & 8-10' },\n"
    "                { name: 'Weighted Dips', setsReps: '3-4 & 10-12' },\n"
    "                { name: 'Pec Deck Fly', setsReps: '3-4 & 12' },\n"
    "                { name: 'Overhead Tricep Extension', setsReps: '3 & 10-12' },\n"
    "                { name: 'Single Arm Tricep Push Down', setsReps: '3 & 12-15' },\n"
    "                { name: 'Reserve Grip Tricep Push Down', setsReps: '3 & 10-12' },\n"
    "                { name: 'Ab Crunch Machine', setsReps: '3 & 12-15' },\n"
    "              ]},\n"
    "              { day: '2. Pull', isRest: false, exercises: [\n"
    "                { name: 'Lat Pull Down', setsReps: '2-3 & 6-8' },\n"
    "                { name: 'Reserve Grip LPD', setsReps: '2-3 & 8-10' },\n"
    "                { name: '1 Arm Seated Cable Row', setsReps: '3 & 10-12' },\n"
    "                { name: 'Cable Straight Arm Pull Down', setsReps: '3 & 10-12' },\n"
    "                { name: 'Seated Bicep Curl', setsReps: '3\u201310-12' },\n"
    "                { name: 'T-Bar Bicep Curl', setsReps: '3 & 8-10' },\n"
    "                { name: 'Cable Hammer Curl', setsReps: '3 & 10-15' },\n"
    "              ]},\n"
    "              { day: '3. Leg & Shoulder', isRest: false, exercises: [\n"
    "                { name: 'Deadlift', setsReps: '2-3 & 6-8' },\n"
    "                { name: 'Squat', setsReps: '2-3 & 6-10' },\n"
    "                { name: 'Leg Extension (optional)', setsReps: '3 & 10-15' },\n"
    "                { name: 'Lateral Raise', setsReps: '3-4 & 10-15' },\n"
    "                { name: 'Overhead DBL Press / Barbell Overhead Press', setsReps: '3 & 8-10' },\n"
    "                { name: 'Rear Delt Fly / Face Pull', setsReps: '3 & 12-15' },\n"
    "                { name: 'Shrugs', setsReps: '3-4 & 12-15' },\n"
    "              ]},\n"
    "              { day: '4. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '\u2014' }] },\n"
    "              { day: '5. Upper Body WO', isRest: false, exercises: [\n"
    "                { name: 'Incline Barbell Bench Press', setsReps: '3 & 6-8' },\n"
    "                { name: 'Cable Fly', setsReps: '2 & 10-12' },\n"
    "                { name: 'Weighted Pull Up', setsReps: '3 & 6-8' },\n"
    "                { name: 'High Cable Lateral Raise', setsReps: '2-3 & 8-10' },\n"
    "                { name: 'Deficit Pendlay Row', setsReps: '2 & 6-8' },\n"
    "                { name: 'Cable Overhead Tricep Extension', setsReps: '2 & 8-10' },\n"
    "                { name: 'Bayesian Curl', setsReps: '2 & 8-10' },\n"
    "              ]},\n"
    "              { day: '6. Lower Body WO', isRest: false, exercises: [\n"
    "                { name: 'Deadlift / RDL', setsReps: '3 & 6-10' },\n"
    "                { name: 'Leg Press', setsReps: '3-4 & 10-12' },\n"
    "                { name: 'Hip Thrust / Abduction Machine', setsReps: '3 & 8-10' },\n"
    "                { name: 'Slow Eccentric Leg Extension', setsReps: '3 & 8-10' },\n"
    "                { name: 'Calf Raises', setsReps: '4 \u00D7 15-20' },\n"
    "                { name: 'Leg Raises', setsReps: '3 \u00D7 10-20' },\n"
    "              ]},\n"
    "              { day: '7. Rest', isRest: true, exercises: [{ name: 'Rest / Istirahat', setsReps: '\u2014' }] },\n"
    "            ],\n"
    "            reminders: " + js_str_list(REMINDERS) + ",\n"
    "            tips: '" + TIPS + "',\n"
    "          },\n"
    "        ]},\n"
    "        { type: 'callout', icon: '\u26A0\uFE0F', text: '**NOTE:** Setelah lo pilih program latihan, make sure keep it consistent sampai 3 bulan kalau lo mau hasilnya maksimal. Kalau ada masalah, langsung tag **@cenhfits** di VIP community \u2014 gw bakalan jawab semua kebutuhan kalian untuk progress bentukin otot.' },\n"
    "      ] },\n"
    "    ],\n"
    "  },"
)

src = src[:ch5_start] + new_ch5 + src[ch5_end:]
print("Chapter 5 replaced")

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("File written")
