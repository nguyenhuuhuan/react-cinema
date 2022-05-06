import { Repository } from "onecore";

export class PreviousSkillSuggestion{
  previousKeyWord!: string;
  result!:string[];
}
export class SkillSuggestion{
  response!:string[];
  previousSkillSuggestion!:PreviousSkillSuggestion;
}
export interface SkillService{
    // getSkills(q:string,max?:number):Promise<string[]>;
    loadData(keyWords: string, max: number, ctx?: any): Promise<string[]>;
  }
  export interface SkillRepository extends Repository<string, string> {
  }