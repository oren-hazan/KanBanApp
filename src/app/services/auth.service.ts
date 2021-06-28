import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserModal} from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable <UserModal | null | any>

  constructor(private angularFireAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore) {
                this.user = this.angularFireAuth.authState.pipe(
                  switchMap(auth => {
                    if (auth) {
                      return this.angularFirestore.doc(`users/${auth.uid}`).valueChanges();
                    } else {
                      return of(null);
                    }
                  })
                );
               }

               register(): any {
                 const provider = new firebase.auth.GithubAuthProvider();
                 return this.angularFireAuth.signInWithPopup(provider);
               }
               logOut() {
                 return this.angularFireAuth.signOut();
               }

               createUserDoc(authUser: { uid: any; ui: any; displayName: any; email: any; photoUtl: any; }):any {
                 return this.angularFirestore.doc(`users/${authUser.uid}`).set({
                   uid: authUser.ui,
                   name: authUser.displayName,
                   email: authUser.email,
                   photoUtl: authUser.photoUtl,
                   board: {
                     todo: [],
                     inProgress: [],
                     review: [],
                     complete: []
                   }
                 });
               }
}
