import { EventData, Page } from '@nativescript/core';
import { BreathingViewModel } from './breathing-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new BreathingViewModel();
}