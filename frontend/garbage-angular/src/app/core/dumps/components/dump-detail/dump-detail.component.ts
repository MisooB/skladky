import { Component, OnInit, Input } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { MatDialog } from '@angular/material';
import { DumpEditComponent } from '../dump-edit/dump-edit.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth';
import { ConfirmDialogComponent } from 'src/app/shared/components/dialog/common-dialogs/confirm-dialog/confirm-dialog.component';
import { DialogService, DialogContentComponent } from 'src/app/shared/components/dialog';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';

@Component({
  selector: 'app-dump-detail',
  templateUrl: './dump-detail.component.html',
  styleUrls: ['./dump-detail.component.scss']
})
export class DumpDetailComponent implements OnInit {

  @Input() dump: Dump;

  imageUrl: Observable<string | null>;

  constructor(
    public dialog: MatDialog,
    private storage: AngularFireStorage,
    public authService: AuthService,
    private dialogService: DialogService) { }

  ngOnInit() {
    if (this.dump.image !== null) {
      this.getImage(this.dump.image);
    }
  }

  getImage(id: string) {
    const ref = this.storage.ref(`/uploads/${id}`);
    this.imageUrl = ref.getDownloadURL();
  }

  onOpenImage() {
    if (this.dump.image) {
      const dialogRef = this.dialog.open(ImageDialogComponent, {
        data: this.dump.image
      });
    }
  }

  onOpenEdit() {
    if (this.authService.isAuthenticated()) {
      const dialogRef = this.dialog.open(DumpEditComponent, {
        width: '650px',
        height: '600px',
        data: this.dump
      });
    } else {
      this.dialogService.confirm('You are not signed in!');
    }
  }

}
