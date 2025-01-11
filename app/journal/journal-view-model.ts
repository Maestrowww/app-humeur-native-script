import { Observable } from '@nativescript/core';
import { alert } from '@nativescript/core/ui/dialogs';

interface JournalEntry {
    date: string;
    preview: string;
    feelings: string;
    thoughts: string;
    gratitude: string;
}

export class JournalViewModel extends Observable {
    private _currentDate: string;
    private _feelingsEntry: string = '';
    private _thoughtsEntry: string = '';
    private _gratitudeEntry: string = '';
    private _journalEntries: JournalEntry[] = [];

    constructor() {
        super();
        
        // Set current date
        const now = new Date();
        this._currentDate = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Initialize observable properties
        this.set('currentDate', this._currentDate);
        this.set('feelingsEntry', '');
        this.set('thoughtsEntry', '');
        this.set('gratitudeEntry', '');
        this.set('journalEntries', this._journalEntries);

        // Load mock data (replace with actual data storage later)
        this.loadMockEntries();
    }

    onSaveEntry() {
        if (!this._feelingsEntry && !this._thoughtsEntry && !this._gratitudeEntry) {
            alert({
                title: "Empty Entry",
                message: "Please write something before saving.",
                okButtonText: "OK"
            });
            return;
        }

        const newEntry: JournalEntry = {
            date: this._currentDate,
            preview: this._feelingsEntry.substring(0, 50) + '...',
            feelings: this._feelingsEntry,
            thoughts: this._thoughtsEntry,
            gratitude: this._gratitudeEntry
        };

        this._journalEntries.unshift(newEntry);
        this.notifyPropertyChange('journalEntries', this._journalEntries);

        // Clear entries
        this.set('feelingsEntry', '');
        this.set('thoughtsEntry', '');
        this.set('gratitudeEntry', '');

        alert({
            title: "Success",
            message: "Journal entry saved!",
            okButtonText: "OK"
        });
    }

    private loadMockEntries() {
        const mockEntries: JournalEntry[] = [
            {
                date: 'Yesterday',
                preview: 'Had a productive day at university...',
                feelings: 'Had a productive day at university. Feeling accomplished.',
                thoughts: 'Thinking about upcoming exams.',
                gratitude: 'Grateful for my study group.'
            }
        ];
        
        this._journalEntries = mockEntries;
        this.notifyPropertyChange('journalEntries', this._journalEntries);
    }
}