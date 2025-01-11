import { EventData, Page } from '@nativescript/core';
import { CommunityViewModel } from './community-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new CommunityViewModel();
}