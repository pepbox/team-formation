export interface TeamMember {
  _id:string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface Player {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  votedLeader: string | null; 
  teamName: string | null;
  teamNumber: string | null;
  teamMembers: TeamMember[] | null;
  teamLeaderId: string | null;
  teamType: string; 
  teamColor: string; 
}
