import { Observable } from '@nativescript/core';

export class BreathingViewModel extends Observable {
    private _isExerciseActive: boolean = false;
    private _duration: number = 5;
    private _breathCycle: number = 4;
    private _timerText: string = "0:00";
    private _instructions: string = "Take a deep breath";
    private _circleScale: number = 1;
    private _timer: any;
    private _startTime: number = 0;
    private _phaseTime: number = 0;

    constructor() {
        super();
        this.set("isExerciseActive", false);
        this.set("duration", this._duration);
        this.set("breathCycle", this._breathCycle);
        this.set("timerText", this._timerText);
        this.set("instructions", this._instructions);
        this.set("circleScale", this._circleScale);
    }

    toggleExercise() {
        if (this._isExerciseActive) {
            this.stopExercise();
        } else {
            this.startExercise();
        }
    }

    startExercise() {
        this._isExerciseActive = true;
        this.notifyPropertyChange("isExerciseActive", true);
        this._startTime = Date.now();
        this._phaseTime = 0;
        this.runBreathingCycle();
    }

    stopExercise() {
        this._isExerciseActive = false;
        this.notifyPropertyChange("isExerciseActive", false);
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this.set("instructions", "Take a deep breath");
        this.set("circleScale", 1);
        this.set("timerText", "0:00");
    }

    private runBreathingCycle() {
        if (!this._isExerciseActive) return;

        const elapsed = Math.floor((Date.now() - this._startTime) / 1000);
        const remaining = this._duration * 60 - elapsed;

        if (remaining <= 0) {
            this.stopExercise();
            return;
        }

        // Update timer display
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        this.set("timerText", `${minutes}:${seconds.toString().padStart(2, '0')}`);

        // Breathing cycle phases
        const cycleTime = this._breathCycle * 1000; // Convert to milliseconds
        this._phaseTime = (this._phaseTime + 100) % cycleTime;
        
        // Calculate circle scale based on breathing phase
        const scale = 1 + Math.sin(this._phaseTime / cycleTime * 2 * Math.PI) * 0.5;
        this.set("circleScale", scale);

        // Update instructions based on phase
        if (this._phaseTime < cycleTime / 2) {
            this.set("instructions", "Breathe in...");
        } else {
            this.set("instructions", "Breathe out...");
        }

        this._timer = setTimeout(() => this.runBreathingCycle(), 100);
    }
}