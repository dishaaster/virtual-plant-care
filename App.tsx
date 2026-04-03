import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";

// ─── DATA ────────────────────────────────────────────────────────────────────

const plants = [
  { name: "Monstera", emoji: "🌿", waterDays: 7, sun: "Medium", soil: "Well-draining", temp: "18–27°C", difficulty: "Easy", color: "bg-emerald-50", border: "border-emerald-100", accent: "text-emerald-700", hoverBg: "from-emerald-600 to-teal-600", tip: "Wipe leaves monthly to keep them dust-free and glossy. Mist occasionally for extra humidity." },
  { name: "Snake Plant", emoji: "🪴", waterDays: 14, sun: "Low", soil: "Sandy / Cactus mix", temp: "15–29°C", difficulty: "Very Easy", color: "bg-green-50", border: "border-green-100", accent: "text-green-700", hoverBg: "from-green-600 to-emerald-600", tip: "Thrives on neglect. Let soil dry completely between waterings to avoid root rot." },
  { name: "Peace Lily", emoji: "🌸", waterDays: 5, sun: "Low", soil: "Peat-based mix", temp: "18–30°C", difficulty: "Easy", color: "bg-teal-50", border: "border-teal-100", accent: "text-teal-700", hoverBg: "from-teal-600 to-cyan-600", tip: "Drooping leaves signal thirst. Keep away from cold drafts and direct sun." },
  { name: "Fiddle Leaf Fig", emoji: "🌳", waterDays: 7, sun: "Bright", soil: "Fast-draining", temp: "16–24°C", difficulty: "Medium", color: "bg-lime-50", border: "border-lime-100", accent: "text-lime-700", hoverBg: "from-lime-600 to-green-600", tip: "Hates being moved. Find a bright spot and leave it there. Avoid cold windows." },
  { name: "Pothos", emoji: "🍃", waterDays: 7, sun: "Low", soil: "Standard potting", temp: "15–29°C", difficulty: "Very Easy", color: "bg-emerald-50", border: "border-emerald-100", accent: "text-emerald-700", hoverBg: "from-emerald-600 to-green-600", tip: "Trails beautifully from shelves. Trim vines to encourage bushier, fuller growth." },
  { name: "Aloe Vera", emoji: "🌵", waterDays: 21, sun: "Bright", soil: "Cactus / Sandy", temp: "13–27°C", difficulty: "Easy", color: "bg-green-50", border: "border-green-100", accent: "text-green-700", hoverBg: "from-green-600 to-teal-600", tip: "Use the gel for minor burns! Plant in terracotta pots for best drainage." },
  { name: "Orchid", emoji: "🌺", waterDays: 10, sun: "Medium", soil: "Bark / Orchid mix", temp: "16–24°C", difficulty: "Hard", color: "bg-teal-50", border: "border-teal-100", accent: "text-teal-700", hoverBg: "from-teal-600 to-emerald-600", tip: "Soak roots for 15 min then drain fully. Never let roots sit in standing water." },
  { name: "Spider Plant", emoji: "🌱", waterDays: 7, sun: "Medium", soil: "Standard potting", temp: "13–27°C", difficulty: "Very Easy", color: "bg-lime-50", border: "border-lime-100", accent: "text-lime-700", hoverBg: "from-lime-600 to-emerald-600", tip: "Produces baby 'spiderettes' you can propagate in water. Great for beginners!" },
];

const sunConfig: Record<string, { label: string; dots: number; color: string }> = {
  Low: { label: "Low Light", dots: 1, color: "bg-amber-300" },
  Medium: { label: "Medium Light", dots: 2, color: "bg-amber-400" },
  Bright: { label: "Bright Light", dots: 3, color: "bg-amber-500" },
};

const waterConfig = (days: number) => {
  if (days <= 5) return { label: "Frequent", drops: 3 };
  if (days <= 10) return { label: "Moderate", drops: 2 };
  return { label: "Infrequent", drops: 1 };
};

const difficultyConfig: Record<string, { bg: string; text: string }> = {
  "Very Easy": { bg: "bg-emerald-100", text: "text-emerald-700" },
  Easy: { bg: "bg-green-100", text: "text-green-700" },
  Medium: { bg: "bg-amber-100", text: "text-amber-700" },
  Hard: { bg: "bg-red-100", text: "text-red-700" },
};

const careTipsData = [
  {
    icon: "💧",
    title: "Water Wisely",
    summary: "Check soil moisture before watering. Stick your finger 1–2 inches into the soil — if it's dry, it's time to water.",
    steps: [
      "Insert your finger 1–2 inches into the soil near the pot edge.",
      "If it feels dry, water thoroughly until it drains from the bottom.",
      "Empty the saucer after 30 minutes to prevent root rot.",
      "Use room-temperature water — cold water can shock tropical plants.",
      "Water in the morning so leaves dry before nightfall.",
    ],
    mistakes: ["Watering on a fixed schedule regardless of soil moisture", "Letting plants sit in standing water", "Using cold tap water on tropical plants"],
  },
  {
    icon: "☀️",
    title: "Light Matters",
    summary: "Most houseplants thrive in bright, indirect light. Rotate your plants every few weeks for even growth.",
    steps: [
      "Identify your plant's light needs (low, medium, or bright).",
      "Place bright-light plants within 1–2 ft of a south or west window.",
      "Use sheer curtains to diffuse harsh direct sunlight.",
      "Rotate the pot 90° every 2 weeks for even, balanced growth.",
      "Consider a grow light for dark rooms or winter months.",
    ],
    mistakes: ["Placing shade plants in direct sun (causes leaf scorch)", "Keeping sun-lovers too far from windows", "Never rotating the plant (causes lopsided growth)"],
  },
  {
    icon: "🌡️",
    title: "Temperature & Humidity",
    summary: "Keep plants away from cold drafts and heating vents. Most tropical plants love humidity — mist them occasionally.",
    steps: [
      "Keep most houseplants between 15–27°C (60–80°F).",
      "Move plants away from cold windows in winter.",
      "Group plants together to naturally raise humidity.",
      "Use a pebble tray filled with water under the pot.",
      "Mist tropical plants 2–3 times per week in dry seasons.",
    ],
    mistakes: ["Placing plants near heating or AC vents", "Leaving tropical plants near cold drafty windows", "Misting plants with fungal issues (worsens the problem)"],
  },
  {
    icon: "🪱",
    title: "Healthy Soil",
    summary: "Use well-draining potting mix. Repot every 1–2 years to refresh nutrients and give roots room to grow.",
    steps: [
      "Choose a potting mix suited to your plant type (e.g., cactus mix for succulents).",
      "Ensure your pot has drainage holes.",
      "Repot when roots start circling the bottom or poking out.",
      "Go up only one pot size at a time to avoid overwatering risk.",
      "Add perlite to standard mix for better drainage.",
    ],
    mistakes: ["Using garden soil indoors (too dense, harbors pests)", "Repotting into a pot that's too large", "Never refreshing old, compacted soil"],
  },
  {
    icon: "✂️",
    title: "Prune Regularly",
    summary: "Remove dead or yellowing leaves to encourage new growth and keep your plant looking its best.",
    steps: [
      "Use clean, sharp scissors or pruning shears.",
      "Remove dead, yellowing, or damaged leaves at the base.",
      "Pinch back leggy stems to encourage bushier growth.",
      "Prune in spring or early summer for best results.",
      "Wipe blades with rubbing alcohol between cuts to prevent disease spread.",
    ],
    mistakes: ["Using dull or dirty tools (causes tearing and infection)", "Pruning more than 1/3 of the plant at once", "Pruning in late autumn when growth slows"],
  },
  {
    icon: "🐛",
    title: "Pest Control",
    summary: "Inspect leaves regularly for pests. Wipe leaves with a damp cloth and use neem oil for natural pest control.",
    steps: [
      "Inspect new plants before bringing them indoors.",
      "Check undersides of leaves weekly for eggs or insects.",
      "Isolate infected plants immediately.",
      "Wipe leaves with a damp cloth to remove pests manually.",
      "Apply diluted neem oil spray every 7 days until clear.",
    ],
    mistakes: ["Ignoring early signs of infestation", "Overwatering (creates conditions pests love)", "Not isolating new or infected plants"],
  },
];

const symptoms = [
  { id: "yellow", label: "Yellow Leaves", emoji: "🟡" },
  { id: "droop", label: "Drooping Plant", emoji: "😔" },
  { id: "brown_tips", label: "Brown Leaf Tips", emoji: "🟤" },
  { id: "spots", label: "Brown/Black Spots", emoji: "⚫" },
  { id: "leggy", label: "Leggy / Stretching", emoji: "📏" },
  { id: "wilting", label: "Wilting Despite Watering", emoji: "💦" },
  { id: "no_growth", label: "No New Growth", emoji: "🛑" },
  { id: "white_powder", label: "White Powdery Coating", emoji: "🤍" },
];

const diagnoses: Record<string, { causes: string[]; suggestions: string[] }> = {
  yellow: {
    causes: ["Overwatering (most common)", "Nutrient deficiency (nitrogen)", "Too little light", "Natural aging of lower leaves"],
    suggestions: ["Let soil dry out between waterings", "Feed with balanced liquid fertilizer monthly", "Move to a brighter spot", "Remove yellowed leaves to redirect energy"],
  },
  droop: {
    causes: ["Underwatering / thirst", "Root rot from overwatering", "Temperature shock", "Repotting stress"],
    suggestions: ["Check soil — water if dry, let dry if wet", "Inspect roots for rot (brown, mushy)", "Move away from drafts or vents", "Give it a week to recover after repotting"],
  },
  brown_tips: {
    causes: ["Low humidity", "Fluoride or salt buildup in soil", "Inconsistent watering", "Cold drafts"],
    suggestions: ["Mist leaves or use a pebble tray", "Flush soil with water monthly to remove salts", "Water consistently and evenly", "Move away from cold windows"],
  },
  spots: {
    causes: ["Fungal infection", "Bacterial disease", "Overwatering", "Pest damage (spider mites, scale)"],
    suggestions: ["Remove affected leaves immediately", "Improve air circulation around the plant", "Reduce watering frequency", "Inspect for pests and treat with neem oil"],
  },
  leggy: {
    causes: ["Insufficient light", "Plant reaching toward light source", "Lack of pruning"],
    suggestions: ["Move to a brighter location", "Rotate plant regularly for even growth", "Pinch back stems to encourage bushiness", "Consider a grow light in dark rooms"],
  },
  wilting: {
    causes: ["Root rot (overwatering)", "Root-bound pot", "Pest infestation at roots", "Compacted soil blocking water absorption"],
    suggestions: ["Check roots — repot if rotted", "Repot into fresh, well-draining soil", "Inspect roots for pests", "Aerate soil gently with a chopstick"],
  },
  no_growth: {
    causes: ["Dormancy (normal in winter)", "Nutrient-depleted soil", "Root-bound plant", "Too little light"],
    suggestions: ["Be patient during winter months", "Fertilize monthly in spring/summer", "Repot into a slightly larger pot", "Increase light exposure"],
  },
  white_powder: {
    causes: ["Powdery mildew (fungal)", "Mealybugs (cottony clusters)", "Mineral deposits from hard water"],
    suggestions: ["Spray with diluted baking soda solution (1 tsp per litre)", "Remove mealybugs with alcohol-dipped cotton swab", "Use filtered or rainwater for watering", "Improve air circulation"],
  },
};

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Reminder {
  id: string;
  plantName: string;
  email: string;
  frequency: number;
  time: string;
  createdAt: number;
  lastWatered: number;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getNextWatering(reminder: Reminder): number {
  return reminder.lastWatered + reminder.frequency * 24 * 60 * 60 * 1000;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Water now! 💧";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

// ─── VIRTUAL PLANT ───────────────────────────────────────────────────────────

function VirtualPlant() {
  const [waterLevel, setWaterLevel] = useState(() => {
    const saved = localStorage.getItem("vp_waterLevel");
    return saved ? Number(saved) : 60;
  });
  const [lastWatered, setLastWatered] = useState(() => {
    const saved = localStorage.getItem("vp_lastWatered");
    return saved ? Number(saved) : Date.now();
  });
  const [isWatering, setIsWatering] = useState(false);
  const [drops, setDrops] = useState<{ id: number; x: number }[]>([]);
  const dropId = useRef(0);

  // Drain water level over time
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterLevel((prev) => {
        const next = Math.max(0, prev - 1);
        localStorage.setItem("vp_waterLevel", String(next));
        return next;
      });
    }, 30000); // drain 1% every 30s
    return () => clearInterval(interval);
  }, []);

  const health = waterLevel >= 60 ? "thriving" : waterLevel >= 30 ? "okay" : "drooping";

  const plantEmoji =
    health === "thriving" ? "🌿" : health === "okay" ? "🍃" : "🥀";

  const stemHeight = 40 + waterLevel * 0.6; // 40–100px
  const leafScale = 0.5 + waterLevel * 0.005; // 0.5–1.0

  function handleWater() {
    if (isWatering) return;
    setIsWatering(true);
    const newDrops = Array.from({ length: 6 }, (_, i) => ({
      id: dropId.current++,
      x: 30 + i * 12,
    }));
    setDrops(newDrops);
    setTimeout(() => setDrops([]), 1000);

    setWaterLevel((prev) => {
      const next = Math.min(100, prev + 25);
      localStorage.setItem("vp_waterLevel", String(next));
      return next;
    });
    const now = Date.now();
    setLastWatered(now);
    localStorage.setItem("vp_lastWatered", String(now));
    setTimeout(() => setIsWatering(false), 1000);
    toast.success("🌿 Plant watered! It's happy now.");
  }

  const timeSince = Date.now() - lastWatered;
  const hoursSince = Math.floor(timeSince / 3600000);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100 flex flex-col items-center gap-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Your Virtual Plant</h3>
        <p className="text-sm text-gray-500">Water it regularly to keep it thriving!</p>
      </div>

      {/* Plant display */}
      <div className="relative w-48 h-48 flex items-end justify-center">
        {/* Water drops animation */}
        {drops.map((drop) => (
          <div
            key={drop.id}
            className="absolute top-0 text-blue-400 text-lg animate-bounce"
            style={{ left: drop.x, animationDuration: "0.5s" }}
          >
            💧
          </div>
        ))}

        {/* Pot */}
        <div className="relative z-10">
          {/* Plant body */}
          <div
            className="flex flex-col items-center transition-all duration-700"
            style={{ transform: health === "drooping" ? "rotate(-8deg)" : "none" }}
          >
            {/* Leaves */}
            <div
              className="transition-all duration-700 text-center"
              style={{
                transform: `scale(${leafScale})`,
                filter: health === "drooping" ? "grayscale(40%)" : "none",
              }}
            >
              <div className="text-6xl leading-none select-none">{plantEmoji}</div>
              {health === "thriving" && (
                <div className="flex justify-center gap-1 mt-1">
                  <span className="text-2xl" style={{ transform: "rotate(-20deg)" }}>🌿</span>
                  <span className="text-2xl" style={{ transform: "rotate(20deg)" }}>🌿</span>
                </div>
              )}
            </div>

            {/* Stem */}
            <div
              className="w-2 rounded-full transition-all duration-700"
              style={{
                height: `${stemHeight * 0.4}px`,
                backgroundColor: health === "drooping" ? "#a3a3a3" : "#16a34a",
              }}
            />
          </div>

          {/* Pot */}
          <div className="w-20 h-14 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-2xl rounded-t-sm mx-auto relative">
            <div className="absolute -top-1 left-0 right-0 h-3 bg-amber-500 rounded-sm" />
            {/* Soil */}
            <div className="absolute top-2 left-2 right-2 h-3 bg-amber-900 rounded-sm opacity-60" />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Water Level</span>
          <span className={`font-bold ${health === "thriving" ? "text-emerald-600" : health === "okay" ? "text-amber-500" : "text-red-500"}`}>
            {health === "thriving" ? "🌟 Thriving" : health === "okay" ? "😐 Okay" : "😢 Needs Water!"}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${
              health === "thriving" ? "bg-emerald-500" : health === "okay" ? "bg-amber-400" : "bg-red-400"
            }`}
            style={{ width: `${waterLevel}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center">
          Last watered: {hoursSince === 0 ? "just now" : `${hoursSince}h ago`}
        </p>
      </div>

      <button
        onClick={handleWater}
        disabled={isWatering}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <span className="text-lg">💧</span>
        {isWatering ? "Watering…" : "Water Plant"}
      </button>

      <div className="grid grid-cols-3 gap-3 w-full text-center">
        {[
          { label: "Health", value: health === "thriving" ? "Great" : health === "okay" ? "Fair" : "Poor", color: health === "thriving" ? "text-emerald-600" : health === "okay" ? "text-amber-500" : "text-red-500" },
          { label: "Water", value: `${waterLevel}%`, color: "text-blue-500" },
          { label: "Days Old", value: Math.floor((Date.now() - (Number(localStorage.getItem("vp_created")) || Date.now())) / 86400000) + 1 + "d", color: "text-purple-500" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-2">
            <div className={`font-bold text-sm ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REMINDERS SECTION ───────────────────────────────────────────────────────

function RemindersSection() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("plantReminders") || "[]");
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({ plantName: "", email: "", frequency: "7", time: "08:00" });
  const [editId, setEditId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  function save(list: Reminder[]) {
    setReminders(list);
    localStorage.setItem("plantReminders", JSON.stringify(list));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.plantName || !form.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (editId) {
      const updated = reminders.map((r) =>
        r.id === editId
          ? { ...r, plantName: form.plantName, email: form.email, frequency: Number(form.frequency), time: form.time }
          : r
      );
      save(updated);
      toast.success("✏️ Reminder updated!");
      setEditId(null);
    } else {
      const newReminder: Reminder = {
        id: crypto.randomUUID(),
        plantName: form.plantName,
        email: form.email,
        frequency: Number(form.frequency),
        time: form.time,
        createdAt: Date.now(),
        lastWatered: Date.now(),
      };
      save([...reminders, newReminder]);
      toast.success(`🌿 Reminder set for ${form.plantName}!`);
    }
    setForm({ plantName: "", email: "", frequency: "7", time: "08:00" });
  }

  function handleEdit(r: Reminder) {
    setEditId(r.id);
    setForm({ plantName: r.plantName, email: r.email, frequency: String(r.frequency), time: r.time });
    document.getElementById("reminder-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleDelete(id: string) {
    save(reminders.filter((r) => r.id !== id));
    toast.success("🗑️ Reminder deleted.");
    if (editId === id) { setEditId(null); setForm({ plantName: "", email: "", frequency: "7", time: "08:00" }); }
  }

  function markWatered(id: string) {
    const updated = reminders.map((r) => r.id === id ? { ...r, lastWatered: Date.now() } : r);
    save(updated);
    toast.success("💧 Marked as watered!");
  }

  return (
    <section id="reminders" className="py-20 bg-emerald-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-emerald-300 font-semibold text-sm uppercase tracking-wider">Stay on Track</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Watering Reminders</h2>
          <p className="text-emerald-200 mt-3">Set reminders and track your watering schedule.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form id="reminder-form" onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-5">
              {editId ? "✏️ Edit Reminder" : "➕ New Reminder"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Plant Name <span className="text-red-400">*</span></label>
                <input type="text" placeholder="e.g. My Monstera" value={form.plantName} onChange={(e) => setForm({ ...form, plantName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-red-400">*</span></label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 placeholder-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
                  <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 bg-white">
                    <option value="1">Every day</option>
                    <option value="2">Every 2 days</option>
                    <option value="3">Every 3 days</option>
                    <option value="7">Every week</option>
                    <option value="14">Every 2 weeks</option>
                    <option value="21">Every 3 weeks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg">
                  {editId ? "💾 Save Changes" : "🌿 Set Reminder"}
                </button>
                {editId && (
                  <button type="button" onClick={() => { setEditId(null); setForm({ plantName: "", email: "", frequency: "7", time: "08:00" }); }}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Reminder list */}
          <div className="flex flex-col gap-4">
            {reminders.length === 0 ? (
              <div className="bg-white/10 rounded-3xl p-8 text-center text-emerald-200 border border-white/20">
                <div className="text-4xl mb-3">🌱</div>
                <p className="font-medium">No reminders yet.</p>
                <p className="text-sm mt-1 text-emerald-300">Add your first plant reminder!</p>
              </div>
            ) : (
              reminders.map((r) => {
                const nextMs = getNextWatering(r) - now;
                const overdue = nextMs <= 0;
                return (
                  <div key={r.id} className={`bg-white rounded-2xl p-5 shadow-lg border-l-4 ${overdue ? "border-red-400" : "border-emerald-400"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                          🌿 {r.plantName}
                          {overdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Overdue!</span>}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">{r.email} · Every {r.frequency} day{r.frequency > 1 ? "s" : ""} at {r.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(r)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">✏️</button>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">🗑️</button>
                      </div>
                    </div>
                    <div className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${overdue ? "bg-red-50" : "bg-emerald-50"}`}>
                      <div>
                        <p className="text-xs text-gray-500">Next watering</p>
                        <p className={`font-bold text-sm ${overdue ? "text-red-600" : "text-emerald-700"}`}>
                          {formatCountdown(nextMs)}
                        </p>
                      </div>
                      <button onClick={() => markWatered(r.id)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors">
                        💧 Watered!
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CARE TIPS SECTION ───────────────────────────────────────────────────────

function CareTipsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="care-tips" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Tips & Tricks</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Expert Care Tips</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Click any card to expand step-by-step instructions and common mistakes to avoid.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careTipsData.map((tip) => {
            const isOpen = expanded === tip.title;
            return (
              <div
                key={tip.title}
                className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isOpen ? "border-emerald-300 shadow-lg" : "border-emerald-100 hover:shadow-md hover:-translate-y-0.5"
                } bg-gradient-to-br from-emerald-50 to-teal-50`}
                onClick={() => setExpanded(isOpen ? null : tip.title)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{tip.icon}</div>
                      <h3 className="text-lg font-bold text-gray-800">{tip.title}</h3>
                    </div>
                    <span className={`text-emerald-500 text-xl transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mt-3">{tip.summary}</p>
                </div>

                {isOpen && (
                  <div className="px-6 pb-6 border-t border-emerald-100 pt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-1">
                        <span>📋</span> Step-by-Step
                      </h4>
                      <ol className="space-y-2">
                        {tip.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-gray-700">
                            <span className="flex-shrink-0 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-500 mb-2 flex items-center gap-1">
                        <span>⚠️</span> Common Mistakes
                      </h4>
                      <ul className="space-y-1.5">
                        {tip.mistakes.map((m, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-600">
                            <span className="text-red-400 flex-shrink-0">✗</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── PLANT GALLERY WITH SEARCH ───────────────────────────────────────────────

function PlantGallery() {
  const [search, setSearch] = useState("");
  const [filterLight, setFilterLight] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");

  const filtered = plants.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchLight = filterLight === "All" || p.sun === filterLight;
    const matchDiff = filterDiff === "All" || p.difficulty === filterDiff;
    return matchSearch && matchLight && matchDiff;
  });

  return (
    <section id="plants" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Gallery</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Popular Houseplants</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Search and filter plants by name, light, or difficulty. Hover a card for a quick tip.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search plants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 placeholder-gray-400 bg-white"
            />
          </div>
          <select value={filterLight} onChange={(e) => setFilterLight(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-700 bg-white">
            <option value="All">☀️ All Light</option>
            <option value="Low">🌑 Low Light</option>
            <option value="Medium">🌤 Medium Light</option>
            <option value="Bright">☀️ Bright Light</option>
          </select>
          <select value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-700 bg-white">
            <option value="All">🌱 All Levels</option>
            <option value="Very Easy">Very Easy</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-lg font-medium">No plants found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((plant) => {
              const sun = sunConfig[plant.sun];
              const water = waterConfig(plant.waterDays);
              const diff = difficultyConfig[plant.difficulty];
              return (
                <div key={plant.name}
                  className={`relative overflow-hidden rounded-2xl border ${plant.border} ${plant.color} group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                  <div className="p-5 transition-opacity duration-300 group-hover:opacity-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-5xl leading-none">{plant.emoji}</div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diff.bg} ${diff.text}`}>{plant.difficulty}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-4">{plant.name}</h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5"><span className="text-sm">💧</span><span className="text-xs text-gray-500">Every {plant.waterDays}d</span></div>
                        <div className="flex gap-0.5">{[1, 2, 3].map((i) => (<div key={i} className={`w-2 h-2 rounded-full ${i <= water.drops ? "bg-blue-400" : "bg-gray-200"}`} />))}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5"><span className="text-sm">☀️</span><span className="text-xs text-gray-500">{sun.label}</span></div>
                        <div className="flex gap-0.5">{[1, 2, 3].map((i) => (<div key={i} className={`w-2 h-2 rounded-full ${i <= sun.dots ? sun.color : "bg-gray-200"}`} />))}</div>
                      </div>
                      <div className="flex items-center gap-1.5"><span className="text-sm">🪱</span><span className="text-xs text-gray-500 truncate">{plant.soil}</span></div>
                      <div className="flex items-center gap-1.5"><span className="text-sm">🌡️</span><span className="text-xs text-gray-500">{plant.temp}</span></div>
                    </div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${plant.hoverBg} p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <div>
                      <div className="text-4xl mb-3">{plant.emoji}</div>
                      <h3 className="text-white font-bold text-base mb-1">{plant.name}</h3>
                      <p className="text-white/90 text-xs leading-relaxed">{plant.tip}</p>
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-white/80 text-xs"><span>💧</span><span>Water every {plant.waterDays} days</span></div>
                      <div className="flex items-center gap-2 text-white/80 text-xs"><span>☀️</span><span>{sun.label}</span></div>
                      <div className="flex items-center gap-2 text-white/80 text-xs"><span>🌡️</span><span>{plant.temp}</span></div>
                      <div className="flex items-center gap-2 text-white/80 text-xs"><span>🪱</span><span>{plant.soil}</span></div>
                    </div>
                    <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mt-3">{plant.difficulty}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── HEALTH CHECKER ──────────────────────────────────────────────────────────

function HealthChecker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
    setShowResults(false);
  }

  function check() {
    if (selected.length === 0) { toast.error("Please select at least one symptom."); return; }
    setShowResults(true);
  }

  return (
    <section id="health-checker" className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Diagnose</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Plant Health Checker</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Select the symptoms your plant is showing and we'll suggest possible causes and solutions.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100">
          <h3 className="text-base font-bold text-gray-700 mb-4">What symptoms do you see?</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {symptoms.map((s) => (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                  selected.includes(s.id)
                    ? "border-emerald-500 bg-emerald-50 shadow-md scale-105"
                    : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-xs font-semibold text-gray-700 leading-tight">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={check}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
              🔍 Check My Plant
            </button>
            {selected.length > 0 && (
              <button onClick={() => { setSelected([]); setShowResults(false); }}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-semibold transition-all">
                Clear
              </button>
            )}
          </div>

          {showResults && selected.length > 0 && (
            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
                <span>🩺</span>
                <span>Diagnosis for {selected.length} symptom{selected.length > 1 ? "s" : ""}:</span>
              </div>
              {selected.map((id) => {
                const symptom = symptoms.find((s) => s.id === id)!;
                const diag = diagnoses[id];
                return (
                  <div key={id} className="rounded-2xl border border-emerald-100 overflow-hidden">
                    <div className="bg-emerald-600 px-5 py-3 flex items-center gap-2">
                      <span className="text-xl">{symptom.emoji}</span>
                      <span className="text-white font-bold">{symptom.label}</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <h4 className="text-sm font-bold text-amber-600 mb-2 flex items-center gap-1">⚠️ Possible Causes</h4>
                        <ul className="space-y-1.5">
                          {diag.causes.map((c, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-700">
                              <span className="text-amber-400 flex-shrink-0">•</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-600 mb-2 flex items-center gap-1">✅ Suggestions</h4>
                        <ul className="space-y-1.5">
                          {diag.suggestions.map((s, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-700">
                              <span className="text-emerald-500 flex-shrink-0">→</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (!localStorage.getItem("vp_created")) {
      localStorage.setItem("vp_created", String(Date.now()));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["home", "plants", "care-tips", "health-checker", "reminders", "contact"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom >= 80) { setActiveSection(id); break; }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) { toast.error("Please fill in all fields."); return; }
    toast.success("✉️ Message sent! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Plants", id: "plants" },
    { label: "Care Tips", id: "care-tips" },
    { label: "Health Check", id: "health-checker" },
    { label: "Reminders", id: "reminders" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Toaster richColors position="top-center" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-sm"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("home")}>
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold text-emerald-700">PlantCare</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollTo(link.id)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeSection === link.id ? "bg-emerald-100 text-emerald-700" : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"}`}>
                  {link.label}
                </button>
              ))}
              <button onClick={() => scrollTo("reminders")}
                className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                Set Reminder
              </button>
            </div>
            <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-emerald-50" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="w-5 h-0.5 bg-current mb-1" /><div className="w-5 h-0.5 bg-current mb-1" /><div className="w-5 h-0.5 bg-current" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollTo(link.id)}
                  className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${activeSection === link.id ? "bg-emerald-100 text-emerald-700" : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"}`}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 100%)" }}>
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100 rounded-full opacity-20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-16">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-full px-4 py-2 text-sm text-emerald-700 font-medium mb-6 shadow-sm">
            <span>🌱</span><span>Your smart plant companion</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
            Take Care of Your Plants{" "}
            <span className="text-emerald-600">the Smart Way</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Never let your plants wilt again. Get personalized watering reminders, sunlight tracking, and expert care tips — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo("reminders")}
              className="px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              🌿 Set a Reminder
            </button>
            <button onClick={() => scrollTo("plants")}
              className="px-8 py-4 bg-white text-emerald-700 rounded-full font-semibold text-lg hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg border border-emerald-200 hover:-translate-y-0.5">
              Browse Plants
            </button>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[{ value: "200+", label: "Plant Species" }, { value: "10k+", label: "Happy Gardeners" }, { value: "99%", label: "Plants Saved" }].map((stat) => (
              <div key={stat.label} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white">
                <div className="text-2xl font-bold text-emerald-700">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-emerald-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Everything Your Plants Need</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Smart tools designed to help you grow a thriving indoor garden with ease.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "💧", title: "Water Reminders", desc: "Timely notifications based on each plant's specific needs.", color: "bg-blue-50", iconBg: "bg-blue-100", accent: "text-blue-600", id: "reminders" },
              { icon: "☀️", title: "Sunlight Tracker", desc: "Know exactly where to place plants for optimal growth.", color: "bg-amber-50", iconBg: "bg-amber-100", accent: "text-amber-600", id: "plants" },
              { icon: "🩺", title: "Health Checker", desc: "Diagnose symptoms and get actionable care suggestions.", color: "bg-rose-50", iconBg: "bg-rose-100", accent: "text-rose-600", id: "health-checker" },
              { icon: "📋", title: "Care Guides", desc: "Expert step-by-step guides for hundreds of plant species.", color: "bg-emerald-50", iconBg: "bg-emerald-100", accent: "text-emerald-600", id: "care-tips" },
            ].map((feature) => (
              <div key={feature.title} onClick={() => scrollTo(feature.id)}
                className={`${feature.color} rounded-2xl p-7 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-white cursor-pointer`}>
                <div className={`${feature.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}>{feature.icon}</div>
                <h3 className={`text-lg font-bold ${feature.accent} mb-2`}>{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIRTUAL PLANT + PLANT GALLERY */}
      <PlantGallery />

      {/* VIRTUAL PLANT SECTION */}
      <section id="virtual-plant" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Interactive</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Your Virtual Plant</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Practice your plant care skills! Water your virtual plant to keep it thriving. It will droop if neglected.</p>
          </div>
          <div className="max-w-sm mx-auto">
            <VirtualPlant />
          </div>
        </div>
      </section>

      <CareTipsSection />
      <HealthChecker />
      <RemindersSection />

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Contact Us</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Have a question or suggestion? We'd love to hear from you.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Why reach out?</h3>
                <div className="space-y-4">
                  {[
                    { icon: "🌱", title: "Plant Advice", desc: "Get personalized care tips for your specific plants." },
                    { icon: "🐛", title: "Pest & Disease Help", desc: "Struggling with a sick plant? We can help diagnose it." },
                    { icon: "💡", title: "Feature Requests", desc: "Have an idea to improve PlantCare? Tell us!" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-700 text-sm">{item.title}</div>
                        <div className="text-gray-500 text-sm">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-600 rounded-2xl p-6 text-white">
                <div className="text-2xl mb-2">🌿</div>
                <h3 className="font-bold text-lg mb-1">Join Our Community</h3>
                <p className="text-emerald-100 text-sm">Connect with thousands of plant lovers. Share tips, photos, and grow together.</p>
                <div className="flex gap-3 mt-4 flex-wrap">
                  {["🐦 Twitter", "📸 Instagram", "💬 Discord"].map((s) => (
                    <span key={s} className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-white/30 transition-colors">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input type="text" placeholder="Jane Smith" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input type="email" placeholder="jane@example.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea rows={5} placeholder="Tell us about your plant or question..." value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 placeholder-gray-400 resize-none" />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Send Message ✉️
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌿</span>
                <span className="text-xl font-bold text-white">PlantCare</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Your smart companion for keeping plants healthy and happy. Built with love for plant enthusiasts everywhere.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button onClick={() => scrollTo(link.id)} className="text-gray-400 hover:text-emerald-400 transition-colors">{link.label}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Popular Plants</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {plants.slice(0, 5).map((p) => (
                  <li key={p.name} className="flex items-center gap-2"><span>{p.emoji}</span><span>{p.name}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} PlantCare. Made with 💚 for plant lovers.</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-emerald-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
