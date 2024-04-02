import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import {
  NgbActiveModal,
  NgbActiveOffcanvas,
  NgbDropdown,
  NgbModal,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/@shared/services/encrypt-decrypt.service';
import { CreateGroupModalComponent } from 'src/app/@shared/modals/create-group-modal/create-group-modal.component';
import { ProfileMenusModalComponent } from '../../../components/profile-menus-modal/profile-menus-modal.component';
import { NotificationsModalComponent } from '../../../components/notifications-modal/notifications-modal.component';

@Component({
  selector: 'app-profile-chats-sidebar',
  templateUrl: './profile-chats-sidebar.component.html',
  styleUrls: ['./profile-chats-sidebar.component.scss'],
})
export class ProfileChatsSidebarComponent
  implements AfterViewInit, OnChanges, OnInit
{
  chatList: any = [];
  pendingChatList: any = [];
  groupList: any = [];

  @ViewChild('userSearchDropdownRef', { static: false, read: NgbDropdown })
  userSearchNgbDropdown: NgbDropdown;
  searchText = '';
  userList: any = [];
  profileId: number;
  selectedChatUser: any;

  isMessageSoundEnabled: boolean = true;
  isCallSoundEnabled: boolean = true;
  isChatLoader = false;
  selectedButton: string = 'chats';
  newChatList = [];
  approvedUserPage = 1;
  hasMoreUsers = false;
  approvedUserData = [];

  userMenusOverlayDialog: any;

  @Output('newRoomCreated') newRoomCreated: EventEmitter<any> =
    new EventEmitter<any>();
  @Output('onNewChat') onNewChat: EventEmitter<any> = new EventEmitter<any>();
  @Input('isRoomCreated') isRoomCreated: boolean = false;
  @Input('selectedRoomId') selectedRoomId: number = null;
  originalFavicon: HTMLLinkElement;
  constructor(
    private customerService: CustomerService,
    private socketService: SocketService,
    public sharedService: SharedService,
    private activeOffcanvas: NgbActiveOffcanvas,
    private router: Router,
    public encryptDecryptService: EncryptDecryptService,
    private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas,
    public activeOffCanvas: NgbActiveOffcanvas
  ) {
    this.originalFavicon = document.querySelector('link[rel="icon"]');
    this.socketService?.socket?.on('isReadNotification_ack', (data) => {
      if (data?.profileId) {
        this.sharedService.isNotify = false;
        localStorage.setItem('isRead', data?.isRead);
        this.originalFavicon.href = '/assets/images/icon.jpg';
      }
    });
    this.profileId = +localStorage.getItem('profileId');
    const notificationSound =
      JSON.parse(localStorage.getItem('soundPreferences')) || {};
    if (notificationSound?.messageSoundEnabled === 'N') {
      this.isMessageSoundEnabled = false;
    }
    if (notificationSound?.callSoundEnabled === 'N') {
      this.isCallSoundEnabled = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.sharedService
      .getIsRoomCreatedObservable()
      .subscribe((isRoomCreated) => {
        if (isRoomCreated) {
          this.isRoomCreated = isRoomCreated;
          this.getChatList();
          this.getGroupList();
        } else {
          this.selectedChatUser = null;
        }
      });
  }

  ngOnInit(): void {
    this.socketService.connect();
    this.getChatList();
    this.getGroupList();
    // this.getApprovedUserList();
  }

  ngAfterViewInit(): void {
    this.getGroupList();
    if (this.isRoomCreated) {
      this.getChatList();
      this.getGroupList();
    }
    this.socketService.socket?.on('accept-invitation', (data) => {
      if (data) {
        this.onChat(data);
        this.getChatList();
      }
    });
  }

  loadMoreApprovedUsers() {
    this.approvedUserPage = this.approvedUserPage + 1;
    this.getApprovedUserList();
  }

  getApprovedUserList(): void {
    const data = {
      page: this.approvedUserPage,
      size: 15,
    };
    this.customerService.getApprovedUserList(data).subscribe({
      next: (res: any) => {
        // this.spinner.hide();
        if (res?.data) {
          const filterUserProfile = res.data.filter(
            (user: any) =>
              user.Id !== this.sharedService?.userData?.UserID &&
              user.AccountType === 'user' &&
              user.MediaApproved === 1
          );
          const chatUserList = filterUserProfile.filter(
            (user: any) =>
              !this.chatList.some(
                (chatUser: any) => chatUser.profileId === user.profileId
              ) &&
              !this.pendingChatList.some(
                (chatUser: any) => chatUser.profileId === user.profileId
              )
          );
          if (this.approvedUserPage <= 1) {
            this.approvedUserData = chatUserList;
          } else {
            this.approvedUserData = [...this.approvedUserData, ...chatUserList];
          }
          if (this.approvedUserPage < res.pagination.totalPages) {
            this.hasMoreUsers = true;
          } else {
            this.hasMoreUsers = false;
          }
        }
      },
      error: (error) => {
        // this.spinner.hide();
        console.log(error);
      },
    });
  }

  getUserList(): void {
    this.customerService.getProfileList(this.searchText).subscribe({
      next: (res: any) => {
        if (res?.data?.length > 0) {
          this.userList = res.data.filter(
            (user: any) => user.Id !== this.sharedService?.userData?.Id
          );
          this.userList = this.userList.filter(
            (user: any) =>
              !this.chatList.some(
                (chatUser: any) => chatUser.profileId === user.Id
              ) &&
              !this.pendingChatList.some(
                (chatUser: any) => chatUser.profileId === user.Id
              )
          );
          this.userSearchNgbDropdown?.open();
        } else {
          this.userList = [];
          this.userSearchNgbDropdown?.close();
        }
      },
      error: () => {
        this.userList = [];
        this.userSearchNgbDropdown?.close();
      },
    });
  }

  getChatList() {
    this.isChatLoader = true;
    this.socketService?.getChatList({ profileId: this.profileId }, (data) => {
      this.isChatLoader = false;
      this.chatList = data?.filter(
        (user: any) =>
          user.Username != this.sharedService?.userData?.Username &&
          user?.isAccepted === 'Y'
      );
      this.mergeUserChatList();
      this.pendingChatList = data.filter(
        (user: any) => user.isAccepted === 'N'
      );
    });
    return this.chatList;
  }

  dismissSidebar() {
    this.activeOffcanvas?.dismiss();
  }

  // onChat(item: any) {
  //   this.selectedChatUser = item.roomId || item.groupId;
  //   item.unReadMessage = 0;
  //   if (item.groupId) {
  //     item.isAccepted = 'Y';
  //   }
  //   // console.log(item);
  //   // this.notificationNavigation()
  //   this.onNewChat?.emit(item);
  //   if (this.searchText) {
  //     this.searchText = null;
  //   }
  // }

  onChat(item: any) {
    console.log(item);
    this.selectedChatUser = item.roomId || item.groupId;
    item.unReadMessage = 0;
    if (item.groupId) {
      item.isAccepted = 'Y';
    }
    const data = {
      Id: item.profileId,
      ProfilePicName: item.ProfilePicName,
      Username: item.Username,
    };
    if (this.selectedButton === 'users') {
      this.onNewChat?.emit(data);
    } else {
      this.onNewChat?.emit(item);
      if (this.searchText) {
        this.searchText = null;
      }
    }
  }

  goToViewProfile(): void {
    this.router.navigate([`settings/view-profile/${this.profileId}`]);
  }

  toggleSoundPreference(property: string, ngModelValue: boolean): void {
    const soundPreferences =
      JSON.parse(localStorage.getItem('soundPreferences')) || {};
    soundPreferences[property] = ngModelValue ? 'Y' : 'N';
    localStorage.setItem('soundPreferences', JSON.stringify(soundPreferences));
  }

  clearChatList() {
    this.onNewChat?.emit({});
  }

  selectButton(buttonType: string): void {
    this.selectedButton =
      this.selectedButton === buttonType ? buttonType : buttonType;
    if (buttonType === 'chats') {
      this.onNewChat?.emit({});
    }
  }

  getGroupList() {
    this.isChatLoader = true;
    this.socketService?.getGroup({ profileId: this.profileId }, (data) => {
      this.isChatLoader = false;
      this.groupList = data;
      this.mergeUserChatList();
    });
  }

  mergeUserChatList(): void {
    const chatList = this.chatList;
    const groupList = this.groupList;
    const mergeChatList = [...chatList, ...groupList];
    mergeChatList.sort(
      (a, b) =>
        new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
    );
    if (mergeChatList?.length) {
      this.newChatList = mergeChatList.filter((ele) => {
        if (
          ele?.roomId === this.selectedChatUser ||
          ele?.groupId === this.selectedChatUser
        ) {
          ele.unReadMessage = 0;
          this.selectedChatUser = ele?.roomId || ele?.groupId;
          return ele;
        } else return ele;
      });
    }
  }

  createNewGroup() {
    const modalRef = this.modalService.open(CreateGroupModalComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.title = 'Create Group';
    modalRef.result.then((res) => {
      if (res) {
        this.socketService?.createGroup(res, (data: any) => {
          this.getChatList();
          this.getGroupList();
        });
      }
    });
  }

  deleteOrLeaveChat(item) {
    if (item.roomId) {
      const data = {
        roomId: item.roomId,
        profileId: item.profileId,
      };
      this.socketService?.deleteRoom(data, (data: any) => {
        this.getChatList();
        this.getGroupList();
        this.onNewChat?.emit({});
      });
    } else if (item.groupId) {
      const data = {
        profileId: this.profileId,
        groupId: item.groupId,
      };
      this.socketService.removeGroupMember(data, (res) => {
        this.getChatList();
        this.getGroupList();
        this.onNewChat?.emit({});
      });
    }
  }

  openProfileMenuModal(): void {
    this.userMenusOverlayDialog = this.modalService.open(
      ProfileMenusModalComponent,
      {
        keyboard: true,
        modalDialogClass: 'profile-menus-modal',
      }
    );
  }

  openNotificationsMobileModal(): void {
    this.activeOffCanvas?.close();
    this.offcanvasService.open(NotificationsModalComponent, {
      position: 'end',
      panelClass: 'w-300-px',
    });
  }
}
