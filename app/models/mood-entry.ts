export interface MoodEntry {
    id: string;
    mood: string;
    timestamp: Date;
    notes?: string;
}

export class MoodDatabase {
    private static instance: MoodDatabase;
    private moodEntries: MoodEntry[] = [];

    private constructor() {}

    static getInstance(): MoodDatabase {
        if (!MoodDatabase.instance) {
            MoodDatabase.instance = new MoodDatabase();
        }
        return MoodDatabase.instance;
    }

    addMoodEntry(mood: string, notes?: string): MoodEntry {
        const entry: MoodEntry = {
            id: Math.random().toString(36).substr(2, 9),
            mood,
            timestamp: new Date(),
            notes
        };
        this.moodEntries.unshift(entry);
        return entry;
    }

    getMoodEntries(): MoodEntry[] {
        return [...this.moodEntries];
    }

    getRecentMoods(days: number = 7): MoodEntry[] {
        const now = new Date();
        const cutoff = new Date(now.setDate(now.getDate() - days));
        return this.moodEntries.filter(entry => entry.timestamp >= cutoff);
    }
}