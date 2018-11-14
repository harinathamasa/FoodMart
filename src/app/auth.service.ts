import { UserService } from './user.service';
import { Observable, } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { map,switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user$:Observable<firebase.User>

  constructor(private afAuth:AngularFireAuth,private route: ActivatedRoute,private userService:UserService) {
    this.user$ = afAuth.authState;
   }
  login(){
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl',returnUrl);
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout(){
    this.afAuth.auth.signOut();
  }

  loginWithEmail(email,password){
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl',returnUrl);
    this.afAuth.auth.signInWithEmailAndPassword(email,password);
  }
 
  get appUser$(){
    return this.user$.pipe(
      switchMap(user=>{
           if(user) return this.userService.get(user.uid)
           return of(null);
      }));
  }
  

}
