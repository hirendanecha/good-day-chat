import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { ImgPickerComponent } from './components/img-picker/img-picker.component';
import { PostMetaDataCardComponent } from './components/post-meta-data-card/post-meta-data-card.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { TagUserInputComponent } from './components/tag-user-input/tag-user-input.component';
import { ImgPreviewComponent } from './components/img-preview/img-preview.component';
import { InlineLoaderComponent } from './components/inline-loader/inline-loader.component';
import { LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faAngleDoubleUp,
  faCamera,
  faEye,
  faXmark,
  faBars,
  faBorderAll,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faCirclePlus,
  faMagnifyingGlass,
  faDownload,
  faUser,
  faCalendarDays,
  faClock,
  faMessage,
  faThumbsUp,
  faRotate,
  faTrashCan,
  faEllipsis,
  faUserMinus,
  faPenToSquare,
  faLink,
  faComment,
  faImage,
  faPaperPlane,
  faBell,
  faHouse,
  faBookOpen,
  faPlay,
  faNetworkWired,
  faLayerGroup,
  faCertificate,
  faGear,
  faUserPlus,
  faUserXmark,
  faRightFromBracket,
  faUnlockKeyhole,
  faSun,
  faMoon,
  faPlus,
  faSatelliteDish,
  faVideo,
  faUserCheck,
  faCheck,
  faSquareCheck,
  faSquareXmark,
  faFileUpload,
  faFile,
  faFilePdf,
  faShare,
  faEnvelope,
  faPaperclip,
  faPhone,
  faEllipsisH,
  faSearch,
  faBan,
  faFileVideo,
  faSliders,
  faCopy,
  faPhoneSlash,
  faEllipsisV,
  faUsers,
  faCommentAlt,
  faPencil,
  faRefresh,
  faReply,
  faUserTimes,
  faChevronLeft,
  faPhotoFilm,

} from '@fortawesome/free-solid-svg-icons';
import { PipeModule } from './pipe/pipe.module';
import { ForgotPasswordComponent } from '../layouts/auth-layout/pages/forgot-password/forgot-password.component';
import { MentionModule } from 'angular-mentions';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { IncomingcallModalComponent } from './modals/incoming-call-modal/incoming-call-modal.component';
import { OutGoingCallModalComponent } from './modals/outgoing-call-modal/outgoing-call-modal.component';
import { CreateGroupModalComponent } from './modals/create-group-modal/create-group-modal.component';
import { EditGroupModalComponent } from './modals/edit-group-modal/edit-group-modal.component';
import { MediaGalleryComponent } from './components/media-gallery/media-gallery.component';

import { CommonModule } from '@angular/common';

const sharedComponents = [
  ConfirmationModalComponent,
  ImgPickerComponent,
  PostMetaDataCardComponent,
  TagUserInputComponent,
  ImgPreviewComponent,
  InlineLoaderComponent,
  CopyClipboardDirective,
  ForgotPasswordComponent,
  IncomingcallModalComponent,
  OutGoingCallModalComponent,
  CreateGroupModalComponent,
  EditGroupModalComponent,
  MediaGalleryComponent,

];

const sharedModules = [
  CommonModule,
  FormsModule,
  FormsModule,
  ReactiveFormsModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbCollapseModule,
  NgbModule,
  NgxSpinnerModule,
  RouterModule,
  NgxTrimDirectiveModule,
  FontAwesomeModule,
  PipeModule,
  MentionModule,
];

@NgModule({
  declarations: [sharedComponents],
  imports: [sharedModules],
  exports: [...sharedModules, ...sharedComponents],
  providers: [
    NgbActiveModal,
    NgbActiveOffcanvas,
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
  ],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faAngleDoubleUp,
      faCamera,
      faEye,
      faXmark,
      faBars,
      faBorderAll,
      faChevronDown,
      faChevronUp,
      faChevronRight,
      faChevronLeft,
      faCirclePlus,
      faMagnifyingGlass,
      faDownload,
      faUser,
      faCalendarDays,
      faClock,
      faMessage,
      faThumbsUp,
      faRotate,
      faTrashCan,
      faEllipsis,
      faUserMinus,
      faPenToSquare,
      faLink,
      faComment,
      faImage,
      faPaperPlane,
      faBell,
      faHouse,
      faBookOpen,
      faPlay,
      faNetworkWired,
      faLayerGroup,
      faCertificate,
      faGear,
      faUserPlus,
      faUserXmark,
      faRightFromBracket,
      faUnlockKeyhole,
      faSun,
      faMoon,
      faPlus,
      faSatelliteDish,
      faVideo,
      faUserCheck,
      faCheck,
      faSquareCheck,
      faSquareXmark,
      faFileUpload,
      faFile,
      faFilePdf,
      faDownload,
      faShare,
      faEnvelope,
      faPaperclip,
      faPhone,
      faEllipsisH,
      faSearch,
      faBan,
      faFileVideo,
      faSliders,
      faCopy,
      faPhoneSlash,
      faEllipsisV,
      faUsers,
      faCommentAlt,
      faLayerGroup,
      faGear,
      faPencil,
      faRefresh,
      faReply,
      faUserTimes,
      faPhotoFilm

    );
  }
}
