import React, { useEffect, useMemo, useState } from "react";
import { Crown, Shield, Lock, Trash2, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "ashford_apps_v1";
const ADMIN_CODE = "ashford-admin";
const DISCORD_INVITE = "https://discord.gg/UPaKFEXvpD";

const emptyForm = {
  name: "",
  age: "",
  discord: "",
  nick: "",
  staticId: "",
  hours: "",
  timezone: "",
  online: "",
  rp: "",
  previous: "",
  reason: "",
  strengths: "",
  rules: "",
};

const fields = [
  "name",
  "age",
  "discord",
  "nick",
  "staticId",
  "hours",
  "timezone",
  "online",
  "rp",
  "previous",
  "reason",
  "strengths",
  "rules",
];

const rulesText = [
  ["1. Общие положения", [
    "1.1 Семья Ashford является закрытым объединением лиц, действующих в рамках установленных внутренних правил и иерархии.",
    "1.2 Вступая в семью, участник автоматически соглашается со всеми пунктами данного устава.",
    "1.3 Незнание правил не освобождает от ответственности.",
    "1.4 Интересы семьи всегда имеют приоритет над личными интересами участника.",
    "📌 Любые действия, наносящие ущерб репутации семьи, рассматриваются как нарушение вне зависимости от обстоятельств.",
  ]],
  ["2. Иерархия и подчинение", [
    "2.1 В семье действует строгая система подчинения.",
    "2.2 Приказы старшего состава обязательны к исполнению без обсуждений в момент их получения.",
    "2.3 Обсуждение или оспаривание приказов допускается исключительно после завершения ситуации.",
    "2.4 Игнорирование приказа приравнивается к грубому нарушению дисциплины.",
    "📌 В спорных ситуациях окончательное решение остаётся за лидером или его заместителями.",
  ]],
  ["3. Дисциплина", [
    "3.1 Каждый участник обязан поддерживать активность и присутствие в Discord.",
    "3.2 Участник обязан своевременно являться на сборы и мероприятия семьи.",
    "3.3 Отсутствие без предупреждения рассматривается как неуважение к составу.",
    "3.4 Во время общих мероприятий запрещено отвлекаться, уходить без разрешения или игнорировать коммуникацию.",
    "📌 Систематические нарушения дисциплины ведут к понижению или исключению.",
  ]],
  ["4. Внутреннее взаимодействие", [
    "4.1 Внутри семьи запрещены оскорбления, конфликты и токсичное поведение.",
    "4.2 Любые разногласия решаются через старший состав.",
    "4.3 Участники обязаны поддерживать друг друга в игровых и организационных моментах.",
    "4.4 Подрыв авторитета другого участника запрещён.",
    "📌 Внутренние конфликты, вынесенные за пределы семьи, считаются серьёзным нарушением.",
  ]],
  ["5. Поведение в игре", [
    "5.1 Каждый участник обязан соблюдать нормы RolePlay.",
    "5.2 Любые действия, нарушающие атмосферу RP, строго запрещены.",
    "5.3 Участник несёт полную ответственность за свои действия перед семьёй.",
    "5.4 Во всех взаимодействиях участник представляет семью Ashford и обязан действовать достойно.",
    "📌 Нарушение RP может повлечь санкции не только внутри семьи, но и со стороны администрации сервера.",
  ]],
  ["6. Конфиденциальность", [
    "6.1 Запрещается передача любой внутренней информации третьим лицам.",
    "6.2 К внутренней информации относятся состав семьи, планы, финансовые и организационные вопросы.",
    "6.3 Любая утечка информации рассматривается как предательство.",
    "📌 За нарушение данного пункта предусмотрено немедленное исключение без возможности восстановления.",
  ]],
  ["7. Запреты", [
    "7.1 Запрещено действовать против интересов семьи.",
    "7.2 Запрещено использовать сторонние программы, читы, баги и абузы.",
    "7.3 Запрещено провоцировать конфликты без причины.",
    "7.4 Запрещено нарушать правила сервера.",
    "7.5 Запрещено поведение, дискредитирующее семью в глазах других игроков.",
    "📌 Любое серьёзное нарушение может повлечь мгновенное исключение.",
  ]],
  ["8. Система наказаний", [
    "8.1 В зависимости от тяжести нарушения применяются предупреждение, взыскание, понижение в ранге или исключение.",
    "8.2 Повторные нарушения усиливают степень наказания.",
    "8.3 Решение о наказании принимается старшим составом.",
    "📌 В исключительных случаях наказание может быть применено без предварительного предупреждения.",
  ]],
  ["9. Заключительное положение", [
    "9.1 Каждый участник обязан не только соблюдать данный устав, но и поддерживать его исполнение другими.",
    "9.2 Семья Ashford — это структура, где ценятся дисциплина, уважение и преданность.",
    "9.3 Нарушение принципов семьи означает потерю права находиться в её составе.",
  ]],
];

export default function App() {
  const [form, setForm] = useState(emptyForm);
  const [apps, setApps] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [rulesOpen, setRulesOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [invite, setInvite] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setApps(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }, [apps]);

  const filled = fields.filter((key) => String(form[key] || "").trim()).length;
  const complete = filled === fields.length && form.rules === "yes" && Number(form.age) >= 14 && Number(form.hours) >= 0;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!complete) return;
    setApps([{ ...form, id: Date.now(), status: "new", date: new Date().toLocaleString() }, ...apps]);
    setForm(emptyForm);
  };

  const setStatus = (app, status) => {
    const updated = { ...app, status };
    setApps((prev) => prev.map((item) => (item.id === app.id ? updated : item)));
    setSelected((prev) => (prev?.id === app.id ? updated : prev));
    if (status === "accepted") setInvite(updated);
  };

  const removeApp = (id) => {
    setApps((prev) => prev.filter((app) => app.id !== id));
    setSelected(null);
  };

  const login = (e) => {
    e.preventDefault();
    if (adminCode === ADMIN_CODE) {
      setIsAdmin(true);
      setAdminOpen(false);
      setAdminCode("");
    }
  };

  const stats = useMemo(() => ({
    total: apps.length,
    new: apps.filter((a) => a.status === "new").length,
    accepted: apps.filter((a) => a.status === "accepted").length,
  }), [apps]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-700/20 p-3 text-red-400"><Crown /></div>
            <div>
              <h1 className="text-xl font-black">ASHFORD</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Family Recruitment</p>
            </div>
          </div>
          <a href="#form" className="rounded-2xl bg-red-700 px-4 py-2 font-semibold hover:bg-red-600">Подать заявку</a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        <section className="grid gap-6 py-12 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-red-500/20 bg-red-950/30 px-4 py-2 text-red-200">Набор открыт</div>
            <h2 className="text-5xl font-black leading-tight md:text-7xl">Вступление в <span className="text-red-500">Ashford</span></h2>
            <p className="mt-6 text-lg leading-8 text-zinc-400">Заполни анкету, прочитай устав и дождись ответа старшего состава.</p>
            <div className="mt-8 flex gap-3">
              <a href="#form" className="rounded-2xl bg-red-700 px-6 py-3 font-bold hover:bg-red-600">Заполнить заявку</a>
              <button onClick={() => setRulesOpen(true)} className="rounded-2xl border border-white/10 px-6 py-3 font-bold hover:bg-white/10">Устав</button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-zinc-900/70 p-6 shadow-2xl">
            <Shield className="mb-6 h-12 w-12 text-red-400" />
            <Info label="Формат" value="GTA 5 RP Family" />
            <Info label="Приоритет" value="Дисциплина / RP / Актив" />
            <Info label="Рассмотрение" value="Старший состав" />
            <Info label="Discord" value="После принятия" />
          </div>
        </section>

        <section id="form" className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 shadow-2xl">
          <h2 className="mb-2 text-3xl font-black">Заявка в семью</h2>
          <p className="mb-6 text-zinc-400">Кнопка отправки откроется только после полного заполнения анкеты.</p>

          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Имя" value={form.name} onChange={(v) => update("name", v)} />
              <Input label="Возраст" value={form.age} onChange={(v) => update("age", v)} />
              <Input label="Discord" value={form.discord} onChange={(v) => update("discord", v)} />
              <Input label="Nick в игре" value={form.nick} onChange={(v) => update("nick", v)} />
              <Input label="ID / Static" value={form.staticId} onChange={(v) => update("staticId", v)} />
              <Input label="Часов в игре" value={form.hours} onChange={(v) => update("hours", v)} />
              <Input label="Часовой пояс" value={form.timezone} onChange={(v) => update("timezone", v)} />
              <label className="grid gap-2 text-sm text-zinc-300">Онлайн в день
                <select value={form.online} onChange={(e) => update("online", e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none">
                  <option value="">Выбери</option><option>1-2 часа</option><option>3-4 часа</option><option>5+ часов</option><option>По ситуации</option>
                </select>
              </label>
            </div>

            <Area label="Опыт RP" value={form.rp} onChange={(v) => update("rp", v)} />
            <Area label="Прошлые семьи / организации" value={form.previous} onChange={(v) => update("previous", v)} />
            <Area label="Почему хочешь в Ashford" value={form.reason} onChange={(v) => update("reason", v)} />
            <Area label="Твои сильные стороны" value={form.strengths} onChange={(v) => update("strengths", v)} />

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="mb-2 flex justify-between text-sm"><span>Заполнение</span><span>{filled}/{fields.length}</span></div>
              <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-red-600" style={{ width: `${(filled / fields.length) * 100}%` }} /></div>
            </div>

            <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div><b>Устав семьи Ashford</b><p className="text-sm text-zinc-400">Перед отправкой заявки нужно ознакомиться с правилами.</p></div>
                <button type="button" onClick={() => setRulesOpen(true)} className="rounded-2xl border border-red-500/30 px-5 py-3 text-red-200 hover:bg-red-700/20"><AlertTriangle className="mr-2 inline h-4 w-4" />Открыть правила</button>
              </div>
            </div>

            <label className="grid gap-2 text-sm text-zinc-300">Согласие с правилами
              <select value={form.rules} onChange={(e) => update("rules", e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none">
                <option value="">Подтверди</option><option value="yes">Да, правила понимаю и нарушать не буду</option><option value="no">Нет</option>
              </select>
            </label>

            <button disabled={!complete} className={`rounded-2xl py-4 font-black ${complete ? "bg-red-700 hover:bg-red-600" : "cursor-not-allowed bg-zinc-800 text-zinc-500"}`}>
              {complete ? "Отправить заявку" : "Заполни всю заявку"}
            </button>
          </form>
        </section>

        {isAdmin && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-900/80 p-6">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">Staff-панель</h2><button onClick={() => setIsAdmin(false)} className="rounded-xl bg-zinc-800 px-4 py-2">Выйти</button></div>
            <div className="mb-5 grid gap-3 md:grid-cols-3"><Stat label="Всего" value={stats.total} /><Stat label="Новые" value={stats.new} /><Stat label="Принято" value={stats.accepted} /></div>
            <div className="grid gap-3">
              {apps.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-zinc-500">Пока заявок нет</div>}
              {apps.map((app) => (
                <div key={app.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><b>{app.nick}</b><p className="text-sm text-zinc-500">{app.name}, {app.age} лет • {app.discord} • {app.status}</p></div>
                    <div className="flex flex-wrap gap-2">
                      <Btn onClick={() => setSelected(app)}>Открыть</Btn>
                      <Btn onClick={() => setStatus(app, "review")}>Проверка</Btn>
                      <Btn onClick={() => setStatus(app, "accepted")}>Принять</Btn>
                      <Btn onClick={() => setStatus(app, "rejected")}>Отклонить</Btn>
                      <Btn onClick={() => removeApp(app.id)}><Trash2 className="h-4 w-4" /></Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-10 flex items-center justify-between rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-zinc-500">
          <span>Ashford Family Recruitment</span>
          <button onClick={() => setAdminOpen(true)} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 hover:text-white"><Lock className="h-4 w-4" />Staff</button>
        </footer>
      </main>

      {rulesOpen && <RulesModal onClose={() => setRulesOpen(false)} />}
      {adminOpen && !isAdmin && <AdminModal code={adminCode} setCode={setAdminCode} login={login} close={() => setAdminOpen(false)} />}
      {selected && <AppModal app={selected} close={() => setSelected(null)} setStatus={setStatus} removeApp={removeApp} />}
      {invite && <InviteModal app={invite} close={() => setInvite(null)} />}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return <label className="grid gap-2 text-sm text-zinc-300">{label}<input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-red-500" /></label>;
}

function Area({ label, value, onChange }) {
  return <label className="grid gap-2 text-sm text-zinc-300">{label}<textarea value={value} onChange={(e) => onChange(e.target.value)} className="min-h-24 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-red-500" /></label>;
}

function Info({ label, value }) {
  return <div className="mb-3 flex justify-between rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-zinc-500">{label}</span><b>{value}</b></div>;
}

function Stat({ label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><div className="text-2xl font-black">{value}</div><div className="text-xs uppercase text-zinc-500">{label}</div></div>;
}

function Btn({ children, onClick }) {
  return <button onClick={onClick} className="rounded-xl bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700">{children}</button>;
}

function Modal({ title, children, close }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"><div className="flex items-center justify-between border-b border-white/10 p-5"><h2 className="text-2xl font-black">{title}</h2><button onClick={close} className="rounded-xl bg-zinc-800 px-4 py-2">Закрыть</button></div><div className="max-h-[75vh] overflow-y-auto p-5">{children}</div></div></div>;
}

function RulesModal({ onClose }) {
  return <Modal title="Устав семьи Ashford" close={onClose}>{rulesText.map(([title, items]) => <div key={title} className="mb-5 rounded-2xl border border-white/10 bg-black/30 p-4"><h3 className="mb-3 text-xl font-bold text-red-300">{title}</h3>{items.map((item) => <p key={item} className="mb-2 rounded-xl bg-white/5 p-3 text-zinc-300">{item}</p>)}</div>)}</Modal>;
}

function AdminModal({ code, setCode, login, close }) {
  return <Modal title="Staff-вход" close={close}><form onSubmit={login} className="grid gap-4"><input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Админ-код" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" /><button className="rounded-2xl bg-red-700 py-3 font-bold">Войти</button><p className="text-sm text-zinc-500">Демо-код: ashford-admin</p></form></Modal>;
}

function AppModal({ app, close, setStatus, removeApp }) {
  return <Modal title={app.nick} close={close}><div className="grid gap-3 text-zinc-300">{Object.entries(app).map(([k, v]) => <div key={k} className="rounded-xl bg-white/5 p-3"><b>{k}:</b> {String(v)}</div>)}<div className="flex flex-wrap gap-2 pt-3"><Btn onClick={() => setStatus(app, "review")}>Проверка</Btn><Btn onClick={() => setStatus(app, "accepted")}>Принять</Btn><Btn onClick={() => setStatus(app, "rejected")}>Отклонить</Btn><Btn onClick={() => removeApp(app.id)}>Удалить</Btn></div></div></Modal>;
}

function InviteModal({ app, close }) {
  const text = `Привет, ${app.nick}! Твоя заявка в семью Ashford одобрена. Заходи в Discord: ${DISCORD_INVITE}`;
  return <Modal title="Заявка принята" close={close}><div className="grid gap-4"><p className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">Скопируй сообщение и отправь кандидату: {app.discord}</p><div className="rounded-2xl bg-black/30 p-4">{text}</div><button onClick={() => navigator.clipboard?.writeText(text)} className="rounded-2xl bg-emerald-700 py-3 font-bold">Скопировать сообщение</button><a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="rounded-2xl bg-zinc-800 py-3 text-center font-bold">Открыть invite</a></div></Modal>;
}
