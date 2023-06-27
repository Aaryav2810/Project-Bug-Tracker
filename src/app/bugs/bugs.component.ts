import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-bugs',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.scss']
})
export class BugsComponent implements OnInit {

  // Individual Bug Variables
  title: string;
  difficulty: string;
  description: string;
  status: string;
  projId: string;
  
  projectName: string;
  bugsList: Array<Object> = []; // filled with data retrieved from projectsService
  bugs$: Observable<any>;
  
  constructor(private projectService: ProjectsService, private actr: ActivatedRoute, private afs: AngularFirestore) { 
    // Grab and attach projID from url endpoint to the local variable
    this.projId = this.actr.snapshot.params.projId;

    // Keeps bugsList updated with latest data from FireStore
    this.afs.collection('bugs', ref => ref.where('projId', '==', this.projId)).valueChanges({idField: 'id'})
      .subscribe(val => this.bugsList = val);

    // Grab and attach project title from DB to 'projectName'
    this.afs.collection('projects').doc(this.projId).valueChanges().subscribe((val: any)=> {
      this.projectName = val ? val.title : null
    });
  }

  ngOnInit(): void {

  }

  addBug(bugForm: NgForm) {
    this.projectService.addBug(this.title, this.description, this.difficulty, this.status, this.projId);
    
    // Clear input data after new bug is added
    this.title = '';
    this.difficulty = ''; 
    this.description = '';
    this.status = '';

    // reset bug input form to make it 'pristine' and 'untouched' to keep errors from showing on a blank input form
    bugForm.resetForm(); 
  }

  removeBug(bugId: string){ 
    this.projectService.removeBug(bugId)
  }

  updateStatus(bugId: string, newStatus: string) {
    this.projectService.updateStatus(bugId, newStatus);
  }

  /**
   * Assigns a color based off of the level of difficulty provided
   * @param difficulty "easy", "medium", or "hard" based off specific bug data
   * 
   * @returns string color name that will change the background color 
   */
  getDifficultyColor(difficulty: string){
    switch(difficulty) {
      // Red is hard
      case "hard":
        return "red";
      // Orange is medium
      case "medium":
        return "orange"
      // Green is easy/default
      default:
        return "green"
    }
  }
}
