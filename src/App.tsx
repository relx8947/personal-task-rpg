import {
  Activity,
  Backpack,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Coins,
  Dumbbell,
  HeartHandshake,
  Home,
  Palette,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trash2,
  Trophy,
} from 'lucide-react'
import { FormEvent, useEffect, useMemo, useState } from 'react'

type Category = 'learning' | 'work' | 'health' | 'creativity' | 'social' | 'order'
type Difficulty = 'easy' | 'normal' | 'hard' | 'epic'
type Recurrence = 'once' | 'daily' | 'weekdays' | 'weekly'
type HeroClass = 'Pathfinder' | 'Scholar' | 'Artisan' | 'Vanguard'

type AttributeKey = 'focus' | 'vitality' | 'craft' | 'connection' | 'discipline'

type Character = {
  name: string
  heroClass: HeroClass
  level: number
  xp: number
  coins: number
  energy: number
  title: string
  attributes: Record<AttributeKey, number>
}

type Quest = {
  id: string
  title: string
  category: Category
  difficulty: Difficulty
  recurrence: Recurrence
  estimate: number
  createdAt: string
  completedDates: string[]
  archived: boolean
}

type RewardEvent = {
  id: string
  questTitle: string
  xp: number
  coins: number
  attribute: AttributeKey
  date: string
  item?: string
}

type Achievement = {
  id: string
  title: string
  description: string
  unlockedAt?: string
}

type AppState = {
  character: Character
  quests: Quest[]
  rewardEvents: RewardEvent[]
  achievements: Achievement[]
}

const storageKey = 'personal-task-rpg-state-v1'

const categoryConfig: Record<
  Category,
  {
    label: string
    attribute: AttributeKey
    icon: typeof BookOpen
    color: string
  }
> = {
  learning: { label: 'Learning', attribute: 'focus', icon: BookOpen, color: '#2563eb' },
  work: { label: 'Work', attribute: 'discipline', icon: Target, color: '#4f46e5' },
  health: { label: 'Health', attribute: 'vitality', icon: Dumbbell, color: '#059669' },
  creativity: { label: 'Creativity', attribute: 'craft', icon: Palette, color: '#c2410c' },
  social: { label: 'Social', attribute: 'connection', icon: HeartHandshake, color: '#be123c' },
  order: { label: 'Life Order', attribute: 'discipline', icon: Home, color: '#475569' },
}

const difficultyConfig: Record<Difficulty, { label: string; xp: number; coins: number }> = {
  easy: { label: 'Easy', xp: 20, coins: 8 },
  normal: { label: 'Normal', xp: 45, coins: 16 },
  hard: { label: 'Hard', xp: 80, coins: 28 },
  epic: { label: 'Epic', xp: 140, coins: 50 },
}

const heroClassBonus: Record<HeroClass, Partial<Record<AttributeKey, number>>> = {
  Pathfinder: { vitality: 2, discipline: 1 },
  Scholar: { focus: 3 },
  Artisan: { craft: 2, focus: 1 },
  Vanguard: { discipline: 2, connection: 1 },
}

const starterAchievements: Achievement[] = [
  {
    id: 'first-quest',
    title: 'First Clear',
    description: 'Complete your first quest.',
  },
  {
    id: 'five-quests',
    title: 'Momentum',
    description: 'Complete 5 quests.',
  },
  {
    id: 'balanced-growth',
    title: 'Balanced Build',
    description: 'Complete quests in 3 different categories.',
  },
  {
    id: 'level-3',
    title: 'Level 3 Adventurer',
    description: 'Reach character level 3.',
  },
]

const defaultState: AppState = {
  character: {
    name: 'New Adventurer',
    heroClass: 'Pathfinder',
    level: 1,
    xp: 0,
    coins: 0,
    energy: 85,
    title: 'Rookie of the Real World',
    attributes: {
      focus: 3,
      vitality: 3,
      craft: 3,
      connection: 3,
      discipline: 3,
    },
  },
  quests: [
    {
      id: crypto.randomUUID(),
      title: 'Plan tomorrow in 10 minutes',
      category: 'order',
      difficulty: 'easy',
      recurrence: 'daily',
      estimate: 10,
      createdAt: new Date().toISOString(),
      completedDates: [],
      archived: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Deep work sprint',
      category: 'work',
      difficulty: 'hard',
      recurrence: 'weekdays',
      estimate: 60,
      createdAt: new Date().toISOString(),
      completedDates: [],
      archived: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Move your body',
      category: 'health',
      difficulty: 'normal',
      recurrence: 'daily',
      estimate: 30,
      createdAt: new Date().toISOString(),
      completedDates: [],
      archived: false,
    },
  ],
  rewardEvents: [],
  achievements: starterAchievements,
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function weekStart(date = new Date()) {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1)
  copy.setDate(diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function isQuestDueToday(quest: Quest) {
  if (quest.archived) return false
  const now = new Date()
  const day = now.getDay()
  if (quest.recurrence === 'daily') return true
  if (quest.recurrence === 'weekdays') return day >= 1 && day <= 5
  if (quest.recurrence === 'weekly') {
    const createdDay = new Date(quest.createdAt).getDay()
    return createdDay === day
  }
  return quest.completedDates.length === 0
}

function xpForNextLevel(level: number) {
  return 120 + (level - 1) * 80
}

function applyXp(character: Character, xpGain: number) {
  let level = character.level
  let xp = character.xp + xpGain
  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level)
    level += 1
  }
  return { level, xp }
}

function shouldDropItem(quest: Quest) {
  const idScore = Array.from(quest.id).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return (idScore + quest.completedDates.length) % 3 === 0
}

function loadState(): AppState {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return defaultState
  try {
    const parsed = JSON.parse(raw) as AppState
    return {
      ...defaultState,
      ...parsed,
      achievements: starterAchievements.map((achievement) => {
        const existing = parsed.achievements?.find((item) => item.id === achievement.id)
        return existing ?? achievement
      }),
    }
  } catch {
    return defaultState
  }
}

function className(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function evaluateAchievements(state: AppState): Achievement[] {
  const completedCount = state.rewardEvents.length
  const completedCategories = new Set(
    state.quests
      .filter((quest) => quest.completedDates.length > 0)
      .map((quest) => quest.category),
  )
  return state.achievements.map((achievement) => {
    if (achievement.unlockedAt) return achievement
    const unlocked =
      (achievement.id === 'first-quest' && completedCount >= 1) ||
      (achievement.id === 'five-quests' && completedCount >= 5) ||
      (achievement.id === 'balanced-growth' && completedCategories.size >= 3) ||
      (achievement.id === 'level-3' && state.character.level >= 3)
    return unlocked ? { ...achievement, unlockedAt: new Date().toISOString() } : achievement
  })
}

function createInitialCharacter(name: string, heroClass: HeroClass): Character {
  const attributes: Character['attributes'] = {
    focus: 3,
    vitality: 3,
    craft: 3,
    connection: 3,
    discipline: 3,
  }
  const bonus = heroClassBonus[heroClass]
  for (const key of Object.keys(bonus) as AttributeKey[]) {
    attributes[key] += bonus[key] ?? 0
  }
  return {
    ...defaultState.character,
    name,
    heroClass,
    attributes,
    title: `${heroClass} in Training`,
  }
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [characterName, setCharacterName] = useState('')
  const [heroClass, setHeroClass] = useState<HeroClass>('Pathfinder')
  const [questTitle, setQuestTitle] = useState('')
  const [category, setCategory] = useState<Category>('learning')
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [recurrence, setRecurrence] = useState<Recurrence>('once')
  const [estimate, setEstimate] = useState(25)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state])

  const today = todayKey()
  const dueQuests = useMemo(() => state.quests.filter(isQuestDueToday), [state.quests])
  const completedToday = dueQuests.filter((quest) => quest.completedDates.includes(today))
  const completionRate = dueQuests.length
    ? Math.round((completedToday.length / dueQuests.length) * 100)
    : 0
  const nextLevelXp = xpForNextLevel(state.character.level)
  const weeklyEvents = state.rewardEvents.filter(
    (event) => new Date(event.date) >= weekStart(),
  )
  const weeklyXp = weeklyEvents.reduce((sum, event) => sum + event.xp, 0)
  const weeklyCoins = weeklyEvents.reduce((sum, event) => sum + event.coins, 0)
  const unlockedAchievements = state.achievements.filter((item) => item.unlockedAt)
  const latestEvents = state.rewardEvents.slice(0, 6)

  function updateState(updater: (current: AppState) => AppState) {
    setState((current) => {
      const next = updater(current)
      return { ...next, achievements: evaluateAchievements(next) }
    })
  }

  function handleOnboarding(event: FormEvent) {
    event.preventDefault()
    const name = characterName.trim() || 'New Adventurer'
    updateState((current) => ({
      ...current,
      character: createInitialCharacter(name, heroClass),
    }))
  }

  function addQuest(event: FormEvent) {
    event.preventDefault()
    const title = questTitle.trim()
    if (!title) return
    const quest: Quest = {
      id: crypto.randomUUID(),
      title,
      category,
      difficulty,
      recurrence,
      estimate,
      createdAt: new Date().toISOString(),
      completedDates: [],
      archived: false,
    }
    updateState((current) => ({ ...current, quests: [quest, ...current.quests] }))
    setQuestTitle('')
    setCategory('learning')
    setDifficulty('normal')
    setRecurrence('once')
    setEstimate(25)
  }

  function completeQuest(quest: Quest) {
    if (quest.completedDates.includes(today)) return
    const reward = difficultyConfig[quest.difficulty]
    const attribute = categoryConfig[quest.category].attribute
    const estimatedBonus = Math.min(Math.floor(quest.estimate / 20) * 5, 25)
    const xp = reward.xp + estimatedBonus
    const coins = reward.coins + Math.floor(quest.estimate / 15)
    const item = shouldDropItem(quest) ? `${categoryConfig[quest.category].label} token` : undefined

    updateState((current) => {
      const leveled = applyXp(current.character, xp)
      return {
        ...current,
        character: {
          ...current.character,
          xp: leveled.xp,
          level: leveled.level,
          coins: current.character.coins + coins,
          energy: Math.max(15, current.character.energy - 6),
          title: leveled.level >= 3 ? 'Reliable Quest Finisher' : current.character.title,
          attributes: {
            ...current.character.attributes,
            [attribute]: current.character.attributes[attribute] + 1,
          },
        },
        quests: current.quests.map((itemQuest) =>
          itemQuest.id === quest.id
            ? { ...itemQuest, completedDates: [today, ...itemQuest.completedDates] }
            : itemQuest,
        ),
        rewardEvents: [
          {
            id: crypto.randomUUID(),
            questTitle: quest.title,
            xp,
            coins,
            attribute,
            date: new Date().toISOString(),
            item,
          },
          ...current.rewardEvents,
        ],
      }
    })
  }

  function recoverEnergy() {
    updateState((current) => ({
      ...current,
      character: {
        ...current.character,
        coins: Math.max(0, current.character.coins - 10),
        energy: Math.min(100, current.character.energy + 35),
      },
    }))
  }

  function deleteQuest(id: string) {
    updateState((current) => ({
      ...current,
      quests: current.quests.map((quest) =>
        quest.id === id ? { ...quest, archived: true } : quest,
      ),
    }))
  }

  function resetDemo() {
    localStorage.removeItem(storageKey)
    setState(defaultState)
  }

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div className="hero-copy">
          <p className="eyebrow">Personal Task RPG</p>
          <h1>Turn real work into quests that level up your character.</h1>
          <p className="hero-text">
            A local-first MVP for daily quests, XP, coins, attributes, achievements,
            and weekly progress.
          </p>
        </div>
        <form className="onboarding-panel" onSubmit={handleOnboarding}>
          <label htmlFor="character-name">Character name</label>
          <div className="inline-field">
            <input
              id="character-name"
              value={characterName}
              onChange={(event) => setCharacterName(event.target.value)}
              placeholder={state.character.name}
            />
            <select
              aria-label="Hero class"
              value={heroClass}
              onChange={(event) => setHeroClass(event.target.value as HeroClass)}
            >
              <option>Pathfinder</option>
              <option>Scholar</option>
              <option>Artisan</option>
              <option>Vanguard</option>
            </select>
            <button type="submit">
              <ShieldCheck size={18} />
              Start
            </button>
          </div>
        </form>
      </section>

      <section className="dashboard-grid">
        <aside className="character-panel">
          <div className="avatar-ring">
            <Sparkles size={40} />
          </div>
          <div>
            <p className="eyebrow">{state.character.heroClass}</p>
            <h2>{state.character.name}</h2>
            <p className="muted">{state.character.title}</p>
          </div>

          <div className="stat-row">
            <span>Level {state.character.level}</span>
            <strong>
              {state.character.xp}/{nextLevelXp} XP
            </strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${Math.min((state.character.xp / nextLevelXp) * 100, 100)}%` }} />
          </div>

          <div className="resource-grid">
            <div>
              <Coins size={18} />
              <span>{state.character.coins}</span>
              <small>Coins</small>
            </div>
            <div>
              <Activity size={18} />
              <span>{state.character.energy}%</span>
              <small>Energy</small>
            </div>
          </div>

          <div className="attribute-list">
            {(Object.entries(state.character.attributes) as Array<[AttributeKey, number]>).map(
              ([key, value]) => (
                <div key={key}>
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ),
            )}
          </div>

          <button className="secondary-button" onClick={recoverEnergy} disabled={state.character.coins < 10}>
            <RotateCcw size={17} />
            Recover for 10 coins
          </button>
        </aside>

        <section className="quest-column">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Daily Quest Board</p>
              <h2>Today's adventure</h2>
            </div>
            <div className="completion-pill">{completionRate}% clear</div>
          </div>

          <form className="quest-form" onSubmit={addQuest}>
            <input
              value={questTitle}
              onChange={(event) => setQuestTitle(event.target.value)}
              placeholder="Add a quest, such as Read 20 pages"
            />
            <div className="form-grid">
              <select value={category} onChange={(event) => setCategory(event.target.value as Category)}>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as Difficulty)}
              >
                {Object.entries(difficultyConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
              <select
                value={recurrence}
                onChange={(event) => setRecurrence(event.target.value as Recurrence)}
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
              </select>
              <input
                type="number"
                min="5"
                max="240"
                step="5"
                value={estimate}
                onChange={(event) => setEstimate(Number(event.target.value))}
                aria-label="Estimated minutes"
              />
            </div>
            <button type="submit" className="primary-button">
              <Plus size={18} />
              Add quest
            </button>
          </form>

          <div className="quest-list">
            {dueQuests.length === 0 ? (
              <div className="empty-state">
                <Star size={28} />
                <p>No quests are due today. Add one to begin a run.</p>
              </div>
            ) : (
              dueQuests.map((quest) => {
                const config = categoryConfig[quest.category]
                const Icon = config.icon
                const completed = quest.completedDates.includes(today)
                return (
                  <article key={quest.id} className={className('quest-card', completed && 'complete')}>
                    <div className="quest-icon" style={{ color: config.color }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3>{quest.title}</h3>
                      <p>
                        {config.label} · {difficultyConfig[quest.difficulty].label} · {quest.estimate} min ·{' '}
                        {quest.recurrence}
                      </p>
                    </div>
                    <div className="quest-actions">
                      <button
                        className="icon-button"
                        onClick={() => completeQuest(quest)}
                        disabled={completed}
                        title={completed ? 'Completed today' : 'Complete quest'}
                        aria-label={completed ? 'Completed today' : 'Complete quest'}
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button
                        className="icon-button danger"
                        onClick={() => deleteQuest(quest.id)}
                        title="Archive quest"
                        aria-label="Archive quest"
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </section>

        <aside className="side-stack">
          <section className="summary-panel">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Weekly Report</p>
                <h2>This week</h2>
              </div>
              <Trophy size={24} />
            </div>
            <div className="summary-grid">
              <div>
                <strong>{weeklyEvents.length}</strong>
                <span>clears</span>
              </div>
              <div>
                <strong>{weeklyXp}</strong>
                <span>XP</span>
              </div>
              <div>
                <strong>{weeklyCoins}</strong>
                <span>coins</span>
              </div>
            </div>
          </section>

          <section className="summary-panel">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Achievements</p>
                <h2>{unlockedAchievements.length}/{state.achievements.length} unlocked</h2>
              </div>
              <ChevronRight size={22} />
            </div>
            <div className="achievement-list">
              {state.achievements.map((achievement) => (
                <div key={achievement.id} className={className(!achievement.unlockedAt && 'locked')}>
                  <Trophy size={18} />
                  <span>{achievement.title}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="summary-panel">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Reward Log</p>
                <h2>Latest drops</h2>
              </div>
              <Backpack size={23} />
            </div>
            <div className="event-list">
              {latestEvents.length === 0 ? (
                <p className="muted">Complete a quest to generate rewards.</p>
              ) : (
                latestEvents.map((event) => (
                  <div key={event.id}>
                    <span>{event.questTitle}</span>
                    <strong>
                      +{event.xp} XP · +{event.coins} coins
                    </strong>
                    {event.item ? <small>{event.item}</small> : null}
                  </div>
                ))
              )}
            </div>
          </section>

          <button className="secondary-button full-width" onClick={resetDemo}>
            Reset local demo
          </button>
        </aside>
      </section>
    </main>
  )
}
