import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  userId: string = '';
  projId: string = ''; 
  bugId: string = ''; 

  constructor(private auth: AngularFireAuth, private afs: AngularFirestore, private _snackBar: MatSnackBar) { 
    // Attaches Google User to userId var
    this.auth.user.subscribe(v=> {
      this.userId = v ? v.uid : null;
    });
  }
  // Projects Functions
  addProject(title: string, description: string){

    // If both title and description are not properly provided, send error message 
    if(!title || title.length < 3 || title.length > 128 || !description || description.length < 3 || description.length > 300) {
      // Since there is template driven form validation, this message should only show if someone did an incorrect api call directly
      console.log("Invalid data provided")
    }
    // If all is data is properly provided, add it to the Firestore DB and give them success message
    else {
      this.afs.collection('projects').add({
        userId: this.userId,
        title: title,
        description: description
      })
      this._snackBar.open("Project Added", null, {
        duration: 2000,
      });         
    }
  }
  removeProject(projId: string){
    
    // Delete the specific project
    this.afs.collection('projects').doc(projId).delete();

    // Delete the project's children data (all of the project's bugs items)
    this.afs.collection('bugs', ref => ref.where('projId', '==', projId)).valueChanges({idField: 'id'})
      .subscribe(bugs => bugs.forEach(b=> this.afs.collection('bugs').doc(b.id).delete()));
    this._snackBar.open("Project Removed", null, {
      duration: 2000,
    });   
  }
  
  // Bugs Functions
  addBug(title: string, description: string, difficulty: string, status: string, projId: string){
    // If there was missing/incorrect information, send an error message
    if(!title || title.length < 3 || title.length > 128 || 
      !description || description.length < 3 || description.length > 300 ||
      (difficulty !== "easy" && difficulty !=="medium" && difficulty !== "hard") ||
      (status !== "back-log" && status !== "in-progress" && status !== "completed") ||
      !status || !projId) {
      // Message should only show if someone did an incorrect api call directly
      console.log("Invalid data provided")
    }
    // If all is data is properly provided, add it to the Firestore DB and give them success message
    else {
      this.afs.collection('bugs').add({
        projId: projId,
        title: title,
        description: description,
        difficulty: difficulty,
        status: status
      });
      this._snackBar.open("Bug Added", null, {
        duration: 2000,
      });  
    } 
  }
  
  removeBug(bugId: string){
    this.afs.collection('bugs').doc(bugId).delete(); 
    this._snackBar.open("Bug Removed", null, {
      duration: 2000,
    });   
  }

  /**
   * Updates the status of an item to the status given in the argument in Google Firestore
   * 
   * @param bugId Id associated with the bug that needs a status change
   * @param newStatus The next status to progress to according to current status
   * 
   * @returns string value of the "next" status
   */
  updateStatus(bugId: string, newStatus: string) {
    this.afs.collection('bugs').doc(bugId).update({status: newStatus});
  }
}
