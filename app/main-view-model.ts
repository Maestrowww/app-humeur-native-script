import { Observable, Frame } from '@nativescript/core';
import { MoodDatabase, MoodEntry } from './models/mood-entry';

interface MoodChartEntry {
  moodEmoji: string;
  moodValue: number;
  formattedDate: string;
  originalEntry: MoodEntry;
}

export class HelloWorldModel extends Observable {
  private _moodEntries: MoodChartEntry[] = [];
  private _todaySummary: string = "";
  private moodDB: MoodDatabase;

  constructor() {
    super();
    this.moodDB = MoodDatabase.getInstance();
    this.updateMoodHistory();
  }

  get moodEntries(): MoodChartEntry[] {
    return this._moodEntries;
  }

  get todaySummary(): string {
    return this._todaySummary;
  }

  private getMoodValue(mood: string): number {
    const moodValues: { [key: string]: number } = {
      'great': 5,
      'good': 4,
      'okay': 3,
      'bad': 2,
      'awful': 1
    };
    return moodValues[mood] || 3;
  }

  private getMoodEmoji(mood: string): string {
    const moodEmojis: { [key: string]: string } = {
      'great': '😄',
      'good': '🙂',
      'okay': '😐',
      'bad': '😕',
      'awful': '😢'
    };
    return moodEmojis[mood] || '😐';
  }

  onMoodSelect(args: any) {
    const button = args.object;
    const mood = button.get("data-mood");
    
    this.moodDB.addMoodEntry(mood);
    this.updateMoodHistory();
  }

  private updateMoodHistory() {
    const recentMoods = this.moodDB.getRecentMoods(7);
    
    // Update mood entries for the chart
    this._moodEntries = recentMoods.map(entry => ({
      moodEmoji: this.getMoodEmoji(entry.mood),
      moodValue: this.getMoodValue(entry.mood),
      formattedDate: this.formatDate(entry.timestamp),
      originalEntry: entry
    }));
    this.notifyPropertyChange('moodEntries', this._moodEntries);

    // Update today's summary
    const todayCount = this.getTodayMoodCount(recentMoods);
    const latestMood = recentMoods[0];
    this._todaySummary = latestMood 
      ? `Dernière humeur: ${this.getMoodEmoji(latestMood.mood)} à ${latestMood.timestamp.toLocaleTimeString()}\nHumeurs enregistrées aujourd'hui: ${todayCount}`
      : "Aucune humeur enregistrée aujourd'hui";
    this.notifyPropertyChange('todaySummary', this._todaySummary);
  }

  private formatDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    }
    return date.toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  private getTodayMoodCount(moods: MoodEntry[]): number {
    const today = new Date();
    return moods.filter(entry => 
      entry.timestamp.getDate() === today.getDate() &&
      entry.timestamp.getMonth() === today.getMonth() &&
      entry.timestamp.getFullYear() === today.getFullYear()
    ).length;
  }

  onBreathingExercise() {
    Frame.topmost().navigate({
      moduleName: "breathing/breathing-page",
      transition: { name: "slide" }
    });
  }

  onJournal() {
    Frame.topmost().navigate({
      moduleName: "journal/journal-page",
      transition: { name: "slide" }
    });
  }

  onMeditation() {
    console.log("Opening meditation...");
  }

  onCommunity() {
    Frame.topmost().navigate({
      moduleName: "community/community-page",
      transition: { name: "slide" }
    });
  }
}