import { Observable } from '@nativescript/core';
import { alert, prompt } from '@nativescript/core/ui/dialogs';

interface Comment {
    username: string;
    content: string;
    timeAgo: string;
}

interface Post {
    id: string;
    username: string;
    content: string;
    timeAgo: string;
    likes: number;
    comments: Comment[];
}

export class CommunityViewModel extends Observable {
    private _posts: Post[] = [];
    private _newPostText: string = '';

    constructor() {
        super();
        this.loadMockPosts();
        this.set('newPostText', '');
    }

    onNewPost() {
        prompt({
            title: "New Post",
            message: "What's on your mind?",
            okButtonText: "Post",
            cancelButtonText: "Cancel",
            inputType: "text"
        }).then((result) => {
            if (result.result && result.text) {
                this.createPost(result.text);
            }
        });
    }

    onQuickPost() {
        if (this._newPostText.trim()) {
            this.createPost(this._newPostText);
            this.set('newPostText', '');
        }
    }

    onLikePost(args: any) {
        const post = args.object.bindingContext;
        post.likes++;
        this.notifyPropertyChange('posts', this._posts);
    }

    onViewComments(args: any) {
        const post = args.object.bindingContext;
        alert({
            title: "Comments",
            message: post.comments.map(c => `${c.username}: ${c.content}`).join('\n\n'),
            okButtonText: "Close"
        });
    }

    private createPost(content: string) {
        const newPost: Post = {
            id: Math.random().toString(),
            username: "Anonymous Student",
            content: content,
            timeAgo: "Just now",
            likes: 0,
            comments: []
        };

        this._posts.unshift(newPost);
        this.notifyPropertyChange('posts', this._posts);
    }

    private loadMockPosts() {
        this._posts = [
            {
                id: "1",
                username: "Student123",
                content: "Anyone else struggling with exam anxiety? Could use some tips on staying calm during tests.",
                timeAgo: "2h ago",
                likes: 5,
                comments: [
                    {
                        username: "StudyBuddy",
                        content: "Try deep breathing exercises before the exam!",
                        timeAgo: "1h ago"
                    }
                ]
            },
            {
                id: "2",
                username: "MindfulLearner",
                content: "Just discovered a great study technique: Pomodoro method (25 min study, 5 min break). It's helping me stay focused!",
                timeAgo: "4h ago",
                likes: 8,
                comments: [
                    {
                        username: "TimeManager",
                        content: "I use this too! Game changer for productivity.",
                        timeAgo: "3h ago"
                    }
                ]
            }
        ];
        this.notifyPropertyChange('posts', this._posts);
    }
}