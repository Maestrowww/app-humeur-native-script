import { EventData, Page } from '@nativescript/core';
import { JournalViewModel } from './journal-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new JournalViewModel();
}