with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    src = f.read()

old_comp = r"""// ── Workout Program Selector ─────────────────────────────────────────────────
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
};"""

new_comp = r"""// ── Workout Program Selector ─────────────────────────────────────────────────
const WorkoutProgramSelector = ({ programs }) => {
  const [selected, setSelected] = useState(null);
  const prog = programs.find(p => p.id === selected);
  const boldify = (t) => t.replace(/\*\*(.+?)\*\*/g, '<strong class="text-neutral-200">$1</strong>');

  return (
    <AnimatePresence mode="wait">
      {!selected ? (
        <motion.div key="cards"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
          className="my-4 space-y-3">
          {programs.map(p => (
            <motion.button key={p.id} onClick={() => setSelected(p.id)} whileHover={{ x: 4 }}
              className="w-full bg-[#1A1A1A] border border-white/10 hover:border-orange-500/30 rounded-xl p-4 text-left flex items-center justify-between group transition-colors duration-200">
              <div>
                <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-0.5">{p.title}</p>
                <p className="text-white font-semibold text-sm">{p.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-orange-500 transition-colors flex-shrink-0" />
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <motion.div key="table"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
          className="my-4">
          <button onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-5 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali ke pilihan program
          </button>
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">{prog.title}</p>
          <h3 className="text-white font-bold text-lg mb-5">{prog.subtitle}</h3>

          <div className="rounded-xl overflow-hidden border border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-3 py-2.5 text-left text-neutral-400 font-semibold uppercase tracking-wider w-32">Day</th>
                  <th className="px-3 py-2.5 text-left text-neutral-400 font-semibold uppercase tracking-wider">Exercise & Sets</th>
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
                      <td className="px-3 py-2">
                        {day.isRest ? (
                          <span className="text-neutral-600">Rest / Istirahat</span>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-neutral-300 leading-relaxed">{ex.name}</span>
                            <span className="flex-shrink-0 text-[10px] font-mono font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full whitespace-nowrap">{ex.setsReps}</span>
                          </div>
                        )}
                      </td>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};"""

if old_comp in src:
    src = src.replace(old_comp, new_comp)
    print("WorkoutProgramSelector updated with animation + 2-col layout")
else:
    print("Component not found!")

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(src)
print("Done")
