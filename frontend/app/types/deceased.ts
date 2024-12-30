export type Deceased = {
    id: number;
    name: string;
    kaimyou: string // 必須フィールド
    relationToMember: string // 任意フィールド
    memberId: number, // 必須フィールド
    deceasedDay: Date | null // 任意フィールド
    birthday: Date | null // 任意フィールド
    kyounen: Date | null  // 任意フィールド
    comment: string 
  };