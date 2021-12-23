import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from './services/auth.service';
import {CoreService} from './services/core.service';
import {UserBoardModal, UserModal} from './user';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userMenuItems: any[]= [
    {
      icon: 'person',
      title: 'Profile',
      url: 'profile'
    },
    {
      icon: 'book',
      title: 'Board',
      url: '/'
    },
    {
      icon: 'logout',
      title: 'Logout',
      url: 'logout'  
    }
  ];

kanbanBoard: UserBoardModal = {
  todo: [
    'Learn Angular',
    'Master Angular'
  ],
  inProgress: [],
  review: [],
  complete: []
};

constructor(private snackBar: MatSnackBar,
  private authService: AuthService,
  private coreService: CoreService) {
this.checkUser(null);
}

user: UserModal | null | undefined;
userSub: Subscription | undefined;
checkUser(authUser:any) {
  this.userSub = this.authService.user.subscribe(async (userDoc: any | null | undefined) => {
    if (userDoc === undefined) {
      this.user = await this.authService.createUserDoc(authUser);
    } else {
      this.user = userDoc;
      if (userDoc) { this.kanbanBoard = userDoc.board; }
    }
  });
}

logIn() {
  if (this.userSub) { this.userSub.unsubscribe(); }
  this.authService.register().then((auth: { user: any; }) => {
    this.checkUser(auth.user);
  });
}

logOutFromService() {
  this.authService.logOut();
}

drop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);
  }

  this.autoSaveData();
}



autoSaveTimer: number = 0;
autoSaveTimerInterval : any;


autoSaveTimeout : any;
autoSaveData() {

  // Interval
  if (this.autoSaveTimerInterval) {
    clearInterval(this.autoSaveTimerInterval);
    this.autoSaveTimer = 0;
  }
  this.autoSaveTimerInterval = setInterval(() => {

    ++this.autoSaveTimer;

    if (this.autoSaveTimer >= 100) {
      this.autoSaveTimer = 0;
      clearInterval(this.autoSaveTimerInterval);
    }

  }, 60);


  // Timeout
  if (this.autoSaveTimeout) { clearTimeout(this.autoSaveTimeout); }
  this.autoSaveTimeout = setTimeout(() => {
    this.saveData();
  }, 1000);
}

async saveData(task?: string | undefined) {
  if (task) {
    if (this.autoSaveTimeout) { clearTimeout(this.autoSaveTimeout); }
    this.kanbanBoard.todo.push(task);

    if (this.autoSaveTimerInterval) {
      clearInterval(this.autoSaveTimerInterval);
      this.autoSaveTimer = 0;
    }
  }
    await this.coreService.saveBoard(this.user!.uid, this.kanbanBoard);
    this.snackBar.open('Saved Successfully!', 'Done', { duration: 3000 });
}

removeItem(taskColumn: any, task: any) {
  this.coreService.removeTask(this.user!.uid, taskColumn, task);
}


}
