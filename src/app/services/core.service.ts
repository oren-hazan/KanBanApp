import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserBoardModal} from '../user';
import firebase from 'firebase';
import firestore = firebase.firestore;


@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private angularFirestore: AngularFirestore) { }

  saveBoard(userId: string, board: UserBoardModal, ) {
    return this.angularFirestore.doc(`users/${userId}`).update({
      [`board`]: board
    });
  }
addNewTask(userId: any, task: any) {
  return this.angularFirestore.doc(`users/${userId}`).update({
    [`board.todo`]:firestore.FieldValue.arrayUnion(task)
    });
}

removeTask(userId: any, taskColumn: any, task: any) {
  return this.angularFirestore.doc(`users/${userId}`).update({
    [`board.${taskColumn}`]:firestore.FieldValue.arrayRemove(task)
  });
}

}
