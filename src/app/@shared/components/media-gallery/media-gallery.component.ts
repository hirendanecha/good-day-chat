import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import * as moment from 'moment';
import { NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageDatePipe } from '../../pipe/message-date.pipe';
import { GalleryImgPreviewComponent } from '../gallery-img-preview/gallery-img-preview.component';
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
  activePage = 1;
  hasMoreData=false;
  filterMediaList = [];

  constructor(
    private messageService: MessageService,
    public activeOffCanvas: NgbActiveOffcanvas,
    private modalService: NgbModal
  ) {
    this.profileId = +localStorage.getItem('profileId');
  }

  ngOnInit() {
    this.getMessageMedia();
  }

  loadMoreMedia() {
    this.activePage = this.activePage + 1;
    this.getMessageMedia();
  }

  getMessageMedia(): void {
    const data = {
      page: this.activePage,
      size: 10,
      roomId: this.userChat?.roomId || null,
      groupId: this.userChat?.groupId || null,
    };
    this.messageService.getMessageMedia(data).subscribe({
      next: (res) => {
        if (this.activePage < res?.pagination.totalPages) {
          this.hasMoreData = true;
        } else {
          this.hasMoreData = false;
        }
        this.mediaList = [...this.mediaList, ...res.data];
        this.filterMediaList = new MessageDatePipe().transform(this.mediaList);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  isFile(media: string): boolean {
    this.fileName = media?.split('/')[3]?.replaceAll('%', '-');
    const FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip'];
    return FILE_EXTENSIONS.some((ext) => media?.endsWith(ext));
  }

  pdfView(pdfUrl: string) {
    window.open(pdfUrl);
  }
  downloadPdf(data): void {
    const pdfLink = document.createElement('a');
    pdfLink.href = data;
    pdfLink.click();
  }

  openImagePreview(src: string) {
    const modalRef = this.modalService.open(GalleryImgPreviewComponent, {
      backdrop: 'static',
    });
    modalRef.componentInstance.src = src;
    modalRef.componentInstance.roomId = this.userChat?.roomId;
    modalRef.componentInstance.groupId = this.userChat?.groupId;
    modalRef.componentInstance.activePage = this.activePage;
  }
}
