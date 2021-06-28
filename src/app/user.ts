
export interface UserModal {
    uid: string;
    name: string;
    email: string;
    photoUrl: string;
    board: UserBoardModal;
  }
  
  export interface UserBoardModal {
    todo: string[];
    inProgress: string[];
    review: string[];
    complete: string[];
  }