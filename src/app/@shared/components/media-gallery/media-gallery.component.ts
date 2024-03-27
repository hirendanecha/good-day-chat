import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import * as moment from 'moment';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.scss'],
})
export class MediaGalleryComponent implements OnInit {
  @Input('userChat') userChat: any = {};
  mediaList: any = [];
  fileName: string;
  profileId: number;
  constructor(
    private messageService: MessageService,
    public activeOffCanvas: NgbActiveOffcanvas
  ) {
    this.profileId = +localStorage.getItem('profileId');
  }

  ngOnInit() {
    this.getMessageMedia();
  }

  getMessageMedia(): void {
    const data = {
      roomId: this.userChat?.roomId || null,
      groupId: this.userChat?.groupId || null,
    };
    this.messageService.getMessageMedia(data).subscribe({
      next: (res) => {
        this.mediaList = res.data;
        this.mediaList.filter((ele) => {
          const messageDate = new Date(ele.createdDate);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          ele['createdTime'] = moment(ele.createdDate).format('h:mm A');
          if (messageDate.toDateString() === today.toDateString()) {
            ele.createdDate = 'Today';
          } else if (messageDate.toDateString() === yesterday.toDateString()) {
            ele.createdDate = 'Yesterday';
          } else {
            const date = moment.utc(messageDate).local().toLocaleString();
            ele.createdDate = moment(date).format('DD-MMM-YYYY');
          }
        });
        console.log(this.mediaList);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  isPdf(media: string): boolean {
    this.fileName = media?.split('/')[3]?.replaceAll('%', '-');
    const fileType =
      media.endsWith('.pdf') ||
      media.endsWith('.doc') ||
      media.endsWith('.docx') ||
      media.endsWith('.xls') ||
      media.endsWith('.xlsx') ||
      media.endsWith('.zip');
    return media && fileType;
  }

  pdfView(pdfUrl: string) {
    window.open(pdfUrl);
  }
}
